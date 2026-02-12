import React from 'react';
import { Card, CardContent } from '../ui';
import { Button } from '../ui';

const VideoIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 mr-2">
        <path d="M23 7l-7 5 7 5V7z" />
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
);

export default function ReminderCard({
    title = "Meeting with Arc Company",
    time = "02:00 pm - 04:00 pm",
    buttonText = "Start Meeting"
}) {
    return (
        <Card className="hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Reminders</h3>
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                </div>
                <div className="text-center py-4">
                    <div className="inline-flex items-center justify-center p-3 bg-blue-50 rounded-full mb-4">
                        <span className="text-2xl">📅</span>
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 mb-1">{title}</h4>
                    <p className="text-sm text-slate-500 mb-6 flex items-center justify-center gap-1">
                        <span className="opacity-70 text-lg">🕒</span> {time}
                    </p>
                    <Button variant="primary" className="w-full group">
                        <span className="flex items-center justify-center">
                            <VideoIcon />
                            {buttonText}
                        </span>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
