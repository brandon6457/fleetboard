import type { Doc } from "../../../../convex/_generated/dataModel";

type FleetEntryCardProps = {
  entry: Doc<"fleetEntries">;
  isHighlighted?: boolean;
};

const statusAccentStyles: Record<Doc<"fleetEntries">["status"], string> = {
  active: "bg-emerald-600",
  maintenance: "bg-orange-600",
  backup: "bg-sky-600",
  shop: "bg-zinc-800",
};

const statusTextStyles: Record<
  Doc<"fleetEntries">["status"],
  { unitNumber: string; personName: string }
> = {
  active: {
    unitNumber: "text-emerald-700",
    personName: "text-emerald-700",
  },
  maintenance: {
    unitNumber: "text-black",
    personName: "text-zinc-800",
  },
  backup: {
    unitNumber: "text-black",
    personName: "text-black",
  },
  shop: {
    unitNumber: "text-black",
    personName: "text-zinc-800",
  },
};

export function FleetEntryCard({
  entry,
  isHighlighted = false,
}: FleetEntryCardProps) {
  const textStyles = statusTextStyles[entry.status];

  return (
    <article
      className={`grid grid-cols-[0.45rem_1fr] border-[3px] bg-white leading-tight ${
        isHighlighted
          ? "border-yellow-400 outline outline-[6px] outline-yellow-300 shadow-[0_0_0_6px_#facc15,0_0_28px_12px_rgba(250,204,21,0.8)]"
          : "border-black shadow-[3px_3px_0_#000]"
      }`}
    >
      <div className={statusAccentStyles[entry.status]} aria-hidden="true" />
      <div className="p-3">
        <p className="flex min-w-0 flex-row items-baseline gap-2 overflow-hidden whitespace-nowrap uppercase leading-none">
          <span
            className={`shrink-0 text-[clamp(1.25rem,1.45vw,2rem)] font-black ${textStyles.unitNumber}`}
          >
            {entry.unitNumber}
          </span>
          <span
            className={`min-w-0 truncate text-[clamp(0.95rem,1vw,1.2rem)] font-black ${textStyles.personName}`}
          >
            {entry.personName}
          </span>
        </p>
        {entry.notes ? (
          <p className="mt-3 border-t-2 border-zinc-200 pt-2 text-sm font-semibold leading-snug text-zinc-600">
            {entry.notes}
          </p>
        ) : null}
      </div>
    </article>
  );
}
