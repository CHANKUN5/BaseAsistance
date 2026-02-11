import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout({ children, title, subtitle }) {
    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar />
            <div className="flex-1 flex flex-col min-h-screen lg:ml-64 transition-all duration-300">
                <Header title={title} subtitle={subtitle} />
                <main className="flex-1 p-6 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
