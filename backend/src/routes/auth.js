const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { prisma } = require("../prisma");
const { ok, fail } = require("../utils/response");
const { registerSchema, loginSchema } = require("../validators/auth");

const router = express.Router();

function signToken(user) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    const err = new Error("Server misconfigured: JWT_SECRET missing");
    err.status = 500;
    throw err;
  }
  return jwt.sign(
    { userId: user.id, role: user.role, email: user.email },
    secret,
    { expiresIn: "7d" }
  );
}

router.post("/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, parsed.error.issues[0]?.message || "Invalid payload", 400);

  const { email, password } = parsed.data;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return fail(res, "Email already in use", 409);

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, password: hashed, role: "user" },
    select: { id: true, email: true, role: true },
  });

  const token = signToken(user);
  return ok(res, { token, user }, 201);
});

router.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, parsed.error.issues[0]?.message || "Invalid payload", 400);

  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return fail(res, "Invalid credentials", 401);

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return fail(res, "Invalid credentials", 401);

  const token = signToken(user);
  return ok(res, { token, user: { id: user.id, email: user.email, role: user.role } });
});

module.exports = router;

