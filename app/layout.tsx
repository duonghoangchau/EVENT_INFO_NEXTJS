import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Event Information Page',
  description: 'Trang thông tin sự kiện có admin quản trị nội dung'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
