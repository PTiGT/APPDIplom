const { prisma } = require("../prisma");

async function listFavorites(userId) {
  const [articles, challenges] = await Promise.all([
    prisma.favoriteArticle.findMany({ where: { userId }, include: { article: true }, orderBy: { createdAt: "desc" } }),
    prisma.favoriteChallenge.findMany({
      where: { userId },
      include: { challenge: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return { articles, challenges };
}

async function toggleFavoriteArticle({ userId, articleId }) {
  const existing = await prisma.favoriteArticle.findUnique({
    where: { userId_articleId: { userId, articleId } },
  });
  if (existing) {
    await prisma.favoriteArticle.delete({ where: { id: existing.id } });
    return { favorited: false };
  }
  await prisma.favoriteArticle.create({ data: { userId, articleId } });
  return { favorited: true };
}

async function toggleFavoriteChallenge({ userId, challengeId }) {
  const existing = await prisma.favoriteChallenge.findUnique({
    where: { userId_challengeId: { userId, challengeId } },
  });
  if (existing) {
    await prisma.favoriteChallenge.delete({ where: { id: existing.id } });
    return { favorited: false };
  }
  await prisma.favoriteChallenge.create({ data: { userId, challengeId } });
  return { favorited: true };
}

module.exports = {
  listFavorites,
  toggleFavoriteArticle,
  toggleFavoriteChallenge,
};

