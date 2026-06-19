import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { AppShell } from "@/layouts/AppShell";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cubed",
  description:
    "Retail cube space management for store owners, merchants, and pickup order reservations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <AppShell>{children}</AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
