const { z } = require("zod");

const challengeDifficultySchema = z.enum(["easy", "medium", "hard"]);

const challengeCreateSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  difficulty: challengeDifficultySchema,
  starterCode: z.string().min(1),
  expectedOutput: z.string().min(1),
  languageId: z.number().int().positive(),
});

const challengeUpdateSchema = z
  .object({
    title: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    difficulty: challengeDifficultySchema.optional(),
    starterCode: z.string().min(1).optional(),
    expectedOutput: z.string().min(1).optional(),
    languageId: z.number().int().positive().optional(),
  })
  .refine((v) => Object.keys(v).length > 0, { message: "No fields to update" });

const submissionCreateSchema = z.object({
  code: z.string().min(1),
});

module.exports = {
  challengeCreateSchema,
  challengeUpdateSchema,
  submissionCreateSchema,
  challengeDifficultySchema,
};

