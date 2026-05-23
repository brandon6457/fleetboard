export default function Loading() {
  return (
    <main className="flex h-screen items-center justify-center overflow-hidden border-[4px] border-zinc-300 bg-white p-8 text-black shadow-[inset_0_0_10px_rgba(0,0,0,0.25)]">
      <section className="w-full max-w-xl border-[4px] border-black p-8 text-center">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-zinc-600">
          Down to Earth
        </p>
        <h1 className="mt-3 text-4xl font-black uppercase leading-none">
          Loading Fleet Board
        </h1>
        <div className="mx-auto mt-5 w-48 border-t-[4px] border-black" />
      </section>
    </main>
  );
}
