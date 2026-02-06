import Card from '../common/Card';
import './StatsCard.css';

const TrendUpIcon = () => (
    <svg viewBox="0 0 20 20" fill="currentColor" className="stats-card__trend-icon">
        <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
    </svg>
);

const TrendDownIcon = () => (
    <svg viewBox="0 0 20 20" fill="currentColor" className="stats-card__trend-icon">
        <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 3.707 5.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
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
    return (
        <Card
            variant={variant}
            className="stats-card"
            onClick={onClick}
            hoverable={!!onClick}
        >
            <div className="stats-card__header">
                <span className="stats-card__title">{title}</span>
            </div>

            <div className="stats-card__value">{value}</div>

            {subtitle && (
                <div className="stats-card__footer">
                    {trend && (
                        <span className={`stats-card__trend stats-card__trend--${trend.type}`}>
                            {trend.type === 'up' ? <TrendUpIcon /> : <TrendDownIcon />}
                            <span className="stats-card__trend-text">
                                {trend.type === 'up' ? '+' : '-'}
                            </span>
                        </span>
                    )}
                    <span className="stats-card__subtitle">{subtitle}</span>
                </div>
            )}
        </Card>
    );
}
