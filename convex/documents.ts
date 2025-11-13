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

export const archive = mutation({
  args: {
    documentId: v.id("documents"),
  },
  handler: async (ctx, args) => {
    const { documentId } = args;
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new Error("User not authenticated");
    }
    const userId = user.subject;
    const document = await ctx.db.get(documentId);
    if (!document) {
      throw new Error("Document not found");
    }
    if (document.userId !== userId) {
      throw new Error("User not authorized");
    }

    const recursiveArchive = async (docId: Id<"documents">) => {
      const children = await ctx.db
        .query("documents")
        .withIndex("byUserIdParentDocument", (q) =>
          q.eq("parentDocument", docId).eq("userId", userId)
        )
        .collect();
      for (const child of children) {
        await ctx.db.patch(child._id, { isArchived: true });
        await recursiveArchive(child._id);
      }
    };

    const doc = await ctx.db.patch(documentId, {
      isArchived: true,
    });

    await recursiveArchive(documentId);

    return doc;
  },
});

export const getTrash = query({
  handler: async (ctx) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new Error("User not authenticated");
    }
    const userId = user.subject;

    return await ctx.db
      .query("documents")
      .withIndex("byUserId", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isArchived"), true))
      .order("desc")
      .collect();
  },
});

export const restore = mutation({
  args: {
    id: v.id("documents"),
  },
  handler: async (ctx, args) => {
    const { id } = args;
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new Error("User not authenticated");
    }
    const userId = user.subject;
    const document = await ctx.db.get(id);
    if (!document) {
      throw new Error("Document not found");
    }
    if (document.userId !== userId) {
      throw new Error("User not authorized");
    }

    const recursiveRestore = async (docId: Id<"documents">) => {
      const children = await ctx.db
        .query("documents")
        .withIndex("byUserIdParentDocument", (q) =>
          q.eq("parentDocument", docId).eq("userId", userId)
        )
        .collect();

      for (const child of children) {
        await ctx.db.patch(child._id, { isArchived: false });
        await recursiveRestore(child._id);
      }
    };

    //Membuat sebuah tipe data menjadi "?" atau opsional
    const option: Partial<Doc<"documents">> = {
      isArchived: false,
    };

    if (document.parentDocument) {
      const parent = await ctx.db.get(document.parentDocument);
      if (parent?.isArchived) {
        option.parentDocument = undefined;
      }
    }

    const updatedDoc = await ctx.db.patch(id, option);
    await recursiveRestore(id);
    return updatedDoc;
  },
});

export const remove = mutation({
  args: {
    id: v.id("documents"),
  },
  handler: async (ctx, args) => {
    const { id } = args;
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new Error("User not authenticated");
    }
    const userId = user.subject;
    const document = await ctx.db.get(id);
    if (!document) {
      throw new Error("Document not found");
    }
    if (document.userId !== userId) {
      throw new Error("User not authorized");
    }

    return ctx.db.delete(document._id);
  },
});

export const getSearch = query({
  handler: async (ctx) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new Error("User not authenticated");
    }
    const userId = user.subject;

    return await ctx.db
      .query("documents")
      .withIndex("byUserId", (q) => q.eq("userId", userId))
      .filter((f) => f.eq(f.field("isArchived"), false))
      .order("desc")
      .collect();
  },
});

export const getById = query({
  args: {
    id: v.id("documents"),
  },
  handler: async (ctx, args) => {
    const { id } = args;
    const user = await ctx.auth.getUserIdentity();

    const document = await ctx.db.get(id);
    if (!document) {
      throw new Error("Document not found");
    }

    if (document.isPublished && !document.isArchived) return document;

    if (!user) {
      throw new Error("User not authenticated");
    }
    const userId = user.subject;

    if (document.userId !== userId) {
      throw new Error("User forbidden");
    }

    return document;
  },
});

export const updateDoc = mutation({
  args: {
    id: v.id("documents"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    icon: v.optional(v.string()),
    isPublished: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new Error("User not authenticated");
    }
    const userId = user.subject;
    const document = await ctx.db.get(id);
    if (!document) {
      throw new Error("Document not found");
    }
    if (document.userId !== userId) {
      throw new Error("User not authorized");
    }

    return await ctx.db.patch(id, {
      ...data,
    });
  },
});

export const removeIcon = mutation({
  args: {
    id: v.id("documents"),
  },
  handler: async (ctx, args) => {
    const { id } = args;
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new Error("User not authenticated");
    }
    const userId = user.subject;
    const document = await ctx.db.get(id);
    if (!document) {
      throw new Error("Document not found");
    }
    if (document.userId !== userId) {
      throw new Error("User not authorized");
    }

    return await ctx.db.patch(id, {
      icon: undefined,
    });
  },
});
