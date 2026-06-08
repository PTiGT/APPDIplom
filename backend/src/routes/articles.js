const express = require("express");
const { prisma } = require("../prisma");
const { ok, fail } = require("../utils/response");
const { requireAuth, requireRole } = require("../middleware/auth");
const { articleCreateSchema, articleUpdateSchema } = require("../validators/entities");

const router = express.Router();

// Public
router.get("/", async (req, res) => {
  const items = await prisma.article.findMany({ orderBy: { createdAt: "desc" } });
  return ok(res, items);
});

router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return fail(res, "Invalid id", 400);

  const item = await prisma.article.findUnique({ where: { id } });
  if (!item) return fail(res, "Article not found", 404);
  return ok(res, item);
});

// Admin
router.post("/", requireAuth, requireRole("admin"), async (req, res) => {
  const parsed = articleCreateSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, parsed.error.issues[0]?.message || "Invalid payload", 400);

  const created = await prisma.article.create({ data: parsed.data });
  return ok(res, created, 201);
});

router.put("/:id", requireAuth, requireRole("admin"), async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return fail(res, "Invalid id", 400);

  const parsed = articleUpdateSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, parsed.error.issues[0]?.message || "Invalid payload", 400);

  try {
    const updated = await prisma.article.update({ where: { id }, data: parsed.data });
    return ok(res, updated);
  } catch {
    return fail(res, "Article not found", 404);
  }
});

router.delete("/:id", requireAuth, requireRole("admin"), async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return fail(res, "Invalid id", 400);

  try {
    await prisma.article.delete({ where: { id } });
    return ok(res, true);
  } catch {
    return fail(res, "Article not found", 404);
  }
});

module.exports = router;

