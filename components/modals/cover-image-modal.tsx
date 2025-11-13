"use client";

import { useCoverImage } from "@/hooks/use-cover-image";
import React from "react";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";

export const CoverImageModal = () => {
  const coverImage = useCoverImage();
  console.log("CoverImageModal", coverImage.isOpen);
  return (
    <Dialog open={coverImage.isOpen} onOpenChange={coverImage.onClose}>
      <DialogContent>
        <DialogTitle>
          <DialogHeader>
            <h2 className="text-center text-lg font-semibold">Cover Image</h2>
          </DialogHeader>
        </DialogTitle>
        <div>TODO: Upload Image</div>
      </DialogContent>
    </Dialog>
  );
};
