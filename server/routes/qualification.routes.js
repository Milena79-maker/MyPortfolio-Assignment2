
import express from "express";
import {
  getQualifications,
  getQualification,
  createQualification,
  updateQualification,
  deleteQualification
} from "../controllers/qualification.controller.js";
import requireAuth, { requireAdmin } from "../helpers/auth.middleware.js";
const router = express.Router();

router.get("/", getQualifications);
router.get("/:id", getQualification);
router.post("/", requireAuth, requireAdmin, createQualification);
router.put("/:id", requireAuth, requireAdmin, updateQualification);
router.delete("/:id", requireAuth, requireAdmin, deleteQualification);

export default router;