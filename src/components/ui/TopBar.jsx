'use client';

import { T } from '@/lib/design-tokens';

export default function TopBar({ title, subtitle, action, hasBack = false, onBack }) {
    return (
        <div
            style={{
                background: T.white,
                borderBottom: `1px solid ${T.border}`,
                padding: '20px 36px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                position: 'sticky',
                top: 0,
                zIndex: 10,
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {hasBack && (
                    <div
                        onClick={onBack}
                        style={{
                            width: 36,
                            height: 36,
                            borderRadius: T.radiusSm,
                            background: T.bg,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            fontSize: 16,
                            transition: 'background 0.15s',
                        }}
                    >
                        ←
                    </div>
                )}
                <div>
                    {subtitle && (
                        <div style={{ fontSize: 12, color: T.gray, marginBottom: 2 }}>
                            {subtitle}
                        </div>
                    )}
                    <div
                        style={{
                            fontSize: 20,
                            fontWeight: 800,
                            color: T.text,
                            letterSpacing: -0.5,
                        }}
                    >
                        {title}
                    </div>
                </div>
            </div>
            {action && <div>{action}</div>}
        </div>
    );
}
