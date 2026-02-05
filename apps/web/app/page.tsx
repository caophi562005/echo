"use client";

import { SignInButton, UserButton } from "@clerk/nextjs";
import { api } from "@workspace/backend/_generated/api";
import { Authenticated, Unauthenticated, useQuery } from "convex/react";

export default function Page() {
  const users = useQuery(api.user.getMany);

  return (
    <>
      <Authenticated>
        <div className="flex items-center justify-center min-h-svh">
          <p>apps/web</p>
          <UserButton />
          {JSON.stringify(users)}
        </div>
      </Authenticated>
      <Unauthenticated>
        <SignInButton>Sign in</SignInButton>
      </Unauthenticated>
    </>
  );
}
