/**
 * StatsCard Component
 * Statistics card for dashboard metrics (based on demo.png)
 */

import Card from '../common/Card';
import './StatsCard.css';

const ArrowIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="stats-card__arrow">
        <line x1="7" y1="17" x2="17" y2="7" />
        <polyline points="7 7 17 7 17 17" />
    </svg>
);

export default function StatsCard({
    title,
    value,
    subtitle,
    trend,
    variant = 'default',
    icon = null,
    onClick
}) {
    const isHighlight = variant === 'highlight';

    return (
        <Card
            variant={variant}
            className="stats-card"
            onClick={onClick}
            hoverable={!!onClick}
        >
            <div className="stats-card__header">
                <span className="stats-card__title">{title}</span>
                <button className="stats-card__action" aria-label="Ver detalles">
                    <ArrowIcon />
                </button>
            </div>

            <div className="stats-card__value">{value}</div>

            {subtitle && (
                <div className="stats-card__footer">
                    {trend && (
                        <span className={`stats-card__trend stats-card__trend--${trend.type}`}>
                            {trend.icon || '📈'}
                        </span>
                    )}
                    <span className="stats-card__subtitle">{subtitle}</span>
                </div>
            )}
        </Card>
    );
}
