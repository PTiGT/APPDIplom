const { prisma } = require("../prisma");

async function listTopics({ categoryId }) {
  const where = {};
  if (Number.isInteger(categoryId)) where.categoryId = categoryId;

  return prisma.topic.findMany({
    where,
    orderBy: [{ categoryId: "asc" }, { order: "asc" }, { id: "asc" }],
  });
}

async function getTopicById(id) {
  return prisma.topic.findUnique({
    where: { id },
    include: { lessons: { orderBy: { order: "asc" } } },
  });
}

async function createTopic(data) {
  return prisma.topic.create({ data });
}

async function updateTopic(id, data) {
  return prisma.topic.update({ where: { id }, data });
}

async function deleteTopic(id) {
  return prisma.topic.delete({ where: { id } });
}

module.exports = { listTopics, getTopicById, createTopic, updateTopic, deleteTopic };

