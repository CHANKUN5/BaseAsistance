import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Header.css';

function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 19) return 'Buenas tardes';
    return 'Buenas noches';
}

export default function Header() {
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
