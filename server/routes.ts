import type { Express } from "express";
import { createServer, type Server } from "http";
import { analyzeRequestSchema, type AnalyzeResponse, type TextSegment } from "@shared/schema";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "x-ai/grok-4.1-fast:free";

const SYSTEM_PROMPT = `You are a professional text editor and grammar assistant. Analyze the user's text and identify:
1. ERRORS: Spelling mistakes, grammatical errors, or incorrect words that should be deleted or replaced
2. ADDITIONS: Grammar fixes like missing punctuation, corrected spelling, or proper word usage
3. IMPROVEMENTS: Stylistic rephrasing for better sentence flow, removing passive voice, or enhancing clarity

Return your analysis as a JSON array of segments. Each segment should have:
- "text": the word or phrase
- "type": one of "error", "addition", "improvement", or "standard"
- "reason": explanation for errors and improvements (optional for standard text)

IMPORTANT RULES:
1. Preserve the original text structure - include all words as segments
2. For deleted text (errors), mark the original wrong word with type "error"
3. For corrections, add a new segment with type "addition" right after the error
4. For style improvements, mark the improved phrase with type "improvement"
5. Unchanged text should have type "standard"
6. Always provide a helpful reason for errors and improvements
7. Keep reasons concise (e.g., "Spelling Error", "Passive Voice", "Missing Comma", "Better Word Choice")

Example input: "The cat were runing fastly."
Example output:
[
  {"text": "The cat ", "type": "standard"},
  {"text": "were", "type": "error", "reason": "Subject-Verb Agreement"},
  {"text": "was", "type": "addition", "reason": "Correct verb form"},
  {"text": " ", "type": "standard"},
  {"text": "runing", "type": "error", "reason": "Spelling Error"},
  {"text": "running", "type": "addition", "reason": "Correct spelling"},
  {"text": " ", "type": "standard"},
  {"text": "fastly", "type": "error", "reason": "Incorrect Adverb"},
  {"text": "quickly", "type": "addition", "reason": "Correct adverb form"},
  {"text": ".", "type": "standard"}
]

Return ONLY the JSON array, no markdown code blocks or other text.`;

async function callOpenRouter(text: string, apiKey: string): Promise<TextSegment[]> {
  const response = await fetch(OPENROUTER_API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://smart-editor.replit.app",
      "X-Title": "Smart Editor",
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Analyze this text and return the JSON segments array:\n\n${text}` },
      ],
      temperature: 0.3,
      max_tokens: 4000,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `OpenRouter API error: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("No response from AI model");
  }

  try {
    let jsonContent = content.trim();
    if (jsonContent.startsWith("```json")) {
      jsonContent = jsonContent.slice(7);
    }
    if (jsonContent.startsWith("```")) {
      jsonContent = jsonContent.slice(3);
    }
    if (jsonContent.endsWith("```")) {
      jsonContent = jsonContent.slice(0, -3);
    }
    jsonContent = jsonContent.trim();

    const segments = JSON.parse(jsonContent);

    if (!Array.isArray(segments)) {
      throw new Error("Response is not an array");
    }

    return segments.map((seg: any) => ({
      text: String(seg.text || ""),
      type: ["error", "addition", "improvement", "standard"].includes(seg.type) ? seg.type : "standard",
      reason: seg.reason ? String(seg.reason) : undefined,
    }));
  } catch (parseError) {
    console.error("Failed to parse AI response:", content);
    throw new Error("Failed to parse AI response. The model returned an invalid format. Please try again.");
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.post("/api/analyze", async (req, res) => {
    try {
      const result = analyzeRequestSchema.safeParse(req.body);

      if (!result.success) {
        return res.status(400).json({
          error: result.error.errors[0]?.message || "Invalid request"
        });
      }

      const { text, apiKey } = result.data;

      const segments = await callOpenRouter(text, apiKey);

      const improvedText = segments
        .filter(s => s.type !== "error")
        .map(s => s.text)
        .join("");

      const response: AnalyzeResponse = {
        segments,
        originalText: text,
        improvedText,
      };

      res.json(response);
    } catch (error) {
      console.error("Analysis error:", error);
      res.status(500).json({
        error: error instanceof Error ? error.message : "Analysis failed"
      });
    }
  });

  return httpServer;
}
