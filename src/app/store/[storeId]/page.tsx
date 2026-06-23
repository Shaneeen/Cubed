import { notFound } from "next/navigation";
import { mockStore } from "@/lib/mockData";
import { CubeCard } from "@/components/customer/CubeCard";

export function generateStaticParams() {
  return [{ storeId: mockStore.id }];
}

export default function StorePage({ params }: { params: { storeId: string } }) {
  if (params.storeId !== mockStore.id) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 sm:space-y-8 lg:space-y-10">
      <header className="space-y-1.5">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-text-muted lg:text-sm">
          Store directory
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-text sm:text-4xl lg:text-5xl">
          {mockStore.name}
        </h1>
        <p className="text-sm text-text-muted lg:text-base">
          {mockStore.cubes.length} cubes inside this store. Tap one to browse.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4">
        {mockStore.cubes.map((cube) => (
          <CubeCard key={cube.id} cube={cube} />
        ))}
      </div>
    </div>
  );
}
