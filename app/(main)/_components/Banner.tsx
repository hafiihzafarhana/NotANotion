"use client";

import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface BannerInterface {
  docId: Id<"documents">;
}

export const Banner = ({ docId }: BannerInterface) => {
  const router = useRouter();
  const deleteDocument = useMutation(api.documents.remove);
  const restoreDocuments = useMutation(api.documents.restore);
  const handleRestore = () => {
    if (!docId) return;
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

  const handleRemove = () => {
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
    router.push("/documents");
  };
  return (
    <div className="w-full bg-rose-500 text-center text-sm p-2 text-white flex items-center gap-x-2 justify-center">
      <p>Your Note in the trash</p>
      <Button
        size={"sm"}
        onClick={handleRestore}
        variant={"outline"}
        className="border-white bg-transparent hover:bg-primary/5 text-white hover:text-white p-1 px-2 h-auto font-normal"
      >
        Restore
      </Button>
      <ConfirmModal onConfirm={handleRemove}>
        <Button
          size={"sm"}
          variant={"outline"}
          className="border-white bg-transparent hover:bg-primary/5 text-white hover:text-white p-1 px-2 h-auto font-normal"
        >
          Remove
        </Button>
      </ConfirmModal>
    </div>
  );
};
