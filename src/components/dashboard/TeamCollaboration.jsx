/**
 * TeamCollaboration Component
 * Team members list with their current tasks (based on demo.png)
 */

import Card from '../common/Card';
import Button from '../common/Button';
import './TeamCollaboration.css';

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
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

export default function TeamCollaboration({
    members = DEFAULT_MEMBERS,
    onAddMember,
    title = 'Team Collaboration'
}) {
    return (
        <Card className="team-collaboration" padding="medium">
            <div className="team-collaboration__header">
                <h3 className="team-collaboration__title">{title}</h3>
                <Button
                    variant="secondary"
                    size="small"
                    icon={<PlusIcon />}
                    onClick={onAddMember}
                >
                    Add Member
                </Button>
            </div>

            <ul className="team-collaboration__list">
                {members.map((member) => (
                    <li key={member.id} className="team-collaboration__item">
                        <div className="team-collaboration__avatar">
                            {member.avatar ? (
                                <img src={member.avatar} alt={member.name} />
                            ) : (
                                <span>{member.name.charAt(0)}</span>
                            )}
                        </div>

                        <div className="team-collaboration__info">
                            <span className="team-collaboration__name">{member.name}</span>
                            <span className="team-collaboration__task">
                                Working on <strong>{member.task}</strong>
                            </span>
                        </div>

                        <span className={`team-collaboration__status team-collaboration__status--${member.status}`}>
                            {STATUS_LABELS[member.status]}
                        </span>
                    </li>
                ))}
            </ul>
        </Card>
    );
}
