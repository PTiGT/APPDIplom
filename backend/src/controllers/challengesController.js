const { ok, fail } = require("../utils/response");
const challengeRepo = require("../repositories/challengeRepository");
const submissionRepo = require("../repositories/submissionRepository");
const { recordActivity } = require("../services/activityService");
const { evaluateSubmission } = require("../services/submissionEvaluator");
const {
  challengeCreateSchema,
  challengeUpdateSchema,
  submissionCreateSchema,
  challengeDifficultySchema,
} = require("../validators/learning");

async function listChallenges(req, res) {
  const languageIdRaw = req.query.languageId;
  const difficultyRaw = req.query.difficulty;

  let languageId;
  if (typeof languageIdRaw === "string" && languageIdRaw.trim() !== "") {
    languageId = Number(languageIdRaw);
    if (!Number.isInteger(languageId)) return fail(res, "Invalid languageId", 400);
  }

  let difficulty;
  if (typeof difficultyRaw === "string" && difficultyRaw.trim() !== "") {
    const parsedDiff = challengeDifficultySchema.safeParse(difficultyRaw);
    if (!parsedDiff.success) return fail(res, "Invalid difficulty", 400);
    difficulty = parsedDiff.data;
  }

  const items = await challengeRepo.listChallenges({ languageId, difficulty });
  return ok(res, items);
}

async function getChallenge(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return fail(res, "Invalid id", 400);

  const item = await challengeRepo.getChallengeById(id);
  if (!item) return fail(res, "Challenge not found", 404);
  return ok(res, item);
}

async function createChallenge(req, res) {
  const parsed = challengeCreateSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, parsed.error.issues[0]?.message || "Invalid payload", 400);

  try {
    const created = await challengeRepo.createChallenge(parsed.data);
    return ok(res, created, 201);
  } catch {
    return fail(res, "Invalid languageId", 400);
  }
}

async function updateChallenge(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return fail(res, "Invalid id", 400);

  const parsed = challengeUpdateSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, parsed.error.issues[0]?.message || "Invalid payload", 400);

  try {
    const updated = await challengeRepo.updateChallenge(id, parsed.data);
    return ok(res, updated);
  } catch {
    return fail(res, "Challenge not found", 404);
  }
}

async function deleteChallenge(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return fail(res, "Invalid id", 400);

  try {
    await challengeRepo.deleteChallenge(id);
    return ok(res, true);
  } catch {
    return fail(res, "Challenge not found", 404);
  }
}

async function submitToChallenge(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return fail(res, "Invalid id", 400);
  if (!req.user?.userId) return fail(res, "Unauthorized", 401);

  const parsed = submissionCreateSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, parsed.error.issues[0]?.message || "Invalid payload", 400);

  const challenge = await challengeRepo.getChallengeById(id);
  if (!challenge) return fail(res, "Challenge not found", 404);

  const verdict = evaluateSubmission({ code: parsed.data.code, expectedOutput: challenge.expectedOutput });

  const created = await submissionRepo.createSubmission({
    userId: req.user.userId,
    challengeId: id,
    code: parsed.data.code,
    status: verdict.status,
    output: verdict.output,
    error: verdict.error,
  });

  await recordActivity({
    userId: req.user.userId,
    type: verdict.status === "accepted" ? "challenge_accepted" : "challenge_attempted",
    meta: { challengeId: id, status: verdict.status },
  });

  return ok(res, created, 201);
}

async function listMySubmissions(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return fail(res, "Invalid id", 400);
  if (!req.user?.userId) return fail(res, "Unauthorized", 401);

  const items = await submissionRepo.listSubmissionsForUserChallenge({
    userId: req.user.userId,
    challengeId: id,
  });
  return ok(res, items);
}

module.exports = {
  listChallenges,
  getChallenge,
  createChallenge,
  updateChallenge,
  deleteChallenge,
  submitToChallenge,
  listMySubmissions,
};

