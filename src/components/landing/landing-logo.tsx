import React from "react";
import Image from "next/image";
import { PUBLIC_BRAND_NAME } from "../../lib/public-brand";

type LandingLogoProps = {
  className?: string;
  priority?: boolean;
};

export function LandingLogo({ className, priority = false }: LandingLogoProps) {
  return (
    <Image
      alt={PUBLIC_BRAND_NAME}
      className={["h-auto w-[156px] sm:w-[174px]", className].filter(Boolean).join(" ")}
      height={88}
      priority={priority}
      src="/brand/whatspent-wordmark.png"
      width={320}
    />
  );
}
