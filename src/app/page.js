'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { T } from '@/lib/design-tokens';
import { getSupabase } from '@/lib/supabase';
import TopBar from '@/components/ui/TopBar';
import EventCard from '@/components/EventCard';

const FILTERS = ['전체', '플리마켓', '푸드트럭', '서울', '경기', '모집중'];

export default function HomePage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('전체');

  useEffect(() => {
    fetchEvents();
  }, [activeFilter]);

  async function fetchEvents() {
    setLoading(true);
    const sb = getSupabase();
    let query = sb
      .from('events')
      .select('*')
      .eq('is_approved', true)
      .eq('is_deleted', false)
      .order('created_at', { ascending: false });

    // 필터 적용
    if (activeFilter === '플리마켓') {
      query = query.eq('recruitment_type', '플리마켓');
    } else if (activeFilter === '푸드트럭') {
      query = query.eq('recruitment_type', '푸드트럭');
    } else if (activeFilter === '서울') {
      query = query.eq('location_sido', '서울');
    } else if (activeFilter === '경기') {
      query = query.eq('location_sido', '경기');
    } else if (activeFilter === '모집중') {
      query = query.eq('status', '모집중');
    }

    const { data, error } = await query.limit(20);
    if (!error && data) setEvents(data);
    setLoading(false);
  }

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
    <>
      <TopBar
        title="어떤 행사 찾으세요?"
        subtitle="안녕하세요 👋"
        action={
          <div style={{ display: 'flex', gap: 10 }}>
            <div
              style={{
                background: T.bg,
                borderRadius: T.radiusMd,
                padding: '10px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                border: `1px solid ${T.border}`,
                width: 260,
                cursor: 'pointer',
              }}
            >
              <span style={{ fontSize: 15 }}>🔍</span>
              <span style={{ fontSize: 14, color: '#C4C9D1' }}>
                행사명, 지역으로 검색
              </span>
            </div>
            <Link href="/events/register">
              <div
                style={{
                  background: T.blue,
                  borderRadius: T.radiusMd,
                  padding: '10px 18px',
                  fontSize: 14,
                  fontWeight: 700,
                  color: '#fff',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                + 행사 제보
              </div>
            </Link>
          </div>
        }
      />

      <div className="page-padding">
        {/* 프로모션 배너 */}
        <div
          className="animate-fade-in"
          style={{
            background: `linear-gradient(135deg, #1E3A5F, ${T.blue})`,
            borderRadius: T.radiusXl,
            padding: '28px 32px',
            marginBottom: 28,
            color: '#fff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <div>
            <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 6 }}>
              리뷰 3개 작성하면
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.5 }}>
              1개월 무료 구독 🎁
            </div>
            <div style={{ fontSize: 13, opacity: 0.8, marginTop: 6 }}>
              진짜 셀러들의 매출 정보를 확인해보세요
            </div>
          </div>
          <Link href="/reviews/write">
            <div
              style={{
                background: 'rgba(255,255,255,0.15)',
                borderRadius: 14,
                padding: '14px 24px',
                fontSize: 14,
                fontWeight: 700,
                cursor: 'pointer',
                border: '1px solid rgba(255,255,255,0.3)',
                whiteSpace: 'nowrap',
                color: '#fff',
              }}
            >
              지금 리뷰 쓰기 →
            </div>
          </Link>
        </div>

        {/* 필터 칩 */}
        <div className="filter-chips">
          {FILTERS.map((f) => (
            <span
              key={f}
              className={`filter-chip ${activeFilter === f ? 'active' : ''}`}
              onClick={() => setActiveFilter(f)}
            >
              {f}
            </span>
          ))}
        </div>

        {/* 행사 수 */}
        <div style={{ fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 16 }}>
          {loading ? '로딩 중...' : (
            <>최근 등록된 행사 <span style={{ color: T.blue }}>{events.length}</span></>
          )}
        </div>

        {/* 행사 카드 그리드 */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }} className="grid-events">
            {[1, 2, 3].map((i) => (
              <div key={i} style={{
                background: T.white, borderRadius: T.radiusLg, padding: 20,
                border: `1px solid ${T.border}`, height: 280,
                animation: 'pulse 1.5s infinite',
              }}>
                <div style={{ background: T.grayLt, borderRadius: 12, height: 140, marginBottom: 14 }} />
                <div style={{ background: T.grayLt, borderRadius: 8, height: 16, width: '60%', marginBottom: 8 }} />
                <div style={{ background: T.grayLt, borderRadius: 8, height: 12, width: '40%' }} />
              </div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60, color: T.gray }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🎪</div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>등록된 행사가 없어요</div>
            <div style={{ fontSize: 14, marginTop: 8 }}>행사를 제보해주세요!</div>
          </div>
        ) : (
          <div className="grid-events">
            {events.map((e) => (
              <EventCard
                key={e.id}
                name={e.name}
                location={`${e.location_sido || ''} ${e.location_sigungu || ''}`}
                date={formatDate(e.date_start, e.date_end)}
                rating={e.avg_rating || '0.0'}
                reviewCount={e.review_count || 0}
                badge={e.recruitment_type}
                isPaid={e.is_paid}
                locked={false}
                onClick={() => window.location.href = `/events/${e.id}`}
              />
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </>
  );
}
