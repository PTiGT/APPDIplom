const express = require("express");
const { requireAuth, requireRole } = require("../middleware/auth");
const controller = require("../controllers/lessonsController");

const router = express.Router();

// Public
router.get("/:id", controller.getLesson);

// Auth
router.post("/:id/complete", requireAuth, controller.completeLesson);

// Admin
router.post("/", requireAuth, requireRole("admin"), controller.createLesson);
router.put("/:id", requireAuth, requireRole("admin"), controller.updateLesson);
router.delete("/:id", requireAuth, requireRole("admin"), controller.deleteLesson);

module.exports = router;

