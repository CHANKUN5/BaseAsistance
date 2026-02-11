import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const MenuIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="4" y1="12" x2="20" y2="12" />
        <line x1="4" y1="6" x2="20" y2="6" />
        <line x1="4" y1="18" x2="20" y2="18" />
    </svg>
);

function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 19) return 'Buenas tardes';
    return 'Buenas noches';
}

export default function Header({ onMenuClick }) {
    const { user } = useAuth();
    const navigate = useNavigate();

    const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'Usuario';
    const userInitial = userName.charAt(0).toUpperCase();
    const greeting = getGreeting();

    function handleProfileClick() {
        navigate('/profile');
    }

    return (
        <header className="header">
            <div className="header__left">
                <button className="header__menu-toggle" onClick={onMenuClick} aria-label="Abrir menú">
                    <MenuIcon />
                </button>
            </div>

            <div className="header__right">
                <button className="header__user-section" onClick={handleProfileClick}>
                    <div className="header__avatar">
                        <span className="header__avatar-initial">{userInitial}</span>
                    </div>
                    <div className="header__user-info">
                        <span className="header__greeting">{greeting}</span>
                        <span className="header__user-name">{userName}</span>
                    </div>
                </button>
            </div>
        </header>
    );
}
