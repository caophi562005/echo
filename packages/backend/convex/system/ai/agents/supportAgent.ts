import { groq } from "@ai-sdk/groq";
import { Agent } from "@convex-dev/agent";
import { components } from "../../../_generated/api";

export const supportAgent = new Agent(components.agent, {
  name: "supportAgent",
  languageModel: groq("qwen/qwen3-32b"),
  instructions: "You are a customer support agent",
});
