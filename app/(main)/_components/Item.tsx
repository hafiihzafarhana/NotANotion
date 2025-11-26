"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/clerk-react";
import { useMutation } from "convex/react";
import {
  Archive,
  ChevronDown,
  ChevronRight,
  LucideIcon,
  MoreHorizontal,
  Plus,
  Trash,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ItemInterface {
  id?: Id<"documents">;
  documentIcon?: string;
  active?: boolean;
  expanded?: boolean;
  isSearching?: boolean;
  level?: number;
  onExpand?: () => void;
  label: string;
  onclick: () => void;
  icon: LucideIcon;
}

export const Item = ({
  id,
  documentIcon,
  active,
  expanded,
  isSearching,
  level = 0,
  onExpand,
  icon: Icon,
  label,
  onclick,
}: ItemInterface) => {
  const ChevronIcon = expanded ? ChevronDown : ChevronRight;
  const router = useRouter();
  const create = useMutation(api.documents.create);
  const archive = useMutation(api.documents.archive);
  const { user } = useUser();
  const handleExpand = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    if (onExpand) {
      onExpand();
    }
  };

  const handleSubCreate = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!id) return;
    e.stopPropagation();
    const newDoc = create({
      title: "New Note",
      parentDocument: id,
    }).then((docId) => {
      if (!expanded) {
        onExpand?.();
      }

      router.push(`/documents/${docId}`);
    });

    toast.promise(newDoc, {
      loading: "Creating note...",
      success: () => {
        return "Note created successfully!";
      },
      error: (error) => {
        return `Error creating note: ${error.message}`;
      },
    });
  };

  const handleArchive = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!id) return;
    e.stopPropagation();
    const archiveDoc = archive({
      documentId: id,
    }).then(() => {
      router.push(`/documents/`);
    });

    toast.promise(archiveDoc, {
      loading: "Archiving note...",
      success: () => {
        return "Note archived successfully!";
      },
      error: (error) => {
        return `Error archiving note: ${error.message}`;
      },
    });
  };

  return (
    <div
      onClick={onclick}
      role="button"
      style={{ paddingLeft: level ? `${level * 12 + 12}px` : "12px" }}
      className={cn(
        "group min-h-[27px] text-sm py-1 pr-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium",
        active && "bg-primary/5 text-primary"
      )}
    >
      {!!id && (
        <div
          role="button"
          onClick={handleExpand}
          className="h-full rounded-sm hover:bg-neutral-300 dark:bg-neutral-600 mr-1 "
        >
          <ChevronIcon className="h-4 w-4 shrink-0 text-muted-foreground/50" />
        </div>
      )}
      {documentIcon ? (
        <div className="shrink-0 mr-2 text-[18px]">{documentIcon}</div>
      ) : (
        <Icon className="h-[18px] w-[18px] mr-2 shrink-0 text-muted-foreground" />
      )}
      <span className="truncate">{label}</span>
      {isSearching && (
        <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘ K</span>
        </kbd>
      )}
      {!!id && (
        <div className="ml-auto flex items-center gap-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger
              onClick={(e) => {
                e.stopPropagation();
              }}
              asChild
            >
              <div
                role="button"
                className="opacity-0 group-hover:opacity-100 transition h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
              >
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-60 "
              align="start"
              side="right"
              forceMount
            >
              <DropdownMenuItem onClick={handleArchive}>
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div className="text-xs text-muted-foreground p-2">
                Last edited by: {user?.fullName}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <div
            role="button"
            onClick={handleSubCreate}
            className="opacity-0 group-hover:opacity-100 transition h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
          >
            <Plus className="h-4 w-4 text-muted-foreground " />
          </div>
        </div>
      )}
    </div>
  );
};

Item.Skeleton = function ItemSkeleton({ level }: { level?: number }) {
  return (
    <div
      style={{ paddingLeft: level ? `${level * 12 + 25}px` : "12px" }}
      className="flex gap-x-2 py-[3px]"
    >
      <Skeleton className="h-4 w-4" />
      <Skeleton className="h-4 w-[30%]" />
    </div>
  );
};
