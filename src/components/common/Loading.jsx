/**
 * Loading Component
 * Spinner and skeleton loading indicators
 */

import './Loading.css';

/**
 * Spinner Loading Indicator
 */
export default function Loading({ size = 'medium', className = '' }) {
    const classes = [
        'loading-spinner',
        `loading-spinner--${size}`,
        className
    ].filter(Boolean).join(' ');

    return (
        <div className={classes} role="status" aria-label="Cargando">
            <div className="loading-spinner__circle" />
        </div>
    );
}

/**
 * Skeleton Loading Placeholder
 */
export function Skeleton({
    width = '100%',
    height = '20px',
    variant = 'text',
    className = ''
}) {
    const classes = [
        'skeleton',
        `skeleton--${variant}`,
        className
    ].filter(Boolean).join(' ');

    const style = {
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height
    };

    return <div className={classes} style={style} aria-hidden="true" />;
}

/**
 * Full Page Loading Overlay
 */
export function LoadingOverlay({ message = 'Cargando...' }) {
    return (
        <div className="loading-overlay">
            <div className="loading-overlay__content">
                <Loading size="large" />
                {message && <p className="loading-overlay__message">{message}</p>}
            </div>
        </div>
    );
}
