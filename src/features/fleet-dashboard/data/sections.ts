export const fleetSections = [
  { id: "SRQ_RKL", title: "SRQ/RKL" },
  { id: "TAMPA", title: "TAMPA" },
  { id: "SRQ_BACKUP", title: "SRQ/BACKUP" },
  { id: "SW_CON", title: "SW CON" },
  { id: "WEST_CON", title: "WEST CON" },
  { id: "SW_MAIN", title: "SW MAIN" },
  { id: "SHOP", title: "SHOP" },
] as const;

export type FleetSectionId = (typeof fleetSections)[number]["id"];

export const fleetSectionTitles: Record<FleetSectionId, string> =
  fleetSections.reduce(
    (titles, section) => ({
      ...titles,
      [section.id]: section.title,
    }),
    {} as Record<FleetSectionId, string>,
  );

export const fleetStatuses = [
  { id: "active", title: "Active" },
  { id: "backup", title: "Backup" },
] as const;

export type FleetStatus = (typeof fleetStatuses)[number]["id"];

export const fleetStatusTitles: Record<FleetStatus, string> =
  fleetStatuses.reduce(
    (titles, status) => ({
      ...titles,
      [status.id]: status.title,
    }),
    {} as Record<FleetStatus, string>,
  );
