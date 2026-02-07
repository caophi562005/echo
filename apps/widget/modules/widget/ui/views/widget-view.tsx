"use client";

import { screenAtom } from "@/modules/widget/atoms/widget-atom";
import { WidgetAuthScreen } from "@/modules/widget/ui/screens/widget-auth-screen";
import { WidgetErrorScreen } from "@/modules/widget/ui/screens/widget-error-screen";
import { useAtomValue } from "jotai";
import { WidgetChatScreen } from "../screens/widget-chat-screen";
import { WidgetLoadingScreen } from "../screens/widget-loading-screen";
import { WidgetSelectionScreen } from "../screens/widget-selection-screen";

interface Props {
  organizationId: string;
}

export const WidgetView = ({ organizationId }: Props) => {
  const screen = useAtomValue(screenAtom);

  const screenComponents = {
    loading: <WidgetLoadingScreen organizationId={organizationId} />,
    error: <WidgetErrorScreen />,
    auth: <WidgetAuthScreen />,
    voice: <p>Voice</p>,
    inbox: <p>Inbox</p>,
    selection: <WidgetSelectionScreen />,
    chat: <WidgetChatScreen />,
    contact: <p>Contact</p>,
  };

  return (
    <main className="flex h-full w-full flex-col overflow-hidden rounded-xl border bg-muted">
      {screenComponents[screen]}
    </main>
  );
};
