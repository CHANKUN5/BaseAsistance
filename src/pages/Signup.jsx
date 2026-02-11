import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button, Input, Card, CardContent } from '../components/ui';

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
            newErrors.email = 'El email es requerido';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email inválido';
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
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4 text-white shadow-lg shadow-blue-200">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-7 h-7">
                            <circle cx="12" cy="12" r="10" className="opacity-25" stroke="none" fill="currentColor" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">Crear cuenta</h1>
                    <p className="text-slate-500 mt-2">Únete para gestionar tus proyectos</p>
                </div>

                <Card className="shadow-lg border-0 ring-1 ring-slate-900/5">
                    <CardContent className="p-8">
                        {submitError && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3">
                                <svg className="w-5 h-5 text-red-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-sm text-red-600">{submitError}</p>
                            </div>
                        )}

                        {submitSuccess && (
                            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-lg flex items-start gap-3">
                                <svg className="w-5 h-5 text-emerald-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                                <p className="text-sm text-emerald-600">¡Cuenta creada exitosamente! Redirigiendo...</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-700 block">Email</label>
                                <Input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="ejemplo@correo.com"
                                    error={errors.email}
                                    autoComplete="email"
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-700 block">Contraseña</label>
                                <Input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Mínimo 6 caracteres"
                                    error={errors.password}
                                    autoComplete="new-password"
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-700 block">Confirmar Contraseña</label>
                                <Input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Repite tu contraseña"
                                    error={errors.confirmPassword}
                                    autoComplete="new-password"
                                    required
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                size="lg"
                                isLoading={isSubmitting || loading}
                                disabled={submitSuccess}
                            >
                                Crear Cuenta
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <p className="text-center mt-8 text-sm text-slate-500">
                    ¿Ya tienes una cuenta?{' '}
                    <Link to="/login" className="font-medium text-blue-600 hover:text-blue-700 transition-colors">
                        Inicia sesión
                    </Link>
                </p>
            </div>
        </div>
    );
}
