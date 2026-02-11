import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Modal from '../common/Modal';
import Button from '../common/Button';
import './Sidebar.css';

const Icons = {
    logo: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
        </svg>
    ),
    dashboard: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
        </svg>
    ),
    clock: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
        </svg>
    ),
    calendar: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
    ),
    analytics: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
    ),
    user: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    ),
    logout: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
    { to: '/analytics', icon: Icons.analytics, label: 'Análisis' }
];

const PROFILE_ITEMS = [
    { to: '/profile', icon: Icons.user, label: 'Mi Perfil' }
];

export default function Sidebar({ isOpen, onClose }) {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleLogoutClick = () => {
        setShowLogoutModal(true);
    };

    const confirmLogout = async () => {
        const result = await logout();
        if (result.success) {
            navigate('/login');
            if (onClose) onClose();
        }
        setShowLogoutModal(false);
    };

    const handleLinkClick = () => {
        if (onClose && window.innerWidth <= 1024) {
            onClose();
        }
    };

    return (
        <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
            <div className="sidebar__logo">
                <span className="sidebar__logo-icon">{Icons.logo}</span>
                <span className="sidebar__logo-text">TimeControl</span>
            </div>

            <nav className="sidebar__nav">
                <span className="sidebar__label">MENÚ</span>
                <ul className="sidebar__menu">
                    {MENU_ITEMS.map((item) => (
                        <li key={item.to}>
                            <NavLink
                                to={item.to}
                                className={({ isActive }) =>
                                    `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
                                }
                                onClick={handleLinkClick}
                            >
                                <span className="sidebar__link-icon">{item.icon}</span>
                                <span className="sidebar__link-text">{item.label}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            <nav className="sidebar__nav sidebar__nav--general">
                <span className="sidebar__label">CUENTA</span>
                <ul className="sidebar__menu">
                    {PROFILE_ITEMS.map((item) => (
                        <li key={item.to}>
                            <NavLink
                                to={item.to}
                                className={({ isActive }) =>
                                    `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
                                }
                                onClick={handleLinkClick}
                            >
                                <span className="sidebar__link-icon">{item.icon}</span>
                                <span className="sidebar__link-text">{item.label}</span>
                            </NavLink>
                        </li>
                    ))}
                    <li>
                        <button className="sidebar__link" onClick={handleLogoutClick}>
                            <span className="sidebar__link-icon">{Icons.logout}</span>
                            <span className="sidebar__link-text">Cerrar Sesión</span>
                        </button>
                    </li>
                </ul>
            </nav>

            <Modal
                isOpen={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                title="Cerrar Sesión"
                size="small"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setShowLogoutModal(false)}>
                            Cancelar
                        </Button>
                        <Button variant="danger" onClick={confirmLogout}>
                            Cerrar Sesión
                        </Button>
                    </>
                }
            >
                <p>¿Estás seguro de que deseas cerrar tu sesión actual?</p>
            </Modal>
        </aside>
    );
}
