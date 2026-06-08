-- Refactor learning structure:
-- Courses -> Category/Topic/Lesson (topic-based), keep existing Lesson content by migrating:
-- Course becomes a Topic under a per-language "Legacy: Курсы" Category.

BEGIN;

-- 1) Category: add optional languageId (title is mapped to existing "name" column in Prisma)
ALTER TABLE "Category"
  ADD COLUMN IF NOT EXISTS "languageId" INTEGER;

-- 2) Create Topic table
CREATE TABLE IF NOT EXISTS "Topic" (
  "id" SERIAL NOT NULL,
  "title" TEXT NOT NULL,
  "categoryId" INTEGER NOT NULL,
  "order" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Topic_pkey" PRIMARY KEY ("id")
);

-- 3) Lesson: add topicId as nullable first (we will backfill)
ALTER TABLE "Lesson"
  ADD COLUMN IF NOT EXISTS "topicId" INTEGER;

-- 4) Ensure there is a per-language legacy category (idempotent-ish)
INSERT INTO "Category" ("name", "languageId", "createdAt", "updatedAt")
SELECT
  'Legacy: Курсы' AS "name",
  l."id" AS "languageId",
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM "Language" l
WHERE NOT EXISTS (
  SELECT 1 FROM "Category" c
  WHERE c."languageId" = l."id" AND c."name" = 'Legacy: Курсы'
);

-- 5) Create Topic rows from existing Course rows (1 topic per course)
WITH legacy_category AS (
  SELECT c."id" AS "categoryId", c."languageId"
  FROM "Category" c
  WHERE c."name" = 'Legacy: Курсы' AND c."languageId" IS NOT NULL
),
course_with_cat AS (
  SELECT
    crs."id" AS "courseId",
    crs."title" AS "title",
    lc."categoryId" AS "categoryId"
  FROM "Course" crs
  JOIN legacy_category lc ON lc."languageId" = crs."languageId"
),
ordered_courses AS (
  SELECT
    cwc.*,
    ROW_NUMBER() OVER (PARTITION BY cwc."categoryId" ORDER BY cwc."courseId")::int AS "order"
  FROM course_with_cat cwc
)
INSERT INTO "Topic" ("title", "categoryId", "order", "createdAt", "updatedAt")
SELECT
  oc."title",
  oc."categoryId",
  oc."order",
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM ordered_courses oc
WHERE NOT EXISTS (
  SELECT 1 FROM "Topic" t
  WHERE t."categoryId" = oc."categoryId" AND t."title" = oc."title"
);

-- 6) Backfill Lesson.topicId by joining Lesson.courseId -> Course.languageId -> legacy category -> Topic(title=Course.title)
UPDATE "Lesson" l
SET "topicId" = t."id"
FROM "Course" crs
JOIN "Category" cat
  ON cat."languageId" = crs."languageId" AND cat."name" = 'Legacy: Курсы'
JOIN "Topic" t
  ON t."categoryId" = cat."id" AND t."title" = crs."title"
WHERE l."courseId" = crs."id"
  AND l."topicId" IS NULL;

-- 7) Drop old constraints/indexes referencing courseId
ALTER TABLE "Lesson" DROP CONSTRAINT IF EXISTS "Lesson_courseId_fkey";
DROP INDEX IF EXISTS "Lesson_courseId_idx";
DROP INDEX IF EXISTS "Lesson_courseId_order_key";

-- 8) Enforce NOT NULL topicId and set up new FKs/indexes
ALTER TABLE "Lesson"
  ALTER COLUMN "topicId" SET NOT NULL;

CREATE INDEX IF NOT EXISTS "Lesson_topicId_idx" ON "Lesson"("topicId");
CREATE UNIQUE INDEX IF NOT EXISTS "Lesson_topicId_order_key" ON "Lesson"("topicId", "order");

ALTER TABLE "Category"
  ADD CONSTRAINT "Category_languageId_fkey"
  FOREIGN KEY ("languageId") REFERENCES "Language"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Topic"
  ADD CONSTRAINT "Topic_categoryId_fkey"
  FOREIGN KEY ("categoryId") REFERENCES "Category"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Lesson"
  ADD CONSTRAINT "Lesson_topicId_fkey"
  FOREIGN KEY ("topicId") REFERENCES "Topic"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

CREATE INDEX IF NOT EXISTS "Topic_categoryId_idx" ON "Topic"("categoryId");
CREATE UNIQUE INDEX IF NOT EXISTS "Topic_categoryId_order_key" ON "Topic"("categoryId", "order");

-- 9) Remove courseId from Lesson after backfill
ALTER TABLE "Lesson" DROP COLUMN IF EXISTS "courseId";

-- 10) Drop Course and FavoriteCourse (new platform doesn't use them)
DROP TABLE IF EXISTS "FavoriteCourse";
DROP TABLE IF EXISTS "Course";

COMMIT;

