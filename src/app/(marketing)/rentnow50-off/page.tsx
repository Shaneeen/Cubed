import { MarketingPage } from "@/components/marketing/MarketingPage";

export default function RentNow50OffPage() {
  return (
    <MarketingPage
      eyebrow="Rental Offer"
      title="Rent Now, 50% Off"
      description="A limited-time 50% off rental promotion — offer details pending migration."
      related={[{ href: "/sprout-a-cube", label: "Back to Sprout a Cube" }]}
    />
  );
}
