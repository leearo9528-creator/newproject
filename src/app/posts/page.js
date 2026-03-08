'use client';

import { useState, useEffect } from 'react';
import { T } from '@/lib/design-tokens';
import { getSupabase } from '@/lib/supabase';
import TopBar from '@/components/ui/TopBar';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

export default function PostListPage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('전체');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchPosts();
    }, [filter]);

    async function fetchPosts() {
        setLoading(true);
        setError('');
        const sb = getSupabase();
        let query = sb
            .from('posts')
            .select('*')
            .eq('is_approved', true)
            .eq('is_deleted', false)
            .order('created_at', { ascending: false });

        if (filter === '모집중') query = query.eq('is_closed', false);
        if (filter === '플리마켓') query = query.eq('recruitment_type', '플리마켓');
        if (filter === '푸드트럭') query = query.eq('recruitment_type', '푸드트럭');

        const { data, error } = await query.limit(20);
        if (error) {
            setError('공고 목록을 불러오지 못했어요. 잠시 후 다시 시도해주세요.');
        } else if (data) {
            setPosts(data);
        }
        setLoading(false);
    }

    return (
        <div style={{ minHeight: '100vh', background: T.bg }}>
            <TopBar title="공고" subtitle="📋 셀러 모집 공고" />

            <div className="page-padding">
                <div className="filter-chips">
                    {['전체', '모집중', '플리마켓', '푸드트럭'].map((f) => (
                        <span key={f} className={`filter-chip ${filter === f ? 'active' : ''}`}
                            onClick={() => setFilter(f)}>{f}</span>
                    ))}
                </div>

                {error && (
                    <div style={{
                        background: '#FFF0F0', color: '#E53E3E', borderRadius: 10,
                        padding: '12px 16px', fontSize: 13, fontWeight: 600, marginBottom: 16,
                    }}>⚠️ {error}</div>
                )}

                <div style={{ fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 16 }}>
                    {loading ? '로딩 중...' : (
                        <>전체 공고 <span style={{ color: T.blue }}>{posts.length}</span></>
                    )}
                </div>

                {loading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {[1, 2, 3].map((i) => (
                            <div key={i} style={{
                                background: T.white, borderRadius: T.radiusLg, padding: 20,
                                border: `1px solid ${T.border}`, height: 120,
                            }}>
                                <div style={{ background: T.grayLt, borderRadius: 8, height: 16, width: '50%', marginBottom: 10 }} />
                                <div style={{ background: T.grayLt, borderRadius: 8, height: 12, width: '70%' }} />
                            </div>
                        ))}
                    </div>
                ) : posts.length === 0 ? (
                    <Card style={{ textAlign: 'center', padding: 40 }}>
                        <div style={{ fontSize: 36, marginBottom: 12 }}>📋</div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: T.text }}>등록된 공고가 없어요</div>
                    </Card>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {posts.map((post) => {
                            const isExpired = post.deadline && new Date(post.deadline) < new Date();
                            const status = post.is_closed || isExpired ? '마감' : '모집중';
                            return (
                                <Card key={post.id} className="animate-fade-in">
                                    <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                                        <Badge text={post.recruitment_type} />
                                        <Badge text={status} />
                                    </div>
                                    <div style={{ fontSize: 16, fontWeight: 700, color: T.text, marginBottom: 6 }}>
                                        {post.title}
                                    </div>
                                    <div style={{ fontSize: 13, color: T.gray, marginBottom: 12 }}>
                                        {post.location_sido} {post.location_sigungu}
                                    </div>
                                    <div style={{
                                        display: 'flex', gap: 16, fontSize: 13, color: T.textSub,
                                        paddingTop: 12, borderTop: `1px solid ${T.border}`,
                                    }}>
                                        {post.deadline && <span>📅 마감 {post.deadline}</span>}
                                        {post.recruit_count && <span>👥 {post.recruit_count}팀</span>}
                                        <span>💰 {post.is_paid ? post.fee || '유료' : '무료'}</span>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
