import { MarketingPage } from "@/components/marketing/MarketingPage";

export default function ThreeMonthRentPage() {
  return (
    <MarketingPage
      eyebrow="Rental Offer"
      title="3 Month Rent (20% Off)"
      description="A 3-month cube rental offer at a discounted rate — offer details pending migration."
      related={[{ href: "/sprout-a-cube", label: "Back to Sprout a Cube" }]}
    />
  );
}
