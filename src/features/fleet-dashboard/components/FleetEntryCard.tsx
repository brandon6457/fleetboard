import type { Doc } from "../../../../convex/_generated/dataModel";

type FleetEntryCardProps = {
  entry: Doc<"fleetEntries">;
  isHighlighted?: boolean;
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
    <article className="leading-tight">
      <p
        className={`inline-flex max-w-full flex-row items-baseline gap-2 overflow-hidden whitespace-nowrap uppercase leading-none ${
          isHighlighted
            ? "decoration-yellow-300 decoration-[6px] underline underline-offset-[-2px] [text-shadow:0_0_12px_rgba(250,204,21,0.95),0_0_2px_#facc15]"
            : ""
        }`}
      >
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
        <p className="mt-1 truncate text-sm font-semibold leading-snug text-zinc-600">
          {entry.notes}
        </p>
      ) : null}
    </article>
  );
}
