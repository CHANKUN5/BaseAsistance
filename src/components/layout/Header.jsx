import { useAuth } from '../../context/AuthContext';

const DEFAULT_AVATAR = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"%3E%3Ccircle cx="12" cy="8" r="4" fill="%236b7280"/%3E%3Cpath d="M12 14c-6 0-8 3-8 5v1h16v-1c0-2-2-5-8-5z" fill="%236b7280"/%3E%3C/svg%3E';

const Icons = {
    search: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-slate-400">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
    ),
    mail: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <polyline points="3 7 12 13 21 7" />
        </svg>
    ),
    bell: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
    )
};

export default function Header({ title, subtitle }) {
    const { user } = useAuth();

    const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'Usuario';
    const userEmail = user?.email || 'usuario@ejemplo.com';

    return (
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200">
            <div className="flex-shrink-0">
                {title && (
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
                        {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
                    </div>
                )}
            </div>

            <div className="flex-1 max-w-md mx-6 hidden md:block">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        {Icons.search}
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                        placeholder="Buscar..."
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <kbd className="inline-flex items-center border border-slate-200 rounded px-2 text-xs font-sans font-medium text-slate-400">
                            Ctrl+F
                        </kbd>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button className="p-2 text-slate-400 hover:text-slate-500 hover:bg-slate-100 rounded-full transition-colors relative">
                    {Icons.mail}
                </button>
                <button className="p-2 text-slate-400 hover:text-slate-500 hover:bg-slate-100 rounded-full transition-colors relative">
                    {Icons.bell}
                    <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                </button>

                <div className="flex items-center gap-3 pl-4 border-l border-slate-200 ml-2">
                    <img
                        src={DEFAULT_AVATAR}
                        alt={userName}
                        className="h-8 w-8 rounded-full bg-slate-100"
                    />
                    <div className="hidden md:block">
                        <p className="text-sm font-medium text-slate-700">{userName}</p>
                        <p className="text-xs text-slate-500">{userEmail}</p>
                    </div>
                </div>
            </div>
        </header>
    );
}
