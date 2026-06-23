import { MarketingPage } from "@/components/marketing/MarketingPage";

export default function SproutACubePage() {
  return (
    <MarketingPage
      eyebrow="Sprout a Cube"
      title="Sprout a Cube"
      description="A hub of rental offers for entrepreneurs looking to start selling in a Cube Sprout location."
      related={[
        { href: "/entrepreneur", label: "Sign up as an Entrepreneur" },
        { href: "/one-month-trial", label: "One Month Trial" },
        { href: "/3monthrent", label: "3 Month Rent" },
        { href: "/rentnow50-off", label: "Rent Now 50% Off" },
        { href: "/consignment", label: "Consignment" },
      ]}
    />
  );
}
