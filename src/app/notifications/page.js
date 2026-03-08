'use client';

import { T } from '@/lib/design-tokens';
import TopBar from '@/components/ui/TopBar';
import Card from '@/components/ui/Card';

const NOTIFICATIONS = [
    { id: 1, icon: '✅', title: '리뷰가 승인되었습니다', body: '성수 플리마켓 2025 리뷰', time: '10분 전', isNew: true },
    { id: 2, icon: '📢', title: '새로운 공고가 등록되었어요', body: '마포 봄 푸드페스타 셀러 모집', time: '2시간 전', isNew: true },
    { id: 3, icon: '⏰', title: '공고 마감 D-3', body: '한강 봄꽃 마켓 셀러 모집', time: '5시간 전', isNew: false },
    { id: 4, icon: '🎁', title: '무료 체험이 시작되었어요!', body: '리뷰 3개 작성 완료 — 1개월 프리미엄', time: '1일 전', isNew: false },
    { id: 5, icon: '⚠️', title: '신고가 접수되었습니다', body: '신고 ID #42 처리 완료', time: '3일 전', isNew: false },
];

export default function NotificationPage() {
    return (
        <div style={{ minHeight: '100vh', background: T.bg }}>
            <TopBar title="알림" action={
                <span style={{ fontSize: 13, color: T.blue, fontWeight: 600, cursor: 'pointer' }}>모두 읽음</span>
            } />

            <div className="page-padding">
                <div style={{ fontSize: 13, fontWeight: 600, color: T.gray, marginBottom: 12 }}>오늘</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {NOTIFICATIONS.filter((n) => n.isNew).map((n) => (
                        <Card key={n.id} className="animate-fade-in" style={{ borderLeft: `3px solid ${T.blue}` }}>
                            <div style={{ display: 'flex', gap: 12 }}>
                                <span style={{ fontSize: 20 }}>{n.icon}</span>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{n.title}</div>
                                    <div style={{ fontSize: 13, color: T.gray, marginTop: 2 }}>{n.body}</div>
                                </div>
                                <span style={{ fontSize: 12, color: T.gray, whiteSpace: 'nowrap' }}>{n.time}</span>
                            </div>
                        </Card>
                    ))}
                </div>

                <div style={{ fontSize: 13, fontWeight: 600, color: T.gray, marginTop: 24, marginBottom: 12 }}>이번 주</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {NOTIFICATIONS.filter((n) => !n.isNew).map((n) => (
                        <Card key={n.id}>
                            <div style={{ display: 'flex', gap: 12 }}>
                                <span style={{ fontSize: 20, filter: 'grayscale(0.5) opacity(0.7)' }}>{n.icon}</span>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 14, fontWeight: 600, color: T.textSub }}>{n.title}</div>
                                    <div style={{ fontSize: 13, color: T.gray, marginTop: 2 }}>{n.body}</div>
                                </div>
                                <span style={{ fontSize: 12, color: T.gray, whiteSpace: 'nowrap' }}>{n.time}</span>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
