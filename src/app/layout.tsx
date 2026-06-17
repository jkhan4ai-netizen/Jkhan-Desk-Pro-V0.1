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
        className={`${inter.variable} font-sans antialiased bg-background-light dark:bg-background-dark text-text-main-light dark:text-text-main-dark h-screen overflow-hidden flex items-center justify-center p-4 lg:p-8`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <div className="w-full max-w-[1600px] h-full flex bg-surface-light dark:bg-surface-dark rounded-xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] overflow-hidden border border-border-light dark:border-border-dark">
            {children}
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
