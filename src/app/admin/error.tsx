"use client";

import { useEffect } from "react";

export default function AdminError({
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
    <main className="h-screen overflow-auto bg-white p-8 text-black">
      <section className="mx-auto max-w-2xl border-[3px] border-black p-6 text-center">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-zinc-600">
          Fleet Admin
        </p>
        <h1 className="mt-3 text-3xl font-black uppercase">Admin Error</h1>
        <p className="mt-4 font-bold text-zinc-700">
          The admin page could not finish loading.
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
