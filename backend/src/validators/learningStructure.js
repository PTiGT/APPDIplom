const { z } = require("zod");

const categoryCreateSchema = z.object({
  title: z.string().min(1),
  languageId: z.number().int().positive().nullable().optional(),
});

const categoryUpdateSchema = z
  .object({
    title: z.string().min(1).optional(),
    languageId: z.number().int().positive().nullable().optional(),
  })
  .refine((v) => Object.keys(v).length > 0, { message: "No fields to update" });

const topicCreateSchema = z.object({
  title: z.string().min(1),
  categoryId: z.number().int().positive(),
  order: z.number().int().min(1),
});

const topicUpdateSchema = z
  .object({
    title: z.string().min(1).optional(),
    categoryId: z.number().int().positive().optional(),
    order: z.number().int().min(1).optional(),
  })
  .refine((v) => Object.keys(v).length > 0, { message: "No fields to update" });

const lessonCreateSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  topicId: z.number().int().positive(),
  order: z.number().int().min(1),
});

const lessonUpdateSchema = z
  .object({
    title: z.string().min(1).optional(),
    content: z.string().min(1).optional(),
    topicId: z.number().int().positive().optional(),
    order: z.number().int().min(1).optional(),
  })
  .refine((v) => Object.keys(v).length > 0, { message: "No fields to update" });

module.exports = {
  categoryCreateSchema,
  categoryUpdateSchema,
  topicCreateSchema,
  topicUpdateSchema,
  lessonCreateSchema,
  lessonUpdateSchema,
};

