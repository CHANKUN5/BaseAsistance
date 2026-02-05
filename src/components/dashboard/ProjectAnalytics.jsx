import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import Card from '../common/Card';
import './ProjectAnalytics.css';

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

        return flujoData.slice(-7).map((item, index) => {
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
        <Card className="project-analytics" padding="medium">
            <div className="project-analytics__header">
                <h3 className="project-analytics__title">{title}</h3>
                <p className="project-analytics__subtitle">Últimos 7 días</p>
            </div>

            <div className="project-analytics__chart">
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={data} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                        <XAxis
                            dataKey="day"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#8C8C8C', fontSize: 12 }}
                        />
                        <YAxis hide />
                        <Tooltip
                            cursor={false}
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    return (
                                        <div className="project-analytics__tooltip">
                                            {formatCurrency(payload[0].value)}
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Bar
                            dataKey="value"
                            radius={[8, 8, 8, 8]}
                            barSize={40}
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.isHighlight ? '#40916C' : '#D8F3DC'}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
}
