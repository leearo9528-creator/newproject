'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { T } from '@/lib/design-tokens';
import { getSupabase } from '@/lib/supabase';

export default function LoginPage() {
    const router = useRouter();
    const [mode, setMode] = useState('login');
    const [role, setRole] = useState('셀러');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nickname, setNickname] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    async function handleSubmit() {
        if (!email || !password) {
            setError('이메일과 비밀번호를 입력해주세요');
            return;
        }
        setLoading(true);
        setError('');
        const sb = getSupabase();

        if (mode === 'login') {
            const { error: err } = await sb.auth.signInWithPassword({ email, password });
            if (err) {
                setError(err.message === 'Invalid login credentials'
                    ? '이메일 또는 비밀번호가 맞지 않아요' : err.message);
                setLoading(false);
                return;
            }
            router.push('/');
        } else {
            if (!nickname) {
                setError('닉네임을 입력해주세요');
                setLoading(false);
                return;
            }
            const { data, error: err } = await sb.auth.signUp({
                email,
                password,
                options: { data: { nickname, role: role === '셀러' ? 'seller' : 'organizer' } },
            });
            if (err) {
                setError(err.message.includes('already registered')
                    ? '이미 가입된 이메일이에요' : err.message);
                setLoading(false);
                return;
            }
            // users 테이블에 직접 삽입 (auth.users와 별도)
            if (data.user) {
                await sb.from('users').upsert({
                    id: data.user.id,
                    email,
                    nickname,
                    role: role === '셀러' ? 'seller' : 'organizer',
                    provider: 'email',
                }, { onConflict: 'id' });
            }
            router.push('/');
        }
        setLoading(false);
    }

    async function handleSocialLogin(provider) {
        const sb = getSupabase();
        await sb.auth.signInWithOAuth({
            provider,
            options: { redirectTo: `${window.location.origin}/` },
        });
    }

    return (
        <div style={{
            minHeight: '100vh', display: 'flex', flexDirection: 'column',
            justifyContent: 'center', alignItems: 'center', background: T.white, padding: '40px 24px',
        }}>
            <div style={{ width: '100%', maxWidth: 420 }}>
                {/* 로고 */}
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <div style={{ fontSize: 36, fontWeight: 900, color: T.text, letterSpacing: -1 }}>
                        플리 <span style={{ color: T.blue }}>●</span>
                    </div>
                    <div style={{ fontSize: 14, color: T.gray, marginTop: 8 }}>셀러들의 진짜 행사 리뷰</div>
                </div>

                {/* 탭 */}
                <div style={{ display: 'flex', background: T.bg, borderRadius: T.radiusMd, padding: 4, marginBottom: 28 }}>
                    {['login', 'signup'].map((m, i) => (
                        <div key={m} onClick={() => { setMode(m); setError(''); }} style={{
                            flex: 1, textAlign: 'center', padding: '12px 0', borderRadius: 10,
                            fontSize: 14, fontWeight: 700, cursor: 'pointer',
                            background: mode === m ? T.white : 'transparent',
                            color: mode === m ? T.text : T.gray,
                            boxShadow: mode === m ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                            transition: 'all 0.15s',
                        }}>{i === 0 ? '로그인' : '회원가입'}</div>
                    ))}
                </div>

                {/* 에러 */}
                {error && (
                    <div style={{
                        background: T.redLt, color: T.red, borderRadius: T.radiusMd,
                        padding: '10px 14px', fontSize: 13, fontWeight: 600, marginBottom: 16,
                    }}>⚠️ {error}</div>
                )}

                {/* 입력 */}
                <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
                    style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                    <input type="email" placeholder="이메일" value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{
                            background: T.bg, borderRadius: T.radiusMd, padding: '14px 16px',
                            border: `1px solid ${T.border}`, fontSize: 14, width: '100%', boxSizing: 'border-box', outline: 'none',
                        }} />
                    {mode === 'signup' && (
                        <input type="text" placeholder="닉네임" value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            style={{
                                background: T.bg, borderRadius: T.radiusMd, padding: '14px 16px',
                                border: `1px solid ${T.border}`, fontSize: 14, width: '100%', boxSizing: 'border-box', outline: 'none',
                            }} />
                    )}
                    <input type="password" placeholder="비밀번호 (6자 이상)" value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{
                            background: T.bg, borderRadius: T.radiusMd, padding: '14px 16px',
                            border: `1px solid ${T.border}`, fontSize: 14, width: '100%', boxSizing: 'border-box', outline: 'none',
                        }} />

                    {mode === 'signup' && (
                        <div>
                            <div style={{ fontSize: 13, color: T.gray, marginBottom: 10, fontWeight: 600 }}>역할 선택</div>
                            <div style={{ display: 'flex', gap: 10 }}>
                                {[['🛍️ 셀러', '셀러'], ['📢 주최자', '주최자']].map(([label, val]) => (
                                    <div key={val} onClick={() => setRole(val)} style={{
                                        flex: 1, padding: 14, borderRadius: T.radiusMd, textAlign: 'center', cursor: 'pointer',
                                        border: `2px solid ${role === val ? T.blue : T.border}`,
                                        background: role === val ? T.blueLt : T.white,
                                        fontSize: 14, fontWeight: 700, color: role === val ? T.blue : T.gray,
                                        transition: 'all 0.15s',
                                    }}>{label}</div>
                                ))}
                            </div>
                        </div>
                    )}

                    <button type="submit" disabled={loading} style={{
                        background: loading ? T.gray : T.blue, borderRadius: 14, padding: 16,
                        color: T.white, fontSize: 15, fontWeight: 700, cursor: loading ? 'default' : 'pointer',
                        border: 'none', marginTop: 8,
                    }}>
                        {loading ? '처리 중...' : mode === 'login' ? '로그인' : '가입하기'}
                    </button>
                </form>

                {/* 구분선 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                    <div style={{ flex: 1, height: 1, background: T.border }} />
                    <span style={{ fontSize: 12, color: T.gray }}>또는</span>
                    <div style={{ flex: 1, height: 1, background: T.border }} />
                </div>

                {/* 소셜 */}
                <div style={{ display: 'flex', gap: 10 }}>
                    <div onClick={() => handleSocialLogin('kakao')} style={{
                        flex: 1, background: '#FEE500', border: '1px solid #FEE500', borderRadius: T.radiusMd,
                        padding: 14, textAlign: 'center', cursor: 'pointer', fontSize: 14, fontWeight: 700, color: '#3C1E1E',
                    }}>카카오로 시작</div>
                    <div onClick={() => handleSocialLogin('google')} style={{
                        flex: 1, background: T.white, border: `1px solid ${T.border}`, borderRadius: T.radiusMd,
                        padding: 14, textAlign: 'center', cursor: 'pointer', fontSize: 14, fontWeight: 700, color: T.text,
                    }}>구글로 시작</div>
                </div>
            </div>
        </div>
    );
}
