const { ok, fail } = require("../utils/response");
const { prisma } = require("../prisma");
const progressRepo = require("../repositories/lessonProgressRepository");
const submissionRepo = require("../repositories/submissionRepository");
const { listActivitiesForUser } = require("../repositories/activityRepository");
const { listFavorites, toggleFavoriteArticle, toggleFavoriteChallenge } = require("../repositories/favoriteRepository");
const { getStreak } = require("../repositories/streakRepository");
const { recordActivity } = require("../services/activityService");

function requireUser(req, res) {
  if (!req.user?.userId) {
    fail(res, "Unauthorized", 401);
    return null;
  }
  return req.user.userId;
}

async function getProfile(req, res) {
  const userId = requireUser(req, res);
  if (!userId) return;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, role: true, createdAt: true, updatedAt: true },
  });
  return ok(res, user);
}

async function getStats(req, res) {
  const userId = requireUser(req, res);
  if (!userId) return;

  const [completedLessons, acceptedSubmissions, totalSubmissions, streak] = await Promise.all([
    progressRepo.countCompletedLessons(userId),
    submissionRepo.countAcceptedForUser(userId),
    submissionRepo.countSubmissionsForUser(userId),
    getStreak(userId),
  ]);

  return ok(res, {
    completedLessons,
    submissions: { accepted: acceptedSubmissions, total: totalSubmissions },
    streak: streak ?? { currentStreak: 0, longestStreak: 0, lastActivityAt: null },
  });
}

async function getActivity(req, res) {
  const userId = requireUser(req, res);
  if (!userId) return;

  const takeRaw = req.query.take;
  let take = 30;
  if (typeof takeRaw === "string" && takeRaw.trim() !== "") {
    const parsed = Number(takeRaw);
    if (!Number.isInteger(parsed) || parsed < 1 || parsed > 100) return fail(res, "Invalid take", 400);
    take = parsed;
  }

  const items = await listActivitiesForUser({ userId, take });
  return ok(res, items);
}

async function getFavorites(req, res) {
  const userId = requireUser(req, res);
  if (!userId) return;

  const favorites = await listFavorites(userId);
  return ok(res, favorites);
}

async function getLessonProgress(req, res) {
  const userId = requireUser(req, res);
  if (!userId) return;

  const topicIdRaw = req.query.topicId;
  let topicId;
  if (typeof topicIdRaw === "string" && topicIdRaw.trim() !== "") {
    const parsed = Number(topicIdRaw);
    if (!Number.isInteger(parsed)) return fail(res, "Invalid topicId", 400);
    topicId = parsed;
  }

  const items = await progressRepo.getProgressForUserWithLesson({ userId, topicId });
  return ok(res, items);
}

async function toggleArticleFavorite(req, res) {
  const userId = requireUser(req, res);
  if (!userId) return;

  const articleId = Number(req.params.id);
  if (!Number.isInteger(articleId)) return fail(res, "Invalid id", 400);

  try {
    const result = await toggleFavoriteArticle({ userId, articleId });
    if (result.favorited) {
      await recordActivity({ userId, type: "favorite_added", meta: { entity: "article", id: articleId } });
    }
    return ok(res, result);
  } catch {
    return fail(res, "Article not found", 404);
  }
}

async function toggleChallengeFavorite(req, res) {
  const userId = requireUser(req, res);
  if (!userId) return;

  const challengeId = Number(req.params.id);
  if (!Number.isInteger(challengeId)) return fail(res, "Invalid id", 400);

  try {
    const result = await toggleFavoriteChallenge({ userId, challengeId });
    if (result.favorited) {
      await recordActivity({ userId, type: "favorite_added", meta: { entity: "challenge", id: challengeId } });
    }
    return ok(res, result);
  } catch {
    return fail(res, "Challenge not found", 404);
  }
}

module.exports = {
  getProfile,
  getStats,
  getActivity,
  getLessonProgress,
  getFavorites,
  toggleArticleFavorite,
  toggleChallengeFavorite,
};

