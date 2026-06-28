import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { OutletProvider } from "@/context/OutletContext";
import { OutletGate } from "@/components/outlet/OutletGate";
import { AuthProvider } from "@/features/auth/AuthContext";
import { AppShell } from "@/layouts/AppShell";
import "./globals.css";

export const metadata: Metadata = {
  title: "Monkey",
  description:
    "Monkey Monkey Monkey",
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
          <AuthProvider>
            <OutletProvider>
              <OutletGate>
                <AppShell>{children}</AppShell>
              </OutletGate>
            </OutletProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
