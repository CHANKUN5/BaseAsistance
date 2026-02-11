import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader } from '../ui';

export default function ProjectProgress({
    completed = 41,
    inProgress = 35,
    pending = 24,
    title = 'Project Progress'
}) {
    const total = completed + inProgress + pending;
    const completedPercent = Math.round((completed / total) * 100);

    const data = [
        { name: 'Completed', value: completed, color: '#059669' },
        { name: 'In Progress', value: inProgress, color: '#f59e0b' },
        { name: 'Pending', value: pending, color: '#e2e8f0' }
    ];

    return (
        <Card className="h-full">
            <CardHeader title={title} />
            <CardContent>
                <div className="relative h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={70}
                                outerRadius={90}
                                paddingAngle={2}
                                dataKey="value"
                                startAngle={90}
                                endAngle={-270}
                                cornerRadius={4}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>

                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                        <span className="block text-4xl font-bold text-slate-900">{completedPercent}%</span>
                        <span className="block text-xs font-medium text-slate-500 uppercase tracking-wide mt-1">Project Ended</span>
                    </div>
                </div>

                <div className="flex justify-center gap-6 mt-6">
                    {data.map((item) => (
                        <div key={item.name} className="flex items-center gap-2">
                            <span
                                className="w-2.5 h-2.5 rounded-full"
                                style={{ backgroundColor: item.color }}
                            />
                            <span className="text-xs text-slate-600 font-medium">{item.name}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
