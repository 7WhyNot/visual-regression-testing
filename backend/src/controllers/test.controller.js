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
  let testRun;

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

    testRun = await prisma.testRun.create({
      data: { projectId, status: "RUNNING" }
    });

    const results = [];

    for (const scenario of project.testScenarios) {
      let baselineUrl = null;
      let currentUrl = null;

      try {
        const currentBuffer = await browserService.takeScreenshot(
          scenario.targetUrl,
          scenario.width,
          scenario.height
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
          const result = await prisma.testResult.create({
            data: {
              testRunId: testRun.id,
              testScenarioId: scenario.id,
              status: "PASSED",
              baselineUrl: currentUrl,
              currentUrl,
              mismatchPercentage: 0
            }
          });
          results.push(result);
          continue;
        }

        baselineUrl = baselineResult.currentUrl;

        const baselineBuffer = await downloadImageBuffer(baselineUrl);
        const { mismatchPercentage, diffBuffer } = compareService.compareImages(
          baselineBuffer,
          currentBuffer
        );

        const hasMismatch = mismatchPercentage > 0;
        const diffUrl = hasMismatch
          ? await storageService.uploadImage(
              diffBuffer,
              createDiffFilename(projectId, testRun.id, scenario.id)
            )
          : null;

        const result = await prisma.testResult.create({
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

        results.push(result);
      } catch (scenarioError) {
        try {
          const result = await prisma.testResult.create({
            data: {
              testRunId: testRun.id,
              testScenarioId: scenario.id,
              status: "FAILED",
              baselineUrl,
              currentUrl,
              mismatchPercentage: 0
            }
          });
          results.push(result);
        } catch {
        }
      }
    }

    const completedRun = await prisma.testRun.update({
      where: { id: testRun.id },
      data: { status: "COMPLETED", completedAt: new Date() },
      include: { testResults: true }
    });

    res.json({ testRun: completedRun, results });
  } catch (error) {
    if (testRun) {
      await prisma.testRun.update({
        where: { id: testRun.id },
        data: { status: "FAILED", completedAt: new Date() }
      }).catch(() => {});
    }
    res.status(500).json({ error: error.message });
  }
};

export const getTestRun = async (req, res) => {
  try {
    const { runId } = req.params;
    const testRun = await prisma.testRun.findUnique({
      where: { id: runId },
      include: {
        testResults: true,
        project: {
          include: { testScenarios: true }
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
