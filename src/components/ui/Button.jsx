'use client';

import { T } from '@/lib/design-tokens';

const variants = {
    primary: {
        background: T.blue,
        color: T.white,
        border: 'none',
        fontWeight: 700,
    },
    secondary: {
        background: T.bg,
        color: T.gray,
        border: `1px solid ${T.border}`,
        fontWeight: 600,
    },
    ghost: {
        background: 'transparent',
        color: T.gray,
        border: 'none',
        fontWeight: 600,
    },
    danger: {
        background: T.red,
        color: T.white,
        border: 'none',
        fontWeight: 700,
    },
};

export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    style = {},
    ...props
}) {
    const v = variants[variant] || variants.primary;
    const sizes = {
        sm: { padding: '8px 14px', fontSize: 13, borderRadius: T.radiusSm },
        md: { padding: '12px 20px', fontSize: 14, borderRadius: T.radiusMd },
        lg: { padding: '16px 24px', fontSize: 15, borderRadius: 14 },
    };
    const s = sizes[size] || sizes.md;

    return (
        <button
            style={{
                ...v,
                ...s,
                width: fullWidth ? '100%' : 'auto',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                cursor: 'pointer',
                transition: 'opacity 0.15s ease, transform 0.1s ease',
                ...style,
            }}
            onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.98)'; }}
            onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
            {...props}
        >
            {children}
        </button>
    );
}
