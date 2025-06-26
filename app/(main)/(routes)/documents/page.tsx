"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/clerk-react";
import { useMutation } from "convex/react";
import { PlusCircle } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

const DocumentPage = () => {
  const { user } = useUser();
  const create = useMutation(api.documents.create);

  const onCreate = () => {
    const newDoc = create({
      title: "New Note",
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

  return (
    <div className="h-full flex flex-col items-center justify-center space-y-4">
      <Image
        src={"/empty-light.png"}
        alt="empty-dark.png"
        width={200}
        height={200}
        className="dark:hidden"
      />

      <Image
        src={"/empty-dark.png"}
        alt="empty-dark.png"
        width={200}
        height={200}
        className="hidden dark:block"
      />
      <h2 className="text-lg font-medium text-center">
        Welcome for {user?.firstName} &apos;s Not
        <span className="text-red-600">A</span>
        Notion
      </h2>
      <Button onClick={onCreate}>
        <PlusCircle className="h-4 w-4 mr-2" />
        Create a note
      </Button>
    </div>
  );
};

export default DocumentPage;
