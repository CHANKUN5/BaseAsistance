import Sidebar from './Sidebar';
import Header from './Header';
import './Layout.css';

export default function Layout({ children, title, subtitle }) {
    return (
        <div className="layout">
            <Sidebar />
            <div className="layout__main">
                <Header />
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
