"use client";

import { useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Doc } from "../../../../convex/_generated/dataModel";
import { CompanyLogo } from "./CompanyLogo";
import { FleetEntryCard } from "./FleetEntryCard";
import { FleetSection } from "./FleetSection";
import type { FleetSectionId } from "../data/sections";
import { fleetSectionTitles, fleetSections } from "../data/sections";

type FleetEntriesBySection = Record<FleetSectionId, Doc<"fleetEntries">[]>;

const emptyEntriesBySection = (): FleetEntriesBySection =>
  fleetSections.reduce(
    (grouped, section) => ({
      ...grouped,
      [section.id]: [],
    }),
    {} as FleetEntriesBySection,
  );

export function FleetDashboard() {
  const entries = useQuery(api.fleetEntries.list);

  const entriesBySection = useMemo(() => {
    const grouped = emptyEntriesBySection();

    for (const entry of entries ?? []) {
      grouped[entry.section].push(entry);
    }

    return grouped;
  }, [entries]);

  const renderEntries = (section: FleetSectionId) => (
    <div className="grid content-start gap-3">
      {entriesBySection[section].map((entry) => (
        <FleetEntryCard entry={entry} key={entry._id} />
      ))}
    </div>
  );

  return (
    <main className="flex h-screen min-h-[680px] flex-col overflow-hidden border-[4px] border-zinc-300 bg-white p-2 text-black shadow-[inset_0_0_10px_rgba(0,0,0,0.25)]">
      <header className="grid h-[19vh] min-h-[156px] max-h-[212px] shrink-0 grid-cols-[minmax(22rem,30vw)_1fr_minmax(22rem,30vw)] items-center">
        <CompanyLogo />
        <h1 className="whitespace-nowrap text-center text-[clamp(2.55rem,3.55vw,5.2rem)] font-black uppercase leading-none text-black">
          FLEET MANAGEMENT
        </h1>
        <div aria-hidden="true" />
      </header>

      <div className="mt-1 grid min-h-0 flex-1 grid-cols-[1.05fr_1.52fr_1.12fr_2.42fr] gap-[3px] bg-black p-[3px]">
        <FleetSection title={fleetSectionTitles.SRQ_RKL}>
          {renderEntries("SRQ_RKL")}
        </FleetSection>

        <div className="grid min-h-0 grid-rows-[72fr_28fr] gap-[3px] bg-black">
          <FleetSection title={fleetSectionTitles.TAMPA}>
            {renderEntries("TAMPA")}
          </FleetSection>
          <FleetSection title={fleetSectionTitles.SRQ_BACKUP}>
            {renderEntries("SRQ_BACKUP")}
          </FleetSection>
        </div>

        <div className="grid min-h-0 grid-rows-[1fr_2fr] gap-[3px] bg-black">
          <FleetSection title={fleetSectionTitles.SW_CON}>
            {renderEntries("SW_CON")}
          </FleetSection>
          <FleetSection title={fleetSectionTitles.WEST_CON}>
            {renderEntries("WEST_CON")}
          </FleetSection>
        </div>

        <FleetSection className="relative" title={fleetSectionTitles.SW_MAIN}>
          {renderEntries("SW_MAIN")}
          <FleetSection
            className="absolute bottom-0 right-0 h-[28%] min-h-44 w-[53%] border-l-[3px] border-t-[3px] border-black"
            title={fleetSectionTitles.SHOP}
          >
            {renderEntries("SHOP")}
          </FleetSection>
        </FleetSection>
      </div>
    </main>
  );
}
