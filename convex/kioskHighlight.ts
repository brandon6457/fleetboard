import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const highlightKey = "fleet-dashboard";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("kioskHighlights")
      .withIndex("by_key", (q) => q.eq("key", highlightKey))
      .unique();
  },
});

export const set = mutation({
  args: {
    entryId: v.id("fleetEntries"),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const existing = await ctx.db
      .query("kioskHighlights")
      .withIndex("by_key", (q) => q.eq("key", highlightKey))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        highlightedEntryId: args.entryId,
        updatedAt: now,
      });
      return;
    }

    await ctx.db.insert("kioskHighlights", {
      key: highlightKey,
      highlightedEntryId: args.entryId,
      updatedAt: now,
    });
  },
});

export const clear = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db
      .query("kioskHighlights")
      .withIndex("by_key", (q) => q.eq("key", highlightKey))
      .unique();

    if (!existing) {
      await ctx.db.insert("kioskHighlights", {
        key: highlightKey,
        updatedAt: Date.now(),
      });
      return;
    }

    await ctx.db.replace(existing._id, {
      key: highlightKey,
      updatedAt: Date.now(),
    });
  },
});
