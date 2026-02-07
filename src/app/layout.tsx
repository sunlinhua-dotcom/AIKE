import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "AI 未来生存课 | Next-Gen Engine",
  description: "10节课教会孩子在AI时代生存——从时间觉醒到价值创造",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="bg-[#0F0F1F] text-gray-200 antialiased overflow-hidden h-screen">
        <div className="flex h-screen">
          <Sidebar />
          <main className="flex-1 relative overflow-hidden w-full min-w-0">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
