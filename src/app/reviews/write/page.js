'use client';

import { useState } from 'react';
import { T } from '@/lib/design-tokens';
import { REVENUE_RANGES, FILTERS } from '@/lib/design-tokens';
import TopBar from '@/components/ui/TopBar';
import Card from '@/components/ui/Card';

export default function ReviewWritePage() {
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

    return (
        <div style={{ minHeight: '100vh', background: T.bg }}>
            <TopBar
                title="리뷰 작성"
                subtitle="✍️ 성수 플리마켓 2025"
                hasBack
                onBack={() => window.history.back()}
                action={
                    <div style={{ display: 'flex', gap: 8 }}>
                        <button
                            onClick={() => window.history.back()}
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
                            style={{
                                padding: '10px 20px',
                                borderRadius: T.radiusMd,
                                background: T.blue,
                                fontSize: 14,
                                fontWeight: 700,
                                color: '#fff',
                                cursor: 'pointer',
                                border: 'none',
                            }}
                        >
                            등록하기
                        </button>
                    </div>
                }
            />

            <div className="page-padding">
                <div className="review-write-grid" style={{ display: 'grid', gap: 24, alignItems: 'start' }}>
                    {/* 메인 폼 */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
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
                            <div style={{
                                marginTop: 16, background: T.blue, borderRadius: T.radiusMd,
                                padding: 14, textAlign: 'center', color: '#fff', fontSize: 14,
                                fontWeight: 700, cursor: 'pointer',
                            }}>등록하기</div>
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
