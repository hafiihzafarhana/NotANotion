"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "./ui/button";
import { ImageIcon, X } from "lucide-react";
import { use } from "react";
import { useCoverImage } from "@/hooks/use-cover-image";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { useEdgeStore } from "@/lib/edgestore";
import { Skeleton } from "./ui/skeleton";

interface CoverImageModalInterface {
  url?: string;
  preview?: boolean;
}

export const CoverImageModal = ({ url, preview }: CoverImageModalInterface) => {
  const coverimage = useCoverImage();
  const params = useParams();
  const { edgestore } = useEdgeStore();
  const removeCoverImage = useMutation(api.documents.removeCoverImage);
  const onRemoveCoverImage = async () => {
    console.log(params.documentId);
    removeCoverImage({
      id: params.documentId as Id<"documents">,
    });
    await edgestore.publicFiles.delete({
      url: url || "",
    });
  };
  return (
    <div
      className={cn(
        "relative w-full h-[35vh] group",
        !url && "h-[12vh]",
        url && "bg-muted"
      )}
    >
      {!!url && (
        <Image src={url} alt="Cover Image" className="object-cover" fill />
      )}
      {url && !preview && (
        <div className="opacity-0 group-hover:opacity-100 absolute bottom-5 right-5 flex items-center gap-x-2">
          <Button
            onClick={() => coverimage.onReplaceUrl(url)}
            className="text-muted-foreground text-xs"
            // variant="outline"
            size={"sm"}
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            Change Cover
          </Button>
          <Button
            className="text-muted-foreground text-xs"
            // variant="outline"
            size={"sm"}
            onClick={onRemoveCoverImage}
          >
            <X className="h-4 w-4 mr-2" />
            Remove
          </Button>
        </div>
      )}
    </div>
  );
};

CoverImageModal.Skeleton = function CoverImageModalSkeleton() {
  return <Skeleton className="w-full h-[12vh]" />;
};
