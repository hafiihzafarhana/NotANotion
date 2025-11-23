"use client";

import { CoverImageModal } from "@/components/cover";
import { ToolBar } from "@/components/tool-bar";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { use } from "react";

interface DocumentIdPageInterface {
  params: {
    documentId: Id<"documents">;
  };
}

const DocumentIdPage = ({
  params,
}: {
  params: Promise<DocumentIdPageInterface["params"]>;
}) => {
  const { documentId } = use(params);
  const getDocument = useQuery(api.documents.getById, {
    id: documentId,
  });

  if (getDocument === undefined) {
    return (
      <div>
        <CoverImageModal.Skeleton />
        <div className="md:max-w-3xl lg:max-w-4xl mx-auto mt-10">
          <div className="space-y-4 pl-8 pt-4">
            <Skeleton className="h-14 w-[50%]" />
            <Skeleton className="h-14 w-[80%]" />
            <Skeleton className="h-14 w-[40%]" />
            <Skeleton className="h-14 w-[60%]" />
          </div>
        </div>
      </div>
    );
  }

  if (getDocument === null) {
    return (
      <div className="md:max-w-3xl lg:max-w-4xl mx-auto mt-10">
        <div className="space-y-4 pl-8 pt-4">
          <Skeleton className="h-14 w-[50%]" />
          <Skeleton className="h-14 w-[80%]" />
          <Skeleton className="h-14 w-[40%]" />
          <Skeleton className="h-14 w-[60%]" />
        </div>
      </div>
    );
  }

  return (
    <div className="pb-40">
      <CoverImageModal url={getDocument.coverImage} />
      <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
        <ToolBar initialData={getDocument} />
      </div>
    </div>
  );
};

export default DocumentIdPage;
