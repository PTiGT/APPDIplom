const { prisma } = require("../prisma");

async function createSubmission(data) {
  return prisma.submission.create({ data });
}

async function listSubmissionsForUserChallenge({ userId, challengeId }) {
  return prisma.submission.findMany({
    where: { userId, challengeId },
    orderBy: { createdAt: "desc" },
  });
}

async function countAcceptedForUser(userId) {
  return prisma.submission.count({ where: { userId, status: "accepted" } });
}

async function countSubmissionsForUser(userId) {
  return prisma.submission.count({ where: { userId } });
}

module.exports = {
  createSubmission,
  listSubmissionsForUserChallenge,
  countAcceptedForUser,
  countSubmissionsForUser,
};

