'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { T } from '@/lib/design-tokens';
import { REVENUE_RANGES } from '@/lib/design-tokens';
import { getSupabase } from '@/lib/supabase';
import TopBar from '@/components/ui/TopBar';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';

export default function EventDetailPage() {
    const params = useParams();
    const [event, setEvent] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [tab, setTab] = useState('리뷰');
    const [liked, setLiked] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params?.id) fetchData();
    }, [params?.id]);

    async function fetchData() {
        const sb = getSupabase();

        // 행사 데이터
        const { data: ev } = await sb
            .from('events')
            .select('*')
            .eq('id', params.id)
            .single();

        if (ev) setEvent(ev);

        // 승인된 리뷰
        const { data: rvs } = await sb
            .from('reviews')
            .select('*, users(nickname, is_verified)')
            .eq('event_id', params.id)
            .eq('is_approved', true)
            .eq('is_deleted', false)
            .order('created_at', { ascending: false });

        if (rvs) setReviews(rvs);
        setLoading(false);
    }

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', background: T.bg }}>
                <TopBar title="행사 상세" hasBack onBack={() => window.history.back()} />
                <div className="page-padding" style={{ textAlign: 'center', paddingTop: 80 }}>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
                    <div style={{ color: T.gray }}>로딩 중...</div>
                </div>
            </div>
        );
    }

    if (!event) {
        return (
            <div style={{ minHeight: '100vh', background: T.bg }}>
                <TopBar title="행사 상세" hasBack onBack={() => window.history.back()} />
                <div className="page-padding" style={{ textAlign: 'center', paddingTop: 80 }}>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>🤔</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: T.text }}>행사를 찾을 수 없어요</div>
                </div>
            </div>
        );
    }

    const e = event;
    const repurchaseRate = reviews.length > 0
        ? Math.round((reviews.filter(r => r.repurchase_intent).length / reviews.length) * 100)
        : 0;

    const avgVisitors = reviews.length > 0 ? (reviews.reduce((s, r) => s + (r.rating_visitors || 0), 0) / reviews.length).toFixed(1) : 0;
    const avgOrganizer = reviews.length > 0 ? (reviews.reduce((s, r) => s + (r.rating_organizer || 0), 0) / reviews.length).toFixed(1) : 0;
    const avgAtmosphere = reviews.length > 0 ? (reviews.reduce((s, r) => s + (r.rating_atmosphere || 0), 0) / reviews.length).toFixed(1) : 0;

    return (
        <div style={{ minHeight: '100vh', background: T.bg }}>
            <TopBar
                title="행사 상세"
                hasBack
                onBack={() => window.history.back()}
                action={
                    <div style={{ display: 'flex', gap: 8 }}>
                        <div onClick={() => setLiked(!liked)} style={{
                            width: 38, height: 38, borderRadius: 10,
                            background: liked ? '#FFF0F0' : T.bg,
                            border: `1px solid ${T.border}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', fontSize: 18, transition: 'all 0.15s',
                        }}>
                            {liked ? '❤️' : '🤍'}
                        </div>
                        <Link href={`/reviews/write?event=${e.id}&name=${encodeURIComponent(e.name)}`}>
                            <div style={{
                                background: T.blue, borderRadius: 10, padding: '0 20px', height: 38,
                                display: 'flex', alignItems: 'center',
                                color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer',
                            }}>✍️ 리뷰 쓰기</div>
                        </Link>
                    </div>
                }
            />

            <div className="page-padding">
                <div>
                    {/* 행사 기본 정보 */}
                    <Card style={{ marginBottom: 16 }} className="animate-fade-in">
                        <div style={{
                            background: `linear-gradient(135deg, #E8F0FF, ${T.blueLt})`,
                            borderRadius: 14, height: 200,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64, marginBottom: 20,
                        }}>🎪</div>
                        <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                            <Badge text={e.recruitment_type} />
                            <Badge text={e.status} />
                            {e.is_indoor && <Badge text="실내" />}
                        </div>
                        <div style={{ fontSize: 24, fontWeight: 800, color: T.text, letterSpacing: -0.5, marginBottom: 6 }}>
                            {e.name}
                        </div>
                        <div style={{ fontSize: 14, color: T.gray }}>
                            {e.location_sido} {e.location_sigungu} · {e.date_start} ~ {e.date_end || ''} · {e.is_indoor ? '실내' : '실외'}
                        </div>
                    </Card>

                    {/* 평점 요약 */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
                        {[
                            [e.avg_rating || '0.0', '종합 평점', T.text],
                            [e.review_count || 0, '셀러 리뷰', T.blue],
                            [`${repurchaseRate}%`, '재참가 의향', T.green],
                        ].map(([val, label, color]) => (
                            <Card key={label} style={{ textAlign: 'center', padding: 18 }}>
                                <div style={{ fontSize: 32, fontWeight: 800, color }}>{val}</div>
                                <div style={{ fontSize: 13, color: T.gray, marginTop: 4 }}>{label}</div>
                            </Card>
                        ))}
                    </div>

                    {/* 항목별 평균 */}
                    {reviews.length > 0 && (
                        <Card style={{ marginBottom: 16 }}>
                            <div style={{ fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 14 }}>항목별 평균</div>
                            {[['방문객 수 / 유동인구', avgVisitors], ['주최측 대응', avgOrganizer], ['마켓 분위기', avgAtmosphere]].map(([label, val]) => (
                                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                                    <span style={{ fontSize: 13, color: T.gray, width: 160, flexShrink: 0 }}>{label}</span>
                                    <div style={{ flex: 1, height: 8, background: T.border, borderRadius: 4, overflow: 'hidden' }}>
                                        <div style={{ width: `${(val / 5) * 100}%`, height: '100%', background: T.blue, borderRadius: 4, transition: 'width 0.6s ease' }} />
                                    </div>
                                    <span style={{ fontSize: 13, fontWeight: 700, color: T.text, width: 28 }}>{val}</span>
                                </div>
                            ))}
                        </Card>
                    )}

                    {/* 탭 */}
                    <div style={{ display: 'flex', borderBottom: `2px solid ${T.border}`, marginBottom: 16 }}>
                        {['리뷰', '행사정보'].map((t) => (
                            <div key={t} onClick={() => setTab(t)} style={{
                                padding: '12px 20px', fontSize: 14, fontWeight: 700, cursor: 'pointer',
                                color: tab === t ? T.blue : T.gray,
                                borderBottom: tab === t ? `2px solid ${T.blue}` : '2px solid transparent',
                                marginBottom: -2,
                            }}>{t}</div>
                        ))}
                    </div>

                    {tab === '리뷰' && (
                        <div>
                            {reviews.length === 0 ? (
                                <Card style={{ textAlign: 'center', padding: 40 }}>
                                    <div style={{ fontSize: 36, marginBottom: 12 }}>📝</div>
                                    <div style={{ fontSize: 16, fontWeight: 700, color: T.text }}>아직 리뷰가 없어요</div>
                                    <div style={{ fontSize: 13, color: T.gray, marginTop: 6 }}>첫 번째 리뷰를 남겨보세요!</div>
                                </Card>
                            ) : (
                                reviews.map((review) => {
                                    const revenues = review.booth_type === 'seller' ? REVENUE_RANGES.seller : REVENUE_RANGES.foodtruck;
                                    return (
                                        <Card key={review.id} style={{ marginBottom: 12 }} className="animate-fade-in">
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                                                <div style={{ display: 'flex', gap: 6 }}>
                                                    {review.users?.is_verified && <Badge text="🏅 헤비셀러" />}
                                                    <Badge text={review.booth_type === 'seller' ? '일반 셀러' : '푸드트럭'} />
                                                </div>
                                                <span style={{ fontSize: 13, color: T.gray }}>
                                                    {review.participated_year}.{String(review.participated_month).padStart(2, '0')}
                                                </span>
                                            </div>
                                            <div style={{ fontSize: 14, fontWeight: 700, color: T.blue, marginBottom: 4 }}>
                                                ★ {review.overall_rating}
                                            </div>
                                            <div style={{ fontSize: 15, color: T.green, marginBottom: 8 }}>
                                                👍 {review.pros}
                                            </div>
                                            {/* 구독 잠금 */}
                                            <div style={{ background: T.bg, borderRadius: 10, padding: '12px 16px' }}>
                                                <div style={{ fontSize: 12, color: T.gray, marginBottom: 8 }}>🔒 구독하면 볼 수 있어요</div>
                                                <div style={{ display: 'flex', gap: 8 }}>
                                                    <div style={{ flex: 1, background: T.border, height: 32, borderRadius: 8 }} />
                                                    <div style={{ flex: 1, background: T.border, height: 32, borderRadius: 8 }} />
                                                </div>
                                            </div>
                                        </Card>
                                    );
                                })
                            )}

                            {/* 구독 유도 */}
                            <div style={{
                                background: `linear-gradient(135deg, #1E3A5F, ${T.blue})`,
                                borderRadius: 16, padding: 24, color: '#fff', textAlign: 'center', marginTop: 16,
                            }}>
                                <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 6 }}>매출 정보가 궁금하다면?</div>
                                <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 16 }}>
                                    {e.review_count || 0}개 리뷰의 매출 범위 전체 확인
                                </div>
                                <Link href="/subscribe">
                                    <div style={{
                                        background: '#fff', color: T.blue, borderRadius: 10, padding: 14,
                                        fontSize: 14, fontWeight: 700, cursor: 'pointer',
                                    }}>구독하고 전체 보기</div>
                                </Link>
                            </div>
                        </div>
                    )}

                    {tab === '행사정보' && (
                        <Card>
                            {[
                                ['주최', e.organizer || '-'],
                                ['위치', `${e.location_sido || ''} ${e.location_sigungu || ''}`],
                                ['일정', `${e.date_start || ''} ~ ${e.date_end || ''}`],
                                ['환경', e.is_indoor ? '실내' : '실외'],
                                ['참가비', e.is_paid ? '유료' : '무료'],
                                ['모집유형', e.recruitment_type],
                                ['출처', e.source === 'public_api' ? '공공데이터' : e.source === 'admin' ? '관리자 등록' : '유저 제보'],
                            ].map(([k, v], i, arr) => (
                                <div key={k} style={{
                                    display: 'flex', padding: '14px 0',
                                    borderBottom: i < arr.length - 1 ? `1px solid ${T.border}` : 'none',
                                }}>
                                    <span style={{ fontSize: 14, color: T.gray, width: 80 }}>{k}</span>
                                    <span style={{ fontSize: 14, color: T.text, fontWeight: 600 }}>{v}</span>
                                </div>
                            ))}
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
