const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");
const logger = require("../utils/logger.js");

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

const PRIMARY_MODEL = "gemini-3.5-flash-lite";
const FALLBACK_MODEL = "gemini-3.6-flash";

const interviewReportSchema = z.object({
  jobTitle: z
    .string()
    .describe(
      "The job title/role being applied for, extracted directly from the job description (e.g. 'Senior Frontend Engineer')",
    ),
  companyName: z
    .string()
    .optional()
    .describe(
      "The hiring company's name, only if it's actually mentioned in the job description - omit this field entirely if it isn't",
    ),
  matchScore: z
    .number()
    .min(0)
    .max(100)
    .describe(
      "Score between 0 and 100 indicating how well the candidate matches the job",
    ),

  technicalQuestions: z
    .array(
      z.object({
        question: z.string(),
        intention: z.string(),
        answer: z.string(),
      }),
    )
    .min(10)
    .max(12)
    .describe(
      "Generate at least 10 and at most 12 technical interview questions specifically tailored to the candidate and job description. Keep answers concise but useful.",
    ),

  behavioralQuestions: z
    .array(
      z.object({
        question: z.string(),
        intention: z.string(),
        answer: z.string(),
      }),
    )
    .min(10)
    .max(12)
    .describe(
      "Generate at least 10 and at most 12 behavioral interview questions specifically tailored to the candidate and job description. Keep answers concise but useful.",
    ),

  skillGaps: z.array(
    z.object({
      skill: z.string(),
      severity: z.enum(["low", "medium", "high"]),
    }),
  ),

  preparationPlan: z.array(
    z.object({
      day: z.number(),
      focus: z.string(),
      tasks: z.array(z.string()),
    }),
  ),
});

async function callModel(model, prompt) {
  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: zodToJsonSchema(interviewReportSchema),
      temperature: 0.3,
      maxOutputTokens: 8192,
    },
  });

  return JSON.parse(response.text);
}

async function generateInterviewReport({ resume, jobDescription }) {
  const prompt = `
Generate a personalized interview report for the candidate based only on the resume and job description.

Requirements:

1. Generate 10 to 12 technical interview questions.
2. Generate 10 to 12 behavioral interview questions.
3. Questions must be relevant to the job description and candidate's resume.
4. Each question must include:
   - the question
   - why the interviewer is asking it
   - a concise but useful model answer
5. Calculate the match score from 0 to 100 based on how well the candidate's resume matches the job requirements.
6. Identify the most important skill gaps.
7. Create a practical preparation roadmap.

Resume:
${resume}

Job Description:
${jobDescription}
`;

  // Try primary model twice
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      return await callModel(PRIMARY_MODEL, prompt);
    } catch (error) {
      logger.warn(
        { model: PRIMARY_MODEL, attempt, error: error.message },
        "Primary model failed",
      );
    }
  }

  // Fallback model
  try {
    logger.warn({ model: FALLBACK_MODEL }, "Using fallback model");

    return await callModel(FALLBACK_MODEL, prompt);
  } catch (error) {
    logger.error({ error: error.message }, "Both AI models failed");

    throw new Error(
      "Failed to generate interview report. Please try again later.",
    );
  }
}

module.exports = {
  generateInterviewReport,
};
