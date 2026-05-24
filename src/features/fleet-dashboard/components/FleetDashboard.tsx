"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Doc } from "../../../../convex/_generated/dataModel";
import { CompanyLogo } from "./CompanyLogo";
import { FleetEntryCard } from "./FleetEntryCard";
import { FleetSection } from "./FleetSection";
import type { FleetSectionId } from "../data/sections";
import { fleetSectionTitles, fleetSections } from "../data/sections";

type FleetEntriesBySection = Record<FleetSectionId, Doc<"fleetEntries">[]>;

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
  year: "numeric",
});

const timeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
});

const emptyEntriesBySection = (): FleetEntriesBySection =>
  fleetSections.reduce(
    (grouped, section) => ({
      ...grouped,
      [section.id]: [],
    }),
    {} as FleetEntriesBySection,
  );

const entryMatchesSearch = (entry: Doc<"fleetEntries">, query?: string) => {
  const normalizedQuery = query?.trim().toLowerCase();

  if (!normalizedQuery) {
    return false;
  }

  return [entry.unitNumber, entry.personName ?? ""].some((value) =>
    value.toLowerCase().includes(normalizedQuery),
  );
};

export function FleetDashboard() {
  const entries = useQuery(api.fleetEntries.list);
  const highlight = useQuery(api.kioskHighlight.get);
  const [now, setNow] = useState(() => new Date());
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNow(new Date());
      setIsFullscreen(Boolean(document.fullscreenElement));
    }, 30000);

    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const entriesBySection = useMemo(() => {
    const grouped = emptyEntriesBySection();

    for (const entry of entries ?? []) {
      grouped[entry.section].push(entry);
    }

    return grouped;
  }, [entries]);

  const isLoadingEntries = entries === undefined;
  const totalVehicles = entries?.length ?? 0;
  const highlightedSearchQuery = highlight?.highlightedSearchQuery;

  const toggleFullscreen = async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }

    await document.documentElement.requestFullscreen();
  };

  const renderEntries = (section: FleetSectionId) => {
    if (isLoadingEntries) {
      return (
        <p className="border-[3px] border-dashed border-zinc-300 p-3 text-center text-sm font-black uppercase text-zinc-500">
          Loading entries
        </p>
      );
    }

    if (section === "SW_MAIN") {
      return (
        <div className="h-full columns-2 gap-x-8 overflow-hidden [column-fill:auto]">
          {entriesBySection[section].map((entry) => (
            <div className="mb-1 break-inside-avoid" key={entry._id}>
              <FleetEntryCard
                entry={entry}
                isHighlighted={entryMatchesSearch(
                  entry,
                  highlightedSearchQuery,
                )}
              />
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="grid content-start gap-1">
        {entriesBySection[section].map((entry) => (
          <FleetEntryCard
            entry={entry}
            isHighlighted={entryMatchesSearch(entry, highlightedSearchQuery)}
            key={entry._id}
          />
        ))}
      </div>
    );
  };

  return (
    <main className="flex h-screen min-h-[680px] flex-col overflow-hidden border-[4px] border-zinc-300 bg-white p-2 text-black shadow-[inset_0_0_10px_rgba(0,0,0,0.25)]">
      <header className="grid h-[19vh] min-h-[156px] max-h-[212px] shrink-0 grid-cols-[minmax(22rem,30vw)_1fr_minmax(22rem,30vw)] items-center">
        <CompanyLogo />
        <div className="text-center">
          <h1 className="whitespace-nowrap text-[clamp(2.55rem,3.55vw,5.2rem)] font-black uppercase leading-none text-black">
            FLEET MANAGEMENT
          </h1>
          <p className="mt-2 text-[clamp(0.85rem,1vw,1.2rem)] font-black uppercase tracking-[0.18em] text-zinc-700">
            {dateFormatter.format(now)} | {timeFormatter.format(now)}
          </p>
        </div>
        <aside className="flex items-center justify-end gap-4 pr-4">
          <button
            className="border-[3px] border-black bg-white px-3 py-2 text-xs font-black uppercase text-black"
            onClick={toggleFullscreen}
            type="button"
          >
            {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          </button>
          <div className="min-w-36 border-[4px] border-black bg-white px-4 py-3 text-center">
            <p className="text-sm font-black uppercase leading-none text-black">
              Total Vehicles
            </p>
            <p className="mt-2 text-5xl font-black leading-none text-black">
              {isLoadingEntries ? "..." : totalVehicles}
            </p>
          </div>
        </aside>
      </header>

      <div className="mt-1 grid min-h-0 flex-1 grid-cols-[1.05fr_1.52fr_1.12fr_2.42fr] gap-[3px] bg-black p-[3px]">
        <FleetSection
          count={entriesBySection.SRQ_RKL.length}
          title={fleetSectionTitles.SRQ_RKL}
        >
          {renderEntries("SRQ_RKL")}
        </FleetSection>

        <div className="grid min-h-0 grid-rows-[72fr_28fr] gap-[3px] bg-black">
          <FleetSection
            count={entriesBySection.TAMPA.length}
            title={fleetSectionTitles.TAMPA}
          >
            {renderEntries("TAMPA")}
          </FleetSection>
          <FleetSection
            count={entriesBySection.SRQ_BACKUP.length}
            title={fleetSectionTitles.SRQ_BACKUP}
          >
            {renderEntries("SRQ_BACKUP")}
          </FleetSection>
        </div>

        <div className="grid min-h-0 grid-rows-[1fr_2fr] gap-[3px] bg-black">
          <FleetSection
            count={entriesBySection.SW_CON.length}
            title={fleetSectionTitles.SW_CON}
          >
            {renderEntries("SW_CON")}
          </FleetSection>
          <FleetSection
            count={entriesBySection.WEST_CON.length}
            title={fleetSectionTitles.WEST_CON}
          >
            {renderEntries("WEST_CON")}
          </FleetSection>
        </div>

        <FleetSection
          className="relative"
          count={entriesBySection.SW_MAIN.length}
          title={fleetSectionTitles.SW_MAIN}
        >
          {renderEntries("SW_MAIN")}
          <FleetSection
            className="absolute bottom-0 right-0 h-[28%] min-h-44 w-[53%] border-l-[3px] border-t-[3px] border-black"
            count={entriesBySection.SHOP.length}
            title={fleetSectionTitles.SHOP}
          >
            {renderEntries("SHOP")}
          </FleetSection>
        </FleetSection>
      </div>
    </main>
  );
}
