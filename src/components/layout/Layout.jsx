import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import './Layout.css';

export default function Layout({ children, title, subtitle }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);

    return (
        <div className="layout">
            <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

            {isSidebarOpen && (
                <div className="layout__overlay" onClick={closeSidebar} />
            )}

            <div className="layout__main">
                <Header onMenuClick={toggleSidebar} />
                <main className="layout__content">
                    {(title || subtitle) && (
                        <div className="layout__page-header">
                            {title && <h1 className="layout__page-title">{title}</h1>}
                            {subtitle && <p className="layout__page-subtitle">{subtitle}</p>}
                        </div>
                    )}
                    {children}
                </main>
            </div>
        </div>
    );
}
