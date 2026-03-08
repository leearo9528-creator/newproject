'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { T } from '@/lib/design-tokens';
import { getSupabase } from '@/lib/supabase';
import TopBar from '@/components/ui/TopBar';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

export default function MyPage() {
    const router = useRouter();
    const [tab, setTab] = useState('내 리뷰');
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [myReviews, setMyReviews] = useState([]);
    const [likedCount, setLikedCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUserData();
    }, []);

    async function loadUserData() {
        const sb = getSupabase();
        const { data: { user: authUser } } = await sb.auth.getUser();

        if (!authUser) {
            router.replace('/login');
            return;
        }

        setUser(authUser);
        setLikedCount(JSON.parse(localStorage.getItem('liked_events') || '[]').length);

        const { data: profileData } = await sb
            .from('users')
            .select('*')
            .eq('id', authUser.id)
            .single();
        if (profileData) setProfile(profileData);

        const { data: reviews } = await sb
            .from('reviews')
            .select('*, events(name)')
            .eq('user_id', authUser.id)
            .eq('is_deleted', false)
            .order('created_at', { ascending: false });
        if (reviews) setMyReviews(reviews);

        setLoading(false);
    }

    async function handleLogout() {
        const sb = getSupabase();
        await sb.auth.signOut();
        router.push('/login');
    }

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', background: T.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ color: T.gray }}>로딩 중...</div>
            </div>
        );
    }

    const nickname = profile?.nickname || user?.user_metadata?.nickname || user?.email?.split('@')[0] || '유저';
    const isVerified = profile?.is_verified || false;
    const reviewCount = myReviews.length;

    return (
        <div style={{ minHeight: '100vh', background: T.bg }}>
            <TopBar title="마이페이지" action={
                <div onClick={handleLogout} style={{ fontSize: 13, color: T.gray, cursor: 'pointer' }}>로그아웃</div>
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
                                <span style={{ fontSize: 18, fontWeight: 800, color: T.text }}>{nickname}</span>
                                {isVerified && <Badge text="헤비셀러" />}
                            </div>
                            <div style={{ fontSize: 13, color: T.gray, marginTop: 3 }}>
                                {profile?.role === 'organizer' ? '주최자' : '셀러'}
                                {isVerified ? ' · 헤비셀러 인증' : ''}
                            </div>
                        </div>
                    </div>
                </Card>

                {/* 구독 카드 */}
                <Card style={{ marginBottom: 16, background: `linear-gradient(135deg, #1E3A5F, ${T.blue})`, color: '#fff', border: 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontSize: 12, opacity: 0.7 }}>현재 구독</div>
                            <div style={{ fontSize: 17, fontWeight: 800, marginTop: 2 }}>
                                {profile?.subscription_status === 'active' ? '프리미엄' : '무료 플랜'}
                            </div>
                            <div style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>
                                {profile?.subscription_expires_at
                                    ? `다음 결제 ${new Date(profile.subscription_expires_at).toLocaleDateString('ko-KR')}`
                                    : '구독하면 매출 정보를 볼 수 있어요'}
                            </div>
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
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
                    {[
                        [reviewCount, '작성 리뷰'],
                        [likedCount, '찜한 행사'],
                        [reviewCount >= 3 ? '✅' : `${reviewCount}/3`, '리뷰 미션'],
                    ].map(([v, l]) => (
                        <Card key={l} style={{ textAlign: 'center', padding: 14 }}>
                            <div style={{ fontSize: 22, fontWeight: 800, color: T.blue }}>{v}</div>
                            <div style={{ fontSize: 12, color: T.gray, marginTop: 4 }}>{l}</div>
                        </Card>
                    ))}
                </div>

                {/* 리뷰 3개 프로모션 */}
                <Card style={{ marginBottom: 24, background: T.yellowLt, border: `1px solid #FFE0A0` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>🎁 리뷰 3개 쓰면 1개월 무료!</div>
                            <div style={{ fontSize: 13, color: T.gray, marginTop: 4 }}>
                                현재 작성한 리뷰: <strong style={{ color: T.blue }}>{reviewCount}/3개</strong>
                                {reviewCount >= 3 && ' ✅ 완료!'}
                            </div>
                        </div>
                        {reviewCount < 3 && (
                            <Link href="/reviews/write">
                                <div style={{
                                    padding: '10px 16px', borderRadius: 10, background: T.blue,
                                    fontSize: 13, fontWeight: 700, cursor: 'pointer', color: '#fff',
                                }}>리뷰 쓰기</div>
                            </Link>
                        )}
                    </div>
                </Card>

                {/* 탭 */}
                <div style={{ display: 'flex', borderBottom: `2px solid ${T.border}`, marginBottom: 16 }}>
                    {['내 리뷰', '설정'].map((t) => (
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
                        {myReviews.length === 0 ? (
                            <Card style={{ textAlign: 'center', padding: 40 }}>
                                <div style={{ fontSize: 36, marginBottom: 12 }}>📝</div>
                                <div style={{ fontSize: 15, fontWeight: 700, color: T.text }}>아직 작성한 리뷰가 없어요</div>
                                <Link href="/reviews/write">
                                    <div style={{
                                        marginTop: 16, display: 'inline-block',
                                        background: T.blue, borderRadius: T.radiusMd,
                                        padding: '12px 24px', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer',
                                    }}>첫 리뷰 작성하기</div>
                                </Link>
                            </Card>
                        ) : (
                            myReviews.map((r, i) => (
                                <Card key={i}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>
                                                {r.events?.name || '행사 리뷰'}
                                            </div>
                                            <div style={{ fontSize: 12, color: T.gray, marginTop: 2 }}>
                                                {r.participated_year}.{String(r.participated_month).padStart(2, '0')}
                                                {!r.is_approved && <span style={{ color: T.gray, marginLeft: 6 }}>· 승인 대기</span>}
                                            </div>
                                        </div>
                                        <div style={{ fontSize: 14, fontWeight: 700, color: T.blue }}>★ {r.overall_rating}</div>
                                    </div>
                                </Card>
                            ))
                        )}
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
                        <Card onClick={handleLogout} style={{ cursor: 'pointer' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: 14, color: T.red }}>로그아웃</span>
                                <span style={{ color: T.gray }}>→</span>
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}
