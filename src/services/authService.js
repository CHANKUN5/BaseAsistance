import { supabase, isSupabaseConfigured } from './supabase';

const DEMO_USER = {
    id: 'demo-user-id',
    email: 'demo@example.com',
    user_metadata: { name: 'Totok Michael' }
};

let demoSession = null;

export async function signup(email, password) {
    if (!isSupabaseConfigured()) {
        return {
            data: { user: { ...DEMO_USER, email } },
            error: null
        };
    }

    const { data, error } = await supabase.auth.signUp({
        email,
        password
    });

    return { data, error };
}

export async function login(email, password) {
    if (!isSupabaseConfigured()) {
        demoSession = { user: { ...DEMO_USER, email } };
        return {
            data: { session: demoSession, user: demoSession.user },
            error: null
        };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    return { data, error };
}

export async function logout() {
    if (!isSupabaseConfigured()) {
        demoSession = null;
        return { error: null };
    }

    const { error } = await supabase.auth.signOut();
    return { error };
}

export async function getCurrentUser() {
    if (!isSupabaseConfigured()) {
        return {
            data: { user: demoSession?.user || null },
            error: null
        };
    }

    const { data, error } = await supabase.auth.getUser();
    return { data, error };
}

export async function getSession() {
    if (!isSupabaseConfigured()) {
        return {
            data: { session: demoSession },
            error: null
        };
    }

    const { data, error } = await supabase.auth.getSession();
    return { data, error };
}

export function onAuthStateChange(callback) {
    if (!isSupabaseConfigured()) {
        return {
            data: {
                subscription: {
                    unsubscribe: () => { }
                }
            }
        };
    }

    return supabase.auth.onAuthStateChange(callback);
}

export default {
    signup,
    login,
    logout,
    getCurrentUser,
    getSession,
    onAuthStateChange
};
