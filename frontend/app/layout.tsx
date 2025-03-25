import type { Metadata } from 'next';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'ResearchGPT - 智能研究助手',
  description: '帮助研究人员分析文献、发现研究空白、设计实验和撰写论文的AI平台',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>
        <main className="min-h-screen bg-gray-50">{children}</main>
      </body>
    </html>
  );
}