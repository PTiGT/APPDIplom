const { prisma } = require("../prisma");

async function getStreak(userId) {
  return prisma.userStreak.findUnique({ where: { userId } });
}

async function upsertStreak({ userId, currentStreak, longestStreak, lastActivityAt }) {
  return prisma.userStreak.upsert({
    where: { userId },
    create: { userId, currentStreak, longestStreak, lastActivityAt },
    update: { currentStreak, longestStreak, lastActivityAt },
  });
}

module.exports = { getStreak, upsertStreak };

