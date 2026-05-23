import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { fleetSectionValidator, fleetStatusValidator } from "./schema";

const cleanOptionalNotes = (notes?: string) => {
  const trimmed = notes?.trim();
  return trimmed ? trimmed : undefined;
};

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("fleetEntries").order("asc").take(500);
  },
});

export const create = mutation({
  args: {
    unitNumber: v.string(),
    personName: v.string(),
    section: fleetSectionValidator,
    notes: v.optional(v.string()),
    status: fleetStatusValidator,
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    return await ctx.db.insert("fleetEntries", {
      unitNumber: args.unitNumber.trim(),
      personName: args.personName.trim(),
      section: args.section,
      notes: cleanOptionalNotes(args.notes),
      status: args.status,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("fleetEntries"),
    unitNumber: v.string(),
    personName: v.string(),
    section: fleetSectionValidator,
    notes: v.optional(v.string()),
    status: fleetStatusValidator,
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      unitNumber: args.unitNumber.trim(),
      personName: args.personName.trim(),
      section: args.section,
      notes: cleanOptionalNotes(args.notes),
      status: args.status,
      updatedAt: Date.now(),
    });
  },
});

export const deleteEntry = mutation({
  args: {
    id: v.id("fleetEntries"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
