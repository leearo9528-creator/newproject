'use client';

import React, { useState } from 'react';
import { T } from '@/lib/design-tokens';
import TopBar from '@/components/ui/TopBar';
import Card from '@/components/ui/Card';

const plans = [
    { id: 'monthly', name: '월간', price: '9,900원/월', desc: '매달 자동 결제', highlight: false },
    { id: 'yearly', name: '연간', price: '79,900원/년', desc: '월 6,658원 · 33% 할인', highlight: true },
];

const features = [
    ['매출 구간 정보', false, true],
    ['리뷰 단점 열람', false, true],
    ['상세 통계 데이터', false, true],
    ['행사 검색', true, true],
    ['리뷰 장점 열람', true, true],
    ['행사 제보', true, true],
];

export default function SubscribePage() {
    const [selected, setSelected] = useState('yearly');

    return (
        <div style={{ minHeight: '100vh', background: T.bg }}>
            <TopBar title="구독" subtitle="프리미엄 시작하기" hasBack onBack={() => window.history.back()} />

            <div className="page-padding" style={{ maxWidth: 640, margin: '0 auto' }}>
                <div className="animate-fade-in" style={{ textAlign: 'center', marginBottom: 32 }}>
                    <div style={{ fontSize: 40, marginBottom: 16 }}>🏆</div>
                    <div style={{ fontSize: 24, fontWeight: 800, color: T.text, letterSpacing: -0.5 }}>
                        진짜 매출 정보를<br />확인해보세요
                    </div>
                    <div style={{ fontSize: 14, color: T.gray, marginTop: 8 }}>
                        셀러들의 실제 매출 범위와 솔직한 단점까지 모두 열람
                    </div>
                </div>

                {/* 플랜 선택 */}
                <div style={{ display: 'flex', gap: 12, marginBottom: 28 }}>
                    {plans.map((p) => (
                        <Card key={p.id} onClick={() => setSelected(p.id)} style={{
                            flex: 1, cursor: 'pointer', position: 'relative',
                            border: `2px solid ${selected === p.id ? T.blue : T.border}`,
                            background: selected === p.id ? T.blueLt : T.white,
                        }}>
                            {p.highlight && (
                                <div style={{
                                    position: 'absolute', top: -10, right: 12,
                                    background: T.red, color: '#fff', borderRadius: 6,
                                    padding: '3px 10px', fontSize: 11, fontWeight: 700,
                                }}>BEST</div>
                            )}
                            <div style={{ fontSize: 16, fontWeight: 800, color: selected === p.id ? T.blue : T.text, marginBottom: 4 }}>
                                {p.name}
                            </div>
                            <div style={{ fontSize: 22, fontWeight: 800, color: T.text, marginBottom: 4 }}>
                                {p.price}
                            </div>
                            <div style={{ fontSize: 12, color: T.gray }}>{p.desc}</div>
                        </Card>
                    ))}
                </div>

                {/* 기능 비교 */}
                <Card style={{ marginBottom: 28 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 16 }}>기능 비교</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 0 }}>
                        <div style={{ fontSize: 12, color: T.gray, padding: '8px 0' }}></div>
                        <div style={{ fontSize: 12, color: T.gray, padding: '8px 16px', textAlign: 'center', fontWeight: 600 }}>무료</div>
                        <div style={{ fontSize: 12, color: T.blue, padding: '8px 16px', textAlign: 'center', fontWeight: 700 }}>프리미엄</div>
                        {features.map(([name, free, premium]) => (
                            <React.Fragment key={name}>
                                <div style={{ fontSize: 13, padding: '10px 0', borderTop: `1px solid ${T.border}`, color: T.text }}>
                                    {name}
                                </div>
                                <div style={{ textAlign: 'center', padding: '10px 16px', borderTop: `1px solid ${T.border}`, fontSize: 14 }}>
                                    {free ? '✅' : '❌'}
                                </div>
                                <div style={{ textAlign: 'center', padding: '10px 16px', borderTop: `1px solid ${T.border}`, fontSize: 14 }}>
                                    {premium ? '✅' : '❌'}
                                </div>
                            </React.Fragment>
                        ))}
                    </div>
                </Card>

                {/* 결제 수단 */}
                <Card style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 14 }}>결제 수단</div>
                    <div style={{ display: 'flex', gap: 10 }}>
                        {[
                            ['💳', '카드 결제'],
                            ['🟡', '카카오페이'],
                            ['🔵', '토스페이'],
                        ].map(([icon, l]) => (
                            <div key={l} style={{
                                flex: 1, padding: 14, borderRadius: T.radiusMd,
                                border: `1px solid ${T.border}`, textAlign: 'center',
                                cursor: 'pointer', transition: 'border-color 0.15s',
                                fontSize: 13, fontWeight: 600, color: T.text,
                            }}>
                                <div style={{ fontSize: 24, marginBottom: 4 }}>{icon}</div>
                                {l}
                            </div>
                        ))}
                    </div>
                </Card>

                <div style={{
                    background: T.blue, borderRadius: 14, padding: 16, textAlign: 'center',
                    color: '#fff', fontSize: 16, fontWeight: 700, cursor: 'pointer',
                }}>
                    {selected === 'yearly' ? '79,900원' : '9,900원'} 결제하기
                </div>
            </div>
        </div>
    );
}
