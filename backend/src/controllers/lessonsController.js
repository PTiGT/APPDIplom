const { ok, fail } = require("../utils/response");
const lessonRepo = require("../repositories/lessonRepository");
const progressRepo = require("../repositories/lessonProgressRepository");
const { recordActivity } = require("../services/activityService");
const { lessonCreateSchema, lessonUpdateSchema } = require("../validators/learningStructure");

async function getLesson(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return fail(res, "Invalid id", 400);

  const item = await lessonRepo.getLessonById(id);
  if (!item) return fail(res, "Lesson not found", 404);
  return ok(res, item);
}

async function createLesson(req, res) {
  const parsed = lessonCreateSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, parsed.error.issues[0]?.message || "Invalid payload", 400);

  try {
    const created = await lessonRepo.createLesson(parsed.data);
    return ok(res, created, 201);
  } catch {
    return fail(res, "Invalid topicId or order", 400);
  }
}

async function updateLesson(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return fail(res, "Invalid id", 400);

  const parsed = lessonUpdateSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, parsed.error.issues[0]?.message || "Invalid payload", 400);

  try {
    const updated = await lessonRepo.updateLesson(id, parsed.data);
    return ok(res, updated);
  } catch {
    return fail(res, "Lesson not found", 404);
  }
}

async function deleteLesson(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return fail(res, "Invalid id", 400);

  try {
    await lessonRepo.deleteLesson(id);
    return ok(res, true);
  } catch {
    return fail(res, "Lesson not found", 404);
  }
}

async function completeLesson(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return fail(res, "Invalid id", 400);
  if (!req.user?.userId) return fail(res, "Unauthorized", 401);

  const lesson = await lessonRepo.getLessonById(id);
  if (!lesson) return fail(res, "Lesson not found", 404);

  const progress = await progressRepo.upsertProgress({
    userId: req.user.userId,
    lessonId: id,
    status: "completed",
    completedAt: new Date(),
  });

  await recordActivity({
    userId: req.user.userId,
    type: "lesson_completed",
    meta: { lessonId: id, topicId: lesson.topicId },
  });

  return ok(res, progress);
}

module.exports = { getLesson, createLesson, updateLesson, deleteLesson, completeLesson };

