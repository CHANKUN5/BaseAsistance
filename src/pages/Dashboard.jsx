import { useState, useEffect } from 'react';
import { Layout } from '../components/layout';
import {
    StatsCard,
    ProjectAnalytics,
    TimeTracker,
    ProjectProgress,
    TeamCollaboration
} from '../components/dashboard';
import { Button, Card, CardContent, CardHeader } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import * as metricasService from '../services/metricasService';

const PROJECTS = [
    { id: 1, name: 'Develop API Endpoints', dueDate: 'Nov 26, 2024', icon: '🔷' },
    { id: 2, name: 'Onboarding Flow', dueDate: 'Nov 28, 2024', icon: '🔶' },
    { id: 3, name: 'Build Dashboard', dueDate: 'Nov 30, 2024', icon: '🔷' },
    { id: 4, name: 'Optimize Page Load', dueDate: 'Dec 5, 2024', icon: '🟢' },
    { id: 5, name: 'Cross-Browser Testing', dueDate: 'Dec 6, 2024', icon: '🟣' }
];

const PlusIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

export default function Dashboard() {
    const { user } = useAuth();
    const [metricas, setMetricas] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadMetricas();
    }, [user]);

    const loadMetricas = async () => {
        if (!user) return;

        setLoading(true);
        try {
            const { data } = await metricasService.getAllMetricas(user.id);
            setMetricas(data);
        } catch (error) {
            console.error('Error loading metrics:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN'
        }).format(value);
    };

    const getStatsData = () => {
        if (!metricas) return [];

        return [
            {
                id: 'ingresos',
                title: 'Ingresos Totales',
                value: formatCurrency(metricas.ingresos),
                subtitle: 'Increased from last month',
                variant: 'highlight',
                trend: { type: 'up', icon: '📈' }
            },
            {
                id: 'costos',
                title: 'Costos Totales',
                value: formatCurrency(metricas.costos),
                subtitle: 'Inventory costs',
                variant: 'default',
                trend: { type: 'down', icon: '📉' }
            },
            {
                id: 'clientes',
                title: 'Clientes',
                value: `${metricas.clientes.nuevos} nuevos / ${metricas.clientes.recurrentes} recurrentes`,
                subtitle: 'Client distribution',
                variant: 'default',
                trend: { type: 'up', icon: '👥' }
            },
            {
                id: 'utilidad',
                title: 'Utilidad Neta',
                value: `${formatCurrency(metricas.utilidad.valor)} (${metricas.utilidad.porcentaje.toFixed(1)}%)`,
                subtitle: 'Net profit margin',
                variant: metricas.utilidad.valor > 0 ? 'success' : 'danger',
                trend: metricas.utilidad.valor > 0 ? { type: 'up', icon: '💰' } : { type: 'down', icon: '📉' }
            }
        ];
    };

    return (
        <Layout
            title="Dashboard"
            subtitle="Plan, prioritize, and accomplish your tasks with ease."
        >
            <div className="flex flex-col sm:flex-row justify-end gap-3 mb-8">
                <Button variant="primary" icon={<PlusIcon />}>
                    Add Project
                </Button>
                <Button variant="secondary">
                    Import Data
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {loading ? (
                    [...Array(4)].map((_, i) => (
                        <div key={i} className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-3 animate-pulse">
                            <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                            <div className="h-8 bg-slate-200 rounded w-4/5"></div>
                            <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                        </div>
                    ))
                ) : (
                    getStatsData().map((stat) => (
                        <StatsCard
                            key={stat.id}
                            title={stat.title}
                            value={stat.value}
                            subtitle={stat.subtitle}
                            variant={stat.variant}
                            trend={stat.trend}
                        />
                    ))
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7 flex flex-col gap-6">
                    <ProjectAnalytics flujoData={metricas?.flujo} />
                    <TeamCollaboration />
                </div>

                <div className="lg:col-span-5 flex flex-col gap-6">
                    <Card>
                        <CardContent className="p-6">
                            <h3 className="text-base font-semibold text-slate-900 mb-4">Reminders</h3>
                            <div className="text-center py-2">
                                <h4 className="text-lg font-semibold text-slate-900 mb-1">Meeting with Arc Company</h4>
                                <p className="text-sm text-slate-500 mb-4">Time: 02:00 pm - 04:00 pm</p>
                                <Button variant="primary" className="w-full">
                                    📹 Start Meeting
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <ProjectProgress />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
                <div className="lg:col-span-8">
                    <Card className="h-full">
                        <CardHeader title="Project">
                            <Button variant="secondary" size="sm" icon={<PlusIcon />}>
                                New
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <ul className="flex flex-col gap-3">
                                {PROJECTS.map((project) => (
                                    <li key={project.id} className="flex items-center gap-3 py-2">
                                        <span className="text-xl">{project.icon}</span>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-slate-900">{project.name}</span>
                                            <span className="text-xs text-slate-500">Due date: {project.dueDate}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-4">
                    <TimeTracker />
                </div>
            </div>
        </Layout>
    );
}
