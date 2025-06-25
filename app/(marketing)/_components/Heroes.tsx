"use client";

import Image from "next/image";

export const Heroes = () => {
  return (
    <div className="flex flex-col items-center justify-center max-w-5xl">
      <div className="flex items-center">
        <div className="relative w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] md:w-[400px] md:h-[400px] ">
          <Image
            src="/heroes-doc-light.png"
            alt="Light mode image"
            className="object-contain dark:hidden"
            fill
          />
          <Image
            src="/heroes-doc-dark.png"
            alt="Dark mode image"
            className="hidden dark:block object-contain"
            fill
          />
        </div>
        <div className="relative h-[400px] w-[400px] hidden md:block">
          <Image
            src={"/heroes-read-light.png"}
            alt="heroes-read-light.png"
            className="object-contain dark:hidden"
            fill
          />
          <Image
            src={"/heroes-read-dark.png"}
            alt="heroes-doc-light.png"
            className="hidden dark:block object-contain"
            fill
          />
        </div>
      </div>
    </div>
  );
};
