"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Doc } from "../../../../convex/_generated/dataModel";
import { CompanyLogo } from "./CompanyLogo";
import { FleetEntryCard } from "./FleetEntryCard";
import type { FleetEntrySize } from "./FleetEntryCard";
import { FleetSection } from "./FleetSection";
import type { FleetSectionId, KioskFleetSectionId } from "../data/sections";
import {
  fleetSectionTitles,
  isFleetSectionId,
  kioskFleetSections,
} from "../data/sections";

type VisibleFleetEntry = Doc<"fleetEntries"> & {
  section: FleetSectionId;
};
type DashboardFleetEntry = VisibleFleetEntry & {
  section: KioskFleetSectionId | "SW_CON";
};
type FleetEntriesBySection = Record<KioskFleetSectionId, VisibleFleetEntry[]>;
type SectionStatusCounts = Record<
  KioskFleetSectionId,
  {
    active: number;
    backup: number;
  }
>;
type SectionSize = {
  height: number;
  width: number;
};
type SectionSizes = Partial<Record<KioskFleetSectionId, SectionSize>>;

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

const unitNumberCollator = new Intl.Collator("en-US", {
  numeric: true,
  sensitivity: "base",
});

const statusSortOrder: Record<Doc<"fleetEntries">["status"], number> = {
  active: 0,
  backup: 1,
};

const roleSortOrder = {
  manager: 0,
  driver: 1,
} as const;

const emptyEntriesBySection = (): FleetEntriesBySection =>
  kioskFleetSections.reduce(
    (grouped, section) => ({
      ...grouped,
      [section.id]: [],
    }),
    {} as FleetEntriesBySection,
  );

const emptySectionStatusCounts = (): SectionStatusCounts =>
  kioskFleetSections.reduce(
    (counts, section) => ({
      ...counts,
      [section.id]: {
        active: 0,
        backup: 0,
      },
    }),
    {} as SectionStatusCounts,
  );

const dashboardSectionForEntry = (
  entry: DashboardFleetEntry,
): KioskFleetSectionId =>
  entry.section === "SW_CON" ? "SW_MAIN" : entry.section;

const isKioskFleetSectionId = (
  sectionId?: string,
): sectionId is KioskFleetSectionId =>
  Boolean(sectionId && kioskFleetSections.some((section) => section.id === sectionId));

const isDashboardFleetEntry = (
  entry: VisibleFleetEntry,
): entry is DashboardFleetEntry =>
  entry.section === "SW_CON" ||
  kioskFleetSections.some((section) => section.id === entry.section);

const entryGapForSize: Record<FleetEntrySize, string> = {
  large: "gap-px",
  medium: "gap-0",
  small: "gap-0",
  minimum: "gap-0",
};

const fallbackEntrySizeForCount = (entryCount: number): FleetEntrySize => {
  if (entryCount > 72) return "small";
  if (entryCount > 46) return "medium";
  return "large";
};

const entrySizeForSection = ({
  columns,
  entryCount,
  sectionSize,
}: {
  columns: number;
  entryCount: number;
  sectionSize?: SectionSize;
}): FleetEntrySize => {
  if (entryCount === 0) return "large";

  if (!sectionSize?.height || !sectionSize.width) {
    return fallbackEntrySizeForCount(entryCount);
  }

  const expectedRows = Math.ceil(entryCount / columns);
  const availableRowHeight = sectionSize.height / expectedRows;
  const columnGapBudget = columns > 1 ? (columns - 1) * 12 : 0;
  const availableColumnWidth = (sectionSize.width - columnGapBudget) / columns;

  if (availableRowHeight >= 19.5 && availableColumnWidth >= (columns > 1 ? 245 : 225)) {
    return "large";
  }

  if (availableRowHeight >= 16.5 && availableColumnWidth >= (columns > 1 ? 180 : 155)) {
    return "medium";
  }

  if (availableRowHeight >= 14 && availableColumnWidth >= 125) {
    return "small";
  }

  return "minimum";
};

const sortFleetEntries = (
  firstEntry: Doc<"fleetEntries">,
  secondEntry: Doc<"fleetEntries">,
) => {
  const firstIsSwCon = firstEntry.section === "SW_CON";
  const secondIsSwCon = secondEntry.section === "SW_CON";

  if (firstIsSwCon || secondIsSwCon) {
    if (firstIsSwCon !== secondIsSwCon) {
      return firstIsSwCon ? 1 : -1;
    }

    const firstRole = firstEntry.role ?? "driver";
    const secondRole = secondEntry.role ?? "driver";
    const roleComparison = roleSortOrder[firstRole] - roleSortOrder[secondRole];

    if (roleComparison !== 0) {
      return roleComparison;
    }

    return unitNumberCollator.compare(
      firstEntry.unitNumber,
      secondEntry.unitNumber,
    );
  }

  const firstRole = firstEntry.role ?? "driver";
  const secondRole = secondEntry.role ?? "driver";
  const roleComparison = roleSortOrder[firstRole] - roleSortOrder[secondRole];

  if (roleComparison !== 0) {
    return roleComparison;
  }

  if (firstRole === "manager" && secondRole === "manager") {
    return unitNumberCollator.compare(
      firstEntry.unitNumber,
      secondEntry.unitNumber,
    );
  }

  const statusComparison =
    statusSortOrder[firstEntry.status] - statusSortOrder[secondEntry.status];

  if (statusComparison !== 0) {
    return statusComparison;
  }

  return unitNumberCollator.compare(
    firstEntry.unitNumber,
    secondEntry.unitNumber,
  );
};

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
  const [sectionSizes, setSectionSizes] = useState<SectionSizes>({});

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

  useEffect(() => {
    if (typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver((observedEntries) => {
      setSectionSizes((currentSizes) => {
        let hasChanged = false;
        const nextSizes = { ...currentSizes };

        for (const observedEntry of observedEntries) {
          const sectionId = (observedEntry.target as HTMLElement).dataset
            .fleetSection;

          if (!isKioskFleetSectionId(sectionId)) continue;

          const nextSize = {
            height: observedEntry.contentRect.height,
            width: observedEntry.contentRect.width,
          };
          const currentSize = currentSizes[sectionId];

          if (
            !currentSize ||
            Math.abs(currentSize.height - nextSize.height) > 0.5 ||
            Math.abs(currentSize.width - nextSize.width) > 0.5
          ) {
            nextSizes[sectionId] = nextSize;
            hasChanged = true;
          }
        }

        return hasChanged ? nextSizes : currentSizes;
      });
    });

    for (const element of document.querySelectorAll<HTMLElement>(
      "[data-fleet-section]",
    )) {
      if (isKioskFleetSectionId(element.dataset.fleetSection)) {
        observer.observe(element);
      }
    }

    return () => observer.disconnect();
  }, []);

  const visibleEntries = useMemo(() => {
    const activeEntries: VisibleFleetEntry[] = [];

    for (const entry of entries ?? []) {
      if (isFleetSectionId(entry.section)) {
        activeEntries.push(entry as VisibleFleetEntry);
      }
    }

    return activeEntries;
  }, [entries]);

  const dashboardEntries = useMemo(
    () => visibleEntries.filter(isDashboardFleetEntry),
    [visibleEntries],
  );

  const entriesBySection = useMemo(() => {
    const grouped = emptyEntriesBySection();

    for (const entry of dashboardEntries) {
      grouped[dashboardSectionForEntry(entry)].push(entry);
    }

    for (const section of kioskFleetSections) {
      grouped[section.id].sort(sortFleetEntries);
    }

    return grouped;
  }, [dashboardEntries]);

  const sectionStatusCounts = useMemo(() => {
    const counts = emptySectionStatusCounts();

    for (const entry of dashboardEntries) {
      counts[dashboardSectionForEntry(entry)][entry.status] += 1;
    }

    return counts;
  }, [dashboardEntries]);

  const isLoadingEntries = entries === undefined;
  const totalVehicles = visibleEntries.length;
  const highlightedSearchQuery = highlight?.highlightedSearchQuery;

  const toggleFullscreen = async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }

    await document.documentElement.requestFullscreen();
  };

  const renderEntries = (section: KioskFleetSectionId) => {
    const entryCount = entriesBySection[section].length;
    const columns = section === "SW_MAIN" ? 3 : 1;
    const entrySize = entrySizeForSection({
      columns,
      entryCount,
      sectionSize: sectionSizes[section],
    });

    if (isLoadingEntries) {
      return (
        <p className="border-[3px] border-dashed border-zinc-300 p-[clamp(0.45rem,0.8dvh,0.8rem)] text-center text-[clamp(0.72rem,0.8dvw,1rem)] font-black uppercase text-zinc-500">
          Loading entries
        </p>
      );
    }

    if (section === "SW_MAIN") {
      return (
        <div
          className="grid h-full content-start overflow-hidden"
          style={{
            columnGap: "clamp(6px, 0.5dvw, 14px)",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            rowGap: entrySize === "large" ? "1px" : "0px",
          }}
        >
          {entriesBySection[section].map((entry) => (
            <div className="min-w-0" key={entry._id}>
              <FleetEntryCard
                entry={entry}
                isHighlighted={entryMatchesSearch(
                  entry,
                  highlightedSearchQuery,
                )}
                size={entrySize}
              />
            </div>
          ))}
        </div>
      );
    }

    return (
      <div
        className={`grid content-start overflow-hidden ${entryGapForSize[entrySize]}`}
      >
        {entriesBySection[section].map((entry) => (
          <FleetEntryCard
            entry={entry}
            isHighlighted={entryMatchesSearch(entry, highlightedSearchQuery)}
            key={entry._id}
            size={entrySize}
          />
        ))}
      </div>
    );
  };

  return (
    <main className="flex h-dvh min-h-0 flex-col overflow-hidden border-[clamp(2px,0.22dvw,4px)] border-zinc-300 bg-white p-[clamp(0.25rem,0.55dvh,0.55rem)] text-black shadow-[inset_0_0_10px_rgba(0,0,0,0.25)]">
      <header className="grid h-[clamp(5.25rem,12dvh,8.75rem)] shrink-0 grid-cols-[minmax(13rem,22dvw)_1fr_minmax(13rem,21dvw)] items-center">
        <CompanyLogo />
        <div className="text-center">
          <h1 className="whitespace-nowrap text-[clamp(2.05rem,3.1dvw,4.25rem)] font-black uppercase leading-none text-black">
            FLEET MANAGEMENT
          </h1>
          <p className="mt-[clamp(0.2rem,0.45dvh,0.45rem)] text-[clamp(0.72rem,0.82dvw,1.05rem)] font-black uppercase tracking-[0.16em] text-zinc-700">
            {dateFormatter.format(now)} | {timeFormatter.format(now)}
          </p>
        </div>
        <aside className="flex items-center justify-end gap-[clamp(0.45rem,0.8dvw,1rem)] pr-[clamp(0.25rem,0.75dvw,1rem)]">
          <button
            className="border-[3px] border-black bg-white px-[clamp(0.45rem,0.75dvw,0.8rem)] py-[clamp(0.28rem,0.45dvh,0.5rem)] text-[clamp(0.58rem,0.62dvw,0.78rem)] font-black uppercase text-black"
            onClick={toggleFullscreen}
            type="button"
          >
            {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          </button>
          <div className="min-w-[clamp(6.5rem,8.4dvw,9rem)] border-[clamp(3px,0.24dvw,4px)] border-black bg-white px-[clamp(0.55rem,0.9dvw,1rem)] py-[clamp(0.45rem,0.75dvh,0.8rem)] text-center">
            <p className="text-[clamp(0.6rem,0.68dvw,0.86rem)] font-black uppercase leading-none text-black">
              Total Vehicles
            </p>
            <p className="mt-[clamp(0.2rem,0.45dvh,0.45rem)] text-[clamp(1.9rem,2.7dvw,3.45rem)] font-black leading-none text-black">
              {isLoadingEntries ? "..." : totalVehicles}
            </p>
          </div>
        </aside>
      </header>

      <div className="mt-[clamp(0.12rem,0.35dvh,0.35rem)] grid min-h-0 flex-1 grid-cols-[1.08fr_1.02fr_1.18fr_3.25fr] gap-[clamp(2px,0.2dvw,4px)] bg-black p-[clamp(2px,0.2dvw,4px)]">
        <FleetSection
          contentSectionId="SRQ_RKL"
          statusCounts={sectionStatusCounts.SRQ_RKL}
          title={fleetSectionTitles.SRQ_RKL}
        >
          {renderEntries("SRQ_RKL")}
        </FleetSection>

        <FleetSection
          contentSectionId="TAMPA"
          statusCounts={sectionStatusCounts.TAMPA}
          title={fleetSectionTitles.TAMPA}
        >
          {renderEntries("TAMPA")}
        </FleetSection>

        <FleetSection
          contentSectionId="WEST_CON"
          statusCounts={sectionStatusCounts.WEST_CON}
          title={fleetSectionTitles.WEST_CON}
        >
          {renderEntries("WEST_CON")}
        </FleetSection>

        <FleetSection
          contentSectionId="SW_MAIN"
          statusCounts={sectionStatusCounts.SW_MAIN}
          title="SW MAIN/CON"
        >
          {renderEntries("SW_MAIN")}
        </FleetSection>
      </div>
    </main>
  );
}
