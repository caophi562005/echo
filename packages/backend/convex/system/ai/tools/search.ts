import { createTool } from "@convex-dev/agent";
import z from "zod";

export const search = createTool({
  description:
    "Search the knowledge base for relevant information to help answer user questions",
  args: z.object({
    query: z
      .string()
      .describe("The search query to find  relevant information"),
  }),
  handler: async (ctx) => {
    if (!ctx.threadId) {
      return "Missing thread ID";
    }

    // await ctx.runMutation(internal.system.conversations.search, {
    //   threadId: ctx.threadId,
    // });

    // await supportAgent.saveMessage(ctx, {
    //   threadId: ctx.threadId,
    //   message: {
    //     role: "assistant",
    //     content: "Conversation searched",
    //   },
    // });

    return "Conversation searched";
  },
});
