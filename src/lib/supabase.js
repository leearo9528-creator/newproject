import { createClient } from '@supabase/supabase-js';

// 브라우저 클라이언트 (싱글턴)
let supabase = null;

export function getSupabase() {
    if (supabase) return supabase;
    supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    return supabase;
}

// 서버사이드용 (API Routes, Server Components)
export function createServerSupabase() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
}
