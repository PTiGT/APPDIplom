const express = require("express");
const { requireAuth } = require("../middleware/auth");
const controller = require("../controllers/meController");

const router = express.Router();

router.use(requireAuth);

router.get("/profile", controller.getProfile);
router.get("/stats", controller.getStats);
router.get("/activity", controller.getActivity);
router.get("/progress", controller.getLessonProgress);

router.get("/favorites", controller.getFavorites);
router.post("/favorites/articles/:id/toggle", controller.toggleArticleFavorite);
router.post("/favorites/challenges/:id/toggle", controller.toggleChallengeFavorite);

module.exports = router;

