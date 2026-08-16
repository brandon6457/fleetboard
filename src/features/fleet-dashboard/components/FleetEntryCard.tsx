import type { Doc } from "../../../../convex/_generated/dataModel";

type FleetEntryCardProps = {
  entry: Doc<"fleetEntries">;
  isHighlighted?: boolean;
  size?: FleetEntrySize;
};

export type FleetEntrySize = "large" | "medium" | "small" | "minimum";

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

const sizeStyles: Record<
  FleetEntrySize,
  {
    gap: string;
    highlight: string;
    personName: string;
    row: string;
    unitNumber: string;
  }
> = {
  large: {
    gap: "gap-1.5",
    highlight: "-mx-1.5 px-1.5",
    personName: "text-[clamp(0.66rem,0.6vw,0.82rem)]",
    row: "h-[18px]",
    unitNumber: "text-[clamp(0.78rem,0.72vw,1rem)]",
  },
  medium: {
    gap: "gap-1",
    highlight: "-mx-1.5 px-1.5",
    personName: "text-[clamp(0.56rem,0.5vw,0.66rem)]",
    row: "h-[16px]",
    unitNumber: "text-[clamp(0.64rem,0.58vw,0.78rem)]",
  },
  small: {
    gap: "gap-1",
    highlight: "-mx-1 px-1",
    personName: "text-[clamp(0.5rem,0.44vw,0.58rem)]",
    row: "h-[14px]",
    unitNumber: "text-[clamp(0.58rem,0.5vw,0.66rem)]",
  },
  minimum: {
    gap: "gap-0.5",
    highlight: "-mx-1 px-1 py-0",
    personName: "text-[clamp(0.46rem,0.38vw,0.52rem)]",
    row: "h-[12px]",
    unitNumber: "text-[clamp(0.52rem,0.44vw,0.6rem)]",
  },
};

export function FleetEntryCard({
  entry,
  isHighlighted = false,
  size = "large",
}: FleetEntryCardProps) {
  const isSwConEntry = entry.section === "SW_CON";
  const isManager = (entry.role ?? "driver") === "manager";
  const sizing = sizeStyles[size];
  const textStyles =
    isManager
      ? {
          unitNumber: "text-red-600",
          personName: "text-red-600",
        }
      : isSwConEntry
      ? {
          unitNumber: "text-blue-700",
          personName: "text-blue-700",
        }
      : statusTextStyles[entry.status];
  const personName = entry.personName?.trim();

  return (
    <article
      className={`flex min-w-0 items-center overflow-hidden leading-none ${sizing.row} ${
        isHighlighted
          ? `${sizing.highlight} bg-[#FFD400] shadow-[0_0_18px_rgba(255,212,0,0.8)]`
          : ""
      }`}
    >
      <p
        className={`inline-flex max-w-full flex-row items-center overflow-hidden whitespace-nowrap uppercase leading-none ${
          sizing.gap
        }`}
      >
        <span
          className={`shrink-0 font-black ${sizing.unitNumber} ${textStyles.unitNumber}`}
        >
          {entry.unitNumber}
        </span>
        {personName ? (
          <span
            className={`min-w-0 truncate font-black ${sizing.personName} ${textStyles.personName}`}
          >
            {personName}
          </span>
        ) : null}
      </p>
    </article>
  );
}
