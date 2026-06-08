const { fail } = require("../utils/response");

function notFound(req, res) {
  return fail(res, "Not found", 404);
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const status = typeof err?.status === "number" ? err.status : 500;
  const message = err?.message ? String(err.message) : "Internal server error";
  return fail(res, message, status);
}

module.exports = { notFound, errorHandler };

