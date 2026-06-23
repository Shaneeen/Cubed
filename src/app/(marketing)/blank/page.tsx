import { MarketingPage } from "@/components/marketing/MarketingPage";

export default function AboutLandingPage() {
  return (
    <MarketingPage
      eyebrow="About"
      title="About Cube Sprout"
      description="This landing page mirrors the original site's About dropdown parent (/blank), which funnels straight through to About Us."
      related={[
        { href: "/aboutus", label: "About Us" },
        { href: "/sprout-a-cube", label: "Sprout a Cube" },
        { href: "/events", label: "Events" },
      ]}
    />
  );
}
