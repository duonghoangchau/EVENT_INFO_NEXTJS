import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Event Information Page',
  description: 'Kỷ niệm 50 năm thành lập THÀNH CÔNG'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
