import { Card, CardContent, CardHeader } from '../ui';
import { Button } from '../ui';

// Demo team members
const DEFAULT_MEMBERS = [
    {
        id: 1,
        name: 'Alexandra Deff',
        task: 'Github Project Repository',
        status: 'completed',
        avatar: null
    },
    {
        id: 2,
        name: 'Edwin Adenike',
        task: 'Integrate User Authentication System',
        status: 'in-progress',
        avatar: null
    },
    {
        id: 3,
        name: 'Isaac Oluwatemilorun',
        task: 'Develop Search and Filter Functionality',
        status: 'pending',
        avatar: null
    },
    {
        id: 4,
        name: 'David Oshodi',
        task: 'Responsive Layout for Homepage',
        status: 'in-progress',
        avatar: null
    }
];

const STATUS_LABELS = {
    'completed': 'Completed',
    'in-progress': 'In Progress',
    'pending': 'Pending'
};

const PlusIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

export default function TeamCollaboration({
    members = DEFAULT_MEMBERS,
    onAddMember,
    title = 'Team Collaboration'
}) {
    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'bg-emerald-100 text-emerald-700';
            case 'in-progress': return 'bg-amber-100 text-amber-700';
            default: return 'bg-slate-100 text-slate-600';
        }
    };

    return (
        <Card className="h-full">
            <CardHeader title={title}>
                <Button variant="secondary" size="sm" icon={<PlusIcon />} onClick={onAddMember}>
                    Add Member
                </Button>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col space-y-4">
                    {members.map((member) => (
                        <div key={member.id} className="flex items-center gap-4 py-3 border-b border-slate-100 last:border-0 last:pb-0">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                                {member.avatar ? (
                                    <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-blue-700 font-semibold">{member.name.charAt(0)}</span>
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-900 truncate">{member.name}</p>
                                <p className="text-xs text-slate-500 truncate mt-0.5">
                                    Working on <span className="font-medium text-slate-700">{member.task}</span>
                                </p>
                            </div>

                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}>
                                {STATUS_LABELS[member.status]}
                            </span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
