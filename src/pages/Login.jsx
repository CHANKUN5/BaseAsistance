import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button, Input, Alert } from '../components/common';
import './Auth.css';

export default function Login() {
    const navigate = useNavigate();
    const { login, isAuthenticated, loading } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    function handleChange(e) {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    }

    function validate() {
        const newErrors = {};

        if (!formData.email) {
            newErrors.email = 'El email es requerido';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email inválido';
        }

        if (!formData.password) {
            newErrors.password = 'La contraseña es requerida';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setSubmitError('');

        if (!validate()) return;

        setIsSubmitting(true);
        const result = await login(formData.email, formData.password);
        setIsSubmitting(false);

        if (result.success) {
            navigate('/dashboard');
        } else {
            setSubmitError(result.error || 'Credenciales incorrectas');
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-header">
                    <div className="auth-logo">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <circle cx="12" cy="12" r="10" opacity="0.2" />
                            <circle cx="12" cy="12" r="6" />
                        </svg>
                        <span>Donezo</span>
                    </div>
                    <h1 className="auth-title">Iniciar Sesión</h1>
                    <p className="auth-subtitle">Ingresa tus credenciales para continuar</p>
                </div>

                {submitError && (
                    <Alert
                        type="error"
                        message={submitError}
                        onClose={() => setSubmitError('')}
                    />
                )}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <Input
                        label="Email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="tu@email.com"
                        error={errors.email}
                        autoComplete="email"
                        required
                    />

                    <Input
                        label="Contraseña"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        error={errors.password}
                        autoComplete="current-password"
                        required
                    />

                    <Button
                        type="submit"
                        fullWidth
                        loading={isSubmitting || loading}
                    >
                        Iniciar Sesión
                    </Button>
                </form>

                <p className="auth-footer">
                    ¿No tienes cuenta?{' '}
                    <Link to="/signup" className="auth-link">Regístrate aquí</Link>
                </p>
            </div>
        </div>
    );
}
