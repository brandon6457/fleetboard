import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { fleetSectionValidator, fleetStatusValidator } from "./schema";

const cleanOptionalString = (value?: string) => {
  const trimmed = value?.trim();
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
    personName: v.optional(v.string()),
    section: fleetSectionValidator,
    status: fleetStatusValidator,
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const personName = cleanOptionalString(args.personName);

    return await ctx.db.insert("fleetEntries", {
      unitNumber: args.unitNumber.trim(),
      ...(personName ? { personName } : {}),
      section: args.section,
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
    personName: v.optional(v.string()),
    section: fleetSectionValidator,
    status: fleetStatusValidator,
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      unitNumber: args.unitNumber.trim(),
      personName: cleanOptionalString(args.personName),
      section: args.section,
      notes: undefined,
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
