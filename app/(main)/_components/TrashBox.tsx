"use client";

import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Spinner } from "@/components/spinner";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { Search, Trash, Undo } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export const TrashBox = () => {
  const router = useRouter();
  const params = useParams();
  const documentsInTrash = useQuery(api.documents.getTrash);
  const restoreDocuments = useMutation(api.documents.restore);
  const deleteDocument = useMutation(api.documents.remove);
  const [search, setSearch] = useState("");

  const filteredDocuments = documentsInTrash?.filter((doc) => {
    return doc.title.toLowerCase().includes(search.toLowerCase());
  });

  const onClick = (docId: string) => {
    router.push(`/documents/${docId}`);
  };

  const handleRestore = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    docId: Id<"documents">
  ) => {
    if (!docId) return;
    e.stopPropagation();
    const promise = restoreDocuments({ id: docId });
    toast.promise(promise, {
      loading: "Restoring note...",
      success: () => {
        return "Note restored successfully!";
      },
      error: (error) => {
        return `Error restoring note: ${error.message}`;
      },
    });
  };

  const handleRemove = (docId: Id<"documents">) => {
    if (!docId) return;
    const promise = deleteDocument({ id: docId });
    toast.promise(promise, {
      loading: "Deleting note...",
      success: () => {
        return "Note Deleted successfully!";
      },
      error: (error) => {
        return `Error deleting note: ${error.message}`;
      },
    });

    if (params.documentId === docId) {
      router.push("/documents");
    }
  };

  if (documentsInTrash === undefined) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <Spinner size={"lg"} />
      </div>
    );
  }

  return (
    <div className="text-sm">
      <div className="flex items-center gap-x-1 p-2">
        <Search className="h-4 w-4" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-7 px-2 focus-visible:ring-transparent bg-secondary"
          placeholder="Search by title..."
        />
      </div>
      <div className="mt-2 px-1 pb-1">
        <p className="hidden last:block text-xs text-center text-muted-foreground pb-2">
          No documents found.
        </p>
        {filteredDocuments?.map((doc) => {
          return (
            <div
              key={doc._id}
              role="button"
              onClick={() => onClick(doc._id)}
              className="text-sm w-full rounded-sm hover:bg-primary/5 flex items-center text-primary justify-between"
            >
              <span className="truncate pl-2">{doc.title}</span>
              <div className="flex items-center">
                <div
                  onClick={(e) => handleRestore(e, doc._id)}
                  role="button"
                  className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"
                >
                  <Undo className="h-4 w-4 text-muted-foreground" />
                </div>
                <ConfirmModal onConfirm={() => handleRemove(doc._id)}>
                  <div
                    role="button"
                    className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"
                  >
                    <Trash className="h-4 w-4 text-muted-foreground" />
                  </div>
                </ConfirmModal>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
