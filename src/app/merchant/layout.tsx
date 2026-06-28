import { MerchantPortalNav } from "@/components/merchant/MerchantPortalNav";

export default function MerchantLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-8">
      <MerchantPortalNav />
      {children}
    </div>
  );
}
