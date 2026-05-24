import type { Doc } from "../../../../convex/_generated/dataModel";

type FleetEntryCardProps = {
  entry: Doc<"fleetEntries">;
  isHighlighted?: boolean;
  density?: "normal" | "compact";
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
  density = "normal",
}: FleetEntryCardProps) {
  const textStyles = statusTextStyles[entry.status];
  const personName = entry.personName?.trim();
  const isCompact = density === "compact";

  return (
    <article
      className={`leading-tight ${
        isHighlighted
          ? "-mx-2 bg-[#FFD400] px-2 py-1 shadow-[0_0_18px_rgba(255,212,0,0.8)]"
          : ""
      }`}
    >
      <p
        className={`inline-flex max-w-full flex-row items-baseline overflow-hidden whitespace-nowrap uppercase leading-none ${
          isCompact ? "gap-1" : "gap-2"
        }`}
      >
        <span
          className={`shrink-0 font-black ${
            isCompact
              ? "text-[clamp(0.82rem,0.72vw,1.05rem)]"
              : "text-[clamp(0.95rem,1.05vw,1.45rem)]"
          } ${textStyles.unitNumber}`}
        >
          {entry.unitNumber}
        </span>
        {personName ? (
          <span
            className={`min-w-0 truncate font-black ${
              isCompact
                ? "text-[clamp(0.72rem,0.62vw,0.9rem)]"
                : "text-[clamp(0.82rem,0.85vw,1.05rem)]"
            } ${textStyles.personName}`}
          >
            {personName}
          </span>
        ) : null}
      </p>
    </article>
  );
}
