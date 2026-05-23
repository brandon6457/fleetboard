"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
const convex = convexUrl ? new ConvexReactClient(convexUrl) : null;

function MissingConvexConfiguration() {
  return (
    <main className="flex h-screen items-center justify-center bg-white p-8 text-black">
      <section className="max-w-xl border-[4px] border-black p-6 text-center">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-zinc-600">
          Deployment configuration needed
        </p>
        <h1 className="mt-3 text-3xl font-black uppercase">
          Convex URL Missing
        </h1>
        <p className="mt-4 text-base font-bold leading-relaxed text-zinc-700">
          Set NEXT_PUBLIC_CONVEX_URL in the deployment environment so the fleet
          dashboard can connect to Convex.
        </p>
      </section>
    </main>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  if (!convex) {
    return <MissingConvexConfiguration />;
  }

  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
