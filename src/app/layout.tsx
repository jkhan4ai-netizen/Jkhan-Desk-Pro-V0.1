import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "Jkhan Desk Pro — Business Management for Designers",
  description:
    "Персональная система управления бизнесом для графического и motion-дизайнера. Проекты, CRM, финансы, аналитика.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans antialiased bg-[#EBF0F2] text-[#111827]`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <div className="h-screen w-full bg-[#EBF0F2] p-4 md:p-6 box-border flex items-center justify-center">
            <div className="flex h-full w-full bg-[#F4F7F8] rounded-[32px] shadow-sm overflow-hidden">
              {children}
            </div>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
