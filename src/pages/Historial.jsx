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

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

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
            setCurrentPage(1);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const formatearFecha = (fecha) => {
        if (!fecha) return '--';
        const dateObj = (fecha instanceof Date) ? fecha : new Date(fecha + 'T00:00:00');

        return dateObj.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatearHora = (hora) => {
        return hora ? hora.substring(0, 5) : '--:--';
    };

    const parseDurationToHours = (duration) => {
        if (!duration) return 0;
        if (typeof duration === 'number') return duration;
        if (typeof duration === 'string') {
            if (duration.includes(':')) {
                const parts = duration.split(':').map(Number);
                const h = parts[0] || 0;
                const m = parts[1] || 0;
                const s = parts[2] || 0;
                return h + (m / 60) + (s / 3600);
            }
            const match = duration.match(/(\d+\.?\d*)/);
            return match ? parseFloat(match[1]) : 0;
        }
        return 0;
    };

    const formatearDuracion = (val) => {
        if (!val && val !== 0 && typeof val !== 'string') return '--';
        const totalHoras = parseDurationToHours(val);

        const h = Math.floor(totalHoras);
        const m = Math.floor((totalHoras - h) * 60);
        const s = Math.floor(((totalHoras - h) * 60 - m) * 60 + 0.1);

        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    const formatearDuracionKPI = (val) => {
        if (!val && val !== 0 && typeof val !== 'string') return '--';
        const totalHoras = parseDurationToHours(val);

        const h = Math.floor(totalHoras);
        const m = Math.floor((totalHoras - h) * 60);

        return `${h}h ${m}m`;
    };

    const calcularDuracionDinamica = (jornada) => {
        if (!jornada) return null;
        if (jornada.horas_trabajadas) return jornada.horas_trabajadas;
        if (jornada.hora_inicio && jornada.hora_fin) {
            const inicio = new Date(`2000-01-01T${jornada.hora_inicio}`);
            const fin = new Date(`2000-01-01T${jornada.hora_fin}`);
            let diff = fin - inicio;
            if (diff < 0) diff += 24 * 60 * 60 * 1000;
            const totalSeconds = Math.floor(diff / 1000);
            const h = Math.floor(totalSeconds / 3600);
            const m = Math.floor((totalSeconds % 3600) / 60);
            const s = totalSeconds % 60;
            return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
        }
        return null;
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
        return jornadas.reduce((total, jornada) => {
            const duracion = calcularDuracionDinamica(jornada);
            if (duracion) {
                return total + parseDurationToHours(duracion);
            }
            return total;
        }, 0);
    };

    const calcularPromedioDiario = () => {
        const jornadasConDuracion = jornadas.filter(j => calcularDuracionDinamica(j));
        if (jornadasConDuracion.length === 0) return 0;
        return calcularTotalHoras() / jornadasConDuracion.length;
    };

    const handleExportCSV = () => {
        const headers = ['Fecha', 'Hora Inicio', 'Hora Fin', 'Duración', 'Estado'];
        const csvContent = [
            headers.join(','),
            ...jornadas.map(j => {
                const fecha = new Date(j.fecha + 'T00:00:00').toLocaleDateString('es-ES');
                const inicio = formatearHora(j.hora_inicio);
                const fin = formatearHora(j.hora_fin);
                const duracion = formatearDuracion(calcularDuracionDinamica(j));
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
        const dateStr = date.toISOString().split('T')[0];
        const dayJornadas = jornadas.filter(j => j.fecha === dateStr);

        if (dayJornadas.length === 0) return null;

        if (dayJornadas.length > 1) {
            let totalSecs = 0;
            dayJornadas.forEach(j => {
                const dur = calcularDuracionDinamica(j);
                if (dur) {
                    const parts = dur.split(':').map(Number);
                    totalSecs += (parts[0] * 3600) + (parts[1] * 60) + (parts[2] || 0);
                }
            });
            const h = Math.floor(totalSecs / 3600);
            const m = Math.floor((totalSecs % 3600) / 60);
            const s = totalSecs % 60;
            return {
                ...dayJornadas[0],
                horas_trabajadas: `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`,
                isMultiple: true
            };
        }

        return {
            ...dayJornadas[0],
            horas_trabajadas: calcularDuracionDinamica(dayJornadas[0])
        };
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
                                    <div className="stat-value">{formatearDuracionKPI(calcularTotalHoras())}</div>
                                    <div className="stat-label">Total Horas Trabajadas</div>
                                </Card>
                                <Card className="stat-card">
                                    <div className="stat-value">{formatearDuracionKPI(calcularPromedioDiario())}</div>
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
                                            {jornadas
                                                .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                                                .map((jornada) => (
                                                    <tr key={jornada.id}>
                                                        <td className="fecha-cell">
                                                            <div className="fecha-display">
                                                                <div className="fecha-principal">
                                                                    {new Date(jornada.fecha + 'T00:00:00').toLocaleDateString('es-ES')}
                                                                </div>
                                                                <div className="fecha-secundaria">
                                                                    {new Date(jornada.fecha + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'long' })}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>{formatearHora(jornada.hora_inicio)}</td>
                                                        <td>{formatearHora(jornada.hora_fin)}</td>
                                                        <td className="duracion-cell">
                                                            <span className="duracion-badge">
                                                                {formatearDuracion(calcularDuracionDinamica(jornada))}
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

                                    {jornadas.length > itemsPerPage && (
                                        <div className="pagination">
                                            <div className="pagination-info">
                                                Mostrando <span>{(currentPage - 1) * itemsPerPage + 1}</span> - <span>{Math.min(currentPage * itemsPerPage, jornadas.length)}</span> de <span>{jornadas.length}</span>
                                            </div>
                                            <div className="pagination-controls">
                                                <button
                                                    className="pagination-btn"
                                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                                    disabled={currentPage === 1}
                                                >
                                                    &larr; Anterior
                                                </button>
                                                <div className="pagination-page">
                                                    Página <span>{currentPage}</span> de {Math.ceil(jornadas.length / itemsPerPage)}
                                                </div>
                                                <button
                                                    className="pagination-btn"
                                                    onClick={() => setCurrentPage(p => Math.min(Math.ceil(jornadas.length / itemsPerPage), p + 1))}
                                                    disabled={currentPage >= Math.ceil(jornadas.length / itemsPerPage)}
                                                >
                                                    Siguiente &rarr;
                                                </button>
                                            </div>
                                        </div>
                                    )}
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