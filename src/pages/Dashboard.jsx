import { useState, useEffect } from 'react';
import { Layout } from '../components/layout';
import {
    StatsCard,
    ProjectAnalytics,
    TimeTracker,
    ProjectProgress,
    TeamCollaboration,
    ReminderCard,
    ProjectList
} from '../components/dashboard';
import { Button } from '../ui';
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
                subtitle: '↑ 12% vs mes anterior',
                variant: 'highlight',
                trend: { type: 'up', icon: '📈' }
            },
            {
                id: 'costos',
                title: 'Costos Totales',
                value: formatCurrency(metricas.costos),
                subtitle: 'Bajo presupuesto',
                variant: 'default',
                trend: { type: 'down', icon: '📉' }
            },
            {
                id: 'clientes',
                title: 'Clientes',
                value: `${metricas.clientes.nuevos + metricas.clientes.recurrentes}`,
                subtitle: `${metricas.clientes.nuevos} nuevos este mes`,
                variant: 'default',
                trend: { type: 'up', icon: '👥' }
            },
            {
                id: 'utilidad',
                title: 'Utilidad Neta',
                value: `${formatCurrency(metricas.utilidad.valor)}`,
                subtitle: `Margen: ${metricas.utilidad.porcentaje.toFixed(1)}%`,
                variant: metricas.utilidad.valor > 0 ? 'success' : 'danger',
                trend: metricas.utilidad.valor > 0 ? { type: 'up', icon: '💰' } : { type: 'down', icon: '📉' }
            }
        ];
    };

    return (
        <Layout
            title="Dashboard Overview"
            subtitle="Bienvenido de nuevo. Aquí tienes un resumen de tus operaciones."
        >
            <div className="flex flex-col sm:flex-row justify-end gap-3 mb-8">
                <Button variant="secondary" className="bg-white border-slate-200">
                    Exportar Reporte
                </Button>
                <Button variant="primary" icon={<PlusIcon />}>
                    Nuevo Proyecto
                </Button>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {loading ? (
                    [...Array(4)].map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 h-32 animate-pulse">
                            <div className="h-4 bg-slate-100 rounded w-1/2 mb-4"></div>
                            <div className="h-8 bg-slate-100 rounded w-3/4"></div>
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

            {/* Secondary Grid Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                {/* Left Column: Main Content */}
                <div className="lg:col-span-8 space-y-8 flex flex-col">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 grow">
                        <div className="md:col-span-1">
                            <ProjectAnalytics flujoData={metricas?.flujo} />
                        </div>
                        <div className="md:col-span-1">
                            <TeamCollaboration />
                        </div>
                    </div>

                    <div className="grow">
                        <ProjectList projects={PROJECTS} />
                    </div>
                </div>

                {/* Right Column: Side Widgets */}
                <div className="lg:col-span-4 space-y-8 flex flex-col">
                    <div className="grow">
                        <TimeTracker />
                    </div>

                    <div className="grow">
                        <ReminderCard />
                    </div>

                    <div className="grow">
                        <ProjectProgress />
                    </div>
                </div>
            </div>
        </Layout>
    );
}
