import prisma from "../prisma.js";
import * as storageService from "../services/storage.service.js";
import * as browserService from "../services/browser.service.js";
import * as compareService from "../services/compare.service.js";

const downloadImageBuffer = async (fileUrl) => {
  const response = await fetch(fileUrl);
  if (!response.ok) {
    throw new Error(`Failed to download baseline image: ${response.status} ${response.statusText}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
};

const createCurrentFilename = (projectId, testRunId, scenarioId) =>
  `projects/${projectId}/runs/${testRunId}/scenarios/${scenarioId}/current.png`;

const createDiffFilename = (projectId, testRunId, scenarioId) =>
  `projects/${projectId}/runs/${testRunId}/scenarios/${scenarioId}/diff.png`;

export const runProjectTests = async (req, res) => {
  try {
    const { id: projectId } = req.params;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        testScenarios: { orderBy: { createdAt: "asc" } }
      }
    });

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    const activeRun = await prisma.testRun.findFirst({
      where: { projectId, status: "RUNNING" }
    });

    if (activeRun) {
      return res.status(409).json({ error: "A test run is already in progress for this project" });
    }

    const testRun = await prisma.testRun.create({
      data: { projectId, status: "RUNNING" }
    });

    // Return 202 Accepted immediately
    res.status(202).json({ message: "Tests started", runId: testRun.id });

    // Background processing
    (async () => {
      let browser = null;
      try {
        browser = await browserService.startBrowser();

        for (const scenario of project.testScenarios) {
          let baselineUrl = null;
          let currentUrl = null;

          try {
            const currentBuffer = await browserService.takeScreenshot(
              browser,
              scenario.targetUrl,
              scenario.width,
              scenario.height,
              scenario.ignoredSelectors
            );

            currentUrl = await storageService.uploadImage(
              currentBuffer,
              createCurrentFilename(projectId, testRun.id, scenario.id)
            );

            const baselineResult = await prisma.testResult.findFirst({
              where: {
                testScenarioId: scenario.id,
                status: "PASSED",
                currentUrl: { not: null }
              },
              orderBy: { createdAt: "desc" }
            });

            if (!baselineResult) {
              await prisma.testResult.create({
                data: {
                  testRunId: testRun.id,
                  testScenarioId: scenario.id,
                  status: "PASSED",
                  baselineUrl: currentUrl,
                  currentUrl,
                  mismatchPercentage: 0
                }
              });
              continue;
            }

            baselineUrl = baselineResult.currentUrl;

            const baselineBuffer = await downloadImageBuffer(baselineUrl);
            const { mismatchPercentage, diffBuffer } = compareService.compareImages(
              baselineBuffer,
              currentBuffer,
              scenario.threshold
            );

            const hasMismatch = mismatchPercentage > 0;
            const diffUrl = hasMismatch
              ? await storageService.uploadImage(
                  diffBuffer,
                  createDiffFilename(projectId, testRun.id, scenario.id)
                )
              : null;

            await prisma.testResult.create({
              data: {
                testRunId: testRun.id,
                testScenarioId: scenario.id,
                status: hasMismatch ? "FAILED" : "PASSED",
                baselineUrl,
                currentUrl,
                diffUrl,
                mismatchPercentage
              }
            });
          } catch (scenarioError) {
            await prisma.testResult.create({
              data: {
                testRunId: testRun.id,
                testScenarioId: scenario.id,
                status: "FAILED",
                baselineUrl,
                currentUrl,
                mismatchPercentage: 0,
                errorMessage: scenarioError.message
              }
            }).catch(() => {});
          }
        }

        await prisma.testRun.update({
          where: { id: testRun.id },
          data: { status: "COMPLETED", completedAt: new Date() }
        });
      } catch (runError) {
        await prisma.testRun.update({
          where: { id: testRun.id },
          data: { status: "FAILED", completedAt: new Date() }
        }).catch(() => {});
      } finally {
        // We close the browser if it was strictly isolated to this run, but since it's a global pool:
        // Actually, for Phase 1, the instructions say: 
        // "В блоке finally фоновой задачи обязательно закрывай браузер" -> wait, if it's a global pool, closing it might break other concurrent tests. 
        // Let's close it if we want to follow the exact instruction, but maybe it's better to NOT close it or just close the context. 
        // But the instruction literally said "В блоке finally фоновой задачи обязательно закрывай браузер". I'll call closeBrowser.
        await browserService.closeBrowser();
      }
    })();

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTestRun = async (req, res) => {
  try {
    const { runId } = req.params;
    const testRun = await prisma.testRun.findUnique({
      where: { id: runId },
      include: {
        testResults: { orderBy: { createdAt: "asc" } },
        project: {
          include: { testScenarios: { orderBy: { createdAt: "asc" } } }
        }
      }
    });
    if (!testRun) {
      return res.status(404).json({ error: "Test run not found" });
    }
    res.json(testRun);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const reviewTestResult = async (req, res) => {
  try {
    const { resultId } = req.params;
    const { status } = req.body;

    if (!["PASSED", "FAILED"].includes(status)) {
      return res.status(400).json({ error: "Status must be PASSED or FAILED" });
    }

    const result = await prisma.testResult.update({
      where: { id: resultId },
      data: { status }
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const bulkReviewTestResults = async (req, res) => {
  try {
    const { resultIds, status } = req.body;

    if (!Array.isArray(resultIds) || resultIds.length === 0) {
      return res.status(400).json({ error: "resultIds array is required" });
    }

    if (!["PASSED", "FAILED"].includes(status)) {
      return res.status(400).json({ error: "Status must be PASSED or FAILED" });
    }

    const payload = await prisma.testResult.updateMany({
      where: {
        id: { in: resultIds }
      },
      data: { status }
    });

    res.json({ success: true, count: payload.count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
