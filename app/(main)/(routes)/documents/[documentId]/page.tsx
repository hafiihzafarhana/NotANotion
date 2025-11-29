"use client";

import { CoverImageModal } from "@/components/cover";
import { ToolBar } from "@/components/tool-bar";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { use } from "react";
import dynamic from "next/dynamic";
import { useMemo } from "react";

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
  const Editor = useMemo(
    () =>
      dynamic(() => import("@/components/editor"), {
        ssr: false,
      }),
    []
  );
  const { documentId } = use(params);
  const getDocument = useQuery(api.documents.getById, {
    id: documentId,
  });
  const updateDoc = useMutation(api.documents.updateDoc);

  const onChange = (content: string) => {
    updateDoc({
      id: documentId,
      content,
    });
  };

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
        <Editor onChange={onChange} initialContent={getDocument.content} />
      </div>
    </div>
  );
};

export default DocumentIdPage;
