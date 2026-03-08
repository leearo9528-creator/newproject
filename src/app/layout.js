import './globals.css';
import Sidebar from '@/components/layout/Sidebar';
import BottomNav from '@/components/layout/BottomNav';

export const metadata = {
  title: '플리 — 셀러들의 진짜 행사 리뷰',
  description:
    '플리마켓, 푸드트럭 셀러를 위한 행사 리뷰 플랫폼. 실제 매출 정보, 주최자 평점, 셀러 리뷰를 확인하세요.',
  keywords: '플리마켓, 푸드트럭, 행사 리뷰, 셀러, 매출 정보, 플리',
  openGraph: {
    title: '플리 — 셀러들의 진짜 행사 리뷰',
    description: '플리마켓, 푸드트럭 셀러를 위한 행사 리뷰 플랫폼',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#3182F6" />
      </head>
      <body suppressHydrationWarning>
        <div className="app-layout">
          <Sidebar />
          <main className="main-content">
            {children}
          </main>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
