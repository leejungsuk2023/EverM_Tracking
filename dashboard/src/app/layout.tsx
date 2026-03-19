import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import DashboardLayout from '@/components/layout/DashboardLayout';

const geist = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'EverM Dashboard',
  description: 'EverM Medical Coordinator Dashboard',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${geist.variable} antialiased font-sans bg-gray-50`}>
        <DashboardLayout>{children}</DashboardLayout>
      </body>
    </html>
  );
}
