"use client";

import { useScrollTop } from "@/hooks/use-scroll-top";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/mode-toggle";
import { useConvexAuth } from "convex/react";
import { SignInButton, SignUpButton, UserButton } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/spinner";
import Link from "next/link";

export const Navbar = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const scrolled = useScrollTop();
  return (
    <div
      className={cn(
        "z-50 bg-background fixed top-0 flex items-center w-full p-6 dark:bg-[#1F1F1F]",
        scrolled && "border-b shadow-sm"
      )}
    >
      <h3 className="font-bold text-3xl select-none">
        Not<span className="text-red-600">A</span>Notion
      </h3>
      <div className="md:justify-end justify-between md:ml-auto flex w-full gap-x-2 items-center">
        {isLoading ? (
          <Spinner />
        ) : isAuthenticated ? (
          <>
            <Button variant={"ghost"} size={"sm"} asChild>
              <Link href="/documents">Documents</Link>
            </Button>
            <UserButton afterSignOutUrl="/" />
          </>
        ) : (
          <>
            <SignInButton mode="modal">
              <Button className="cursor-pointer" variant={"ghost"}>
                Sign in
              </Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button className="cursor-pointer">Get Free</Button>
            </SignUpButton>
          </>
        )}
        <ModeToggle />
      </div>
    </div>
  );
};
