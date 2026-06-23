import { MarketingPage } from "@/components/marketing/MarketingPage";

export default function WoodleighFloorplanPage() {
  return (
    <MarketingPage
      eyebrow="Floorplan"
      title="Woodleigh Mall Floorplan"
      description="Cube layout and availability for the Woodleigh Mall outlet — floorplan image pending migration."
      related={[{ href: "/entrepreneur", label: "Back to Sign-up" }]}
    />
  );
}
