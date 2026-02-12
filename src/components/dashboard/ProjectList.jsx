import React from 'react';
import { Card, CardHeader, CardContent, Button } from '../ui';

const PlusIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

export default function ProjectList({ projects = [] }) {
    return (
        <Card className="h-full">
            <CardHeader title="Projects" subtitle="Manage your ongoing projects">
                <Button variant="secondary" size="sm" icon={<PlusIcon />}>
                    New
                </Button>
            </CardHeader>
            <CardContent>
                <div className="space-y-1">
                    {projects.map((project) => (
                        <div
                            key={project.id}
                            className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-all duration-200 cursor-pointer border border-transparent hover:border-slate-100"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xl transition-transform group-hover:scale-110">
                                    {project.icon}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                                        {project.name}
                                    </span>
                                    <span className="text-xs text-slate-500">
                                        Due: {project.dueDate}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <path d="M9 18l6-6-6-6" />
                                </svg>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
