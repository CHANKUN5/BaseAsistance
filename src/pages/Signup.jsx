import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button, Input, Alert } from '../components/common';
import './Auth.css';

export default function Signup() {
    const navigate = useNavigate();
    const { signup, isAuthenticated, loading } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState(false);
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
            newErrors.email = 'El correo electrónico es requerido';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Correo electrónico inválido';
        }

        if (!formData.password) {
            newErrors.password = 'La contraseña es requerida';
        } else if (formData.password.length < 6) {
            newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Confirma tu contraseña';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setSubmitError('');
        setSubmitSuccess(false);

        if (!validate()) return;

        setIsSubmitting(true);
        const result = await signup(formData.email, formData.password);
        setIsSubmitting(false);

        if (result.success) {
            setSubmitSuccess(true);
            setTimeout(() => navigate('/login'), 2000);
        } else {
            setSubmitError(result.error || 'Error al crear la cuenta');
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-header">
                    <h1 className="auth-title">Comenzar</h1>
                    <p className="auth-subtitle">Crea tu cuenta y gestiona tu tiempo de trabajo</p>
                </div>

                {submitError && (
                    <Alert
                        type="error"
                        message={submitError}
                        onClose={() => setSubmitError('')}
                    />
                )}

                {submitSuccess && (
                    <Alert
                        type="success"
                        message="¡Cuenta creada exitosamente! Redirigiendo al inicio de sesión..."
                    />
                )}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Correo Electrónico"
                        error={errors.email}
                        autoComplete="email"
                        required
                    />

                    <Input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Contraseña"
                        error={errors.password}
                        autoComplete="new-password"
                        required
                    />

                    <Input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirmar Contraseña"
                        error={errors.confirmPassword}
                        autoComplete="new-password"
                        required
                    />

                    <Button
                        type="submit"
                        fullWidth
                        loading={isSubmitting || loading}
                        disabled={submitSuccess}
                    >
                        Crear Cuenta
                    </Button>
                </form>

                <p className="auth-footer">
                    ¿Ya tienes cuenta?{' '}
                    <Link to="/login" className="auth-link">Inicia sesión</Link>
                </p>
            </div>
        </div>
    );
}
