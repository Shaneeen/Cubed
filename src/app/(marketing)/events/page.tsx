import { MarketingPage } from "@/components/marketing/MarketingPage";

export default function EventsPage() {
  return (
    <MarketingPage
      eyebrow="About"
      title="Events"
      description="Upcoming markets, pop-ups, and community events hosted at Cube Sprout locations — listing pending migration."
      related={[{ href: "/blank", label: "Back to About" }]}
    />
  );
}
