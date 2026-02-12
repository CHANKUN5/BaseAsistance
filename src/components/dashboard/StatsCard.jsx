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
    const variants = {
        default: 'from-white to-slate-50 border-slate-200',
        highlight: 'from-blue-600 to-blue-700 text-white border-blue-500 shadow-blue-200',
        success: 'from-emerald-500 to-emerald-600 text-white border-emerald-400 shadow-emerald-200',
        danger: 'from-rose-500 to-rose-600 text-white border-rose-400 shadow-rose-200'
    };

    const isWhite = variant === 'default';

    return (
        <div
            onClick={onClick}
            className={`
                bg-gradient-to-br ${variants[variant] || variants.default} 
                rounded-2xl p-6 shadow-xl border 
                transition-all duration-300 hover:scale-[1.02] 
                flex flex-col gap-4 relative overflow-hidden group
                ${onClick ? 'cursor-pointer' : ''}
            `}
        >
            {/* Glossy overlay for non-white cards */}
            {!isWhite && (
                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all duration-500"></div>
            )}

            <div className="flex justify-between items-start relative z-10">
                <span className={`text-sm font-semibold uppercase tracking-wider ${isWhite ? 'text-slate-500' : 'text-white/80'}`}>
                    {title}
                </span>
                {trend && (
                    <span className={`
                        flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold
                        ${isWhite ? 'bg-slate-100 text-slate-600' : 'bg-white/20 text-white'}
                    `}>
                        {trend.icon} {trend.type === 'up' ? '↑' : '↓'}
                    </span>
                )}
            </div>

            <div className="relative z-10">
                <div className={`font-black tracking-tight leading-none truncate ${typeof value === 'string' && value.length > 15 ? 'text-2xl' : 'text-4xl'} ${isWhite ? 'text-slate-900' : 'text-white'}`}>
                    {value}
                </div>
                {subtitle && (
                    <div className={`mt-2 text-sm font-medium ${isWhite ? 'text-slate-400' : 'text-white/70'}`}>
                        {subtitle}
                    </div>
                )}
            </div>
        </div>
    );
}
