CREATE TABLE "DocumentationPage" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DocumentationPage_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "DocumentationPage_slug_key" ON "DocumentationPage"("slug");
CREATE INDEX "DocumentationPage_section_idx" ON "DocumentationPage"("section");
CREATE INDEX "DocumentationPage_order_idx" ON "DocumentationPage"("order");

