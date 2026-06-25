export interface Outlet {
  id: string;
  name: string;
  descriptor: string;
  href: string;
}

export const outlets: Outlet[] = [
  {
    id: "tampines-hub",
    name: "Our Tampines Hub",
    descriptor: "Community mall in Tampines Central",
    href: "/ourtampineshubfloorplan",
  },
  {
    id: "pasir-ris-mall",
    name: "Pasir Ris Mall",
    descriptor: "East-side mall near Pasir Ris MRT",
    href: "/pasirrismallfloorplan",
  },
  {
    id: "woodleigh-mall",
    name: "Woodleigh Mall",
    descriptor: "Heartland mall above Woodleigh MRT",
    href: "/woodleighmallfloorplan",
  },
];

export function getOutletById(id: string | null | undefined): Outlet | undefined {
  return outlets.find((outlet) => outlet.id === id);
}
