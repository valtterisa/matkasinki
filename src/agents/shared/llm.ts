import Anthropic from "@anthropic-ai/sdk";

export const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Fast model for interactive flows; heavier model for deep scout research.
export const MODELS = {
  interactive: "claude-sonnet-5",
  research: "claude-opus-4-8",
} as const;
