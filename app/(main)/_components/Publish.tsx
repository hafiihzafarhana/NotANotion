"use client";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useOrigin } from "@/hooks/use-origin";
import { useMutation } from "convex/react";
import { Check, Copy, Globe } from "lucide-react";
import React from "react";
import { toast } from "sonner";

interface PublishInterface {
  initialData: Doc<"documents">;
}

export const Publish = ({ initialData }: PublishInterface) => {
  const origin = useOrigin();
  const update = useMutation(api.documents.updateDoc);
  const [copided, setCopied] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const url = `${origin}/preview/${initialData._id}`;
  const onPublish = () => {
    setIsSubmitting(true);
    const publishDoc = update({
      id: initialData._id,
      isPublished: true,
    }).finally(() => setIsSubmitting(false));

    toast.promise(publishDoc, {
      loading: "Publishing note...",
      success: () => {
        return "Note published successfully!";
      },
      error: (error) => {
        return `Error publishing note: ${error.message}`;
      },
    });
  };

  const onUnpublish = () => {
    setIsSubmitting(true);
    const unpublishDoc = update({
      id: initialData._id,
      isPublished: false,
    }).finally(() => setIsSubmitting(false));

    toast.promise(unpublishDoc, {
      loading: "Unpublishing note...",
      success: () => {
        return "Note unpublished successfully!";
      },
      error: (error) => {
        return `Error unpublishing note: ${error.message}`;
      },
    });
  };

  const onCopyLink = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size={"sm"} variant={"ghost"}>
          Publish{" "}
          {initialData.isPublished && (
            <Globe className="text-sky-500 w-4 h-4 ml-2" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72" align="end" alignOffset={8} forceMount>
        {initialData.isPublished ? (
          <div className="space-y-4">
            <div className="flex items-center gap-x-2 ">
              <Globe className="text-sky-500 animate-pulse w-4 h-4 ml-2" />
              <p className="text-xs font-medium text-sky-500">
                Note is Published
              </p>
            </div>
            <div className="flex items-center ">
              <input
                type="text"
                readOnly
                value={url}
                className="flex-1 h-8 px-2 py-1 text-xs border border-gray-300 rounded-l-md bg-muted truncate focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <Button
                className="h-8 rounded-l-none"
                onClick={onCopyLink}
                disabled={copided}
              >
                {copided ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
            <Button
              onClick={onUnpublish}
              disabled={isSubmitting}
              className="w-full text-xs"
            >
              {isSubmitting ? "Unpublishing..." : "Unpublish Note"}
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <Globe className="w-8 h-8 text-muted-foreground mb-2" />
            <p className="text-sm font-medium mb-2">Publish Note</p>
            <span className="text-xs text-muted-foreground mb-4">
              Share your note with a public link. Anyone with the link can
            </span>
            <Button
              size={"sm"}
              className="w-full mb-2"
              onClick={onPublish}
              disabled={isSubmitting}
              variant={"secondary"}
            >
              {isSubmitting ? "Publishing..." : "Publish Note"}
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};
