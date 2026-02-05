"use client";

import { api } from "@workspace/backend/_generated/api";
import { useQuery } from "convex/react";

export default function Page() {
  const users = useQuery(api.user.getMany);

  return (
    <div className="flex items-center justify-center min-h-svh">
      <p>apps/web</p>
      {JSON.stringify(users)}
    </div>
  );
}
