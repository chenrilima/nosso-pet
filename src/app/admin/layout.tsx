import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Administração",
  robots: { index: false, follow: false },
  alternates: { canonical: null },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
