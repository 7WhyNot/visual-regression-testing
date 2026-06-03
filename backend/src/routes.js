import { Router } from "express";
import {
  createProject,
  createScenario,
  getProjectById,
  getProjects
} from "./controllers/project.controller.js";
import {
  getTestRun,
  reviewTestResult,
  runProjectTests
} from "./controllers/test.controller.js";

const router = Router();

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const validateUuid = (req, res, next) => {
  const id = req.params.id || req.params.resultId || req.params.runId;
  if (id && !UUID_REGEX.test(id)) {
    return res.status(400).json({ error: "Invalid ID format" });
  }
  next();
};

router.post("/projects", createProject);
router.get("/projects", getProjects);
router.get("/projects/:id", validateUuid, getProjectById);
router.post("/projects/:id/scenarios", validateUuid, createScenario);
router.post("/projects/:id/run", validateUuid, runProjectTests);
router.get("/runs/:runId", validateUuid, getTestRun);
router.post("/results/:resultId/review", validateUuid, reviewTestResult);

export default router;
