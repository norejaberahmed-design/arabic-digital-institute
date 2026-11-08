import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "المعهد الرقمي لتعليم العربية",
  description: "تعلم العربية خطوة بخطوة من خلال مواقف الحياة اليومية.",
  applicationName: "Arabic Digital Institute",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#245b49",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
