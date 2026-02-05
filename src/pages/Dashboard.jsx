import { useState, useEffect } from 'react';
import { Layout } from '../components/layout';
import {
    StatsCard,
    ProjectAnalytics,
    TimeTracker,
    ProjectProgress,
    TeamCollaboration
} from '../components/dashboard';
import { Button } from '../components/common';
import { useAuth } from '../context/AuthContext';
import * as metricasService from '../services/metricasService';
import './Dashboard.css';

const PROJECTS = [
    { id: 1, name: 'Develop API Endpoints', dueDate: 'Nov 26, 2024', icon: '🔷' },
    { id: 2, name: 'Onboarding Flow', dueDate: 'Nov 28, 2024', icon: '🔶' },
    { id: 3, name: 'Build Dashboard', dueDate: 'Nov 30, 2024', icon: '🔷' },
    { id: 4, name: 'Optimize Page Load', dueDate: 'Dec 5, 2024', icon: '🟢' },
    { id: 5, name: 'Cross-Browser Testing', dueDate: 'Dec 6, 2024', icon: '🟣' }
];

const PlusIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
            <div className="dashboard__actions">
                <Button variant="primary" icon={<PlusIcon />}>
                    Add Project
                </Button>
                <Button variant="secondary">
                    Import Data
                </Button>
            </div>

            <div className="dashboard__stats">
                {loading ? (
                    [...Array(4)].map((_, i) => (
                        <div key={i} className="stats-skeleton">
                            <div className="skeleton-title"></div>
                            <div className="skeleton-value"></div>
                            <div className="skeleton-subtitle"></div>
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

            <div className="dashboard__grid">
                <div className="dashboard__column dashboard__column--wide">
                    <ProjectAnalytics flujoData={metricas?.flujo} />
                    <TeamCollaboration />
                </div>

                <div className="dashboard__column">
                    <div className="dashboard__reminders">
                        <h3 className="dashboard__card-title">Reminders</h3>
                        <div className="dashboard__reminder-content">
                            <h4 className="dashboard__meeting-title">Meeting with Arc Company</h4>
                            <p className="dashboard__meeting-time">Time: 02:00 pm - 04:00 pm</p>
                            <Button variant="primary" fullWidth>
                                📹 Start Meeting
                            </Button>
                        </div>
                    </div>

                    <ProjectProgress />
                </div>

                <div className="dashboard__column">
                    <div className="dashboard__project-list">
                        <div className="dashboard__project-header">
                            <h3 className="dashboard__card-title">Project</h3>
                            <Button variant="secondary" size="small" icon={<PlusIcon />}>
                                New
                            </Button>
                        </div>
                        <ul className="dashboard__projects">
                            {PROJECTS.map((project) => (
                                <li key={project.id} className="dashboard__project-item">
                                    <span className="dashboard__project-icon">{project.icon}</span>
                                    <div className="dashboard__project-info">
                                        <span className="dashboard__project-name">{project.name}</span>
                                        <span className="dashboard__project-date">Due date: {project.dueDate}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <TimeTracker />
                </div>
            </div>
        </Layout>
    );
}
