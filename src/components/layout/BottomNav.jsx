'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { T } from '@/lib/design-tokens';

const tabs = [
    { icon: '🏠', label: '홈', href: '/' },
    { icon: '📋', label: '공고', href: '/posts' },
    { icon: '✍️', label: '리뷰', href: '/reviews/write' },
    { icon: '🔔', label: '알림', href: '/notifications' },
    { icon: '👤', label: 'MY', href: '/mypage' },
];

export default function BottomNav() {
    const pathname = usePathname();

    return (
        <nav
            className="mobile-only"
            style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                background: T.white,
                borderTop: `1px solid ${T.border}`,
                display: 'flex',
                padding: '8px 0 max(env(safe-area-inset-bottom, 12px), 12px)',
                zIndex: 100,
            }}
        >
            {tabs.map(({ icon, label, href }) => {
                const isActive =
                    href === '/'
                        ? pathname === '/'
                        : pathname.startsWith(href);
                return (
                    <Link
                        key={href}
                        href={href}
                        style={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 3,
                            textDecoration: 'none',
                        }}
                    >
                        <span
                            style={{
                                fontSize: 20,
                                filter: isActive ? 'none' : 'grayscale(1) opacity(0.5)',
                                transition: 'filter 0.15s',
                            }}
                        >
                            {icon}
                        </span>
                        <span
                            style={{
                                fontSize: 10,
                                color: isActive ? T.blue : T.gray,
                                fontWeight: isActive ? 700 : 400,
                            }}
                        >
                            {label}
                        </span>
                    </Link>
                );
            })}
        </nav>
    );
}
