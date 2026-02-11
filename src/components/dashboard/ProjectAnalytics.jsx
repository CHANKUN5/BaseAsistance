import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { Card, CardHeader, CardContent } from '../ui';

const DAYS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

const DEFAULT_DATA = [
    { day: 'L', value: 2100, isHighlight: false },
    { day: 'M', value: 2800, isHighlight: false },
    { day: 'X', value: 2200, isHighlight: false },
    { day: 'J', value: 3100, isHighlight: true },
    { day: 'V', value: 2600, isHighlight: false },
    { day: 'S', value: 2950, isHighlight: false },
    { day: 'D', value: 3200, isHighlight: false }
];

export default function ProjectAnalytics({ flujoData, title = 'Flujo de Ingresos' }) {
    const processData = () => {
        if (!flujoData || flujoData.length === 0) {
            return DEFAULT_DATA;
        }

        return flujoData.slice(-7).map((item) => {
            const date = new Date(item.periodo);
            const dayIndex = (date.getDay() + 6) % 7;
            const isHighlight = item.ingresos === Math.max(...flujoData.slice(-7).map(d => d.ingresos));

            return {
                day: DAYS[dayIndex],
                value: item.ingresos,
                isHighlight
            };
        });
    };

    const data = processData();
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN',
            minimumFractionDigits: 0
        }).format(value);
    };

    return (
        <Card className="h-full">
            <CardHeader title={title} subtitle="Últimos 7 días" />
            <CardContent>
                <div className="w-full h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                            <XAxis
                                dataKey="day"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#94a3b8', fontSize: 12 }}
                                dy={10}
                            />
                            <YAxis hide />
                            <Tooltip
                                cursor={{ fill: 'transparent' }}
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        return (
                                            <div className="bg-slate-900 text-white px-3 py-2 rounded-lg text-sm font-medium shadow-lg">
                                                {formatCurrency(payload[0].value)}
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Bar
                                dataKey="value"
                                radius={[6, 6, 6, 6]}
                                barSize={40}
                            >
                                {data.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.isHighlight ? '#059669' : '#d1fae5'}
                                        className="transition-all duration-300 hover:opacity-80"
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
