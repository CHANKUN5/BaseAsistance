import { useState, useEffect } from 'react';
import { Layout } from '../components/layout';
import { Button, Card, CardContent, CardHeader } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import * as jornadasService from '../services/jornadasService';

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
            case 'activa': return 'bg-emerald-100 text-emerald-700';
            case 'pausada': return 'bg-amber-100 text-amber-700';
            case 'finalizada': return 'bg-slate-100 text-slate-700';
            default: return 'bg-slate-100 text-slate-700';
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
                {/* Status Card */}
                <Card className="h-full">
                    <CardHeader title="Estado Actual">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getEstadoColor(jornadaActual?.estado)}`}>
                            {getEstadoTexto(jornadaActual?.estado)}
                        </span>
                    </CardHeader>

                    <CardContent className="flex flex-col items-center justify-center py-8">
                        {jornadaActual && jornadaActual.estado === 'activa' && (
                            <div className="text-center mb-8">
                                <div className="text-6xl font-bold text-slate-900 font-mono tracking-wider mb-2">
                                    {tiempoTranscurrido}
                                </div>
                                <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">
                                    Tiempo trabajado
                                </div>
                            </div>
                        )}

                        {jornadaActual && (
                            <div className="w-full grid grid-cols-2 gap-4 text-sm">
                                <div className="flex flex-col p-3 bg-slate-50 rounded-lg">
                                    <span className="text-slate-500 mb-1">Fecha</span>
                                    <span className="font-medium text-slate-900">{new Date(jornadaActual.fecha).toLocaleDateString()}</span>
                                </div>
                                <div className="flex flex-col p-3 bg-slate-50 rounded-lg">
                                    <span className="text-slate-500 mb-1">Hora inicio</span>
                                    <span className="font-medium text-slate-900">{jornadaActual.hora_inicio}</span>
                                </div>
                                {jornadaActual.hora_pausa && (
                                    <div className="flex flex-col p-3 bg-slate-50 rounded-lg">
                                        <span className="text-slate-500 mb-1">Hora pausa</span>
                                        <span className="font-medium text-slate-900">{jornadaActual.hora_pausa}</span>
                                    </div>
                                )}
                                {jornadaActual.hora_fin && (
                                    <div className="flex flex-col p-3 bg-slate-50 rounded-lg">
                                        <span className="text-slate-500 mb-1">Hora fin</span>
                                        <span className="font-medium text-slate-900">{jornadaActual.hora_fin}</span>
                                    </div>
                                )}
                                {jornadaActual.horas_trabajadas && (
                                    <div className="flex flex-col p-3 bg-slate-50 rounded-lg col-span-2">
                                        <span className="text-slate-500 mb-1">Horas trabajadas</span>
                                        <span className="font-medium text-slate-900">{jornadaActual.horas_trabajadas}h</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {!jornadaActual && (
                            <div className="text-center text-slate-500 py-10">
                                <span className="block text-4xl mb-2">😴</span>
                                <p>No has iniciado jornada hoy.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Controls Card */}
                <Card className="h-full">
                    <CardHeader title="Controles" />
                    <CardContent className="flex flex-col justify-center gap-4 py-8">
                        <Button
                            variant="primary"
                            size="lg"
                            onClick={iniciarJornada}
                            disabled={jornadaActual && jornadaActual.estado !== 'finalizada'}
                            isLoading={loading}
                            className="w-full py-4 text-lg"
                        >
                            ▶️ Iniciar Jornada
                        </Button>

                        <Button
                            variant="secondary"
                            size="lg"
                            onClick={pausarJornada}
                            disabled={!jornadaActual || jornadaActual.estado !== 'activa'}
                            isLoading={loading}
                            className="w-full py-4 text-lg"
                        >
                            ⏸️ Pausar Jornada
                        </Button>

                        <Button
                            variant="danger"
                            size="lg"
                            onClick={finalizarJornada}
                            disabled={!jornadaActual || jornadaActual.estado === 'finalizada'}
                            isLoading={loading}
                            className="w-full py-4 text-lg"
                        >
                            ⏹️ Finalizar Jornada
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
}