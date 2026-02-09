import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout';
import { Card, Button } from '../components/common';
import Modal from '../components/common/Modal';
import { useAuth } from '../context/AuthContext';
import * as jornadasService from '../services/jornadasService';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Play, Pause, Square, Utensils, Coffee, Clock } from 'lucide-react';
import './Dashboard.css';

export default function Dashboard() {
    const { user } = useAuth();
    const [jornadaActual, setJornadaActual] = useState(null);
    const [tiempoTranscurrido, setTiempoTranscurrido] = useState('00:00:00');
    const [loading, setLoading] = useState(false);
    const [weeklyData, setWeeklyData] = useState([]);
    const [historyData, setHistoryData] = useState([]);

    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        title: '',
        content: null,
        footer: null
    });

    const [kpis, setKpis] = useState({
        totalHoras: '0h 0m',
        actividad: '0%',
        mediaDiaria: '0h 0m',
        diasTrabajados: 0
    });

    useEffect(() => {
        if (user) {
            loadJornadaActiva();
            loadDashboardData();
        }
    }, [user]);

    const parseDurationToHours = (durationStr) => {
        if (!durationStr) return 0;

        // Handle "HH:MM:SS"
        if (durationStr.includes(':')) {
            const parts = durationStr.split(':');
            const h = parseInt(parts[0], 10) || 0;
            const m = parseInt(parts[1], 10) || 0;
            return h + (m / 60);
        }

        // Handle "X hours"
        const match = durationStr.match(/(\d+)\s*hours?/);
        if (match) {
            return parseInt(match[1], 10);
        }

        return 0;
    };

    const loadDashboardData = async () => {
        try {
            const { data, error } = await jornadasService.getHistorialJornadas(user.id, 50);

            if (error) throw error;
            if (!data) return;

            // 1. Set History Table Data
            setHistoryData(data.slice(0, 5));

            // 2. Process Rolling 7-Day Weekly Data
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // Generate list of last 7 days (including today)
            const rollingDays = [];
            for (let i = 6; i >= 0; i--) {
                const d = new Date(today);
                d.setDate(today.getDate() - i);
                rollingDays.push(d);
            }

            const dayNames = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
            const labels = rollingDays.map(d => dayNames[d.getDay()]);

            // Map labels to data
            const dayMap = rollingDays.reduce((acc, d) => {
                const dateStr = d.toISOString().split('T')[0];
                acc[dateStr] = 0;
                return acc;
            }, {});

            let totalHorasNum = 0;
            let diasConActividad = 0;

            data.forEach(log => {
                if (!log.fecha) return;
                const logDate = new Date(log.fecha + 'T00:00:00');
                const logDateStr = logDate.toISOString().split('T')[0];
                const hours = parseDurationToHours(log.horas_trabajadas);

                // For the rolling chart
                if (dayMap[logDateStr] !== undefined) {
                    dayMap[logDateStr] += hours;
                }

                // Global metrics calculation (all history or can be restricted to month)
                totalHorasNum += hours;
            });

            // Count days with activity from history
            const uniqueDays = new Set(data.map(log => log.fecha));
            diasConActividad = uniqueDays.size;

            const processedData = rollingDays.map(d => {
                const dateStr = d.toISOString().split('T')[0];
                return {
                    name: dayNames[d.getDay()],
                    horas: parseFloat(dayMap[dateStr].toFixed(1))
                };
            });

            setWeeklyData(processedData);

            // 3. Update KPIs
            const avgHours = diasConActividad > 0 ? totalHorasNum / diasConActividad : 0;
            const activityPercent = Math.min(100, (diasConActividad / 30) * 100); // Activity in last 30 days roughly

            setKpis({
                totalHoras: `${Math.floor(totalHorasNum)}h ${Math.round((totalHorasNum % 1) * 60)}m`,
                actividad: `${Math.round(activityPercent)}%`,
                mediaDiaria: `${Math.floor(avgHours)}h ${Math.round((avgHours % 1) * 60)}m`,
                diasTrabajados: diasConActividad
            });

        } catch (error) {
            console.error("Error loading dashboard data:", error);
        }
    };

    useEffect(() => {
        let interval;

        const updateTimer = () => {
            if (jornadaActual && jornadaActual.estado === 'activa') {
                // Ensure date and time are combined correctly
                const datePart = jornadaActual.fecha.split('T')[0];
                const inicioString = `${datePart}T${jornadaActual.hora_inicio}`;
                const inicio = new Date(inicioString);
                const ahora = new Date();

                if (isNaN(inicio.getTime())) return;

                const diff = Math.max(0, ahora - inicio);
                const horas = Math.floor(diff / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);

                setTiempoTranscurrido(
                    `${horas.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
                );
            } else {
                setTiempoTranscurrido('00:00:00');
            }
        };

        updateTimer();
        interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [jornadaActual]);

    const loadJornadaActiva = async () => {
        try {
            const { data } = await jornadasService.getJornadaActiva(user.id);
            setJornadaActual(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleJornadaAction = async (action) => {
        if (!user) return;
        setLoading(true);
        try {
            let result;
            if (action === 'iniciar') {
                result = await jornadasService.iniciarJornada(user.id);
            } else if (action === 'pausar') {
                result = await jornadasService.pausarJornada(jornadaActual.id);
            } else if (action === 'finalizar') {
                result = await jornadasService.finalizarJornada(jornadaActual.id);
            }

            if (result && result.error) throw result.error;

            if (result && result.data) {
                setJornadaActual(result.data);
                if (action === 'finalizar') {
                    setModalConfig({
                        isOpen: true,
                        title: '¡Jornada Finalizada!',
                        content: <p>Has trabajado <strong>{result.data.horas_trabajadas || '00:00:00'}</strong> horas hoy. ¡Buen trabajo!</p>,
                        footer: <Button onClick={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}>Cerrar</Button>
                    });
                    loadDashboardData();
                }
            } else {
                await loadJornadaActiva();
            }
        } catch (error) {
            console.error(error);
            setModalConfig({
                isOpen: true,
                title: 'Error',
                content: <p>Hubo un problema al {action} la jornada. Por favor intenta de nuevo.<br /><small>{error.message}</small></p>,
                footer: <Button variant="danger" onClick={() => setModalConfig({ ...modalConfig, isOpen: false })}>Cerrar</Button>
            });
            await loadJornadaActiva();
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = () => {
        if (!jornadaActual) return 'neutral';
        return jornadaActual.estado === 'activa' ? 'success' :
            jornadaActual.estado === 'pausada' ? 'warning' : 'neutral';
    };

    const getStatusText = () => {
        if (!jornadaActual) return 'Sin jornada';
        return jornadaActual.estado === 'activa' ? 'Trabajando' :
            jornadaActual.estado === 'pausada' ? 'Pausado' : 'Finalizado';
    };

    const navigate = useNavigate();
    const handleViewAllHistory = () => navigate('/historial');

    return (
        <Layout title="Dashboard" subtitle="Bienvenido al panel de control de tu actividad diaria">
            <div className="dashboard-container">
                {/* Top: Metrics */}
                <div className="metrics-row">
                    <Card className="metric-card">
                        <div className="metric-icon" style={{ background: '#ECFDF5', color: '#10B981' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                        </div>
                        <div className="metric-info">
                            <span className="metric-label">Horas Trabajadas</span>
                            <span className="metric-value">{kpis.totalHoras}</span>
                            <span className="metric-subtext positive">Total acumulado</span>
                        </div>
                    </Card>
                    <Card className="metric-card">
                        <div className="metric-icon" style={{ background: '#EEF2FF', color: '#6366F1' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
                        </div>
                        <div className="metric-info">
                            <span className="metric-label">Actividad</span>
                            <span className="metric-value">{kpis.actividad}</span>
                            <span className="metric-subtext">{kpis.diasTrabajados} días trabajados</span>
                        </div>
                    </Card>
                    <Card className="metric-card">
                        <div className="metric-icon" style={{ background: '#FFF7ED', color: '#F97316' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                        </div>
                        <div className="metric-info">
                            <span className="metric-label">Media Diaria</span>
                            <span className="metric-value">{kpis.mediaDiaria}</span>
                            <span className="metric-subtext positive">Promedio por jornada</span>
                        </div>
                    </Card>
                </div>

                {/* Middle: Chart & Control Panel */}
                <div className="middle-section">
                    <Card className="chart-card-large">
                        <h3>Últimos 7 días</h3>
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={weeklyData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 11 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                                <Tooltip cursor={{ fill: '#F9FAFB' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                                <Bar dataKey="horas" fill="#C5FF00" radius={[4, 4, 4, 4]} barSize={24} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>

                    <Card className="control-panel-card">
                        <div className="control-header-centered">
                            <h3>Control de Jornada</h3>
                            <span className={`status-pill ${getStatusColor()}`}>
                                <span className="status-dot"></span>
                                {getStatusText()}
                            </span>
                            <div className="big-timer-compact">{tiempoTranscurrido}</div>
                        </div>

                        <div className="action-buttons-grid">
                            {!jornadaActual || jornadaActual.estado === 'finalizada' ? (
                                <button
                                    className="action-btn primary"
                                    onClick={() => handleJornadaAction('iniciar')}
                                    disabled={loading}
                                >
                                    <Play size={20} style={{ marginRight: '8px' }} />
                                    Iniciar Jornada
                                </button>
                            ) : (
                                <>
                                    <div className="pause-actions">
                                        <button
                                            className="pause-btn"
                                            onClick={() => handleJornadaAction('pausar')}
                                            disabled={loading || jornadaActual.estado === 'pausada'}
                                            title="Comida"
                                        >
                                            <Utensils size={20} />
                                            <span>Comida</span>
                                        </button>
                                        <button
                                            className="pause-btn"
                                            onClick={() => handleJornadaAction('pausar')}
                                            disabled={loading || jornadaActual.estado === 'pausada'}
                                            title="Descanso"
                                        >
                                            <Coffee size={20} />
                                            <span>Descanso</span>
                                        </button>
                                        <button
                                            className="pause-btn"
                                            onClick={() => handleJornadaAction('pausar')}
                                            disabled={loading || jornadaActual.estado === 'pausada'}
                                            title="Otra"
                                        >
                                            <Clock size={20} />
                                            <span>Otra</span>
                                        </button>
                                    </div>
                                    <button
                                        className="action-btn danger"
                                        onClick={() => handleJornadaAction('finalizar')}
                                        disabled={loading}
                                    >
                                        <Square size={20} style={{ marginRight: '8px' }} />
                                        Finalizar
                                    </button>
                                    {jornadaActual.estado === 'pausada' && (
                                        <button
                                            className="action-btn secondary"
                                            onClick={() => handleJornadaAction('iniciar')}
                                        >
                                            <Play size={20} style={{ marginRight: '8px' }} />
                                            Reanudar
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    </Card>
                </div>

                {/* Bottom: History Table */}
                <div className="history-section">
                    <Card className="history-card">
                        <div className="history-header">
                            <h3>Últimas Jornadas</h3>
                            <button className="view-all-btn" onClick={handleViewAllHistory}>Ver todo</button>
                        </div>
                        <table className="dashboard-table">
                            <thead>
                                <tr>
                                    <th>FECHA</th>
                                    <th>HORA INICIO</th>
                                    <th>HORAS</th>
                                    <th>ESTADO</th>
                                </tr>
                            </thead>
                            <tbody>
                                {historyData.length > 0 ? (
                                    historyData.map((jornada, index) => (
                                        <tr key={jornada.id || index}>
                                            <td>
                                                <div className="table-date">
                                                    <span className="date-day">
                                                        {new Date(jornada.fecha + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'long' })}
                                                    </span>
                                                    <span className="date-num">
                                                        {new Date(jornada.fecha + 'T00:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                                                    </span>
                                                </div>
                                            </td>
                                            <td>{jornada.hora_inicio}</td>
                                            <td>
                                                <span className="hours-badge">
                                                    {jornada.horas_trabajadas || '--'}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`status-text ${jornada.estado === 'activa' ? 'success' : 'completed'}`}>
                                                    {jornada.estado === 'activa' ? 'EN CURSO' : 'COMPLETADO'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: 'center', padding: '24px', color: '#6B7280' }}>
                                            No hay registros recientes
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </Card>
                </div>
            </div>

            <Modal
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
                title={modalConfig.title}
                footer={modalConfig.footer}
            >
                {modalConfig.content}
            </Modal>
        </Layout>
    );
}
