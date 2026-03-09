'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { T } from '@/lib/design-tokens';
import { REVENUE_RANGES, FILTERS } from '@/lib/design-tokens';
import { getSupabase } from '@/lib/supabase';
import TopBar from '@/components/ui/TopBar';
import Card from '@/components/ui/Card';

function ReviewWriteInner() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [eventId, setEventId] = useState(searchParams.get('event') || null);
    const [eventName, setEventName] = useState(searchParams.get('name') || '');
    const [eventSearch, setEventSearch] = useState('');
    const [eventResults, setEventResults] = useState([]);
    const [eventSearching, setEventSearching] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const searchRef = useRef(null);

    useEffect(() => {
        async function checkAuth() {
            const sb = getSupabase();
            const { data: { user } } = await sb.auth.getUser();
            if (!user) router.replace('/login');
        }
        checkAuth();
    }, []);

    useEffect(() => {
        const q = eventSearch.trim();
        if (!q) { setEventResults([]); return; }
        const timer = setTimeout(async () => {
            setEventSearching(true);
            const sb = getSupabase();
            const { data } = await sb
                .from('events')
                .select('id, name, location_sido, location_sigungu, start_date')
                .eq('is_approved', true)
                .eq('is_deleted', false)
                .or(`name.ilike.%${q}%,location_sido.ilike.%${q}%,location_sigungu.ilike.%${q}%`)
                .order('start_date', { ascending: false })
                .limit(10);
            setEventResults(data || []);
            setEventSearching(false);
        }, 300);
        return () => clearTimeout(timer);
    }, [eventSearch]);

    useEffect(() => {
        function handleClick(e) {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const [boothType, setBoothType] = useState('seller');
    const [year, setYear] = useState('2025');
    const [month, setMonth] = useState('3');
    const [category, setCategory] = useState('');
    const [catPrivate, setCatPrivate] = useState(false);
    const [priceRange, setPriceRange] = useState('');
    const [r1, setR1] = useState(0);
    const [r2, setR2] = useState(0);
    const [r3, setR3] = useState(0);
    const [buyPower, setBuyPower] = useState('');
    const [ageGroup, setAgeGroup] = useState('');
    const [revenue, setRevenue] = useState(null);
    const [pros, setPros] = useState('');
    const [cons, setCons] = useState('');
    const [repurchase, setRepurchase] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const overall = r1 && r2 && r3 ? ((r1 + r2 + r3) / 3).toFixed(1) : null;
    const revenues = boothType === 'seller' ? REVENUE_RANGES.seller : REVENUE_RANGES.foodtruck;

    const inputStyle = (hasValue) => ({
        width: '100%',
        background: T.bg,
        borderRadius: T.radiusMd,
        padding: '13px 16px',
        border: `1.5px solid ${hasValue ? T.blue : T.border}`,
        fontSize: 14,
        color: T.text,
        outline: 'none',
        boxSizing: 'border-box',
        transition: 'border-color 0.15s',
    });

    async function handleSubmit() {
        if (!r1 || !r2 || !r3) {
            setError('항목별 별점을 모두 입력해주세요');
            return;
        }
        if (!pros.trim()) {
            setError('장점을 입력해주세요');
            return;
        }
        if (repurchase === null) {
            setError('재참가 의향을 선택해주세요');
            return;
        }

        setLoading(true);
        setError('');

        const sb = getSupabase();
        const { data: { user } } = await sb.auth.getUser();

        const reviewData = {
            event_id: eventId || null,
            user_id: user?.id || null,
            booth_type: boothType,
            participated_year: parseInt(year),
            participated_month: parseInt(month),
            category: catPrivate ? null : (category || null),
            category_private: catPrivate,
            price_range: priceRange.trim() || null,
            rating_visitors: r1,
            rating_organizer: r2,
            rating_atmosphere: r3,
            overall_rating: parseFloat(overall),
            buy_power: buyPower || null,
            age_group: ageGroup || null,
            revenue_range: revenue !== null ? revenues[revenue] : null,
            pros: pros.trim(),
            cons: cons.trim() || null,
            repurchase_intent: repurchase,
            is_approved: false,
            is_deleted: false,
        };

        const { error: err } = await sb.from('reviews').insert(reviewData);
        setLoading(false);

        if (err) {
            setError('리뷰 등록 중 오류가 발생했어요. 다시 시도해주세요.');
            return;
        }

        setSubmitted(true);
    }

    if (submitted) {
        return (
            <div style={{ minHeight: '100vh', background: T.bg }}>
                <TopBar title="리뷰 작성" hasBack onBack={() => router.push('/')} />
                <div className="page-padding" style={{ textAlign: 'center', paddingTop: 80 }}>
                    <div style={{ fontSize: 64, marginBottom: 20 }}>🎉</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: T.text, marginBottom: 8 }}>
                        리뷰를 남겨주셔서 감사해요!
                    </div>
                    <div style={{ fontSize: 14, color: T.gray, marginBottom: 32 }}>
                        관리자 승인 후 리뷰가 공개돼요.
                    </div>
                    <div
                        onClick={() => eventId ? router.push(`/events/${eventId}`) : router.push('/')}
                        style={{
                            display: 'inline-block',
                            background: T.blue, borderRadius: T.radiusMd,
                            padding: '14px 32px', color: '#fff', fontSize: 15,
                            fontWeight: 700, cursor: 'pointer',
                        }}
                    >
                        {eventId ? '행사로 돌아가기' : '홈으로 돌아가기'}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: T.bg }}>
            <TopBar
                title="리뷰 작성"
                subtitle={eventName ? `✍️ ${eventName}` : '✍️ 행사를 선택해주세요'}
                hasBack
                onBack={() => router.back()}
                action={
                    <div style={{ display: 'flex', gap: 8 }}>
                        <button
                            onClick={() => router.back()}
                            style={{
                                padding: '10px 18px',
                                borderRadius: T.radiusMd,
                                border: `1px solid ${T.border}`,
                                fontSize: 14,
                                fontWeight: 600,
                                color: T.gray,
                                cursor: 'pointer',
                                background: T.bg,
                            }}
                        >
                            취소
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            style={{
                                padding: '10px 20px',
                                borderRadius: T.radiusMd,
                                background: loading ? T.gray : T.blue,
                                fontSize: 14,
                                fontWeight: 700,
                                color: '#fff',
                                cursor: loading ? 'default' : 'pointer',
                                border: 'none',
                            }}
                        >
                            {loading ? '등록 중...' : '등록하기'}
                        </button>
                    </div>
                }
            />

            <div className="page-padding">
                {error && (
                    <div style={{
                        background: T.redLt, color: T.red, borderRadius: T.radiusMd,
                        padding: '10px 14px', fontSize: 13, fontWeight: 600, marginBottom: 16,
                    }}>⚠️ {error}</div>
                )}

                <div className="review-write-grid" style={{ display: 'grid', gap: 24, alignItems: 'start' }}>
                    {/* 메인 폼 */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {/* 행사 선택 */}
                        <Card>
                            <div style={{ fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 14 }}>
                                🎪 어떤 행사에 참가하셨나요?
                            </div>
                            {eventId && eventName ? (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                                    <div style={{
                                        flex: 1, padding: '12px 16px', borderRadius: T.radiusMd,
                                        background: T.blueLt, border: `1.5px solid ${T.blue}`,
                                        fontSize: 14, fontWeight: 700, color: T.blue,
                                    }}>
                                        ✅ {eventName}
                                    </div>
                                    <button
                                        onClick={() => { setEventId(null); setEventName(''); setEventSearch(''); }}
                                        style={{
                                            padding: '10px 14px', borderRadius: T.radiusMd, fontSize: 13,
                                            fontWeight: 600, border: `1px solid ${T.border}`,
                                            background: T.bg, color: T.gray, cursor: 'pointer', whiteSpace: 'nowrap',
                                        }}
                                    >
                                        변경
                                    </button>
                                </div>
                            ) : (
                                <div ref={searchRef} style={{ position: 'relative' }}>
                                    <input
                                        value={eventSearch}
                                        onChange={(e) => { setEventSearch(e.target.value); setShowDropdown(true); }}
                                        onFocus={() => setShowDropdown(true)}
                                        placeholder="행사명 또는 지역으로 검색..."
                                        style={inputStyle(eventSearch)}
                                    />
                                    {showDropdown && (eventSearching || eventResults.length > 0 || eventSearch.trim()) && (
                                        <div style={{
                                            position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100,
                                            background: T.white, border: `1.5px solid ${T.border}`,
                                            borderRadius: T.radiusMd, boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                                            marginTop: 4, overflow: 'hidden',
                                        }}>
                                            {eventSearching ? (
                                                <div style={{ padding: '14px 16px', fontSize: 13, color: T.gray }}>검색 중...</div>
                                            ) : eventResults.length === 0 ? (
                                                <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                    <span style={{ fontSize: 13, color: T.gray }}>검색 결과가 없어요</span>
                                                    <span
                                                        onClick={() => router.push(`/events/register?name=${encodeURIComponent(eventSearch)}`)}
                                                        style={{ fontSize: 13, fontWeight: 700, color: T.blue, cursor: 'pointer' }}
                                                    >
                                                        + 행사 등록하기
                                                    </span>
                                                </div>
                                            ) : eventResults.map((ev, i) => (
                                                <div
                                                    key={ev.id}
                                                    onClick={() => {
                                                        setEventId(ev.id);
                                                        setEventName(ev.name);
                                                        setEventSearch('');
                                                        setShowDropdown(false);
                                                    }}
                                                    style={{
                                                        padding: '12px 16px', cursor: 'pointer',
                                                        borderBottom: i < eventResults.length - 1 ? `1px solid ${T.border}` : 'none',
                                                        transition: 'background 0.1s',
                                                    }}
                                                    onMouseEnter={(e) => e.currentTarget.style.background = T.bg}
                                                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                                >
                                                    <div style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 3 }}>{ev.name}</div>
                                                    <div style={{ fontSize: 12, color: T.gray }}>
                                                        {[ev.location_sido, ev.location_sigungu].filter(Boolean).join(' ')}
                                                        {ev.start_date && ` · ${new Date(ev.start_date).getFullYear()}년 ${new Date(ev.start_date).getMonth() + 1}월`}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </Card>

                        {/* 참가 유형 */}
                        <Card>
                            <div style={{ fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 14 }}>참가 유형</div>
                            <div style={{ display: 'flex', gap: 10 }}>
                                {[['seller', '🛍️ 일반 셀러'], ['foodtruck', '🍔 푸드트럭']].map(([v, l]) => (
                                    <div key={v} onClick={() => setBoothType(v)} style={{
                                        flex: 1, padding: 14, borderRadius: T.radiusMd, cursor: 'pointer',
                                        border: `2px solid ${boothType === v ? T.blue : T.border}`,
                                        background: boothType === v ? T.blueLt : T.white,
                                        textAlign: 'center', fontSize: 14, fontWeight: 700,
                                        color: boothType === v ? T.blue : T.gray, transition: 'all 0.15s',
                                    }}>{l}</div>
                                ))}
                            </div>
                        </Card>

                        {/* 참가 시기 */}
                        <Card>
                            <div style={{ fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 14 }}>참가 시기</div>
                            <div style={{ display: 'flex', gap: 10 }}>
                                <select value={year} onChange={(e) => setYear(e.target.value)} style={inputStyle(true)}>
                                    {['2026', '2025', '2024', '2023'].map((y) => <option key={y} value={y}>{y}년</option>)}
                                </select>
                                <select value={month} onChange={(e) => setMonth(e.target.value)} style={inputStyle(true)}>
                                    {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                                        <option key={m} value={m}>{m}월</option>
                                    ))}
                                </select>
                            </div>
                        </Card>

                        {/* 판매 품목 */}
                        <Card>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                                <div style={{ fontSize: 15, fontWeight: 700, color: T.text }}>판매 품목</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <span style={{ fontSize: 13, color: T.gray }}>비공개</span>
                                    <div onClick={() => setCatPrivate(!catPrivate)} style={{
                                        width: 40, height: 22, borderRadius: 11, background: catPrivate ? T.blue : T.border,
                                        position: 'relative', cursor: 'pointer', transition: 'background 0.2s',
                                    }}>
                                        <div style={{
                                            position: 'absolute', top: 2, left: catPrivate ? 20 : 2,
                                            width: 18, height: 18, borderRadius: '50%', background: '#fff',
                                            transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                                        }} />
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                {FILTERS.boothCategory.map((c) => (
                                    <span key={c} onClick={() => setCategory(c)} style={{
                                        padding: '8px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                                        background: category === c ? T.text : T.bg, color: category === c ? '#fff' : T.gray,
                                        border: `1px solid ${category === c ? T.text : T.border}`, transition: 'all 0.15s',
                                    }}>{c}</span>
                                ))}
                            </div>
                        </Card>

                        {/* 제품 가격대 */}
                        <Card>
                            <div style={{ fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 14 }}>제품 가격대</div>
                            <input value={priceRange} onChange={(e) => setPriceRange(e.target.value)}
                                placeholder="예) 1~3만원대, 소품 5천원~" style={inputStyle(priceRange)} />
                        </Card>

                        {/* 항목별 별점 */}
                        <Card>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                                <div style={{ fontSize: 15, fontWeight: 700, color: T.text }}>항목별 별점</div>
                                {overall && (
                                    <div style={{ background: T.blueLt, borderRadius: 10, padding: '6px 14px', fontSize: 13, fontWeight: 700, color: T.blue }}>
                                        종합 ★ {overall}
                                    </div>
                                )}
                            </div>
                            {[['방문객 수 / 유동인구', r1, setR1], ['주최측 대응', r2, setR2], ['마켓 분위기', r3, setR3]].map(([l, v, sv]) => (
                                <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                                    <span style={{ fontSize: 13, color: T.gray, width: 160, flexShrink: 0 }}>{l}</span>
                                    <div style={{ display: 'flex', gap: 4 }}>
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <span key={s} onClick={() => sv(s)} style={{
                                                fontSize: 28, cursor: 'pointer',
                                                filter: s <= v ? 'none' : 'grayscale(1) opacity(0.3)',
                                                transition: 'filter 0.1s',
                                            }}>⭐</span>
                                        ))}
                                    </div>
                                    {v > 0 && <span style={{ fontSize: 15, fontWeight: 700, color: T.text }}>{v}.0</span>}
                                </div>
                            ))}
                        </Card>

                        {/* 구매력 & 연령층 */}
                        <Card>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                                <div>
                                    <div style={{ fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 12 }}>구매력</div>
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        {FILTERS.buyPower.map((v) => (
                                            <div key={v} onClick={() => setBuyPower(v)} style={{
                                                flex: 1, padding: 10, borderRadius: 10, cursor: 'pointer', textAlign: 'center',
                                                fontSize: 13, fontWeight: 600,
                                                border: `2px solid ${buyPower === v ? T.blue : T.border}`,
                                                background: buyPower === v ? T.blueLt : T.white,
                                                color: buyPower === v ? T.blue : T.gray, transition: 'all 0.15s',
                                            }}>{v}</div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <div style={{ fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 12 }}>주요 연령층</div>
                                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                        {FILTERS.ageGroup.map((v) => (
                                            <span key={v} onClick={() => setAgeGroup(v)} style={{
                                                padding: '8px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                                                background: ageGroup === v ? T.text : T.bg, color: ageGroup === v ? '#fff' : T.gray,
                                                border: `1px solid ${ageGroup === v ? T.text : T.border}`, transition: 'all 0.15s',
                                            }}>{v}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* 매출 구간 */}
                        <Card>
                            <div style={{ fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 14 }}>
                                매출 구간 <span style={{ fontSize: 12, color: T.gray, fontWeight: 400 }}>(구독자 공개)</span>
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                {revenues.map((r, i) => (
                                    <div key={i} onClick={() => setRevenue(i)} style={{
                                        padding: '10px 16px', borderRadius: T.radiusMd, cursor: 'pointer',
                                        border: `2px solid ${revenue === i ? T.blue : T.border}`,
                                        background: revenue === i ? T.blueLt : T.white,
                                        fontSize: 13, fontWeight: 600,
                                        color: revenue === i ? T.blue : T.gray, transition: 'all 0.15s',
                                    }}>{r}</div>
                                ))}
                            </div>
                        </Card>

                        {/* 장점/단점 */}
                        <Card>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                                <div>
                                    <div style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 8 }}>
                                        👍 장점 <span style={{ fontSize: 12, color: T.green, fontWeight: 400 }}>전체 공개</span>
                                    </div>
                                    <textarea value={pros} onChange={(e) => setPros(e.target.value)}
                                        placeholder="이 행사의 좋았던 점을 알려주세요" rows={4}
                                        style={{ ...inputStyle(pros), resize: 'none', fontFamily: 'inherit' }} />
                                </div>
                                <div>
                                    <div style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 8 }}>
                                        👎 단점 <span style={{ fontSize: 12, color: T.gray, fontWeight: 400 }}>🔒 구독자 공개</span>
                                    </div>
                                    <textarea value={cons} onChange={(e) => setCons(e.target.value)}
                                        placeholder="아쉬웠던 점이 있다면 솔직하게 작성해주세요" rows={4}
                                        style={{ ...inputStyle(cons), resize: 'none', fontFamily: 'inherit' }} />
                                </div>
                            </div>
                        </Card>

                        {/* 재참가 의향 */}
                        <Card>
                            <div style={{ fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 14 }}>재참가 의향</div>
                            <div style={{ display: 'flex', gap: 10 }}>
                                {[[true, '✅ 다시 참가할게요'], [false, '❌ 다음엔 다른 곳으로']].map(([v, l]) => (
                                    <div key={String(v)} onClick={() => setRepurchase(v)} style={{
                                        flex: 1, padding: 14, borderRadius: T.radiusMd, cursor: 'pointer',
                                        border: `2px solid ${repurchase === v ? (v ? T.green : T.red) : T.border}`,
                                        background: repurchase === v ? (v ? T.greenLt : T.redLt) : T.white,
                                        textAlign: 'center', fontSize: 14, fontWeight: 700,
                                        color: repurchase === v ? (v ? T.green : T.red) : T.gray,
                                        transition: 'all 0.15s',
                                    }}>{l}</div>
                                ))}
                            </div>
                        </Card>
                    </div>

                    {/* 사이드 패널 (PC) */}
                    <div className="review-sidebar" style={{ position: 'sticky', top: 80 }}>
                        <Card>
                            <div style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 16 }}>📋 작성 현황</div>
                            {[
                                ['행사', eventName || '-'],
                                ['참가 유형', boothType === 'seller' ? '일반 셀러' : '푸드트럭'],
                                ['참가 시기', `${year}년 ${month}월`],
                                ['판매 품목', category || '-'],
                                ['가격대', priceRange || '-'],
                                ['유동인구', r1 ? `★ ${r1}.0` : '-'],
                                ['주최측', r2 ? `★ ${r2}.0` : '-'],
                                ['분위기', r3 ? `★ ${r3}.0` : '-'],
                                ['종합', overall ? `★ ${overall}` : '-'],
                                ['구매력', buyPower || '-'],
                                ['연령층', ageGroup || '-'],
                                ['매출', revenue !== null ? revenues[revenue] : '-'],
                                ['재참가', repurchase === true ? '✅ 예' : repurchase === false ? '❌ 아니요' : '-'],
                            ].map(([k, v], i, arr) => (
                                <div key={k} style={{
                                    display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: 13,
                                    borderBottom: i < arr.length - 1 ? `1px solid ${T.border}` : 'none',
                                }}>
                                    <span style={{ color: T.gray }}>{k}</span>
                                    <span style={{ fontWeight: 600, color: v === '-' ? T.border : T.text }}>{v}</span>
                                </div>
                            ))}
                            <div
                                onClick={handleSubmit}
                                style={{
                                    marginTop: 16, background: loading ? T.gray : T.blue, borderRadius: T.radiusMd,
                                    padding: 14, textAlign: 'center', color: '#fff', fontSize: 14,
                                    fontWeight: 700, cursor: loading ? 'default' : 'pointer',
                                }}
                            >
                                {loading ? '등록 중...' : '등록하기'}
                            </div>
                        </Card>
                    </div>
                </div>
            </div>

            <style jsx>{`
        @media (min-width: 1024px) {
          .review-write-grid {
            grid-template-columns: 1fr 300px !important;
          }
        }
        @media (max-width: 1023px) {
          .review-sidebar {
            display: none !important;
          }
        }
      `}</style>
        </div>
    );
}

export default function ReviewWritePage() {
    return (
        <Suspense fallback={
            <div style={{ minHeight: '100vh', background: '#F5F6F8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ color: '#8B95A1' }}>로딩 중...</div>
            </div>
        }>
            <ReviewWriteInner />
        </Suspense>
    );
}
