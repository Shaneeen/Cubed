import { MerchantPortalNav } from "@/components/merchant/MerchantPortalNav";

export default function MerchantLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="stack-xl">
      <MerchantPortalNav />
      {children}
    </div>
  );
}
