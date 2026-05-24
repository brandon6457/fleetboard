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

export const setSearch = mutation({
  args: {
    searchQuery: v.string(),
  },
  handler: async (ctx, args) => {
    const highlightedSearchQuery = args.searchQuery.trim();
    const now = Date.now();
    const existing = await ctx.db
      .query("kioskHighlights")
      .withIndex("by_key", (q) => q.eq("key", highlightKey))
      .unique();

    if (!highlightedSearchQuery) {
      if (existing) {
        await ctx.db.replace(existing._id, {
          key: highlightKey,
          updatedAt: now,
        });
      }
      return;
    }

    if (existing) {
      await ctx.db.replace(existing._id, {
        key: highlightKey,
        highlightedSearchQuery,
        updatedAt: now,
      });
      return;
    }

    await ctx.db.insert("kioskHighlights", {
      key: highlightKey,
      highlightedSearchQuery,
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
