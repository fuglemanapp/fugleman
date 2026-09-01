import React from "react";
import Image from "next/image";

type LandingLogoProps = {
  className?: string;
  priority?: boolean;
};

export function LandingLogo({ className, priority = false }: LandingLogoProps) {
  return (
    <Image
      alt="WhatSpent"
      className={["h-auto w-[156px] sm:w-[174px]", className].filter(Boolean).join(" ")}
      height={88}
      priority={priority}
      src="/brand/whatspent-wordmark.png"
      width={320}
    />
  );
}
