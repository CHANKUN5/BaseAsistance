import { useAuth } from '../context/AuthContext';
import { Layout } from '../components/layout';
import { Card, Button } from '../components/common';
import './Profile.css';

export default function Profile() {
    const { user, logout } = useAuth();

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleLogout = async () => {
        await logout();
    };

    if (!user) return null;

    const userInitial = (user.user_metadata?.name || user.email || 'U').charAt(0).toUpperCase();

    return (
        <Layout title="Mi Perfil" subtitle="Gestiona tu información personal">
            <div className="profile-page">
                <div className="profile-cards-container">
                    <div className="profile-header-card">
                        <div className="profile-cover"></div>
                        <div className="profile-avatar-container">
                            <div className="profile-avatar">
                                {userInitial}
                            </div>
                        </div>
                        <div className="profile-info-header">
                            <h2>{user.user_metadata?.name || 'Usuario'}</h2>
                            <p className="profile-email">{user.email}</p>
                            <div className="profile-role-badge">Usuario</div>
                        </div>
                    </div>

                    <Card className="profile-details-card">
                        <div className="card-header">
                            <h3>Información Personal</h3>
                        </div>
                        <div className="profile-details-list">
                            <div className="detail-item">
                                <span className="detail-label">Nombre Completo</span>
                                <span className="detail-value">{user.user_metadata?.name || 'No especificado'}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Correo Electrónico</span>
                                <span className="detail-value">{user.email}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">ID de Usuario</span>
                                <span className="detail-value mono">{user.id}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Fecha de Registro</span>
                                <span className="detail-value">{formatDate(user.created_at)}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Último Acceso</span>
                                <span className="detail-value">{formatDate(user.last_sign_in_at)}</span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </Layout>
    );
}
