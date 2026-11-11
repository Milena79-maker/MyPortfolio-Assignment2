import express from "express";
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject
} from "../controllers/project.controller.js";
import requireAuth, { requireAdmin } from "../helpers/auth.middleware.js";
const router = express.Router();

router.get("/", getProjects);
router.get("/:id", getProject);
router.post("/", requireAuth, requireAdmin, createProject);
router.put("/:id", requireAuth, requireAdmin, updateProject);
router.delete("/:id", requireAuth, requireAdmin, deleteProject);

export default router;