'use client';

import { useState } from 'react';
import { T } from '@/lib/design-tokens';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';

export default function EventCard({
    name,
    location,
    date,
    rating,
    reviewCount,
    badge,
    isPaid,
    locked,
    onClick,
}) {
    const [liked, setLiked] = useState(false);

    return (
        <Card onClick={onClick} style={{ cursor: 'pointer' }}>
            {/* 썸네일 */}
            <div
                style={{
                    background: `linear-gradient(135deg, #E8F0FF, ${T.blueLt})`,
                    borderRadius: T.radiusMd,
                    height: 140,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 40,
                    marginBottom: 14,
                    position: 'relative',
                }}
            >
                🎪
                <div
                    onClick={(e) => {
                        e.stopPropagation();
                        setLiked(!liked);
                    }}
                    style={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        width: 32,
                        height: 32,
                        borderRadius: T.radiusSm,
                        background: liked ? '#FFF0F0' : 'rgba(255,255,255,0.9)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 16,
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                    }}
                >
                    {liked ? '❤️' : '🤍'}
                </div>
            </div>

            {/* 배지 */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
                <Badge text={badge} />
                {isPaid && <Badge text="유료" />}
                {locked && <Badge text="🔒 구독" color={T.blue} bg={T.blueLt} />}
            </div>

            {/* 이벤트 정보 */}
            <div style={{ fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 4 }}>
                {name}
            </div>
            <div style={{ fontSize: 13, color: T.gray, marginBottom: 12 }}>
                📍 {location} · {date}
            </div>

            {/* 평점 / 리뷰 */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: 12,
                    borderTop: `1px solid ${T.border}`,
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: T.text }}>
                        ★ {rating}
                    </span>
                    <span style={{ fontSize: 12, color: T.gray }}>
                        리뷰 {reviewCount}개
                    </span>
                </div>
                <div
                    style={{
                        fontSize: 12,
                        color: T.blue,
                        fontWeight: 600,
                    }}
                >
                    상세 보기 →
                </div>
            </div>
        </Card>
    );
}
