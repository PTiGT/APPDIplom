const jwt = require("jsonwebtoken");
const { fail } = require("../utils/response");

function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const [type, token] = header.split(" ");
  if (type !== "Bearer" || !token) {
    return fail(res, "Unauthorized", 401);
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) return fail(res, "Server misconfigured: JWT_SECRET missing", 500);

    const payload = jwt.verify(token, secret);
    req.user = payload; // { userId, role, email }
    return next();
  } catch {
    return fail(res, "Unauthorized", 401);
  }
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) return fail(res, "Unauthorized", 401);
    if (req.user.role !== role) return fail(res, "Forbidden", 403);
    return next();
  };
}

module.exports = { requireAuth, requireRole };

