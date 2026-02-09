import { useState, useEffect } from 'react';
import { Layout } from '../components/layout';
import { Button, Card } from '../components/common';
import { useAuth } from '../context/AuthContext';
import * as jornadasService from '../services/jornadasService';
import './Jornada.css';

export default function Jornada() {
    const { user } = useAuth();
    const [jornadaActual, setJornadaActual] = useState(null);
    const [tiempoTranscurrido, setTiempoTranscurrido] = useState('00:00:00');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            loadJornadaActiva();
        }
    }, [user]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (jornadaActual && jornadaActual.estado === 'activa') {
                const inicio = new Date(`${jornadaActual.fecha}T${jornadaActual.hora_inicio}`);
                const ahora = new Date();
                const diff = Math.max(0, ahora - inicio);

                const horas = Math.floor(diff / (1000 * 60 * 60));
                const minutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const segundos = Math.floor((diff % (1000 * 60)) / 1000);

                setTiempoTranscurrido(
                    `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`
                );
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [jornadaActual]);

    const loadJornadaActiva = async () => {
        try {
            const { data } = await jornadasService.getJornadaActiva(user.id);
            setJornadaActual(data);
        } catch (error) {
            console.error('Error loading active jornada:', error);
        }
    };

    const iniciarJornada = async () => {
        setLoading(true);
        try {
            const { data, error } = await jornadasService.iniciarJornada(user.id);
            if (error) throw error;
            setJornadaActual(data);
        } catch (error) {
            console.error('Error starting jornada:', error);
            alert('Error al iniciar la jornada');
        } finally {
            setLoading(false);
        }
    };

    const pausarJornada = async () => {
        if (!jornadaActual) return;

        setLoading(true);
        try {
            const { data, error } = await jornadasService.pausarJornada(jornadaActual.id);
            if (error) throw error;
            setJornadaActual(data);
        } catch (error) {
            console.error('Error pausing jornada:', error);
            alert('Error al pausar la jornada');
        } finally {
            setLoading(false);
        }
    };

    const finalizarJornada = async () => {
        if (!jornadaActual) return;

        setLoading(true);
        try {
            const { data, error } = await jornadasService.finalizarJornada(jornadaActual.id);
            if (error) throw error;

            const horas = Math.floor(data.horas_trabajadas);
            const minutos = Math.round((data.horas_trabajadas - horas) * 60);
            alert(`Jornada finalizada. Trabajaste ${horas} horas y ${minutos} minutos.`);

            setJornadaActual(data);
        } catch (error) {
            console.error('Error finishing jornada:', error);
            alert('Error al finalizar la jornada');
        } finally {
            setLoading(false);
        }
    };

    const getEstadoColor = (estado) => {
        switch (estado) {
            case 'activa': return 'success';
            case 'pausada': return 'warning';
            case 'finalizada': return 'neutral';
            default: return 'neutral';
        }
    };

    const getEstadoTexto = (estado) => {
        switch (estado) {
            case 'activa': return 'Jornada en curso';
            case 'pausada': return 'Jornada pausada';
            case 'finalizada': return 'Jornada finalizada';
            default: return 'No hay jornada activa';
        }
    };

    return (
        <Layout
            title="Control de Jornada"
            subtitle="Registra y controla tus horas de trabajo diarias."
        >
            <div className="jornada-page">
                <div className="jornada-status">
                    <Card className="status-card">
                        <div className="status-header">
                            <h3>Estado Actual</h3>
                            <span className={`status-badge status-badge--${getEstadoColor(jornadaActual?.estado)}`}>
                                {getEstadoTexto(jornadaActual?.estado)}
                            </span>
                        </div>

                        {jornadaActual && jornadaActual.estado === 'activa' && (
                            <div className="timer-display">
                                <div className="timer-value">{tiempoTranscurrido}</div>
                                <div className="timer-label">Tiempo trabajado</div>
                            </div>
                        )}

                        {jornadaActual && (
                            <div className="jornada-info">
                                <div className="info-item">
                                    <span className="info-label">Fecha:</span>
                                    <span className="info-value">{new Date(jornadaActual.fecha).toLocaleDateString()}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Hora inicio:</span>
                                    <span className="info-value">{jornadaActual.hora_inicio}</span>
                                </div>
                                {jornadaActual.hora_pausa && (
                                    <div className="info-item">
                                        <span className="info-label">Hora pausa:</span>
                                        <span className="info-value">{jornadaActual.hora_pausa}</span>
                                    </div>
                                )}
                                {jornadaActual.hora_fin && (
                                    <div className="info-item">
                                        <span className="info-label">Hora fin:</span>
                                        <span className="info-value">{jornadaActual.hora_fin}</span>
                                    </div>
                                )}
                                {jornadaActual.horas_trabajadas && (
                                    <div className="info-item">
                                        <span className="info-label">Horas trabajadas:</span>
                                        <span className="info-value">{jornadaActual.horas_trabajadas}h</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </Card>
                </div>

                <div className="jornada-controls">
                    <Card className="controls-card">
                        <h3>Controles</h3>
                        <div className="control-buttons">
                            <Button
                                variant="primary"
                                size="large"
                                onClick={iniciarJornada}
                                disabled={jornadaActual && jornadaActual.estado !== 'finalizada'}
                                loading={loading}
                                fullWidth
                            >
                                ▶️ Iniciar Jornada
                            </Button>

                            <Button
                                variant="warning"
                                size="large"
                                onClick={pausarJornada}
                                disabled={!jornadaActual || jornadaActual.estado !== 'activa'}
                                loading={loading}
                                fullWidth
                            >
                                ⏸️ Pausar Jornada
                            </Button>

                            <Button
                                variant="danger"
                                size="large"
                                onClick={finalizarJornada}
                                disabled={!jornadaActual || jornadaActual.estado === 'finalizada'}
                                loading={loading}
                                fullWidth
                            >
                                ⏹️ Finalizar Jornada
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </Layout>
    );
}