import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import BottomNav from './BottomNav';
import FloatingActionButton from './FloatingActionButton';
import { ToastContainer } from './ui/Toast';
import { useToastStore } from '../store/toastStore';

export default function Layout() {
    const location = useLocation();
    const isLoginPage = location.pathname === '/login';
    const toasts = useToastStore((s) => s.toasts);
    const removeToast = useToastStore((s) => s.removeToast);

    return (
        <div className="min-h-screen flex flex-col bg-background text-text-primary transition-colors duration-300">
            <ToastContainer toasts={toasts} onClose={removeToast} />
            {/* Desktop navbar - hidden on mobile */}
            <div className="hidden md:block">
                <Navbar />
            </div>

            {/* Mobile header - simplified */}
            <header className="md:hidden sticky top-0 z-40 px-4 py-3 glass border-b border-white/10">
                <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-primary flex items-center gap-2">
                        <span className="text-2xl">🧠</span>
                        <span>Мой КПТ</span>
                    </span>
                    <MobileThemeToggle />
                </div>
            </header>

            {/* Main content with mobile padding */}
            <main className={`flex-1 pb-20 md:pb-0 ${isLoginPage ? 'pb-0' : ''}`}>
                <div className="container mx-auto px-4 py-4 md:py-8 max-w-5xl">
                    <Outlet />
                </div>
            </main>

            {/* Desktop footer - hidden on mobile */}
            <div className="hidden md:block">
                <Footer />
            </div>

            {/* Mobile bottom navigation */}
            <BottomNav />

            {/* Mobile floating action button */}
            <FloatingActionButton />
        </div>
    );
}

// Simple mobile theme toggle
function MobileThemeToggle() {
    const [isDark, setIsDark] = React.useState(false);

    React.useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDark]);

    return (
        <button
            onClick={() => setIsDark(!isDark)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 transition-colors"
            aria-label="Переключить тему"
        >
            {isDark ? '🌞' : '🌙'}
        </button>
    );
}
