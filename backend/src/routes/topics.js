const express = require("express");
const { requireAuth, requireRole } = require("../middleware/auth");
const controller = require("../controllers/topicsController");

const router = express.Router();

// Public
router.get("/", controller.listTopics);
router.get("/:id", controller.getTopic);

// Admin
router.post("/", requireAuth, requireRole("admin"), controller.createTopic);
router.put("/:id", requireAuth, requireRole("admin"), controller.updateTopic);
router.delete("/:id", requireAuth, requireRole("admin"), controller.deleteTopic);

module.exports = router;

