import { MarketingPage } from "@/components/marketing/MarketingPage";

export default function EntrepreneurPage() {
  return (
    <MarketingPage
      eyebrow="Sprout a Cube"
      title="Entrepreneur Sign-up"
      description="The sign-up form for entrepreneurs renting a cube, plus floorplans for each outlet — form fields pending migration from the existing site."
      related={[
        { href: "/ourtampineshubfloorplan", label: "Tampines Floorplan" },
        { href: "/woodleighmallfloorplan", label: "Woodleigh Floorplan" },
        { href: "/pasirrismallfloorplan", label: "Pasir Ris Floorplan" },
      ]}
    />
  );
}
