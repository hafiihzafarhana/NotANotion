"use client";

import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Item } from "./Item";
import { cn } from "@/lib/utils";
import { FileIcon } from "lucide-react";

interface DocumentListItemsInterface {
  parentDocumentId?: Id<"documents">;
  level?: number;
  data?: Doc<"documents">[];
}

export const DocumentListItems = ({
  parentDocumentId,
  level = 0,
}: DocumentListItemsInterface) => {
  const params = useParams();
  const router = useRouter();
  /*
    Example:
    Record<string, boolean> => "name_1": True
  */
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const handleExpand = (docId: string) => {
    setExpanded((prev) => ({
      ...prev,
      [docId]: !prev[docId],
    }));
  };

  const getDocuments = useQuery(api.documents.getSideBar, {
    parentDocument: parentDocumentId,
  });

  const onRedirect = (docId: string) => {
    if (params.documentId === docId) {
      return;
    }
    router.push(`/documents/${docId}`);
  };

  if (getDocuments === undefined) {
    return (
      <>
        <Item.Skeleton level={level} />
        {level === 0 && (
          <>
            <Item.Skeleton level={level} />
            <Item.Skeleton level={level} />
          </>
        )}
      </>
    );
  }

  return (
    <>
      <p
        style={{
          paddingLeft: level ? `${level * 12 + 25}px` : `12px`,
        }}
        className={cn(
          "hidden text-sm font-medium text-muted-foreground/80",
          /*
            Example:
            <li class="hidden last:block">Item 1</li>
            <li class="hidden last:block">Item 2</li>
            <li class="hidden last:block">Item 3</li>

            Maka hanya Item 3 yang terlihat
          */
          expanded && "last:block",
          level === 0 && "hidden"
        )}
      >
        No Pages Inside
      </p>
      {getDocuments?.map((doc) => (
        <div key={doc._id}>
          <Item
            id={doc._id}
            onclick={() => onRedirect(doc._id)}
            label={doc.title}
            icon={FileIcon}
            documentIcon={doc.icon}
            active={params.documentId === doc._id}
            level={level}
            onExpand={() => handleExpand(doc._id)}
            expanded={expanded[doc._id]}
          />

          {expanded[doc._id] && (
            <DocumentListItems parentDocumentId={doc._id} level={level + 1} />
          )}
        </div>
      ))}
    </>
  );
};
