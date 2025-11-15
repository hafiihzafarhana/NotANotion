"use client";

import { useCoverImage } from "@/hooks/use-cover-image";
import React from "react";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { SingleImageDropzone } from "@/components/upload/single-image";
import {
  UploaderProvider,
  type UploadFn,
} from "@/components/upload/uploader-provider";
import { useEdgeStore } from "@/lib/edgestore";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";

export const CoverImageModal = () => {
  const params = useParams();
  const updateDoc = useMutation(api.documents.updateDoc);
  const coverImage = useCoverImage();
  const { edgestore } = useEdgeStore();

  const onClose = () => {
    coverImage.onClose();
  };

  const uploadFn: UploadFn = React.useCallback(
    async ({ file, onProgressChange, signal }) => {
      const oldCover = coverImage.url; // cover image lama yg tersimpan
      console.log("Old cover image URL:", coverImage, oldCover);
      // 1. Upload file baru
      const res = await edgestore.publicFiles.upload({
        file,
        signal,
        onProgressChange,
      });

      // // 2. Hapus file lama jika ada
      if (oldCover) {
        try {
          await edgestore.publicFiles.delete({
            url: oldCover,
          });
        } catch (e) {
          console.warn("Gagal menghapus file lama:", e);
        }
      }

      // // 3. Update database (Convex)
      await updateDoc({
        id: params.documentId as Id<"documents">,
        coverImage: res.url,
      });

      onClose();
      return res;
      // return new Promise((resolve) => {
      //   setTimeout(() => {
      //     const fakeUrl = URL.createObjectURL(file);
      //     resolve({ url: fakeUrl });
      //   }, 1000);
      // });
    },
    [edgestore, coverImage.url]
  );

  return (
    <Dialog open={coverImage.isOpen} onOpenChange={coverImage.onClose}>
      <DialogContent>
        <DialogTitle>
          <DialogHeader>
            <h2 className="text-center text-lg font-semibold">Cover Image</h2>
          </DialogHeader>
        </DialogTitle>
        <UploaderProvider uploadFn={uploadFn} autoUpload>
          <SingleImageDropzone
            height={200}
            width={200}
            dropzoneOptions={{
              maxSize: 1024 * 1024 * 1, // 1 MB
            }}
          />
        </UploaderProvider>
      </DialogContent>
    </Dialog>
  );
};
