import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "AI 超级个体 | Vibe Coding 高管实战课",
  description: "20 节课，从认知破局到组织升级——用 AI 替代百万团队，只需一个人",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="bg-[var(--bg-black)] text-[var(--text-primary)] antialiased overflow-hidden h-screen" suppressHydrationWarning>
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
