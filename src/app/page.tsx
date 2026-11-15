import { EnvelopeGate } from "@/components/envelope/envelope-gate";
import { Ornament } from "@/components/envelope/primitives";
import { CountdownSection } from "@/components/envelope/sections/countdown-section";
import { FinaleSection } from "@/components/envelope/sections/finale-section";
import { GallerySection } from "@/components/envelope/sections/gallery-section";
import { HeroSection } from "@/components/envelope/sections/hero-section";
import { ScheduleSection } from "@/components/envelope/sections/schedule-section";
import { copy } from "@/content/invitation";

/** Without JavaScript the envelope can't open, so skip it and show everything. */
const NO_SCRIPT_STYLES = `<style>.envelope-overlay{display:none!important}[data-reveal]{opacity:1!important;transform:none!important}</style>`;

export default function InvitationPage() {
  return (
    <>
      <noscript dangerouslySetInnerHTML={{ __html: NO_SCRIPT_STYLES }} />
      <EnvelopeGate copy={copy.gate} music={copy.music}>
        <HeroSection />
        <main>
          <Ornament />
          <ScheduleSection />
          <Ornament />
          <GallerySection />
          <Ornament />
          <CountdownSection />
          <Ornament />
        </main>
        <FinaleSection />
      </EnvelopeGate>
    </>
  );
}
