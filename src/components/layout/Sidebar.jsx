'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { T } from '@/lib/design-tokens';

const menu = [
    { icon: '🏠', label: '홈', href: '/' },
    { icon: '📋', label: '공고', href: '/posts' },
    { icon: '✍️', label: '리뷰', href: '/reviews/write' },
    { icon: '🔔', label: '알림', href: '/notifications' },
    { icon: '👤', label: 'MY', href: '/mypage' },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside
            className="desktop-only"
            style={{
                width: T.sidebarW,
                minHeight: '100vh',
                background: T.white,
                borderRight: `1px solid ${T.border}`,
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                top: 0,
                left: 0,
                zIndex: 100,
            }}
        >
            {/* 로고 */}
            <div
                style={{
                    padding: '28px 24px 20px',
                    borderBottom: `1px solid ${T.border}`,
                }}
            >
                <Link href="/">
                    <div
                        style={{
                            fontSize: 22,
                            fontWeight: 900,
                            color: T.text,
                            letterSpacing: -0.5,
                            cursor: 'pointer',
                        }}
                    >
                        플리 <span style={{ color: T.blue }}>●</span>
                    </div>
                    <div style={{ fontSize: 11, color: T.gray, marginTop: 3 }}>
                        셀러들의 진짜 행사 리뷰
                    </div>
                </Link>
            </div>

            {/* 네비게이션 */}
            <nav style={{ padding: '16px 12px', flex: 1 }}>
                {menu.map(({ icon, label, href }) => {
                    const isActive =
                        href === '/'
                            ? pathname === '/'
                            : pathname.startsWith(href);
                    return (
                        <Link key={href} href={href}>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 12,
                                    padding: '11px 14px',
                                    borderRadius: T.radiusMd,
                                    marginBottom: 4,
                                    background: isActive ? T.blueLt : 'transparent',
                                    color: isActive ? T.blue : T.gray,
                                    fontWeight: isActive ? 700 : 400,
                                    fontSize: 14,
                                    cursor: 'pointer',
                                    transition: 'background 0.15s ease',
                                }}
                            >
                                <span style={{ fontSize: 18 }}>{icon}</span>
                                <span>{label}</span>
                                {label === '알림' && (
                                    <span
                                        style={{
                                            marginLeft: 'auto',
                                            background: T.red,
                                            color: '#fff',
                                            borderRadius: 10,
                                            fontSize: 10,
                                            fontWeight: 700,
                                            padding: '1px 6px',
                                        }}
                                    >
                                        2
                                    </span>
                                )}
                            </div>
                        </Link>
                    );
                })}
            </nav>

            {/* 하단 구독 카드 */}
            <div style={{ padding: 16, borderTop: `1px solid ${T.border}` }}>
                <div
                    style={{
                        background: `linear-gradient(135deg, #1E3A5F, ${T.blue})`,
                        borderRadius: 14,
                        padding: '14px 16px',
                        color: '#fff',
                    }}
                >
                    <div style={{ fontSize: 11, opacity: 0.7, marginBottom: 3 }}>
                        프리미엄 구독
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>
                        매출 정보 확인하기
                    </div>
                    <Link href="/subscribe">
                        <div
                            style={{
                                marginTop: 10,
                                background: 'rgba(255,255,255,0.2)',
                                borderRadius: 8,
                                padding: '6px 10px',
                                fontSize: 11,
                                fontWeight: 600,
                                cursor: 'pointer',
                                textAlign: 'center',
                                transition: 'background 0.15s',
                            }}
                        >
                            구독 관리
                        </div>
                    </Link>
                </div>
            </div>
        </aside>
    );
}
