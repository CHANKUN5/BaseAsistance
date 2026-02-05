/**
 * TimeTracker Component
 * Timer widget for tracking work time (based on demo.png)
 */

import { useState, useEffect, useCallback } from 'react';
import Card from '../common/Card';
import './TimeTracker.css';

const PlayIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor">
        <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
);

const PauseIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor">
        <rect x="6" y="4" width="4" height="16" />
        <rect x="14" y="4" width="4" height="16" />
    </svg>
);

const StopIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor">
        <rect x="4" y="4" width="16" height="16" rx="2" />
    </svg>
);

/**
 * Format seconds to HH:MM:SS
 */
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
        <Card className="time-tracker" variant="highlight" padding="medium">
            <div className="time-tracker__header">
                <h3 className="time-tracker__title">Time Tracker</h3>
            </div>

            <div className="time-tracker__display">
                {formatTime(seconds)}
            </div>

            <div className="time-tracker__controls">
                {isRunning ? (
                    <button
                        className="time-tracker__btn time-tracker__btn--pause"
                        onClick={handlePause}
                        aria-label="Pausar"
                    >
                        <PauseIcon />
                    </button>
                ) : (
                    <button
                        className="time-tracker__btn time-tracker__btn--play"
                        onClick={handleStart}
                        aria-label="Iniciar"
                    >
                        <PlayIcon />
                    </button>
                )}
                <button
                    className="time-tracker__btn time-tracker__btn--stop"
                    onClick={handleStop}
                    aria-label="Detener"
                    disabled={seconds === 0 && !isRunning}
                >
                    <StopIcon />
                </button>
            </div>
        </Card>
    );
}
