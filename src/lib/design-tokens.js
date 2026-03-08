// ═══════════════════════════════════════════
// 플리(Fli) 디자인 토큰 — 토스 스타일 기반
// ═══════════════════════════════════════════

export const T = {
    // Primary
    blue: '#3182F6',
    blueDark: '#1B64DA',
    blueLt: '#EBF3FF',

    // Status
    green: '#00C471',
    greenLt: '#E6F7F0',
    red: '#F04452',
    redLt: '#FEE8EA',
    yellow: '#FF9500',
    yellowLt: '#FFF3E0',

    // Neutral
    text: '#191F28',
    textSub: '#4E5968',
    gray: '#8B95A1',
    grayLt: '#F2F4F6',
    bg: '#F5F6F8',
    border: '#E5E8EB',
    white: '#FFFFFF',

    // Layout
    sidebarW: 240,

    // Radius
    radiusSm: 8,
    radiusMd: 12,
    radiusLg: 16,
    radiusXl: 20,
    radiusFull: 9999,

    // Shadows
    shadowSm: '0 1px 3px rgba(0,0,0,0.06)',
    shadowMd: '0 4px 12px rgba(0,0,0,0.08)',
    shadowLg: '0 8px 24px rgba(0,0,0,0.12)',
};

// 매출 구간 데이터
export const REVENUE_RANGES = {
    seller: [
        '0~10만', '10~30만', '30~50만', '50~70만',
        '70~100만', '100~150만', '150~200만', '200만+'
    ],
    foodtruck: [
        '0~20만', '20~50만', '50~100만', '100~150만',
        '150~200만', '200~300만', '300만+'
    ],
};

// 필터 옵션
export const FILTERS = {
    recruitmentType: ['전체', '플리마켓', '푸드트럭'],
    region: ['서울', '경기', '인천', '부산', '대구', '광주', '대전', '울산', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주'],
    status: ['모집중', '모집마감', '종료'],
    boothCategory: ['의류', '액세서리', '푸드', '음료', '핸드메이드', '그림·아트', '향수·캔들', '빈티지', '기타'],
    ageGroup: ['10대', '20-30대', '30-40대', '40-50대', '전 연령'],
    buyPower: ['낮음', '보통', '높음'],
};
