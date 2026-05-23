import type { Doc } from "../../../../convex/_generated/dataModel";
import { fleetStatusTitles } from "../data/sections";

type FleetEntryCardProps = {
  entry: Doc<"fleetEntries">;
};

const statusStyles: Record<Doc<"fleetEntries">["status"], string> = {
  active: "border-emerald-600 bg-emerald-50 text-emerald-800",
  maintenance: "border-amber-500 bg-amber-50 text-amber-800",
  backup: "border-sky-600 bg-sky-50 text-sky-800",
  shop: "border-zinc-600 bg-zinc-100 text-zinc-800",
};

export function FleetEntryCard({ entry }: FleetEntryCardProps) {
  return (
    <article className="border-[3px] border-black bg-white p-3 leading-tight">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[clamp(1rem,1.05vw,1.35rem)] font-black uppercase text-black">
            {entry.unitNumber}
          </p>
          <p className="mt-1 text-sm font-bold uppercase text-black">
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
        <p className="mt-3 text-sm font-semibold leading-snug text-zinc-700">
          {entry.notes}
        </p>
      ) : null}
    </article>
  );
}
