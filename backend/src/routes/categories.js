const express = require("express");
const { prisma } = require("../prisma");
const { ok, fail } = require("../utils/response");
const { requireAuth, requireRole } = require("../middleware/auth");
const { categoryCreateSchema, categoryUpdateSchema } = require("../validators/learningStructure");

const router = express.Router();

// Public read (useful for future UI)
router.get("/", async (req, res) => {
  const languageIdRaw = req.query.languageId;
  let languageId;
  if (typeof languageIdRaw === "string" && languageIdRaw.trim() !== "") {
    languageId = Number(languageIdRaw);
    if (!Number.isInteger(languageId)) return fail(res, "Invalid languageId", 400);
  }

  const where = {};
  if (Number.isInteger(languageId)) where.languageId = languageId;

  const items = await prisma.category.findMany({
    where,
    orderBy: [{ languageId: "asc" }, { id: "asc" }],
  });
  return ok(res, items);
});

// Admin
router.post("/", requireAuth, requireRole("admin"), async (req, res) => {
  const parsed = categoryCreateSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, parsed.error.issues[0]?.message || "Invalid payload", 400);

  const created = await prisma.category.create({
    data: {
      title: parsed.data.title,
      languageId: parsed.data.languageId ?? null,
    },
  });
  return ok(res, created, 201);
});

router.put("/:id", requireAuth, requireRole("admin"), async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return fail(res, "Invalid id", 400);

  const parsed = categoryUpdateSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, parsed.error.issues[0]?.message || "Invalid payload", 400);

  try {
    const updated = await prisma.category.update({
      where: { id },
      data: {
        ...(parsed.data.title !== undefined ? { title: parsed.data.title } : {}),
        ...(parsed.data.languageId !== undefined ? { languageId: parsed.data.languageId ?? null } : {}),
      },
    });
    return ok(res, updated);
  } catch {
    return fail(res, "Category not found", 404);
  }
});

router.delete("/:id", requireAuth, requireRole("admin"), async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return fail(res, "Invalid id", 400);

  try {
    await prisma.category.delete({ where: { id } });
    return ok(res, true);
  } catch {
    return fail(res, "Category not found", 404);
  }
});

module.exports = router;

