import { MarketingPage } from "@/components/marketing/MarketingPage";

export default function HomePage() {
  return (
    <MarketingPage
      eyebrow="Cube Sprout"
      title="Rent a cube, grow your business"
      description="Cube Sprout gives small entrepreneurs an affordable retail space inside shared malls. This page mirrors the public Cube Sprout site being migrated from Wix — see README.md for the full content spec."
      related={[
        { href: "/blank", label: "About" },
        { href: "/sprout-a-cube", label: "Sprout a Cube" },
        { href: "/contact", label: "Contact" },
      ]}
    />
  );
}
