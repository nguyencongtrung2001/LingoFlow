import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Navbar } from "@/components/layout/Navbar";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "LingoFlow - Làm chủ ngôn ngữ",
    template: "%s | LingoFlow",
  },
  description:
    "Làm chủ ngôn ngữ, khơi nguồn dòng chảy tư duy. Nền tảng học từ vựng thông minh giúp bạn ghi nhớ nhanh hơn, hiệu quả hơn.",
  metadataBase: new URL("https://lingoflow.app"),
  openGraph: {
    title: "LingoFlow - Làm chủ ngôn ngữ",
    description:
      "Nền tảng học từ vựng thông minh giúp bạn ghi nhớ nhanh hơn, hiệu quả hơn.",
    type: "website",
    locale: "vi_VN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`h-full antialiased ${inter.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-[#f8f9ff] text-[#0b1c30] text-[16px] leading-[24px] font-normal min-h-full flex flex-col font-sans pb-16 md:pb-0">
        <Navbar />
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
