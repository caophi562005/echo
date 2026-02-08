"use client";

import { api } from "@workspace/backend/_generated/api";
import { Id } from "@workspace/backend/_generated/dataModel";
import {
  AIConversation,
  AIConversationContent,
  AIConversationScrollButton,
} from "@workspace/ui/components/ai/conversation";
import { Button } from "@workspace/ui/components/button";
import { useMutation, useQuery } from "convex/react";
import { MoreHorizontalIcon, Wand2Icon } from "lucide-react";

import { toUIMessages, useThreadMessages } from "@convex-dev/agent/react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AIInput,
  AIInputButton,
  AIInputSubmit,
  AIInputTextarea,
  AIInputToolbar,
  AIInputTools,
} from "@workspace/ui/components/ai/input";
import {
  AIMessage,
  AIMessageContent,
} from "@workspace/ui/components/ai/message";
import { AIResponse } from "@workspace/ui/components/ai/response";
import { DicebearAvatar } from "@workspace/ui/components/dicebear-avatar";
import { Form, FormField } from "@workspace/ui/components/form";
import { InfiniteScrollTrigger } from "@workspace/ui/components/infinite-scroll-trigger";
import { useInfiniteScroll } from "@workspace/ui/hooks/use-infinite-scroll";
import { useForm } from "react-hook-form";
import z from "zod";

interface Props {
  conversationId: Id<"conversations">;
}

const formSchema = z.object({
  message: z.string().min(1, "Message is required"),
});

export const ConversationIdView = ({ conversationId }: Props) => {
  const conversation = useQuery(api.private.conversations.getOne, {
    conversationId,
  });

  const messages = useThreadMessages(
    api.private.messages.getMany,
    conversation?.threadId ? { threadId: conversation.threadId } : "skip",
    {
      initialNumItems: 10,
    },
  );

  const { topElementRef, handleLoadMore, isLoadingMore, canLoadMore } =
    useInfiniteScroll({
      status: messages.status,
      loadMore: messages.loadMore,
      loadSize: 10,
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  const createMessage = useMutation(api.private.messages.create);
  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    try {
      form.reset();
      await createMessage({
        prompt: value.message,
        conversationId,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex h-full flex-col bg-muted">
      <header className="flex items-center justify-between border-b bg-background p-2.5">
        <Button size={"sm"} variant={"ghost"}>
          <MoreHorizontalIcon />
        </Button>
      </header>

      <AIConversation className="max-h-[calc(100vh-180px)]">
        <AIConversationContent>
          <InfiniteScrollTrigger
            canLoadMore={canLoadMore}
            isLoadingMore={isLoadingMore}
            onLoadMore={handleLoadMore}
            ref={topElementRef}
          />
          {toUIMessages(messages.results ?? [])?.map((message) => {
            return (
              <AIMessage
                from={message.role === "user" ? "assistant" : "user"}
                key={message.id}
              >
                <AIMessageContent>
                  <AIResponse>{message.text}</AIResponse>
                </AIMessageContent>
                {message.role === "user" && (
                  <DicebearAvatar
                    imageUrl="/logo.svg"
                    seed={conversation?.contactSessionId || "user"}
                    size={32}
                  />
                )}
              </AIMessage>
            );
          })}
        </AIConversationContent>
        <AIConversationScrollButton />
      </AIConversation>

      <div className="p-2">
        <Form {...form}>
          <AIInput onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="message"
              disabled={conversation?.status === "resolved"}
              render={({ field }) => {
                return (
                  <AIInputTextarea
                    disabled={
                      conversation?.status === "resolved" ||
                      form.formState.isSubmitting
                    }
                    onChange={field.onChange}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        form.handleSubmit(onSubmit)();
                      }
                    }}
                    placeholder={
                      conversation?.status === "resolved"
                        ? "This conversation has been resolved"
                        : "Type your message..."
                    }
                    value={field.value}
                  />
                );
              }}
            />
            <AIInputToolbar>
              <AIInputTools>
                <AIInputButton>
                  <Wand2Icon />
                  Enhance
                </AIInputButton>
              </AIInputTools>
              <AIInputSubmit
                disabled={
                  conversation?.status === "resolved" ||
                  !form.formState.isValid ||
                  form.formState.isSubmitting
                }
                status="ready"
                type="submit"
              />
            </AIInputToolbar>
          </AIInput>
        </Form>
      </div>
    </div>
  );
};
