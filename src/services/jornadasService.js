import { supabase, isSupabaseConfigured } from './supabase';

let demoJornadas = [
    {
        id: 1,
        user_id: 'demo-user-id',
        fecha: '2024-02-05',
        hora_inicio: '09:00:00',
        hora_fin: '17:30:00',
        horas_trabajadas: 8.5,
        estado: 'finalizada',
        created_at: '2024-02-05T09:00:00Z'
    },
    {
        id: 2,
        user_id: 'demo-user-id',
        fecha: '2024-02-04',
        hora_inicio: '08:30:00',
        hora_fin: '16:45:00',
        horas_trabajadas: 8.25,
        estado: 'finalizada',
        created_at: '2024-02-04T08:30:00Z'
    },
    {
        id: 3,
        user_id: 'demo-user-id',
        fecha: '2024-02-03',
        hora_inicio: '09:15:00',
        hora_fin: '17:00:00',
        horas_trabajadas: 7.75,
        estado: 'finalizada',
        created_at: '2024-02-03T09:15:00Z'
    }
];

let jornadaActivaDemo = null;

export async function iniciarJornada(userId) {
    if (!isSupabaseConfigured()) {
        const nuevaJornada = {
            id: Date.now(),
            user_id: userId,
            fecha: new Date().toISOString().split('T')[0],
            hora_inicio: new Date().toTimeString().split(' ')[0],
            hora_pausa: null,
            hora_fin: null,
            horas_trabajadas: null,
            estado: 'activa',
            created_at: new Date().toISOString()
        };
        
        jornadaActivaDemo = nuevaJornada;
        return { data: nuevaJornada, error: null };
    }

    const { data, error } = await supabase
        .from('jornadas')
        .insert([
            {
                user_id: userId,
                fecha: new Date().toISOString().split('T')[0],
                hora_inicio: new Date().toTimeString().split(' ')[0],
                estado: 'activa'
            }
        ])
        .select()
        .single();

    return { data, error };
}

export async function pausarJornada(jornadaId) {
    if (!isSupabaseConfigured()) {
        if (jornadaActivaDemo && jornadaActivaDemo.id === jornadaId) {
            jornadaActivaDemo = {
                ...jornadaActivaDemo,
                estado: 'pausada',
                hora_pausa: new Date().toTimeString().split(' ')[0]
            };
            return { data: jornadaActivaDemo, error: null };
        }
        return { data: null, error: { message: 'Jornada no encontrada' } };
    }

    const { data, error } = await supabase
        .from('jornadas')
        .update({
            estado: 'pausada',
            hora_pausa: new Date().toTimeString().split(' ')[0]
        })
        .eq('id', jornadaId)
        .select()
        .single();

    return { data, error };
}

export async function finalizarJornada(jornadaId) {
    if (!isSupabaseConfigured()) {
        if (jornadaActivaDemo && jornadaActivaDemo.id === jornadaId) {
            const inicio = new Date(`${jornadaActivaDemo.fecha}T${jornadaActivaDemo.hora_inicio}`);
            const fin = new Date();
            const diff = fin - inicio;
            const horas = (diff / (1000 * 60 * 60));
            
            jornadaActivaDemo = {
                ...jornadaActivaDemo,
                estado: 'finalizada',
                hora_fin: fin.toTimeString().split(' ')[0],
                horas_trabajadas: parseFloat(horas.toFixed(2))
            };
            
            demoJornadas.unshift(jornadaActivaDemo);
            const result = { ...jornadaActivaDemo };
            jornadaActivaDemo = null;
            
            return { data: result, error: null };
        }
        return { data: null, error: { message: 'Jornada no encontrada' } };
    }

    const horaFin = new Date().toTimeString().split(' ')[0];
    
    const { data: jornada } = await supabase
        .from('jornadas')
        .select('hora_inicio, fecha')
        .eq('id', jornadaId)
        .single();

    if (jornada) {
        const inicio = new Date(`${jornada.fecha}T${jornada.hora_inicio}`);
        const fin = new Date();
        const diff = fin - inicio;
        const horas = (diff / (1000 * 60 * 60));

        const { data, error } = await supabase
            .from('jornadas')
            .update({
                estado: 'finalizada',
                hora_fin: horaFin,
                horas_trabajadas: parseFloat(horas.toFixed(2))
            })
            .eq('id', jornadaId)
            .select()
            .single();

        return { data, error };
    }

    return { data: null, error: { message: 'Jornada no encontrada' } };
}

export async function getJornadaActiva(userId) {
    if (!isSupabaseConfigured()) {
        return { 
            data: jornadaActivaDemo && jornadaActivaDemo.user_id === userId ? jornadaActivaDemo : null, 
            error: null 
        };
    }

    const { data, error } = await supabase
        .from('jornadas')
        .select('*')
        .eq('user_id', userId)
        .in('estado', ['activa', 'pausada'])
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

    return { data, error };
}

export async function getHistorialJornadas(userId, limit = 50) {
    if (!isSupabaseConfigured()) {
        return { 
            data: demoJornadas.filter(j => j.user_id === userId).slice(0, limit), 
            error: null 
        };
    }

    const { data, error } = await supabase
        .from('jornadas')
        .select('*')
        .eq('user_id', userId)
        .order('fecha', { ascending: false })
        .order('hora_inicio', { ascending: false })
        .limit(limit);

    return { data, error };
}

export default {
    iniciarJornada,
    pausarJornada,
    finalizarJornada,
    getJornadaActiva,
    getHistorialJornadas
};