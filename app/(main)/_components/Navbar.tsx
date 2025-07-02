"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { MenuIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { Title } from "./Title";
import { Banner } from "./Banner";
import { Menu } from "./Menu";

interface NavbarInterface {
  isCollapsed: boolean;
  onResetWidth: () => void;
}
export const Navbar = ({ isCollapsed, onResetWidth }: NavbarInterface) => {
  const params = useParams();
  const getDocument = useQuery(api.documents.getById, {
    id: params.documentId as Id<"documents">,
  });
  if (getDocument === undefined) {
    return (
      <nav className="bg-background dark:bg-[#1F1F1F] px-3 py-2 w-full flex items-center justify-between">
        <Title.Skeleton />
        <div className="flex items-center gap-x-2">
          <Menu.Skeleton />
        </div>
      </nav>
    );
  }
  if (getDocument === null) {
    return null;
  }
  return (
    <>
      <nav className="bg-background dark:bg-[#1F1F1F] px-3 py-2 w-full flex items-center gap-x-4">
        {isCollapsed && (
          <MenuIcon
            onClick={onResetWidth}
            className="h-6 w-6 text-muted-foreground"
            role="button"
          />
        )}
        <div className="flex items-center justify-between w-full">
          <Title initialData={getDocument} />
          <div className="flex items-center gap-x-2">
            <Menu docId={getDocument._id} />
          </div>
        </div>
      </nav>
      {getDocument.isArchived && <Banner docId={getDocument._id} />}
    </>
  );
};
