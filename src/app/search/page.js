'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { T } from '@/lib/design-tokens';
import { getSupabase } from '@/lib/supabase';
import TopBar from '@/components/ui/TopBar';
import EventCard from '@/components/EventCard';

export default function SearchPage() {
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const search = useCallback(async (q) => {
        if (!q.trim()) {
            setResults([]);
            setSearched(false);
            return;
        }
        setLoading(true);
        setSearched(true);
        const sb = getSupabase();
        const { data } = await sb
            .from('events')
            .select('*')
            .eq('is_approved', true)
            .eq('is_deleted', false)
            .or(`name.ilike.%${q}%,location_sido.ilike.%${q}%,location_sigungu.ilike.%${q}%`)
            .order('created_at', { ascending: false })
            .limit(30);
        setResults(data || []);
        setLoading(false);
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => search(query), 300);
        return () => clearTimeout(timer);
    }, [query, search]);

    function formatDate(start, end) {
        if (!start) return '';
        const s = new Date(start);
        const sm = s.getMonth() + 1;
        const sd = s.getDate();
        if (!end) return `${sm}.${sd}`;
        const e = new Date(end);
        return `${sm}.${sd}~${e.getDate()}`;
    }

    return (
        <div style={{ minHeight: '100vh', background: T.bg }}>
            <TopBar
                title="검색"
                hasBack
                onBack={() => router.back()}
                action={
                    <div style={{
                        background: T.white,
                        borderRadius: T.radiusMd,
                        padding: '10px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        border: `1px solid ${T.border}`,
                        width: 300,
                    }}>
                        <span style={{ fontSize: 15 }}>🔍</span>
                        <input
                            autoFocus
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="행사명, 지역으로 검색"
                            style={{
                                border: 'none',
                                outline: 'none',
                                background: 'transparent',
                                fontSize: 14,
                                color: T.text,
                                width: '100%',
                            }}
                        />
                        {query && (
                            <span
                                onClick={() => setQuery('')}
                                style={{ fontSize: 14, color: T.gray, cursor: 'pointer' }}
                            >✕</span>
                        )}
                    </div>
                }
            />

            <div className="page-padding">
                {!searched && (
                    <div style={{ textAlign: 'center', paddingTop: 60, color: T.gray }}>
                        <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: T.text }}>어떤 행사를 찾고 계세요?</div>
                        <div style={{ fontSize: 13, marginTop: 8 }}>행사명이나 지역명으로 검색해보세요</div>
                    </div>
                )}

                {loading && (
                    <div style={{ textAlign: 'center', paddingTop: 60, color: T.gray }}>
                        <div style={{ fontSize: 14 }}>검색 중...</div>
                    </div>
                )}

                {searched && !loading && results.length === 0 && (
                    <div style={{ textAlign: 'center', paddingTop: 60, color: T.gray }}>
                        <div style={{ fontSize: 48, marginBottom: 16 }}>😕</div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: T.text }}>검색 결과가 없어요</div>
                        <div style={{ fontSize: 13, marginTop: 8 }}>다른 키워드로 검색해보세요</div>
                    </div>
                )}

                {!loading && results.length > 0 && (
                    <>
                        <div style={{ fontSize: 14, color: T.gray, marginBottom: 16 }}>
                            검색 결과 <strong style={{ color: T.text }}>{results.length}개</strong>
                        </div>
                        <div className="grid-events">
                            {results.map((e) => (
                                <EventCard
                                    key={e.id}
                                    eventId={e.id}
                                    name={e.name}
                                    location={`${e.location_sido || ''} ${e.location_sigungu || ''}`}
                                    date={formatDate(e.date_start, e.date_end)}
                                    rating={e.avg_rating || '0.0'}
                                    reviewCount={e.review_count || 0}
                                    badge={e.recruitment_type}
                                    isPaid={e.is_paid}
                                    locked={false}
                                    onClick={() => router.push(`/events/${e.id}`)}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
