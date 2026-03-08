'use client';

import { T } from '@/lib/design-tokens';

export default function Card({ children, style = {}, onClick, className = '' }) {
    return (
        <div
            onClick={onClick}
            className={className}
            style={{
                background: T.white,
                borderRadius: T.radiusLg,
                padding: 20,
                border: `1px solid ${T.border}`,
                boxShadow: T.shadowSm,
                cursor: onClick ? 'pointer' : 'default',
                transition: 'box-shadow 0.15s ease, transform 0.15s ease',
                ...style,
            }}
            onMouseEnter={(e) => {
                if (onClick) {
                    e.currentTarget.style.boxShadow = T.shadowMd;
                    e.currentTarget.style.transform = 'translateY(-1px)';
                }
            }}
            onMouseLeave={(e) => {
                if (onClick) {
                    e.currentTarget.style.boxShadow = T.shadowSm;
                    e.currentTarget.style.transform = 'translateY(0)';
                }
            }}
        >
            {children}
        </div>
    );
}
