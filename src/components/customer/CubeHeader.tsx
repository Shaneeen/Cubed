import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Cube } from "@/types/cube";

export function CubeHeader({ cube, storeId }: { cube: Cube; storeId: string }) {
  return (
    <header className="relative overflow-hidden rounded-[28px] border border-border bg-bg-elevated p-6 shadow-theme backdrop-blur-xl sm:p-8">
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-secondary/20 blur-3xl" />

      <Link
        href={`/store/${storeId}`}
        className="relative z-10 mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-text-muted transition-colors hover:text-primary-strong"
      >
        <ArrowLeft className="size-4" />
        Back to store
      </Link>

      <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center">
        {cube.logo && (
          <div className="size-16 shrink-0 overflow-hidden rounded-2xl border border-border bg-surface shadow-theme sm:size-20">
            <Image
              src={cube.logo}
              alt={`${cube.merchantName} logo`}
              width={80}
              height={80}
              className="size-full object-cover"
            />
          </div>
        )}

        <div className="space-y-1">
          {cube.tagline && (
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary-strong">
              {cube.tagline}
            </p>
          )}
          <h1 className="text-3xl font-semibold tracking-tight text-text sm:text-4xl">
            {cube.merchantName}
          </h1>
        </div>
      </div>

      <p className="relative z-10 mt-5 max-w-2xl text-[0.95rem] leading-relaxed text-text-muted">
        {cube.about}
      </p>
    </header>
  );
}
