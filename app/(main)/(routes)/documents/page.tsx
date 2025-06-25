"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/clerk-react";
import { PlusCircle } from "lucide-react";
import Image from "next/image";

const DocumentPage = () => {
  const { user } = useUser();
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
      <Button>
        <PlusCircle className="h-4 w-4 mr-2" />
        Create a note
      </Button>
    </div>
  );
};

export default DocumentPage;
