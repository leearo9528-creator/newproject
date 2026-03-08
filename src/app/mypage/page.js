'use client';

import { useState } from 'react';
import Link from 'next/link';
import { T } from '@/lib/design-tokens';
import TopBar from '@/components/ui/TopBar';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

export default function MyPage() {
    const [tab, setTab] = useState('내 리뷰');

    return (
        <div style={{ minHeight: '100vh', background: T.bg }}>
            <TopBar title="마이페이지" action={
                <Link href="/login">
                    <div style={{ fontSize: 13, color: T.gray, cursor: 'pointer' }}>로그아웃</div>
                </Link>
            } />

            <div className="page-padding">
                {/* 프로필 */}
                <Card style={{ marginBottom: 16 }} className="animate-fade-in">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{
                            width: 56, height: 56, borderRadius: '50%',
                            background: `linear-gradient(135deg, ${T.blueLt}, #D0E4FF)`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
                        }}>🛍️</div>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ fontSize: 18, fontWeight: 800, color: T.text }}>헤비셀러Kim</span>
                                <Badge text="헤비셀러" />
                            </div>
                            <div style={{ fontSize: 13, color: T.gray, marginTop: 3 }}>셀러 · 헤비셀러 인증</div>
                        </div>
                    </div>
                </Card>

                {/* 구독 카드 */}
                <Card style={{ marginBottom: 16, background: `linear-gradient(135deg, #1E3A5F, ${T.blue})`, color: '#fff', border: 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontSize: 12, opacity: 0.7 }}>현재 구독</div>
                            <div style={{ fontSize: 17, fontWeight: 800, marginTop: 2 }}>월간 프리미엄</div>
                            <div style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>다음 결제 2025.04.15</div>
                        </div>
                        <Link href="/subscribe">
                            <div style={{
                                padding: '10px 18px', borderRadius: 10, background: 'rgba(255,255,255,0.2)',
                                fontSize: 13, fontWeight: 700, cursor: 'pointer', color: '#fff',
                            }}>관리</div>
                        </Link>
                    </div>
                </Card>

                {/* 활동 통계 */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
                    {[['12', '작성 리뷰'], ['3', '찜한 행사'], ['5', '지원 공고'], ['8.2K', '조회수']].map(([v, l]) => (
                        <Card key={l} style={{ textAlign: 'center', padding: 14 }}>
                            <div style={{ fontSize: 24, fontWeight: 800, color: T.blue }}>{v}</div>
                            <div style={{ fontSize: 12, color: T.gray, marginTop: 4 }}>{l}</div>
                        </Card>
                    ))}
                </div>

                {/* 리뷰 3개 프로모션 */}
                <Card style={{ marginBottom: 24, background: T.yellowLt, border: `1px solid #FFE0A0` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>🎁 리뷰 3개 쓰면 1개월 무료!</div>
                            <div style={{ fontSize: 13, color: T.gray, marginTop: 4 }}>현재 작성한 리뷰: <strong style={{ color: T.blue }}>12/3개</strong> ✅ 완료!</div>
                        </div>
                    </div>
                </Card>

                {/* 탭 */}
                <div style={{ display: 'flex', borderBottom: `2px solid ${T.border}`, marginBottom: 16 }}>
                    {['내 리뷰', '찜한 행사', '설정'].map((t) => (
                        <div key={t} onClick={() => setTab(t)} style={{
                            padding: '12px 20px', fontSize: 14, fontWeight: 700, cursor: 'pointer',
                            color: tab === t ? T.blue : T.gray,
                            borderBottom: tab === t ? `2px solid ${T.blue}` : '2px solid transparent',
                            marginBottom: -2, transition: 'color 0.15s',
                        }}>{t}</div>
                    ))}
                </div>

                {tab === '내 리뷰' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {[
                            { name: '성수 플리마켓', date: '2025.02', rating: 4.5 },
                            { name: '마포 봄 푸드페스타', date: '2025.01', rating: 3.8 },
                            { name: '한강 봄꽃 마켓', date: '2024.12', rating: 4.7 },
                        ].map((r, i) => (
                            <Card key={i}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <div>
                                        <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{r.name}</div>
                                        <div style={{ fontSize: 12, color: T.gray, marginTop: 2 }}>{r.date}</div>
                                    </div>
                                    <div style={{ fontSize: 14, fontWeight: 700, color: T.blue }}>★ {r.rating}</div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
                {tab === '설정' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {['프로필 수정', '알림 설정', '이용약관', '개인정보 처리방침', '문의하기'].map((item) => (
                            <Card key={item}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: 14, color: T.text }}>{item}</span>
                                    <span style={{ color: T.gray }}>→</span>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
