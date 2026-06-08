const { prisma } = require("../prisma");

async function createActivity({ userId, type, meta }) {
  return prisma.activity.create({
    data: { userId, type, meta: meta ?? undefined },
  });
}

async function listActivitiesForUser({ userId, take = 30 }) {
  return prisma.activity.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take,
  });
}

module.exports = { createActivity, listActivitiesForUser };

