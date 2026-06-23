import { MarketingPage } from "@/components/marketing/MarketingPage";

export default function ContactUsPage() {
  return (
    <MarketingPage
      eyebrow="Contact"
      title="Contact Us"
      description="Contact form and outlet details — content pending migration. The route name is preserved as-is from the original Wix site for URL fidelity."
      related={[{ href: "/contact", label: "Back to Contact" }]}
    />
  );
}
