import { supabase } from '../lib/supabase';

export async function getIngresosTotales(userId) {
    const { data, error } = await supabase
        .from('metricas_financieras')
        .select('ingresos_totales')
        .eq('user_id', userId)
        .order('periodo', { ascending: false })
        .limit(1)
        .maybeSingle();

    if (error) {
        console.error('SUPABASE ERROR (getIngresosTotales):', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
        });
    }

    return {
        data: data?.ingresos_totales || 0,
        error
    };
}

export async function getCostosTotales(userId) {
    const { data, error } = await supabase
        .from('metricas_financieras')
        .select('costos_totales')
        .eq('user_id', userId)
        .order('periodo', { ascending: false })
        .limit(1)
        .maybeSingle();

    if (error) {
        console.error('SUPABASE ERROR (getCostosTotales):', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
        });
    }

    return {
        data: data?.costos_totales || 0,
        error
    };
}

export async function getClientes(userId) {
    const { data, error } = await supabase
        .from('metricas_financieras')
        .select('clientes_nuevos, clientes_recurrentes')
        .eq('user_id', userId)
        .order('periodo', { ascending: false })
        .limit(1)
        .maybeSingle();

    if (error) console.error('Error getting clientes:', error);

    return {
        data: {
            nuevos: data?.clientes_nuevos || 0,
            recurrentes: data?.clientes_recurrentes || 0
        },
        error
    };
}

export async function getUtilidadNeta(userId) {
    const { data, error } = await supabase
        .from('metricas_financieras')
        .select('utilidad_neta, porcentaje_utilidad')
        .eq('user_id', userId)
        .order('periodo', { ascending: false })
        .limit(1)
        .maybeSingle();

    if (error) console.error('Error getting utilidad:', error);

    return {
        data: {
            valor: data?.utilidad_neta || 0,
            porcentaje: data?.porcentaje_utilidad || 0
        },
        error
    };
}

export async function getFlujoIngresos(userId, dias = 7) {
    const fechaInicio = new Date();
    fechaInicio.setDate(fechaInicio.getDate() - dias);

    const { data, error } = await supabase
        .from('metricas_financieras')
        .select('periodo, ingresos_totales, costos_totales')
        .eq('user_id', userId)
        .gte('periodo', fechaInicio.toISOString().split('T')[0])
        .order('periodo', { ascending: true });

    if (error) console.error('Error getting flujo:', error);

    const flujoData = data?.map(item => ({
        periodo: item.periodo,
        ingresos: item.ingresos_totales,
        egresos: item.costos_totales
    })) || [];

    return { data: flujoData, error };
}

export async function getAllMetricas(userId) {
    try {
        const [ingresos, costos, clientes, utilidad, flujo] = await Promise.all([
            getIngresosTotales(userId),
            getCostosTotales(userId),
            getClientes(userId),
            getUtilidadNeta(userId),
            getFlujoIngresos(userId)
        ]);

        return {
            data: {
                ingresos: ingresos.data,
                costos: costos.data,
                clientes: clientes.data,
                utilidad: utilidad.data,
                flujo: flujo.data
            },
            error: null
        };
    } catch (error) {
        console.error('Error getting all metrics:', error);
        return { data: null, error };
    }
}

export default {
    getIngresosTotales,
    getCostosTotales,
    getClientes,
    getUtilidadNeta,
    getFlujoIngresos,
    getAllMetricas
};