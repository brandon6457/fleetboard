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
    unitNumber: "text-green-700",
    personName: "text-green-700",
  },
  backup: {
    unitNumber: "text-black",
    personName: "text-black",
  },
};

export function FleetEntryCard({
  entry,
  isHighlighted = false,
}: FleetEntryCardProps) {
  const textStyles = statusTextStyles[entry.status];
  const personName = entry.personName?.trim();

  return (
    <article
      className={`leading-tight ${
        isHighlighted
          ? "-mx-2 bg-[#FFD400] px-2 py-1 shadow-[0_0_18px_rgba(255,212,0,0.8)]"
          : ""
      }`}
    >
      <p
        className="inline-flex max-w-full flex-row items-baseline gap-2 overflow-hidden whitespace-nowrap uppercase leading-none"
      >
        <span
          className={`shrink-0 text-[clamp(0.95rem,1.05vw,1.45rem)] font-black ${textStyles.unitNumber}`}
        >
          {entry.unitNumber}
        </span>
        {personName ? (
          <span
            className={`min-w-0 truncate text-[clamp(0.82rem,0.85vw,1.05rem)] font-black ${textStyles.personName}`}
          >
            {personName}
          </span>
        ) : null}
      </p>
    </article>
  );
}
