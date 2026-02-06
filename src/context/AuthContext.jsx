import { createContext, useContext, useState, useEffect } from 'react';
import * as authService from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        initializeAuth();

        const { data } = authService.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN') {
                setUser(session?.user || null);
            } else if (event === 'SIGNED_OUT') {
                setUser(null);
            }
        });

        return () => {
            data?.subscription?.unsubscribe();
        };
    }, []);

    async function initializeAuth() {
        try {
            const { data, error } = await authService.getSession();
            if (error) throw error;
            setUser(data?.session?.user || null);
        } catch (err) {
            console.error('Auth initialization error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function signup(email, password) {
        setLoading(true);
        setError(null);
        try {
            const { data, error } = await authService.signup(email, password);
            if (error) throw error;
            return { success: true, data };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }

    function translateError(errorMessage) {
        const translations = {
            'Invalid login credentials': 'Credenciales de acceso inválidas',
            'Email not confirmed': 'El correo electrónico no ha sido confirmado',
            'User not found': 'Usuario no encontrado',
            'Invalid password': 'Contraseña incorrecta',
            'Too many requests': 'Demasiados intentos. Por favor, espera un momento',
            'Network error': 'Error de conexión. Verifica tu internet',
        };

        for (const [english, spanish] of Object.entries(translations)) {
            if (errorMessage.includes(english)) {
                return spanish;
            }
        }
        return 'Error al iniciar sesión. Verifica tus credenciales';
    }

    async function login(email, password) {
        setLoading(true);
        setError(null);
        try {
            const { data, error } = await authService.login(email, password);
            if (error) throw error;
            setUser(data?.user || null);
            return { success: true, data };
        } catch (err) {
            const translatedError = translateError(err.message);
            setError(translatedError);
            return { success: false, error: translatedError };
        } finally {
            setLoading(false);
        }
    }

    async function logout() {
        setLoading(true);
        try {
            const { error } = await authService.logout();
            if (error) throw error;
            setUser(null);
            return { success: true };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }

    const value = {
        user,
        loading,
        error,
        isAuthenticated: !!user,
        signup,
        login,
        logout,
        clearError: () => setError(null)
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export default AuthContext;
