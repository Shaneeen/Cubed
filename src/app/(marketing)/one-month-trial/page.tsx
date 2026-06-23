import { MarketingPage } from "@/components/marketing/MarketingPage";

export default function OneMonthTrialPage() {
  return (
    <MarketingPage
      eyebrow="Rental Offer"
      title="One Month Trial"
      description="Try out a cube for one month before committing — offer details pending migration. Note: the original URL (/one-month-tiral) was misspelled and now redirects here."
      related={[{ href: "/sprout-a-cube", label: "Back to Sprout a Cube" }]}
    />
  );
}
