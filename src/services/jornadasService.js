import { supabase } from '../lib/supabase';

export async function iniciarJornada(userId) {
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

    if (error) {
        console.error('SUPABASE ERROR (iniciarJornada):', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
        });
        throw error;
    }

    return { data, error };
}

export async function pausarJornada(jornadaId) {
    const { data, error } = await supabase
        .from('jornadas')
        .update({
            estado: 'pausada',
            hora_pausa: new Date().toTimeString().split(' ')[0]
        })
        .eq('id', jornadaId)
        .select()
        .single();

    if (error) {
        console.error('SUPABASE ERROR (pausarJornada):', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
        });
        throw error;
    }

    return { data, error };
}

export async function finalizarJornada(jornadaId) {
    const horaFin = new Date().toTimeString().split(' ')[0];

    // Primero obtenemos la jornada para calcular horas
    const { data: jornada, error: fetchError } = await supabase
        .from('jornadas')
        .select('hora_inicio, fecha')
        .eq('id', jornadaId)
        .maybeSingle();

    if (fetchError || !jornada) {
        throw new Error('Jornada no encontrada');
    }

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
        .maybeSingle();

    if (error) {
        console.error('SUPABASE ERROR (finalizarJornada):', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
        });
        throw error;
    }

    return { data, error };
}

export async function getJornadaActiva(userId) {
    const { data, error } = await supabase
        .from('jornadas')
        .select('*')
        .eq('user_id', userId)
        .in('estado', ['activa', 'pausada'])
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

    if (error && error.code !== 'PGRST116') { // Ignorar error si no hay datos
        console.error('Error getting active jornada:', error);
    }

    return { data, error };
}

export async function getHistorialJornadas(userId, limit = 50) {
    const { data, error } = await supabase
        .from('jornadas')
        .select('*')
        .eq('user_id', userId)
        .order('fecha', { ascending: false })
        .order('hora_inicio', { ascending: false })
        .limit(limit);

    if (error) {
        console.error('Error getting historial:', error);
    }

    return { data, error };
}

export default {
    iniciarJornada,
    pausarJornada,
    finalizarJornada,
    getJornadaActiva,
    getHistorialJornadas
};