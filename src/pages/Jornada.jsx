import { useState, useEffect } from 'react';
import { Layout } from '../components/layout';
import { Button, Card, Modal } from '../components/common';
import { useAuth } from '../context/AuthContext';
import * as jornadasService from '../services/jornadasService';
import './Jornada.css';

export default function Jornada() {
    const { user } = useAuth();
    const [jornadaActual, setJornadaActual] = useState(null);
    const [tiempoTranscurrido, setTiempoTranscurrido] = useState('00:00:00');
    const [loading, setLoading] = useState(false);
    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        title: '',
        content: null,
        footer: null
    });

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
                const diff = ahora - inicio;

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

            setModalConfig({
                isOpen: true,
                title: '¡Jornada Finalizada!',
                content: (
                    <div className="finish-modal-content">
                        <p>Has finalizado tu jornada laboral con éxito.</p>
                        <div className="finish-stats">
                            <span className="stat-label">Tiempo total:</span>
                            <span className="stat-value">{formatearDuracion(data.horas_trabajadas)}</span>
                        </div>
                    </div>
                ),
                footer: <Button onClick={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}>Cerrar</Button>
            });

            setJornadaActual(data);
        } catch (error) {
            console.error('Error finishing jornada:', error);
            setModalConfig({
                isOpen: true,
                title: 'Error',
                content: <p>No se pudo finalizar la jornada. Por favor, intenta de nuevo.</p>,
                footer: <Button onClick={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}>Cerrar</Button>
            });
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

    const formatearDuracion = (duration) => {
        if (!duration) return '00:00:00';
        if (typeof duration === 'string' && duration.includes(':')) {
            const parts = duration.split(':').map(Number);
            const h = parts[0] || 0;
            const m = parts[1] || 0;
            const s = parts[2] || 0;
            return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
        }
        return duration;
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
                                    <span className="info-value">
                                        {new Date(jornadaActual.fecha + 'T00:00:00').toLocaleDateString('es-ES', {
                                            weekday: 'long',
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                    </span>
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
                                        <span className="info-value">{formatearDuracion(jornadaActual.horas_trabajadas)}</span>
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
                                Iniciar Jornada
                            </Button>

                            <Button
                                variant="warning"
                                size="large"
                                onClick={pausarJornada}
                                disabled={!jornadaActual || jornadaActual.estado !== 'activa'}
                                loading={loading}
                                fullWidth
                            >
                                Pausar Jornada
                            </Button>

                            <Button
                                variant="danger"
                                size="large"
                                onClick={finalizarJornada}
                                disabled={!jornadaActual || jornadaActual.estado === 'finalizada'}
                                loading={loading}
                                fullWidth
                            >
                                Finalizar Jornada
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>

            <Modal
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
                title={modalConfig.title}
                footer={modalConfig.footer}
            >
                {modalConfig.content}
            </Modal>
        </Layout>
    );
}
