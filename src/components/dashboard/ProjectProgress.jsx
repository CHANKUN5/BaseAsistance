/**
 * ProjectProgress Component
 * Donut chart showing project completion progress (based on demo.png)
 */

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import Card from '../common/Card';
import './ProjectProgress.css';

export default function ProjectProgress({
    completed = 41,
    inProgress = 35,
    pending = 24,
    title = 'Project Progress'
}) {
    const total = completed + inProgress + pending;
    const completedPercent = Math.round((completed / total) * 100);

    const data = [
        { name: 'Completed', value: completed, color: '#40916C' },
        { name: 'In Progress', value: inProgress, color: '#F4A261' },
        { name: 'Pending', value: pending, color: '#E8E8E8' }
    ];

    return (
        <Card className="project-progress" padding="medium">
            <div className="project-progress__header">
                <h3 className="project-progress__title">{title}</h3>
            </div>

            <div className="project-progress__chart">
                <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={75}
                            paddingAngle={2}
                            dataKey="value"
                            startAngle={90}
                            endAngle={-270}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>

                <div className="project-progress__center">
                    <span className="project-progress__percent">{completedPercent}%</span>
                    <span className="project-progress__label">Project Ended</span>
                </div>
            </div>

            <div className="project-progress__legend">
                {data.map((item) => (
                    <div key={item.name} className="project-progress__legend-item">
                        <span
                            className="project-progress__legend-dot"
                            style={{ backgroundColor: item.color }}
                        />
                        <span className="project-progress__legend-text">{item.name}</span>
                    </div>
                ))}
            </div>
        </Card>
    );
}
