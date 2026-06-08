const { prisma } = require("../prisma");

async function getLessonById(id) {
  return prisma.lesson.findUnique({
    where: { id },
    include: { topic: { include: { category: { include: { language: true } } } } },
  });
}

async function createLesson(data) {
  return prisma.lesson.create({ data });
}

async function updateLesson(id, data) {
  return prisma.lesson.update({ where: { id }, data });
}

async function deleteLesson(id) {
  return prisma.lesson.delete({ where: { id } });
}

module.exports = {
  getLessonById,
  createLesson,
  updateLesson,
  deleteLesson,
};

