import express from "express";
import {
  getContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact
} from "../controllers/contact.controller.js";
import requireAuth, { requireAdmin } from "../helpers/auth.middleware.js";
const router = express.Router();

router.get("/", requireAuth, requireAdmin, getContacts);
router.get("/:id", requireAuth, requireAdmin, getContact);
router.post("/", createContact);
router.put("/:id", requireAuth, requireAdmin, updateContact);
router.delete("/:id", requireAuth, requireAdmin, deleteContact);

export default router;