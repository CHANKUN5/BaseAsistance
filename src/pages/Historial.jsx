import { useState, useEffect } from 'react';
import { Layout } from '../components/layout';
import { Card, CardHeader, CardContent, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import * as jornadasService from '../services/jornadasService';

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

    const getEstadoBadgeColor = (estado) => {
        const colors = {
            finalizada: 'bg-emerald-100 text-emerald-700',
            activa: 'bg-blue-100 text-blue-700',
            pausada: 'bg-amber-100 text-amber-700'
        };
        return colors[estado] || 'bg-slate-100 text-slate-700';
    };

    const calcularTotalHoras = () => {
        return jornadas.reduce((total, jornada) => total + (jornada.horas_trabajadas || 0), 0);
    };

    const calcularPromedioDiario = () => {
        const jornadasFinalizadas = jornadas.filter(j => j.horas_trabajadas);
        if (jornadasFinalizadas.length === 0) return 0;
        return calcularTotalHoras() / jornadasFinalizadas.length;
    };

    return (
        <Layout
            title="Historial de Jornadas"
            subtitle="Consulta el registro completo de tus jornadas laborales."
        >
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardContent className="p-6 flex flex-col items-center text-center">
                            <div className="text-3xl font-bold text-slate-900 mb-1">{jornadas.length}</div>
                            <div className="text-sm font-medium text-slate-500">Jornadas Registradas</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6 flex flex-col items-center text-center">
                            <div className="text-3xl font-bold text-slate-900 mb-1">{formatearDuracion(calcularTotalHoras())}</div>
                            <div className="text-sm font-medium text-slate-500">Total Horas Trabajadas</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6 flex flex-col items-center text-center">
                            <div className="text-3xl font-bold text-slate-900 mb-1">{formatearDuracion(calcularPromedioDiario())}</div>
                            <div className="text-sm font-medium text-slate-500">Promedio Diario</div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="overflow-hidden">
                    <CardHeader title="Registro de Jornadas" />
                    <CardContent className="p-0">
                        {loading ? (
                            <div className="p-8 text-center text-slate-500">Cargando historial...</div>
                        ) : jornadas.length === 0 ? (
                            <div className="p-12 text-center">
                                <span className="block text-4xl mb-3">📅</span>
                                <h3 className="text-lg font-medium text-slate-900">No hay jornadas registradas</h3>
                                <p className="text-slate-500 mt-1">Comienza registrando tu primera jornada en la sección "Jornada".</p>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Fecha</TableHead>
                                        <TableHead>Hora Inicio</TableHead>
                                        <TableHead>Hora Fin</TableHead>
                                        <TableHead>Duración</TableHead>
                                        <TableHead>Estado</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {jornadas.map((jornada) => (
                                        <TableRow key={jornada.id}>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-slate-900">
                                                        {new Date(jornada.fecha).toLocaleDateString('es-ES')}
                                                    </span>
                                                    <span className="text-xs text-slate-500 capitalize">
                                                        {new Date(jornada.fecha).toLocaleDateString('es-ES', { weekday: 'long' })}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-mono text-slate-600">
                                                {formatearHora(jornada.hora_inicio)}
                                            </TableCell>
                                            <TableCell className="font-mono text-slate-600">
                                                {formatearHora(jornada.hora_fin)}
                                            </TableCell>
                                            <TableCell>
                                                <span className="font-medium text-slate-900">
                                                    {formatearDuracion(jornada.horas_trabajadas)}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getEstadoBadgeColor(jornada.estado)}`}>
                                                    {jornada.estado}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
}