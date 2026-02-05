import { useState, useEffect } from 'react';
import { Layout } from '../components/layout';
import { Card } from '../components/common';
import { useAuth } from '../context/AuthContext';
import * as jornadasService from '../services/jornadasService';
import './Historial.css';

export default function Historial() {
    const { user } = useAuth();
    const [jornadas, setJornadas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            loadHistorial();
        }
    }, [user]);

    const loadHistorial = async () => {
        setLoading(true);
        try {
            const { data } = await jornadasService.getHistorialJornadas(user.id);
            setJornadas(data || []);
        } catch (error) {
            console.error('Error loading historial:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatearFecha = (fecha) => {
        return new Date(fecha).toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatearHora = (hora) => {
        return hora ? hora.substring(0, 5) : '--:--';
    };

    const formatearDuracion = (horas) => {
        if (!horas) return '--';
        const h = Math.floor(horas);
        const m = Math.round((horas - h) * 60);
        return `${h}h ${m}m`;
    };

    const getEstadoBadge = (estado) => {
        const colors = {
            finalizada: 'success',
            activa: 'primary',
            pausada: 'warning'
        };
        return colors[estado] || 'neutral';
    };

    const calcularTotalHoras = () => {
        return jornadas.reduce((total, jornada) => total + (jornada.horas_trabajadas || 0), 0);
    };

    const calcularPromedioDiario = () => {
        const jornadasFinalizadas = jornadas.filter(j => j.horas_trabajadas);
        if (jornadasFinalizadas.length === 0) return 0;
        return calcularTotalHoras() / jornadasFinalizadas.length;
    };

    if (loading) {
        return (
            <Layout
                title="Historial de Jornadas"
                subtitle="Consulta el registro completo de tus jornadas laborales."
            >
                <div className="historial-loading">
                    <div className="loading-skeleton">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="skeleton-row">
                                <div className="skeleton-item skeleton-date"></div>
                                <div className="skeleton-item skeleton-time"></div>
                                <div className="skeleton-item skeleton-time"></div>
                                <div className="skeleton-item skeleton-duration"></div>
                                <div className="skeleton-item skeleton-status"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout
            title="Historial de Jornadas"
            subtitle="Consulta el registro completo de tus jornadas laborales."
        >
            <div className="historial-page">
                <div className="historial-stats">
                    <div className="stats-grid">
                        <Card className="stat-card">
                            <div className="stat-value">{jornadas.length}</div>
                            <div className="stat-label">Jornadas Registradas</div>
                        </Card>
                        <Card className="stat-card">
                            <div className="stat-value">{formatearDuracion(calcularTotalHoras())}</div>
                            <div className="stat-label">Total Horas Trabajadas</div>
                        </Card>
                        <Card className="stat-card">
                            <div className="stat-value">{formatearDuracion(calcularPromedioDiario())}</div>
                            <div className="stat-label">Promedio Diario</div>
                        </Card>
                    </div>
                </div>

                <Card className="historial-table-card">
                    <div className="table-header">
                        <h3>Registro de Jornadas</h3>
                    </div>
                    
                    {jornadas.length === 0 ? (
                        <div className="empty-state">
                            <p>No hay jornadas registradas aún.</p>
                            <p>Comienza registrando tu primera jornada en la sección "Jornada".</p>
                        </div>
                    ) : (
                        <div className="historial-table-container">
                            <table className="historial-table">
                                <thead>
                                    <tr>
                                        <th>Fecha</th>
                                        <th>Hora Inicio</th>
                                        <th>Hora Fin</th>
                                        <th>Duración</th>
                                        <th>Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {jornadas.map((jornada) => (
                                        <tr key={jornada.id}>
                                            <td className="fecha-cell">
                                                <div className="fecha-display">
                                                    <div className="fecha-principal">
                                                        {new Date(jornada.fecha).toLocaleDateString('es-ES')}
                                                    </div>
                                                    <div className="fecha-secundaria">
                                                        {new Date(jornada.fecha).toLocaleDateString('es-ES', { weekday: 'long' })}
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{formatearHora(jornada.hora_inicio)}</td>
                                            <td>{formatearHora(jornada.hora_fin)}</td>
                                            <td className="duracion-cell">
                                                <span className="duracion-badge">
                                                    {formatearDuracion(jornada.horas_trabajadas)}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`estado-badge estado-badge--${getEstadoBadge(jornada.estado)}`}>
                                                    {jornada.estado}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>
            </div>
        </Layout>
    );
}