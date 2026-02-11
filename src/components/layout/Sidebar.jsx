import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Icons = {
    logo: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8 text-blue-600">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
        </svg>
    ),
    dashboard: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
        </svg>
    ),
    clock: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
        </svg>
    ),
    calendar: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
    ),
    analytics: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
    ),
    users: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    ),
    settings: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
    ),
    help: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
    ),
    logout: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
    )
};

const MENU_ITEMS = [
    { to: '/dashboard', icon: Icons.dashboard, label: 'Panel de Control' },
    { to: '/jornada', icon: Icons.clock, label: 'Jornada' },
    { to: '/historial', icon: Icons.calendar, label: 'Historial' },
    { to: '/analytics', icon: Icons.analytics, label: 'Análisis' },
    { to: '/team', icon: Icons.users, label: 'Equipo' }
];

const GENERAL_ITEMS = [
    { to: '/settings', icon: Icons.settings, label: 'Configuración' },
    { to: '/help', icon: Icons.help, label: 'Ayuda' }
];

export default function Sidebar() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    async function handleLogout() {
        const result = await logout();
        if (result.success) {
            navigate('/login');
        }
    }

    return (
        <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 lg:translate-x-0 -translate-x-full lg:static flex flex-col p-6 h-screen">
            <div className="flex items-center gap-3 mb-8">
                <span className="text-blue-600">{Icons.logo}</span>
                <span className="text-xl font-bold text-slate-900">TimeControl</span>
            </div>

            <nav className="mb-6">
                <span className="block text-xs font-medium text-slate-400 tracking-wider mb-3 px-4">MENÚ</span>
                <ul className="flex flex-col gap-1">
                    {MENU_ITEMS.map((item) => (
                        <li key={item.to}>
                            <NavLink
                                to={item.to}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                                        ? 'bg-blue-50 text-blue-700'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                    }`
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        <span className={isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-500'}>
                                            {item.icon}
                                        </span>
                                        <span>{item.label}</span>
                                    </>
                                )}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            <nav className="mt-auto mb-6">
                <span className="block text-xs font-medium text-slate-400 tracking-wider mb-3 px-4">GENERAL</span>
                <ul className="flex flex-col gap-1">
                    {GENERAL_ITEMS.map((item) => (
                        <li key={item.to}>
                            <NavLink
                                to={item.to}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                                        ? 'bg-blue-50 text-blue-700'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                    }`
                                }
                            >
                                <span className="text-slate-400">
                                    {item.icon}
                                </span>
                                <span>{item.label}</span>
                            </NavLink>
                        </li>
                    ))}
                    <li>
                        <button
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                            onClick={handleLogout}
                        >
                            <span className="text-slate-400">{Icons.logout}</span>
                            <span>Cerrar Sesión</span>
                        </button>
                    </li>
                </ul>
            </nav>
        </aside>
    );
}