const { prisma } = require("../prisma");

async function upsertProgress({ userId, lessonId, status, completedAt }) {
  return prisma.lessonProgress.upsert({
    where: { userId_lessonId: { userId, lessonId } },
    create: {
      userId,
      lessonId,
      status,
      completedAt: completedAt ?? null,
    },
    update: {
      status,
      completedAt: completedAt ?? null,
    },
  });
}

async function getProgressForUser({ userId, lessonId }) {
  const where = { userId };
  if (Number.isInteger(lessonId)) where.lessonId = lessonId;
  return prisma.lessonProgress.findMany({
    where,
    orderBy: { updatedAt: "desc" },
  });
}

async function getProgressForUserWithLesson({ userId, topicId }) {
  const where = { userId };
  return prisma.lessonProgress.findMany({
    where,
    include: { lesson: true },
    orderBy: { updatedAt: "desc" },
  }).then((items) => {
    if (!Number.isInteger(topicId)) return items;
    return items.filter((p) => p.lesson.topicId === topicId);
  });
}

async function countCompletedLessons(userId) {
  return prisma.lessonProgress.count({
    where: { userId, status: "completed" },
  });
}

module.exports = { upsertProgress, getProgressForUser, getProgressForUserWithLesson, countCompletedLessons };

