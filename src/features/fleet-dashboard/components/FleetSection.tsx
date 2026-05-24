export type FleetSectionItem = {
  id: string;
  label: string;
};

type FleetSectionProps = {
  title: string;
  count?: number;
  statusCounts?: {
    active: number;
    backup: number;
  };
  items?: FleetSectionItem[];
  className?: string;
  children?: React.ReactNode;
};

export function FleetSection({
  title,
  count,
  statusCounts,
  items = [],
  className = "",
  children,
}: FleetSectionProps) {
  return (
    <section className={`flex min-h-0 flex-col bg-white ${className}`}>
      <header className="px-[clamp(1rem,1.35vw,1.8rem)] pt-[clamp(0.8rem,1.2vw,1.4rem)]">
        <h2 className="flex items-center justify-center gap-2 text-center text-[clamp(1.65rem,2vw,3rem)] font-black uppercase leading-none text-black">
          <span>{title}</span>
          {statusCounts ? (
            <span
              className="whitespace-nowrap text-[clamp(0.85rem,0.95vw,1.2rem)] font-black leading-none text-black"
              aria-label={`${title} active ${statusCounts.active} backup ${statusCounts.backup}`}
            >
              A: {statusCounts.active} B: {statusCounts.backup}
            </span>
          ) : typeof count === "number" ? (
            <span
              className="min-w-8 border-[3px] border-black bg-white px-2 py-1 text-center text-sm font-black leading-none text-black"
              aria-label={`${title} count`}
            >
              {count}
            </span>
          ) : null}
        </h2>
        <div className="mt-[clamp(0.35rem,0.55vw,0.65rem)] border-t-[3px] border-black" />
      </header>

      <div className="min-h-0 flex-1 px-[clamp(1rem,1.35vw,1.8rem)] pb-[clamp(1rem,1.35vw,1.8rem)] pt-4">
        {items.length > 0 ? (
          <ul className="grid gap-3">
            {items.map((item) => (
              <li
                className="border-[3px] border-black px-4 py-3 text-lg font-bold uppercase leading-tight text-black"
                key={item.id}
              >
                {item.label}
              </li>
            ))}
          </ul>
        ) : null}
        {children}
      </div>
    </section>
  );
}
