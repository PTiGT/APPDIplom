const { z } = require("zod");

const languageCreateSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  icon: z.string().min(1),
});

const languageUpdateSchema = languageCreateSchema.partial();

const guideCreateSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  languageId: z.number().int().positive(),
});

const guideUpdateSchema = z
  .object({
    title: z.string().min(1).optional(),
    content: z.string().min(1).optional(),
    languageId: z.number().int().positive().optional(),
  })
  .refine((v) => Object.keys(v).length > 0, { message: "No fields to update" });

const articleCreateSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
});

const articleUpdateSchema = z
  .object({
    title: z.string().min(1).optional(),
    content: z.string().min(1).optional(),
  })
  .refine((v) => Object.keys(v).length > 0, { message: "No fields to update" });

const documentationPageCreateSchema = z.object({
  title: z.string().min(1),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must use lowercase latin letters, numbers and dashes"),
  section: z.string().min(1),
  excerpt: z.string().min(1),
  content: z.string().min(1),
  order: z.number().int().min(1).default(1),
});

const documentationPageUpdateSchema = z
  .object({
    title: z.string().min(1).optional(),
    slug: z
      .string()
      .min(1)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must use lowercase latin letters, numbers and dashes")
      .optional(),
    section: z.string().min(1).optional(),
    excerpt: z.string().min(1).optional(),
    content: z.string().min(1).optional(),
    order: z.number().int().min(1).optional(),
  })
  .refine((v) => Object.keys(v).length > 0, { message: "No fields to update" });

const categoryCreateSchema = z.object({
  name: z.string().min(1),
});

const categoryUpdateSchema = z
  .object({
    name: z.string().min(1).optional(),
  })
  .refine((v) => Object.keys(v).length > 0, { message: "No fields to update" });

module.exports = {
  languageCreateSchema,
  languageUpdateSchema,
  guideCreateSchema,
  guideUpdateSchema,
  articleCreateSchema,
  articleUpdateSchema,
  documentationPageCreateSchema,
  documentationPageUpdateSchema,
  categoryCreateSchema,
  categoryUpdateSchema,
};

