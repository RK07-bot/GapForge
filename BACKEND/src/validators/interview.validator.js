const { z } = require("zod");

const generateReportSchema = z.object({
  jobDescription: z
    .string()
    .trim()
    .min(10, "Job description should be at least 10 characters"),
});

module.exports = {
  generateReportSchema,
};