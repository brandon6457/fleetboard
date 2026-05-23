import type { FleetSectionItem } from "../components/FleetSection";

export type FleetSectionKey =
  | "srqRkl"
  | "tampa"
  | "srqBackup"
  | "swCon"
  | "westCon"
  | "swMain"
  | "shop";

export const fleetSectionItems: Record<FleetSectionKey, FleetSectionItem[]> = {
  srqRkl: [],
  tampa: [],
  srqBackup: [],
  swCon: [],
  westCon: [],
  swMain: [],
  shop: [],
};
