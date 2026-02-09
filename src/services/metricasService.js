import { supabase, isSupabaseConfigured } from './supabase';

const demoMetricas = {
    ingresos_totales: 15750.50,
    costos_totales: 8420.25,
    clientes_nuevos: 12,
    clientes_recurrentes: 28,
    utilidad_neta: 7330.25,
    porcentaje_utilidad: 46.5
};

const demoFlujo = [
    { periodo: '2024-01-29', ingresos: 2100, egresos: 1200 },
    { periodo: '2024-01-30', ingresos: 2800, egresos: 1500 },
    { periodo: '2024-01-31', ingresos: 2200, egresos: 1100 },
    { periodo: '2024-02-01', ingresos: 3100, egresos: 1800 },
    { periodo: '2024-02-02', ingresos: 2600, egresos: 1400 },
    { periodo: '2024-02-03', ingresos: 2950, egresos: 1620 },
    { periodo: '2024-02-04', ingresos: 3200, egresos: 1700 }
];

export async function getIngresosTotales(userId) {
    if (!isSupabaseConfigured()) {
        return { data: demoMetricas.ingresos_totales, error: null };
    }

    console.log("USER ID RECIBIDO:", userId);

    const { data, error } = await supabase
        .from('metricas_financieras')
        .select('*')
        .eq('user_id', userId);

    console.log("DATA SUPABASE:", data);
    console.log("ERROR SUPABASE:", error);

    if (!data || data.length === 0) {
        return { data: 0, error };
    }

    return {
        data: data[0].ingresos_totales,
        error
    };
}


export async function getCostosTotales(userId) {
    if (!isSupabaseConfigured()) {
        return { data: demoMetricas.costos_totales, error: null };
    }

    const { data, error } = await supabase
        .from('metricas_financieras')
        .select('costos_totales')
        .eq('user_id', userId)
        .order('periodo', { ascending: false })
        .limit(1)
        .maybeSingle();


    return {
        data: data?.costos_totales || 0,
        error
    };
}

export async function getClientes(userId) {
    if (!isSupabaseConfigured()) {
        return {
            data: {
                nuevos: demoMetricas.clientes_nuevos,
                recurrentes: demoMetricas.clientes_recurrentes
            },
            error: null
        };
    }

    const { data, error } = await supabase
        .from('metricas_financieras')
        .select('clientes_nuevos, clientes_recurrentes')
        .eq('user_id', userId)
        .order('periodo', { ascending: false })
        .limit(1)
        .maybeSingle();


    return {
        data: {
            nuevos: data?.clientes_nuevos || 0,
            recurrentes: data?.clientes_recurrentes || 0
        },
        error
    };
}

export async function getUtilidadNeta(userId) {
    if (!isSupabaseConfigured()) {
        return {
            data: {
                valor: demoMetricas.utilidad_neta,
                porcentaje: demoMetricas.porcentaje_utilidad
            },
            error: null
        };
    }

    const { data, error } = await supabase
        .from('metricas_financieras')
        .select('utilidad_neta, porcentaje_utilidad')
        .eq('user_id', userId)
        .order('periodo', { ascending: false })
        .limit(1)
        .maybeSingle();


    return {
        data: {
            valor: data?.utilidad_neta || 0,
            porcentaje: data?.porcentaje_utilidad || 0
        },
        error
    };
}

export async function getFlujoIngresos(userId, dias = 7) {
    if (!isSupabaseConfigured()) {
        return { data: demoFlujo, error: null };
    }

    const fechaInicio = new Date();
    fechaInicio.setDate(fechaInicio.getDate() - dias);

    const { data, error } = await supabase
        .from('metricas_financieras')
        .select('periodo, ingresos_totales, costos_totales')
        .eq('user_id', userId)
        .gte('periodo', (() => {
            const d = fechaInicio;
            return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        })())
        .order('periodo', { ascending: true });

    const flujoData = data?.map(item => ({
        periodo: item.periodo,
        ingresos: item.ingresos_totales,
        egresos: item.costos_totales
    })) || [];

    return { data: flujoData, error };
}

export async function getAllMetricas(userId) {
    if (!isSupabaseConfigured()) {
        return {
            data: {
                ingresos: demoMetricas.ingresos_totales,
                costos: demoMetricas.costos_totales,
                clientes: {
                    nuevos: demoMetricas.clientes_nuevos,
                    recurrentes: demoMetricas.clientes_recurrentes
                },
                utilidad: {
                    valor: demoMetricas.utilidad_neta,
                    porcentaje: demoMetricas.porcentaje_utilidad
                },
                flujo: demoFlujo
            },
            error: null
        };
    }

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