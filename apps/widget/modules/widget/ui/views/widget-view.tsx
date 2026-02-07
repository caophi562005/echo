"use client";

import { screenAtom } from "@/modules/widget/atoms/widget-atom";
import { WidgetAuthScreen } from "@/modules/widget/ui/screens/widget-auth-screen";
import { useAtomValue } from "jotai";

interface Props {
  organizationId: string;
}

export const WidgetView = ({ organizationId }: Props) => {
  const screen = useAtomValue(screenAtom);

  const screenComponents = {
    error: <p>Error</p>,
    loading: <p>Loading</p>,
    auth: <WidgetAuthScreen />,
    voice: <p>Voice</p>,
    inbox: <p>Inbox</p>,
    selection: <p>Selection</p>,
    chat: <p>Chat</p>,
    contact: <p>Contact</p>,
  };

  return (
    <main className="min-h-screen min-w-screen flex h-full w-full flex-col overflow-hidden rounded-xl border bg-muted">
      {screenComponents[screen]}
    </main>
  );
};
