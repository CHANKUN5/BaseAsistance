import { useState, useEffect } from 'react';
import { Layout } from '../components/layout';
import { useAuth } from '../context/AuthContext';
import * as metricasService from '../services/metricasService';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area
} from 'recharts';
import './Analytics.css';

export default function Analytics() {
    const { user } = useAuth();
    const [period, setPeriod] = useState('semana');
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({
        daily: [],
        trend: [],
        kpis: { totalHoras: '--', diasTrabajados: '--', mediaDiaria: '--', totalPausas: '--', trendHoras: '', trendMedia: '' },
        subtexts: { totalHoras: '', diasTrabajados: '', mediaDiaria: '', totalPausas: '' }
    });

    useEffect(() => {
        if (user) {
            loadAnalytics();
        }
    }, [user, period]);

    const loadAnalytics = async () => {
        setLoading(true);
        try {
            const { data: analyticsData } = await metricasService.getAnalyticsData(user.id, period);
            if (analyticsData) {
                setData(analyticsData);
            }
        } catch (error) {
            console.error("Error loading analytics:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleExportCSV = () => {
        const rows = data.daily || [];
        const headers = ['Periodo', 'Horas'];
        const csvContent = [
            headers.join(','),
            ...rows.map(row => `${row.name},${row.horas}`)
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `reporte_${period}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Use 'data' instead of 'currentData' in the JSX
    const currentData = data;

    return (
        <Layout>
            <div className="analytics-page">
                <div className="analytics-header">
                    <div className="analytics-title">
                        <h2>Reportes</h2>
                        <p>Analiza tu tiempo de trabajo</p>
                    </div>
                    <div className="analytics-actions">
                        <div className="time-toggle">
                            <button
                                className={`toggle-btn ${period === 'semana' ? 'active' : ''}`}
                                onClick={() => setPeriod('semana')}
                            >
                                Semana
                            </button>
                            <button
                                className={`toggle-btn ${period === 'mes' ? 'active' : ''}`}
                                onClick={() => setPeriod('mes')}
                            >
                                Mes
                            </button>
                        </div>
                        <button className="export-btn" onClick={handleExportCSV}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="7 10 12 15 17 10" />
                                <line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                            Exportar CSV
                        </button>
                    </div>
                </div>

                <div className="kpi-grid">
                    <div className="kpi-card">
                        <div>
                            <div className="kpi-header">
                                <div className="kpi-icon active">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10" />
                                        <polyline points="12 6 12 12 16 14" />
                                    </svg>
                                </div>
                                <div>
                                    <div className="kpi-label">Total Horas</div>
                                    <div className="kpi-trend positive">
                                        <span>{currentData.kpis.trendHoras}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="kpi-value">{currentData.kpis.totalHoras}</div>
                            <div className="kpi-subtext">{currentData.subtexts.totalHoras}</div>
                        </div>
                    </div>

                    <div className="kpi-card">
                        <div>
                            <div className="kpi-header">
                                <div className="kpi-icon" style={{ background: '#EEF2FF', color: '#6366F1' }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                        <line x1="16" y1="2" x2="16" y2="6" />
                                        <line x1="8" y1="2" x2="8" y2="6" />
                                        <line x1="3" y1="10" x2="21" y2="10" />
                                    </svg>
                                </div>
                                <div>
                                    <div className="kpi-label">Días Trabajados</div>
                                </div>
                            </div>
                            <div className="kpi-value">{currentData.kpis.diasTrabajados}</div>
                            <div className="kpi-subtext">{currentData.subtexts.diasTrabajados}</div>
                        </div>
                    </div>

                    <div className="kpi-card">
                        <div>
                            <div className="kpi-header">
                                <div className="kpi-icon" style={{ background: '#ECFDF5', color: '#10B981' }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                                        <polyline points="17 6 23 6 23 12" />
                                    </svg>
                                </div>
                                <div>
                                    <div className="kpi-label">Media Diaria</div>
                                    <div className="kpi-trend positive">
                                        <span>{currentData.kpis.trendMedia}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="kpi-value">{currentData.kpis.mediaDiaria}</div>
                            <div className="kpi-subtext">{currentData.subtexts.mediaDiaria}</div>
                        </div>
                    </div>

                    <div className="kpi-card">
                        <div>
                            <div className="kpi-header">
                                <div className="kpi-icon" style={{ background: '#FFF7ED', color: '#F97316' }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
                                        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                                        <line x1="6" y1="1" x2="6" y2="4" />
                                        <line x1="10" y1="1" x2="10" y2="4" />
                                        <line x1="14" y1="1" x2="14" y2="4" />
                                    </svg>
                                </div>
                                <div>
                                    <div className="kpi-label">Total Pausas</div>
                                </div>
                            </div>
                            <div className="kpi-value">{currentData.kpis.totalPausas}</div>
                            <div className="kpi-subtext">{currentData.subtexts.totalPausas}</div>
                        </div>
                    </div>
                </div>

                <div className="charts-grid">
                    <div className="chart-card">
                        <div className="chart-header">
                            <h3>Horas {period === 'semana' ? 'Diarias' : 'Semanales'}</h3>
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={currentData.daily}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                                />
                                <Tooltip
                                    cursor={{ fill: '#F9FAFB' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                                />
                                <Bar
                                    dataKey="horas"
                                    fill="#C5FF00"
                                    radius={[4, 4, 4, 4]}
                                    barSize={20}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="chart-card">
                        <div className="chart-header">
                            <h3>Tendencia {period === 'semana' ? 'Semanal' : 'Mensual'}</h3>
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={currentData.trend}>
                                <defs>
                                    <linearGradient id="colorHoras" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#818CF8" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#818CF8" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="horas"
                                    stroke="#6366F1"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorHoras)"
                                    dot={{ r: 4, fill: '#6366F1', strokeWidth: 2, stroke: '#fff' }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
