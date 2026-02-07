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
        // En una app real, el cálculo de horas trabajadas debería ser más robusto (considerando pausas previas).
        // Aquí simplificamos asumiendo que el frontend o una función de base de datos lo calcula,
        // o simplemente guardamos la hora fin y dejamos que se calcule después.

        // Para este demo, vamos a dejar que el cálculo sea NULL o básico por ahora,
        // O idealmente, traer la jornada, calcular diff entre inicio y fin (menos pausas si las hubiera).

        const now = new Date();
        const horaFin = now.toTimeString().split(' ')[0];

        // NOTA: El cálculo de 'horas_trabajadas' aquí es complejo si hay múltiples pausas.
        // Lo ideal es que al finalizar, se haga un update simple de hora_fin y estado.
        // El campo 'horas_trabajadas' podría ser calculado en el cliente o vía trigger en DB.
        // Para no romper la funcionalidad, enviaremos null u omitiremos el campo calculado por ahora
        // a menos que tengamos la hora de inicio disponible.

        const { data, error } = await supabase
            .from('jornadas')
            .update({
                estado: 'finalizada',
                hora_fin: horaFin
                // horas_trabajadas: ... (se calcularía mejor en backend o con datos completos)
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