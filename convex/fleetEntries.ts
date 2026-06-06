import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import type { MutationCtx } from "./_generated/server";
import {
  fleetRoleValidator,
  fleetSectionValidator,
  fleetStatusValidator,
} from "./schema";

const cleanOptionalString = (value?: string) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
};

const normalizeUnitNumber = (unitNumber: string) =>
  unitNumber.trim().toLowerCase();

const duplicateVehicleMessage = (unitNumber: string) =>
  `Vehicle ${unitNumber} already exists.\nPlease edit the existing entry instead of creating a duplicate.`;

const findDuplicateVehicle = async (
  ctx: MutationCtx,
  unitNumber: string,
  excludeId?: Id<"fleetEntries">,
) => {
  const normalizedUnitNumber = normalizeUnitNumber(unitNumber);
  const entries = await ctx.db.query("fleetEntries").collect();

  return entries.find(
    (entry) =>
      entry._id !== excludeId &&
      normalizeUnitNumber(entry.unitNumber) === normalizedUnitNumber,
  );
};

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("fleetEntries").order("asc").collect();
  },
});

export const create = mutation({
  args: {
    unitNumber: v.string(),
    personName: v.optional(v.string()),
    section: fleetSectionValidator,
    status: fleetStatusValidator,
    role: v.optional(fleetRoleValidator),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const unitNumber = args.unitNumber.trim();
    const personName = cleanOptionalString(args.personName);

    if (!unitNumber) {
      throw new Error("Vehicle number is required.");
    }

    const duplicate = await findDuplicateVehicle(ctx, unitNumber);
    if (duplicate) {
      throw new Error(duplicateVehicleMessage(unitNumber));
    }

    return await ctx.db.insert("fleetEntries", {
      unitNumber,
      ...(personName ? { personName } : {}),
      section: args.section,
      status: args.status,
      role: args.role ?? "driver",
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
    role: v.optional(fleetRoleValidator),
  },
  handler: async (ctx, args) => {
    const unitNumber = args.unitNumber.trim();

    if (!unitNumber) {
      throw new Error("Vehicle number is required.");
    }

    const existingEntry = await ctx.db.get(args.id);
    if (!existingEntry) {
      throw new Error("Fleet entry not found.");
    }

    if (
      normalizeUnitNumber(existingEntry.unitNumber) !==
      normalizeUnitNumber(unitNumber)
    ) {
      const duplicate = await findDuplicateVehicle(ctx, unitNumber, args.id);
      if (duplicate) {
        throw new Error(duplicateVehicleMessage(unitNumber));
      }
    }

    await ctx.db.patch(args.id, {
      unitNumber,
      personName: cleanOptionalString(args.personName),
      section: args.section,
      notes: undefined,
      status: args.status,
      role: args.role ?? "driver",
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
