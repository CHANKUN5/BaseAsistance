import { useState, useEffect } from 'react';
import { Layout } from '../components/layout';
import { Card, Button } from '../components/common';
import { useAuth } from '../context/AuthContext';
import * as jornadasService from '../services/jornadasService';
import './Historial.css';

export default function Historial() {
    const { user } = useAuth();
    const [jornadas, setJornadas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('list');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState(null);

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
            console.error(error);
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

    // Helper to parse "HH:MM:SS" or numbers to float hours
    const parseDurationToHours = (duration) => {
        if (!duration) return 0;
        if (typeof duration === 'number') return duration;
        if (typeof duration === 'string') {
            if (duration.includes(':')) {
                const [h, m] = duration.split(':').map(Number);
                return (h || 0) + ((m || 0) / 60);
            }
            // "8 hours" format logic
            const match = duration.match(/(\d+)/);
            return match ? parseFloat(match[1]) : 0;
        }
        return 0;
    };

    const formatearDuracion = (val) => {
        const horas = parseDurationToHours(val);
        if (!horas && horas !== 0) return '--';
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
        return jornadas.reduce((total, jornada) => total + parseDurationToHours(jornada.horas_trabajadas), 0);
    };

    const calcularPromedioDiario = () => {
        const jornadasFinalizadas = jornadas.filter(j => j.horas_trabajadas);
        if (jornadasFinalizadas.length === 0) return 0; // Avoid division by zero
        return calcularTotalHoras() / jornadasFinalizadas.length;
    };



    const handleExportCSV = () => {
        const headers = ['Fecha', 'Hora Inicio', 'Hora Fin', 'Duración', 'Estado'];
        const csvContent = [
            headers.join(','),
            ...jornadas.map(j => {
                const fecha = new Date(j.fecha).toLocaleDateString('es-ES');
                const inicio = formatearHora(j.hora_inicio);
                const fin = formatearHora(j.hora_fin);
                const duracion = formatearDuracion(j.horas_trabajadas);
                return `${fecha},${inicio},${fin},${duracion},${j.estado}`;
            })
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'historial_jornadas.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayOfMonth = new Date(year, month, 1).getDay();

        const days = [];
        const prevMonthDays = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

        for (let i = 0; i < prevMonthDays; i++) {
            days.push(null);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            days.push(new Date(year, month, i));
        }

        return days;
    };

    const getJornadaForDay = (date) => {
        if (!date) return null;
        return jornadas.find(j => {
            const jDate = new Date(j.fecha);
            return jDate.getDate() === date.getDate() &&
                jDate.getMonth() === date.getMonth() &&
                jDate.getFullYear() === date.getFullYear();
        });
    };

    const changeMonth = (offset) => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
        setSelectedDay(null);
    };

    const handleDayClick = (day, jornada) => {
        if (day) {
            setSelectedDay({ date: day, jornada });
        }
    };

    if (loading) {
        return (
            <Layout title="Historial">
                <div className="historial-loading">Loading...</div>
            </Layout>
        );
    }

    return (
        <Layout
            title="Historial"
            subtitle="Revisa tus registros de tiempo"
        >
            <div className="historial-page">
                <div className="historial-header-actions">
                    <div className="view-toggles">
                        <button
                            className={`view-toggle ${viewMode === 'list' ? 'active' : ''}`}
                            onClick={() => setViewMode('list')}
                        >
                            Lista
                        </button>
                        <button
                            className={`view-toggle ${viewMode === 'calendar' ? 'active' : ''}`}
                            onClick={() => setViewMode('calendar')}
                        >
                            Calendario
                        </button>
                    </div>
                </div>

                {viewMode === 'list' ? (
                    <>
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
                    </>
                ) : (
                    <div className="calendar-view-container">
                        <Card className="calendar-card">
                            <div className="calendar-header">
                                <h3>
                                    {currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                                </h3>
                                <div className="calendar-nav">
                                    <button onClick={() => changeMonth(-1)}>&lt;</button>
                                    <button onClick={() => changeMonth(1)}>&gt;</button>
                                </div>
                            </div>
                            <div className="calendar-grid">
                                {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(day => (
                                    <div key={day} className="calendar-day-header">{day}</div>
                                ))}
                                {getDaysInMonth(currentDate).map((day, index) => {
                                    const jornada = getJornadaForDay(day);
                                    const isSelected = selectedDay && day &&
                                        selectedDay.date.getTime() === day.getTime();

                                    return (
                                        <div
                                            key={index}
                                            className={`calendar-day ${day ? 'active-day' : ''} ${isSelected ? 'selected' : ''} ${jornada ? 'has-jornada' : ''}`}
                                            onClick={() => handleDayClick(day, jornada)}
                                        >
                                            {day && (
                                                <>
                                                    <span className="day-number">{day.getDate()}</span>
                                                    {jornada && (
                                                        <span className="day-hours">
                                                            {formatearDuracion(jornada.horas_trabajadas)}
                                                        </span>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </Card>

                        <div className="calendar-details-panel">
                            {selectedDay ? (
                                <Card className="details-card">
                                    <h3>{formatearFecha(selectedDay.date)}</h3>
                                    {selectedDay.jornada ? (
                                        <div className="day-details">
                                            <div className="detail-row">
                                                <span>Estado</span>
                                                <span className={`estado-badge estado-badge--${getEstadoBadge(selectedDay.jornada.estado)}`}>
                                                    {selectedDay.jornada.estado}
                                                </span>
                                            </div>
                                            <div className="detail-row">
                                                <span>Inicio</span>
                                                <span>{formatearHora(selectedDay.jornada.hora_inicio)}</span>
                                            </div>
                                            <div className="detail-row">
                                                <span>Fin</span>
                                                <span>{formatearHora(selectedDay.jornada.hora_fin)}</span>
                                            </div>
                                            <div className="detail-row highlight">
                                                <span>Total</span>
                                                <span>{formatearDuracion(selectedDay.jornada.horas_trabajadas)}</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="no-data-msg">No hay registros para este día.</p>
                                    )}
                                </Card>
                            ) : (
                                <Card className="details-placeholder">
                                    <div className="placeholder-content">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="12" cy="12" r="10" />
                                            <polyline points="12 6 12 12 16 14" />
                                        </svg>
                                        <h4>Selecciona un día</h4>
                                        <p>Haz clic en un día del calendario para ver los detalles</p>
                                    </div>
                                </Card>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}