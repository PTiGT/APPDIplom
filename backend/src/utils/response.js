function ok(res, data, status = 200) {
  return res.status(status).json({ data, error: null });
}

function fail(res, error, status = 400) {
  const message = typeof error === "string" ? error : "Unknown error";
  return res.status(status).json({ data: null, error: message });
}

module.exports = { ok, fail };

