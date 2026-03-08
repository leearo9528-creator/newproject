'use client';

import { T } from '@/lib/design-tokens';

const presets = {
    '플리마켓': { color: T.blue, bg: T.blueLt },
    '푸드트럭': { color: '#00A86B', bg: '#E6F7F1' },
    '페어': { color: '#7B61FF', bg: '#F0EEFF' },
    '모집중': { color: T.green, bg: T.greenLt },
    '모집마감': { color: T.gray, bg: T.grayLt },
    '마감임박': { color: T.red, bg: T.redLt },
    '종료': { color: T.gray, bg: T.grayLt },
    '유료': { color: '#666', bg: T.grayLt },
    '유료참가': { color: '#666', bg: T.grayLt },
    '무료': { color: T.green, bg: T.greenLt },
    '헤비셀러': { color: T.yellow, bg: T.yellowLt },
    '둘다': { color: T.blue, bg: T.blueLt },
};

export default function Badge({ text, color, bg, style = {} }) {
    const preset = presets[text] || {};
    const finalColor = color || preset.color || T.blue;
    const finalBg = bg || preset.bg || T.blueLt;

    return (
        <span
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                background: finalBg,
                color: finalColor,
                fontSize: 11,
                fontWeight: 600,
                padding: '3px 8px',
                borderRadius: 6,
                letterSpacing: -0.2,
                lineHeight: 1.4,
                whiteSpace: 'nowrap',
                ...style,
            }}
        >
            {text}
        </span>
    );
}
