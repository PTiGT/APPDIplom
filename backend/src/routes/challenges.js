const express = require("express");
const { requireAuth, requireRole } = require("../middleware/auth");
const controller = require("../controllers/challengesController");

const router = express.Router();

// Public
router.get("/", controller.listChallenges);
router.get("/:id", controller.getChallenge);

// Auth
router.post("/:id/submit", requireAuth, controller.submitToChallenge);
router.get("/:id/submissions", requireAuth, controller.listMySubmissions);

// Admin
router.post("/", requireAuth, requireRole("admin"), controller.createChallenge);
router.put("/:id", requireAuth, requireRole("admin"), controller.updateChallenge);
router.delete("/:id", requireAuth, requireRole("admin"), controller.deleteChallenge);

module.exports = router;

