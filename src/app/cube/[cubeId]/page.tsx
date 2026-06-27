import { notFound } from "next/navigation";
import { mockStore } from "@/lib/mockData";
import { CubePageClient } from "./CubePageClient";

export function generateStaticParams() {
  return mockStore.cubes.map((cube) => ({ cubeId: cube.id }));
}

export default function CubePage({ params }: { params: { cubeId: string } }) {
  const cube = mockStore.cubes.find((c) => c.id === params.cubeId);

  if (!cube) {
    notFound();
  }

  return <CubePageClient cube={cube} storeId={mockStore.id} />;
}
