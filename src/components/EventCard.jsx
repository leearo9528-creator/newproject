'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { T } from '@/lib/design-tokens';
import { getSupabase } from '@/lib/supabase';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';

export default function EventCard({
    eventId,
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
    const router = useRouter();
    const [liked, setLiked] = useState(false);

    useEffect(() => {
        if (!eventId) return;
        const saved = JSON.parse(localStorage.getItem('liked_events') || '[]');
        setLiked(saved.includes(String(eventId)));
    }, [eventId]);

    async function handleLike(e) {
        e.stopPropagation();
        const sb = getSupabase();
        const { data: { user } } = await sb.auth.getUser();
        if (!user) {
            router.push('/login');
            return;
        }
        const saved = JSON.parse(localStorage.getItem('liked_events') || '[]');
        const id = String(eventId);
        const updated = liked ? saved.filter((v) => v !== id) : [...saved, id];
        localStorage.setItem('liked_events', JSON.stringify(updated));
        setLiked(!liked);
    }

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
                    onClick={handleLike}
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
                <div style={{ fontSize: 12, color: T.blue, fontWeight: 600 }}>
                    상세 보기 →
                </div>
            </div>
        </Card>
    );
}
