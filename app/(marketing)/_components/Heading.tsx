"use client";

import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/clerk-react";
import { useConvexAuth } from "convex/react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export const Heading = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  return (
    <div className="max-w-3xl space-y-4">
      <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold">
        Your Ideas, Documents, & Plans. Unified. Welcome to{" "}
        <span className="underline">
          Not<span className="text-red-600">A</span>Notion
        </span>
      </h1>
      <h3 className="text-base sm:text-xl md:text-2xl font-medium">
        NotANotion is the connected workspace where <br />
        bettern, faster work happens.
      </h3>
      {isLoading ? (
        <div className="w-full flex justify-center items-center">
          <Spinner size={"lg"} />
        </div>
      ) : isAuthenticated ? (
        <Button asChild variant="outline">
          <Link href="/documents">Go to Documents</Link>
        </Button>
      ) : (
        <SignInButton mode="modal">
          <Button className="cursor-pointer">
            Get NotANotion For FREE <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </SignInButton>
      )}
    </div>
  );
};
