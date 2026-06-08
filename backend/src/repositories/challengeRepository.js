const { prisma } = require("../prisma");

async function listChallenges({ languageId, difficulty }) {
  const where = {};
  if (Number.isInteger(languageId)) where.languageId = languageId;
  if (difficulty) where.difficulty = difficulty;
  return prisma.challenge.findMany({
    where,
    orderBy: [{ difficulty: "asc" }, { id: "asc" }],
  });
}

async function getChallengeById(id) {
  return prisma.challenge.findUnique({ where: { id } });
}

async function createChallenge(data) {
  return prisma.challenge.create({ data });
}

async function updateChallenge(id, data) {
  return prisma.challenge.update({ where: { id }, data });
}

async function deleteChallenge(id) {
  return prisma.challenge.delete({ where: { id } });
}

module.exports = {
  listChallenges,
  getChallengeById,
  createChallenge,
  updateChallenge,
  deleteChallenge,
};

