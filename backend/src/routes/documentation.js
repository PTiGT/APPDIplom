const express = require("express");
const { prisma } = require("../prisma");
const { ok, fail } = require("../utils/response");
const { requireAuth, requireRole } = require("../middleware/auth");
const { documentationPageCreateSchema, documentationPageUpdateSchema } = require("../validators/entities");

const router = express.Router();

// Public
router.get("/", async (req, res) => {
  const items = await prisma.documentationPage.findMany({
    orderBy: [{ section: "asc" }, { order: "asc" }, { title: "asc" }],
  });
  return ok(res, items);
});

router.get("/:slug", async (req, res) => {
  const slug = String(req.params.slug || "");
  const item = await prisma.documentationPage.findUnique({ where: { slug } });
  if (!item) return fail(res, "Documentation page not found", 404);
  return ok(res, item);
});

// Admin
router.post("/", requireAuth, requireRole("admin"), async (req, res) => {
  const parsed = documentationPageCreateSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, parsed.error.issues[0]?.message || "Invalid payload", 400);

  try {
    const created = await prisma.documentationPage.create({ data: parsed.data });
    return ok(res, created, 201);
  } catch {
    return fail(res, "Slug already exists", 409);
  }
});

router.put("/:id", requireAuth, requireRole("admin"), async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return fail(res, "Invalid id", 400);

  const parsed = documentationPageUpdateSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, parsed.error.issues[0]?.message || "Invalid payload", 400);

  try {
    const updated = await prisma.documentationPage.update({ where: { id }, data: parsed.data });
    return ok(res, updated);
  } catch {
    return fail(res, "Documentation page not found or slug already exists", 404);
  }
});

router.delete("/:id", requireAuth, requireRole("admin"), async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return fail(res, "Invalid id", 400);

  try {
    await prisma.documentationPage.delete({ where: { id } });
    return ok(res, true);
  } catch {
    return fail(res, "Documentation page not found", 404);
  }
});

module.exports = router;

