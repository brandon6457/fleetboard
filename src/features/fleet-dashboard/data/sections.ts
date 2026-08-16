export const kioskFleetSections = [
  { id: "SRQ_RKL", title: "SRQ" },
  { id: "TAMPA", title: "TAMPA" },
  { id: "WEST_CON", title: "WEST CON" },
  { id: "SW_MAIN", title: "SW MAIN" },
] as const;

export type KioskFleetSectionId = (typeof kioskFleetSections)[number]["id"];

export const fleetSections = [
  ...kioskFleetSections,
  { id: "SW_CON", title: "SW CON" },
] as const;

export type FleetSectionId = (typeof fleetSections)[number]["id"];

const fleetSectionIds = new Set<string>(
  fleetSections.map((section) => section.id),
);

export const isFleetSectionId = (sectionId: string): sectionId is FleetSectionId =>
  fleetSectionIds.has(sectionId);

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

export const fleetRoles = [
  { id: "manager", title: "Manager" },
  { id: "driver", title: "Driver" },
] as const;

export type FleetRole = (typeof fleetRoles)[number]["id"];

export const defaultFleetRole: FleetRole = "driver";

export const fleetRoleTitles: Record<FleetRole, string> = fleetRoles.reduce(
  (titles, role) => ({
    ...titles,
    [role.id]: role.title,
  }),
  {} as Record<FleetRole, string>,
);
