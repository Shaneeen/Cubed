import { MerchantProductsClient } from "./MerchantProductsClient";

export default function MerchantProductsPage({
  params,
}: {
  params: { merchantId: string };
}) {
  return <MerchantProductsClient merchantId={params.merchantId} />;
}
