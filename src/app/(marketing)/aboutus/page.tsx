import { MarketingPage } from "@/components/marketing/MarketingPage";

export default function AboutUsPage() {
  return (
    <MarketingPage
      eyebrow="About"
      title="About Us"
      description="The story, mission, and team behind Cube Sprout — content pending migration from the existing site."
      related={[{ href: "/blank", label: "Back to About" }]}
    />
  );
}
