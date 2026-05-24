type FleetSectionProps = {
  title: string;
  statusCounts: {
    active: number;
    backup: number;
  };
  className?: string;
  children?: React.ReactNode;
};

export function FleetSection({
  title,
  statusCounts,
  className = "",
  children,
}: FleetSectionProps) {
  return (
    <section className={`flex min-h-0 flex-col bg-white ${className}`}>
      <header className="px-[clamp(1rem,1.35vw,1.8rem)] pt-[clamp(0.8rem,1.2vw,1.4rem)]">
        <h2 className="flex items-center justify-center gap-1.5 text-center text-[clamp(1.45rem,1.85vw,3rem)] font-black uppercase leading-none text-black">
          <span className="whitespace-nowrap">{title}</span>
          <span
            className="whitespace-nowrap text-[clamp(0.72rem,0.78vw,1rem)] font-black leading-none text-black"
            aria-label={`${title} active ${statusCounts.active} backup ${statusCounts.backup}`}
          >
            A:{statusCounts.active} B:{statusCounts.backup}
          </span>
        </h2>
        <div className="mt-[clamp(0.35rem,0.55vw,0.65rem)] border-t-[3px] border-black" />
      </header>

      <div className="min-h-0 flex-1 px-[clamp(1rem,1.35vw,1.8rem)] pb-[clamp(1rem,1.35vw,1.8rem)] pt-4">
        {children}
      </div>
    </section>
  );
}
