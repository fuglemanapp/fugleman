import React from "react";
import { LandingFaq } from "../components/landing/landing-faq";
import { LandingFooter } from "../components/landing/landing-footer";
import { LandingHeader } from "../components/landing/landing-header";
import { LandingHero } from "../components/landing/landing-hero";
import { LandingProductOverview } from "../components/landing/landing-product-overview";
import { LandingProductShowcases } from "../components/landing/landing-product-showcases";

export default function Home() {
  return (
    <div className="landing-page min-h-screen">
      <LandingHeader />
      <main>
        <LandingHero />
        <LandingProductOverview />
        <LandingProductShowcases />
        <LandingFaq />
      </main>
      <LandingFooter />
    </div>
  );
}
