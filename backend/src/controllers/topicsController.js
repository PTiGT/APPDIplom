const { ok, fail } = require("../utils/response");
const topicRepo = require("../repositories/topicRepository");
const { topicCreateSchema, topicUpdateSchema } = require("../validators/learningStructure");

async function listTopics(req, res) {
  const categoryIdRaw = req.query.categoryId;
  let categoryId;
  if (typeof categoryIdRaw === "string" && categoryIdRaw.trim() !== "") {
    categoryId = Number(categoryIdRaw);
    if (!Number.isInteger(categoryId)) return fail(res, "Invalid categoryId", 400);
  }

  const items = await topicRepo.listTopics({ categoryId });
  return ok(res, items);
}

async function getTopic(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return fail(res, "Invalid id", 400);

  const item = await topicRepo.getTopicById(id);
  if (!item) return fail(res, "Topic not found", 404);
  return ok(res, item);
}

async function createTopic(req, res) {
  const parsed = topicCreateSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, parsed.error.issues[0]?.message || "Invalid payload", 400);

  try {
    const created = await topicRepo.createTopic(parsed.data);
    return ok(res, created, 201);
  } catch {
    return fail(res, "Invalid categoryId or order", 400);
  }
}

async function updateTopic(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return fail(res, "Invalid id", 400);

  const parsed = topicUpdateSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, parsed.error.issues[0]?.message || "Invalid payload", 400);

  try {
    const updated = await topicRepo.updateTopic(id, parsed.data);
    return ok(res, updated);
  } catch {
    return fail(res, "Topic not found", 404);
  }
}

async function deleteTopic(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return fail(res, "Invalid id", 400);

  try {
    await topicRepo.deleteTopic(id);
    return ok(res, true);
  } catch {
    return fail(res, "Topic not found", 404);
  }
}

module.exports = { listTopics, getTopic, createTopic, updateTopic, deleteTopic };

