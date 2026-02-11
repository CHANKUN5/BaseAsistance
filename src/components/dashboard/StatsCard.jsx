import { Card, CardContent } from '../ui';

const ArrowIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 text-inherit">
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
    onClick
}) {
    // Defines styles based on variant
    const getVariantStyles = () => {
        if (variant === 'highlight') {
            return {
                card: 'bg-emerald-600 text-white border-none',
                action: 'bg-white/20 hover:bg-white/30 border-white/10 text-white',
                subtitle: 'text-emerald-100'
            };
        }
        return {
            card: 'bg-white text-slate-900',
            action: 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-600',
            subtitle: 'text-slate-500'
        };
    };

    const styles = getVariantStyles();

    return (
        <Card className={`${styles.card} transition-shadow hover:shadow-md cursor-pointer h-full`} onClick={onClick}>
            <CardContent className="p-5 flex flex-col gap-3 h-full">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium opacity-90">{title}</span>
                    <button className={`flex items-center justify-center w-8 h-8 rounded-lg border transition-colors ${styles.action}`} aria-label="Ver detalles">
                        <ArrowIcon />
                    </button>
                </div>

                <div className={`font-bold leading-none truncate ${typeof value === 'string' && value.length > 15 ? 'text-xl' : 'text-3xl'}`}>{value}</div>

                {subtitle && (
                    <div className="flex items-center gap-2 mt-auto pt-1">
                        {trend && (
                            <span className={`text-sm flex items-center gap-1 ${trend.type === 'up' ? 'text-emerald-500' : 'text-red-500'} ${variant === 'highlight' ? '!text-white' : ''}`}>
                                {trend.icon || '📈'}
                            </span>
                        )}
                        <span className={`text-sm ${styles.subtitle}`}>{subtitle}</span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
