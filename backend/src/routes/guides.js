const express = require("express");
const { prisma } = require("../prisma");
const { ok, fail } = require("../utils/response");
const { requireAuth, requireRole } = require("../middleware/auth");
const { guideCreateSchema, guideUpdateSchema } = require("../validators/entities");

const router = express.Router();

// Public
router.get("/", async (req, res) => {
  const languageIdRaw = req.query.languageId;
  const where = {};
  if (typeof languageIdRaw === "string" && languageIdRaw.trim() !== "") {
    const languageId = Number(languageIdRaw);
    if (!Number.isInteger(languageId)) return fail(res, "Invalid languageId", 400);
    where.languageId = languageId;
  }

  const items = await prisma.guide.findMany({
    where,
    orderBy: { id: "asc" },
  });
  return ok(res, items);
});

// Admin
router.post("/", requireAuth, requireRole("admin"), async (req, res) => {
  const parsed = guideCreateSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, parsed.error.issues[0]?.message || "Invalid payload", 400);

  try {
    const created = await prisma.guide.create({ data: parsed.data });
    return ok(res, created, 201);
  } catch {
    return fail(res, "Invalid languageId", 400);
  }
});

router.put("/:id", requireAuth, requireRole("admin"), async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return fail(res, "Invalid id", 400);

  const parsed = guideUpdateSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, parsed.error.issues[0]?.message || "Invalid payload", 400);

  try {
    const updated = await prisma.guide.update({ where: { id }, data: parsed.data });
    return ok(res, updated);
  } catch {
    return fail(res, "Guide not found", 404);
  }
});

router.delete("/:id", requireAuth, requireRole("admin"), async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return fail(res, "Invalid id", 400);

  try {
    await prisma.guide.delete({ where: { id } });
    return ok(res, true);
  } catch {
    return fail(res, "Guide not found", 404);
  }
});

module.exports = router;

