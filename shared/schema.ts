import { z } from "zod";

export type ChangeType = "error" | "addition" | "improvement" | "standard";

export interface TextSegment {
  text: string;
  type: ChangeType;
  reason?: string;
}

export interface AnalyzeRequest {
  text: string;
  apiKey: string;
}

export interface AnalyzeResponse {
  segments: TextSegment[];
  originalText: string;
  improvedText: string;
}

export const analyzeRequestSchema = z.object({
  text: z.string().min(1, "Text is required"),
  apiKey: z.string().min(1, "API key is required"),
});

export type InsertAnalyzeRequest = z.infer<typeof analyzeRequestSchema>;
