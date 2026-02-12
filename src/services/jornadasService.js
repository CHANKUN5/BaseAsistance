import { supabase } from './supabase';

export async function iniciarJornada(userId) {
    console.log("Service: iniciarJornada called for", userId);
    try {
        const now = new Date();
        // Use local date format YYYY-MM-DD instead of UTC to avoid offset issues
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const fecha = `${year}-${month}-${day}`;
        const hora_inicio = now.toTimeString().split(' ')[0];

        const { data, error } = await supabase
            .from('jornadas')
            .insert([{
                usuario_id: userId,
                fecha,
                hora_inicio,
                estado: 'activa'
            }])
            .select()
            .single();

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error("Error iniciando jornada:", error);
        return { data: null, error };
    }
}

export async function pausarJornada(jornadaId) {
    try {
        const hora_pausa = new Date().toTimeString().split(' ')[0];
        const { data, error } = await supabase
            .from('jornadas')
            .update({ estado: 'pausada', hora_pausa })
            .eq('id', jornadaId)
            .select()
            .single();

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error("Error pausando jornada:", error);
        return { data: null, error };
    }
}

export async function finalizarJornada(jornadaId) {
    try {
        const { data: currentJornada, error: fetchError } = await supabase
            .from('jornadas')
            .select('fecha, hora_inicio')
            .eq('id', jornadaId)
            .single();

        if (fetchError) throw fetchError;

        const now = new Date();
        const horaFin = now.toTimeString().split(' ')[0];

        // Calculate worked time
        const startDateTime = new Date(`${currentJornada.fecha}T${currentJornada.hora_inicio}`);
        const diffInMs = now.getTime() - startDateTime.getTime();

        // Convert to HH:MM:SS format
        const totalSeconds = Math.max(0, Math.floor(diffInMs / 1000));
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;

        const horasTrabajadas = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

        const { data, error } = await supabase
            .from('jornadas')
            .update({
                estado: 'finalizada',
                hora_fin: horaFin,
                horas_trabajadas: horasTrabajadas
            })
            .eq('id', jornadaId)
            .select()
            .single();

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error("Error finalizando jornada:", error);
        return { data: null, error };
    }
}

export async function getJornadaActiva(userId) {
    try {
        const { data, error } = await supabase
            .from('jornadas')
            .select('*')
            .eq('usuario_id', userId)
            .in('estado', ['activa', 'pausada'])
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error("Error obteniendo jornada activa:", error);
        return { data: null, error };
    }
}

export async function getHistorialJornadas(userId, limit = 50) {
    try {
        const { data, error } = await supabase
            .from('jornadas')
            .select('*')
            .eq('usuario_id', userId)
            .order('fecha', { ascending: false })
            .order('hora_inicio', { ascending: false })
            .limit(limit);

        if (error) throw error;

        return { data: data || [], error: null };
    } catch (error) {
        console.error("Error obteniendo historial:", error);
        return { data: [], error };
    }
}

export default {
    iniciarJornada,
    pausarJornada,
    finalizarJornada,
    getJornadaActiva,
    getHistorialJornadas
};