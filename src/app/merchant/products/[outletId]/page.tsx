import { MerchantProductsEditor } from "./MerchantProductsEditor";

export default function MerchantProductsEditorPage({
  params,
}: {
  params: { outletId: string };
}) {
  return <MerchantProductsEditor outletId={params.outletId} />;
}
