import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader } from '../ui';

const PlayIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
);

const PauseIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <rect x="6" y="4" width="4" height="16" />
        <rect x="14" y="4" width="4" height="16" />
    </svg>
);

const StopIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <rect x="4" y="4" width="16" height="16" rx="2" />
    </svg>
);

function formatTime(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return [hours, minutes, seconds]
        .map(val => val.toString().padStart(2, '0'))
        .join(':');
}

export default function TimeTracker({
    initialSeconds = 0,
    onStart,
    onPause,
    onStop,
    autoStart = false
}) {
    const [seconds, setSeconds] = useState(initialSeconds);
    const [isRunning, setIsRunning] = useState(autoStart);

    useEffect(() => {
        let interval = null;

        if (isRunning) {
            interval = setInterval(() => {
                setSeconds(s => s + 1);
            }, 1000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isRunning]);

    const handleStart = useCallback(() => {
        setIsRunning(true);
        onStart?.();
    }, [onStart]);

    const handlePause = useCallback(() => {
        setIsRunning(false);
        onPause?.(seconds);
    }, [onPause, seconds]);

    const handleStop = useCallback(() => {
        setIsRunning(false);
        onStop?.(seconds);
        setSeconds(0);
    }, [onStop, seconds]);

    return (
        <div className="bg-gradient-to-br from-emerald-900 to-emerald-800 rounded-xl overflow-hidden relative shadow-lg h-full flex flex-col items-center justify-center p-8 text-center min-h-[250px]">
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(255,255,255,0.2)_0%,transparent_60%)]"></div>
            </div>

            <h3 className="text-white/90 font-medium text-sm mb-6 relative z-10">Time Tracker</h3>

            <div className="text-5xl font-bold text-white mb-8 tracking-wider font-mono tabular-nums relative z-10">
                {formatTime(seconds)}
            </div>

            <div className="flex items-center gap-6 relative z-10">
                {isRunning ? (
                    <button
                        className="w-14 h-14 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-white/50"
                        onClick={handlePause}
                        aria-label="Pausar"
                    >
                        <PauseIcon />
                    </button>
                ) : (
                    <button
                        className="w-14 h-14 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-white/50"
                        onClick={handleStart}
                        aria-label="Iniciar"
                    >
                        <PlayIcon />
                    </button>
                )}

                <button
                    className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleStop}
                    aria-label="Detener"
                    disabled={seconds === 0 && !isRunning}
                >
                    <StopIcon />
                </button>
            </div>
        </div>
    );
}
