const express = require("express");
const { prisma } = require("../prisma");
const { ok, fail } = require("../utils/response");
const { requireAuth, requireRole } = require("../middleware/auth");
const { languageCreateSchema, languageUpdateSchema } = require("../validators/entities");

const router = express.Router();

// Public
router.get("/", async (req, res) => {
  const items = await prisma.language.findMany({ orderBy: { id: "asc" } });
  return ok(res, items);
});

// Admin
router.post("/", requireAuth, requireRole("admin"), async (req, res) => {
  const parsed = languageCreateSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, parsed.error.issues[0]?.message || "Invalid payload", 400);

  const created = await prisma.language.create({ data: parsed.data });
  return ok(res, created, 201);
});

router.put("/:id", requireAuth, requireRole("admin"), async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return fail(res, "Invalid id", 400);

  const parsed = languageUpdateSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, parsed.error.issues[0]?.message || "Invalid payload", 400);

  try {
    const updated = await prisma.language.update({ where: { id }, data: parsed.data });
    return ok(res, updated);
  } catch {
    return fail(res, "Language not found", 404);
  }
});

router.delete("/:id", requireAuth, requireRole("admin"), async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return fail(res, "Invalid id", 400);

  try {
    await prisma.language.delete({ where: { id } });
    return ok(res, true);
  } catch {
    return fail(res, "Language not found", 404);
  }
});

module.exports = router;

