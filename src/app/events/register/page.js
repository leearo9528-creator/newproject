'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { T, FILTERS } from '@/lib/design-tokens';
import { getSupabase } from '@/lib/supabase';
import TopBar from '@/components/ui/TopBar';
import Card from '@/components/ui/Card';

export default function EventRegisterPage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [organizer, setOrganizer] = useState('');
    const [recruitmentType, setRecruitmentType] = useState('플리마켓');
    const [locationSido, setLocationSido] = useState('');
    const [locationSigungu, setLocationSigungu] = useState('');
    const [dateStart, setDateStart] = useState('');
    const [dateEnd, setDateEnd] = useState('');
    const [isIndoor, setIsIndoor] = useState(false);
    const [isPaid, setIsPaid] = useState(false);
    const [description, setDescription] = useState('');
    const [sourceUrl, setSourceUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

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
        if (!name.trim()) {
            setError('행사명을 입력해주세요');
            return;
        }
        if (!locationSido) {
            setError('지역(시/도)을 선택해주세요');
            return;
        }
        if (!dateStart) {
            setError('시작일을 입력해주세요');
            return;
        }

        setLoading(true);
        setError('');

        const sb = getSupabase();
        const { error: err } = await sb.from('events').insert({
            name: name.trim(),
            organizer: organizer.trim() || null,
            recruitment_type: recruitmentType,
            location_sido: locationSido,
            location_sigungu: locationSigungu.trim() || null,
            date_start: dateStart,
            date_end: dateEnd || null,
            is_indoor: isIndoor,
            is_paid: isPaid,
            description: description.trim() || null,
            source_url: sourceUrl.trim() || null,
            source: 'user',
            status: '모집중',
            is_approved: false,
            is_deleted: false,
        });

        setLoading(false);

        if (err) {
            setError('제보 등록 중 오류가 발생했어요. 다시 시도해주세요.');
            return;
        }

        setSubmitted(true);
    }

    if (submitted) {
        return (
            <div style={{ minHeight: '100vh', background: T.bg }}>
                <TopBar title="행사 제보" hasBack onBack={() => router.push('/')} />
                <div className="page-padding" style={{ textAlign: 'center', paddingTop: 80 }}>
                    <div style={{ fontSize: 64, marginBottom: 20 }}>🎉</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: T.text, marginBottom: 8 }}>
                        제보해주셔서 감사해요!
                    </div>
                    <div style={{ fontSize: 14, color: T.gray, marginBottom: 32 }}>
                        관리자 검토 후 승인되면 행사 목록에 등록돼요.
                    </div>
                    <div
                        onClick={() => router.push('/')}
                        style={{
                            display: 'inline-block',
                            background: T.blue, borderRadius: T.radiusMd,
                            padding: '14px 32px', color: '#fff', fontSize: 15,
                            fontWeight: 700, cursor: 'pointer',
                        }}
                    >
                        홈으로 돌아가기
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: T.bg }}>
            <TopBar
                title="행사 제보"
                subtitle="📢 새로운 행사를 알려주세요"
                hasBack
                onBack={() => router.back()}
                action={
                    <div style={{ display: 'flex', gap: 8 }}>
                        <button
                            onClick={() => router.back()}
                            style={{
                                padding: '10px 18px', borderRadius: T.radiusMd,
                                border: `1px solid ${T.border}`, fontSize: 14,
                                fontWeight: 600, color: T.gray, cursor: 'pointer', background: T.bg,
                            }}
                        >
                            취소
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            style={{
                                padding: '10px 20px', borderRadius: T.radiusMd,
                                background: loading ? T.gray : T.blue, fontSize: 14,
                                fontWeight: 700, color: '#fff', cursor: loading ? 'default' : 'pointer',
                                border: 'none',
                            }}
                        >
                            {loading ? '등록 중...' : '제보하기'}
                        </button>
                    </div>
                }
            />

            <div className="page-padding" style={{ maxWidth: 720, margin: '0 auto' }}>
                {error && (
                    <div style={{
                        background: T.redLt, color: T.red, borderRadius: T.radiusMd,
                        padding: '10px 14px', fontSize: 13, fontWeight: 600, marginBottom: 16,
                    }}>⚠️ {error}</div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {/* 행사 기본 정보 */}
                    <Card>
                        <div style={{ fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 14 }}>행사 기본 정보</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="행사명 *"
                                style={inputStyle(name)}
                            />
                            <input
                                value={organizer}
                                onChange={(e) => setOrganizer(e.target.value)}
                                placeholder="주최자 / 주최 단체 (선택)"
                                style={inputStyle(organizer)}
                            />
                        </div>
                    </Card>

                    {/* 모집 유형 */}
                    <Card>
                        <div style={{ fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 14 }}>모집 유형</div>
                        <div style={{ display: 'flex', gap: 10 }}>
                            {['플리마켓', '푸드트럭'].map((v) => (
                                <div
                                    key={v}
                                    onClick={() => setRecruitmentType(v)}
                                    style={{
                                        flex: 1, padding: 14, borderRadius: T.radiusMd, cursor: 'pointer',
                                        border: `2px solid ${recruitmentType === v ? T.blue : T.border}`,
                                        background: recruitmentType === v ? T.blueLt : T.white,
                                        textAlign: 'center', fontSize: 14, fontWeight: 700,
                                        color: recruitmentType === v ? T.blue : T.gray, transition: 'all 0.15s',
                                    }}
                                >
                                    {v === '플리마켓' ? '🛍️ 플리마켓' : '🍔 푸드트럭'}
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* 위치 */}
                    <Card>
                        <div style={{ fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 14 }}>위치</div>
                        <div style={{ display: 'flex', gap: 10 }}>
                            <select
                                value={locationSido}
                                onChange={(e) => setLocationSido(e.target.value)}
                                style={{ ...inputStyle(locationSido), flex: 1 }}
                            >
                                <option value="">시/도 선택 *</option>
                                {FILTERS.region.map((r) => (
                                    <option key={r} value={r}>{r}</option>
                                ))}
                            </select>
                            <input
                                value={locationSigungu}
                                onChange={(e) => setLocationSigungu(e.target.value)}
                                placeholder="시/군/구 (선택)"
                                style={{ ...inputStyle(locationSigungu), flex: 1 }}
                            />
                        </div>
                    </Card>

                    {/* 일정 */}
                    <Card>
                        <div style={{ fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 14 }}>행사 일정</div>
                        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                            <input
                                type="date"
                                value={dateStart}
                                onChange={(e) => setDateStart(e.target.value)}
                                style={{ ...inputStyle(dateStart), flex: 1 }}
                            />
                            <span style={{ color: T.gray, fontSize: 13, whiteSpace: 'nowrap' }}>~</span>
                            <input
                                type="date"
                                value={dateEnd}
                                onChange={(e) => setDateEnd(e.target.value)}
                                style={{ ...inputStyle(dateEnd), flex: 1 }}
                            />
                        </div>
                    </Card>

                    {/* 환경 & 참가비 */}
                    <Card>
                        <div style={{ fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 14 }}>행사 환경</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            <div>
                                <div style={{ fontSize: 13, color: T.gray, marginBottom: 8, fontWeight: 600 }}>실내/실외</div>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    {[[false, '🌤️ 실외'], [true, '🏠 실내']].map(([v, l]) => (
                                        <div
                                            key={String(v)}
                                            onClick={() => setIsIndoor(v)}
                                            style={{
                                                flex: 1, padding: 10, borderRadius: 10, cursor: 'pointer', textAlign: 'center',
                                                fontSize: 13, fontWeight: 600,
                                                border: `2px solid ${isIndoor === v ? T.blue : T.border}`,
                                                background: isIndoor === v ? T.blueLt : T.white,
                                                color: isIndoor === v ? T.blue : T.gray, transition: 'all 0.15s',
                                            }}
                                        >{l}</div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <div style={{ fontSize: 13, color: T.gray, marginBottom: 8, fontWeight: 600 }}>참가비</div>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    {[[false, '무료'], [true, '유료']].map(([v, l]) => (
                                        <div
                                            key={String(v)}
                                            onClick={() => setIsPaid(v)}
                                            style={{
                                                flex: 1, padding: 10, borderRadius: 10, cursor: 'pointer', textAlign: 'center',
                                                fontSize: 13, fontWeight: 600,
                                                border: `2px solid ${isPaid === v ? T.blue : T.border}`,
                                                background: isPaid === v ? T.blueLt : T.white,
                                                color: isPaid === v ? T.blue : T.gray, transition: 'all 0.15s',
                                            }}
                                        >{l}</div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* 추가 정보 */}
                    <Card>
                        <div style={{ fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 14 }}>추가 정보 (선택)</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="행사 설명이나 특이사항을 자유롭게 작성해주세요"
                                rows={4}
                                style={{ ...inputStyle(description), resize: 'none', fontFamily: 'inherit' }}
                            />
                            <input
                                value={sourceUrl}
                                onChange={(e) => setSourceUrl(e.target.value)}
                                placeholder="행사 관련 링크 (SNS, 홈페이지 등)"
                                style={inputStyle(sourceUrl)}
                            />
                        </div>
                    </Card>

                    {/* 안내 */}
                    <div style={{
                        background: T.blueLt, borderRadius: T.radiusMd,
                        padding: '14px 16px', fontSize: 13, color: T.blue,
                    }}>
                        💡 제보하신 행사는 관리자 검토 후 승인되어 목록에 표시됩니다.
                    </div>

                    <div
                        onClick={handleSubmit}
                        style={{
                            background: loading ? T.gray : T.blue, borderRadius: 14,
                            padding: 16, textAlign: 'center',
                            color: '#fff', fontSize: 16, fontWeight: 700,
                            cursor: loading ? 'default' : 'pointer',
                            marginBottom: 24,
                        }}
                    >
                        {loading ? '등록 중...' : '행사 제보하기'}
                    </div>
                </div>
            </div>
        </div>
    );
}
