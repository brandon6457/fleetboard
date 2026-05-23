import type { Doc } from "../../../../convex/_generated/dataModel";
import { fleetStatusTitles } from "../data/sections";

type FleetEntryCardProps = {
  entry: Doc<"fleetEntries">;
  isHighlighted?: boolean;
};

const statusStyles: Record<Doc<"fleetEntries">["status"], string> = {
  active: "border-emerald-700 bg-emerald-100 text-emerald-900",
  maintenance: "border-orange-700 bg-orange-100 text-orange-900",
  backup: "border-sky-700 bg-sky-100 text-sky-900",
  shop: "border-zinc-800 bg-zinc-200 text-zinc-950",
};

const statusAccentStyles: Record<Doc<"fleetEntries">["status"], string> = {
  active: "bg-emerald-600",
  maintenance: "bg-orange-600",
  backup: "bg-sky-600",
  shop: "bg-zinc-800",
};

export function FleetEntryCard({
  entry,
  isHighlighted = false,
}: FleetEntryCardProps) {
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
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-[clamp(1.25rem,1.45vw,2rem)] font-black uppercase leading-none text-black">
              {entry.unitNumber}
            </p>
            <p className="mt-1 truncate text-[clamp(0.9rem,0.9vw,1.1rem)] font-black uppercase text-zinc-800">
              {entry.personName}
            </p>
          </div>
          <span
            className={`shrink-0 border-2 px-2 py-1 text-xs font-black uppercase ${statusStyles[entry.status]}`}
          >
            {fleetStatusTitles[entry.status]}
          </span>
        </div>
        {entry.notes ? (
          <p className="mt-3 border-t-2 border-zinc-200 pt-2 text-sm font-semibold leading-snug text-zinc-600">
            {entry.notes}
          </p>
        ) : null}
      </div>
    </article>
  );
}
