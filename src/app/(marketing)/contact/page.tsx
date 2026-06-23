import { MarketingPage } from "@/components/marketing/MarketingPage";

export default function ContactPage() {
  return (
    <MarketingPage
      eyebrow="Contact"
      title="Contact"
      description="Get in touch with Cube Sprout or browse frequently asked questions."
      related={[
        { href: "/copy-of-c-o-n-t-a-c-t", label: "Contact Us" },
        { href: "/faq", label: "FAQ" },
      ]}
    />
  );
}
