import { MarketingPage } from "@/components/marketing/MarketingPage";

export default function ConsignmentPage() {
  return (
    <MarketingPage
      eyebrow="Rental Offer"
      title="Consignment"
      description="Sell on consignment instead of renting a full cube — offer details pending migration."
      related={[{ href: "/sprout-a-cube", label: "Back to Sprout a Cube" }]}
    />
  );
}
