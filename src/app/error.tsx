"use client";

import { useEffect } from "react";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex h-screen items-center justify-center overflow-hidden border-[4px] border-zinc-300 bg-white p-8 text-black shadow-[inset_0_0_10px_rgba(0,0,0,0.25)]">
      <section className="w-full max-w-xl border-[4px] border-black p-8 text-center">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-zinc-600">
          Fleet Management
        </p>
        <h1 className="mt-3 text-4xl font-black uppercase leading-none">
          Dashboard Error
        </h1>
        <p className="mt-4 text-base font-bold leading-relaxed text-zinc-700">
          The dashboard could not finish loading. Try again, and check the
          deployment logs if this keeps happening.
        </p>
        <button
          className="mt-6 border-[3px] border-black bg-black px-5 py-3 text-sm font-black uppercase text-white"
          onClick={() => unstable_retry()}
          type="button"
        >
          Try Again
        </button>
      </section>
    </main>
  );
}
