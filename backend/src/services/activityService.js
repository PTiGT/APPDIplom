const { createActivity } = require("../repositories/activityRepository");
const { bumpStreak } = require("./streakService");

async function recordActivity({ userId, type, meta }) {
  const [activity, streak] = await Promise.all([
    createActivity({ userId, type, meta }),
    bumpStreak(userId),
  ]);
  return { activity, streak };
}

module.exports = { recordActivity };

