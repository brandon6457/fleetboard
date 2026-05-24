import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const fleetSectionValidator = v.union(
  v.literal("SRQ_RKL"),
  v.literal("TAMPA"),
  v.literal("SRQ_BACKUP"),
  v.literal("SW_CON"),
  v.literal("WEST_CON"),
  v.literal("SW_MAIN"),
  v.literal("SHOP"),
);

export const fleetStatusValidator = v.union(
  v.literal("active"),
  v.literal("backup"),
);

export default defineSchema({
  fleetEntries: defineTable({
    unitNumber: v.string(),
    personName: v.optional(v.string()),
    section: fleetSectionValidator,
    // Deprecated: retained until existing documents have been migrated.
    notes: v.optional(v.string()),
    status: fleetStatusValidator,
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_section", ["section"])
    .index("by_status", ["status"])
    .index("by_section_and_status", ["section", "status"]),
  kioskHighlights: defineTable({
    key: v.string(),
    highlightedEntryId: v.optional(v.id("fleetEntries")),
    highlightedSearchQuery: v.optional(v.string()),
    updatedAt: v.number(),
  }).index("by_key", ["key"]),
});
