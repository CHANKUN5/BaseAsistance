import { useAuth } from '../../context/AuthContext';
import './Header.css';

const DEFAULT_AVATAR = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"%3E%3Ccircle cx="12" cy="8" r="4" fill="%236b7280"/%3E%3Cpath d="M12 14c-6 0-8 3-8 5v1h16v-1c0-2-2-5-8-5z" fill="%236b7280"/%3E%3C/svg%3E';

const Icons = {
    search: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
    ),
    mail: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <polyline points="3 7 12 13 21 7" />
        </svg>
    ),
    bell: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
        <header className="header">
            <div className="header__left">
                {title && (
                    <div className="header__title-section">
                        <h1 className="header__title">{title}</h1>
                        {subtitle && <p className="header__subtitle">{subtitle}</p>}
                    </div>
                )}
            </div>

            <div className="header__center">
                <div className="header__search">
                    <span className="header__search-icon">{Icons.search}</span>
                    <input
                        type="text"
                        className="header__search-input"
                        placeholder="Buscar..."
                    />
                    <span className="header__search-shortcut">Ctrl+F</span>
                </div>
            </div>

            <div className="header__right">
                <button className="header__icon-btn" aria-label="Mensajes">
                    {Icons.mail}
                </button>
                <button className="header__icon-btn" aria-label="Notificaciones">
                    {Icons.bell}
                    <span className="header__notification-dot" />
                </button>

                <div className="header__user">
                    <img
                        src={DEFAULT_AVATAR}
                        alt={userName}
                        className="header__avatar"
                    />
                    <div className="header__user-info">
                        <span className="header__user-name">{userName}</span>
                        <span className="header__user-email">{userEmail}</span>
                    </div>
                </div>
            </div>
        </header>
    );
}
