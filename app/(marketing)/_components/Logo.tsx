import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import Image from "next/image";

const font = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
});

export const Logo = () => {
  return (
    <div className="hidden md:flex items-center gap-x-2">
      <Image
        src={"/logo-for-light.svg"}
        alt="logo-for-light.svg"
        width={120}
        height={1000}
      />
    </div>
  );
};
