import { supabase } from './supabase';

export async function getAnalyticsData(userId, period = 'semana') {
    try {
        console.log(`Fetching analytics from Supabase for period: ${period}`);

        // Calculate the past date based on the period
        const now = new Date();
        const pastDate = new Date();
        if (period === 'semana') {
            pastDate.setDate(now.getDate() - 7);
        } else {
            pastDate.setDate(now.getDate() - 30);
        }

        // Query the 'metricas' table (new name)
        const { data, error } = await supabase
            .from('metricas')
            .select('*')
            .eq('usuario_id', userId)
            .gte('fecha', pastDate.toISOString().split('T')[0])
            .order('fecha', { ascending: true });

        if (error) throw error;

        if (!data || data.length === 0) {
            return { data: { daily: [], trend: [], kpis: {}, subtexts: {} }, error: null };
        }

        // Processing logic to match the frontend expectations
        // This is a simplified version; in a full app, you'd aggregate or map these.
        // For the demo, we'll return the raw metrics mapped to chart format if data exists.

        const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
        const processedDaily = data.map(m => {
            const date = new Date(m.fecha);
            return {
                name: days[date.getDay()],
                horas: parseFloat(m.total_horas_trabajadas) || 0
            };
        });

        const totalHoras = data.reduce((acc, m) => acc + (parseFloat(m.total_horas_trabajadas) || 0), 0);
        const totalPausas = data.reduce((acc, m) => acc + (m.total_pausas || 0), 0);

        return {
            data: {
                daily: processedDaily,
                trend: processedDaily, // Simple trend for demo
                kpis: {
                    totalHoras: `${Math.floor(totalHoras)}h ${Math.round((totalHoras % 1) * 60)}m`,
                    diasTrabajados: data.length.toString(),
                    mediaDiaria: `${(totalHoras / (data.length || 1)).toFixed(1)}h`,
                    totalPausas: totalPausas.toString(),
                    trendHoras: '+0%', // Placeholder logic
                    trendMedia: '+0%'
                },
                subtexts: {
                    totalHoras: period === 'semana' ? 'esta semana' : 'este mes',
                    diasTrabajados: 'días con actividad',
                    mediaDiaria: 'promedio',
                    totalPausas: 'total acumulado'
                }
            },
            error: null
        };

    } catch (error) {
        console.error("Error fetching analytics:", error);
        return { data: { daily: [], trend: [], kpis: {}, subtexts: {} }, error };
    }
}

export default {
    getAnalyticsData
};