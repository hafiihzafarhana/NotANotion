import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

export const create = mutation({
  args: {
    title: v.string(),
    parentDocument: v.optional(v.id("documents")),
  },
  handler: async (ctx, args) => {
    const { title, parentDocument } = args;
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new Error("User not authenticated");
    }
    const userId = user.subject;
    return await ctx.db.insert("documents", {
      title,
      userId: userId,
      isArchived: false,
      parentDocument,
      isPublished: false,
    });
  },
});

export const getAll = query({
  handler: async (ctx) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new Error("User not authenticated");
    }
    return await ctx.db.query("documents").collect();
  },
});

export const getSideBar = query({
  args: {
    parentDocument: v.optional(v.id("documents")),
  },
  handler: async (ctx, args) => {
    const { parentDocument } = args;
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new Error("User not authenticated");
    }
    const userId = user.subject;
    const documents = await ctx.db
      .query("documents")
      .withIndex("byUserIdParentDocument", (q) =>
        q.eq("parentDocument", parentDocument).eq("userId", userId)
      )
      .filter((q) => q.eq(q.field("isArchived"), false))
      .order("desc")
      .collect();

    return documents;
  },
});
