function normalize(s) {
  return String(s ?? "").trim().replace(/\r\n/g, "\n");
}

/**
 * Minimal, safe evaluator.
 * Today it does NOT execute code. It only compares "expectedOutput" vs submitted "code"
 * using simple heuristics. This keeps the architecture ready for a future sandbox runner.
 */
function evaluateSubmission({ code, expectedOutput }) {
  const c = normalize(code);
  const expected = normalize(expectedOutput);

  if (!c) {
    return { status: "runtime_error", output: null, error: "Empty submission" };
  }
  if (c.includes("RUNTIME_ERROR")) {
    return { status: "runtime_error", output: null, error: "Mock runtime error" };
  }
  if (expected && (c === expected || c.includes(expected))) {
    return { status: "accepted", output: expected, error: null };
  }
  return { status: "wrong_answer", output: null, error: null };
}

module.exports = { evaluateSubmission };

