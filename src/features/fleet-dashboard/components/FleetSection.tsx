type FleetSectionProps = {
  title: string;
  statusCounts: {
    active: number;
    backup: number;
  };
  className?: string;
  contentSectionId?: string;
  children?: React.ReactNode;
};

export function FleetSection({
  title,
  statusCounts,
  className = "",
  contentSectionId,
  children,
}: FleetSectionProps) {
  return (
    <section className={`flex min-h-0 flex-col bg-white ${className}`}>
      <header className="px-[clamp(0.55rem,0.75dvw,1.15rem)] pt-[clamp(0.35rem,0.6dvh,0.8rem)]">
        <h2 className="flex items-center justify-center gap-[clamp(0.2rem,0.35dvw,0.5rem)] text-center text-[clamp(1.05rem,1.35dvw,2rem)] font-black uppercase leading-none text-black">
          <span className="whitespace-nowrap">{title}</span>
          <span
            className="whitespace-nowrap text-[clamp(0.58rem,0.68dvw,0.92rem)] font-black leading-none text-black"
            aria-label={`${title} active ${statusCounts.active} backup ${statusCounts.backup}`}
          >
            A:{statusCounts.active} B:{statusCounts.backup}
          </span>
        </h2>
        <div className="mt-[clamp(0.2rem,0.35dvh,0.42rem)] border-t-[3px] border-black" />
      </header>

      <div
        className="min-h-0 flex-1 px-[clamp(0.45rem,0.7dvw,1.05rem)] pb-[clamp(0.35rem,0.7dvh,0.9rem)] pt-[clamp(0.25rem,0.6dvh,0.7rem)]"
        data-fleet-section={contentSectionId}
      >
        {children}
      </div>
    </section>
  );
}
