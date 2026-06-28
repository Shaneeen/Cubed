import { MarketingPage } from "@/components/marketing/MarketingPage";

export default function FaqPage() {
  return (
    <MarketingPage
      eyebrow="Contact"
      title="FAQ"
      description="Answers to frequently asked questions about renting or shopping at a Cube Sprout cube — content pending migration."
      related={[{ href: "/contact", label: "Back to Contact" }]}
    />
  );
}
