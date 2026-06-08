const { getStreak, upsertStreak } = require("../repositories/streakRepository");

function startOfDayUTC(d) {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

function daysBetweenUTC(a, b) {
  const a0 = startOfDayUTC(a).getTime();
  const b0 = startOfDayUTC(b).getTime();
  return Math.round((b0 - a0) / (24 * 60 * 60 * 1000));
}

async function bumpStreak(userId, now = new Date()) {
  const existing = await getStreak(userId);
  const prevAt = existing?.lastActivityAt;

  let currentStreak = existing?.currentStreak ?? 0;
  let longestStreak = existing?.longestStreak ?? 0;

  if (!prevAt) {
    currentStreak = 1;
  } else {
    const deltaDays = daysBetweenUTC(prevAt, now);
    if (deltaDays <= 0) {
      // same day — do not increment
      currentStreak = currentStreak || 1;
    } else if (deltaDays === 1) {
      currentStreak += 1;
    } else {
      currentStreak = 1;
    }
  }

  if (currentStreak > longestStreak) longestStreak = currentStreak;

  return upsertStreak({
    userId,
    currentStreak,
    longestStreak,
    lastActivityAt: now,
  });
}

module.exports = { bumpStreak };

