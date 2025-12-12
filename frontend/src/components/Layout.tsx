import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import BottomNav from './BottomNav';
import FloatingActionButton from './FloatingActionButton';
import { ToastContainer } from './ui/Toast';
import { useToastStore } from '../store/toastStore';
import { Brain, Sun, Moon } from 'lucide-react';

export default function Layout() {
    const location = useLocation();
    const isLoginPage = location.pathname === '/login';
    const toasts = useToastStore((s) => s.toasts);
    const removeToast = useToastStore((s) => s.removeToast);

    return (
        <div className="min-h-screen flex flex-col text-text-primary transition-colors duration-300">
            {/* Animated Background */}
            <div className="page-background">
                <div className="orb orb-1" />
                <div className="orb orb-2" />
                <div className="orb orb-3" />
            </div>
            
            {/* Grain texture overlay */}
            <div className="grain-overlay" />

            <ToastContainer toasts={toasts} onClose={removeToast} />
            
            {/* Desktop navbar - hidden on mobile */}
            <div className="hidden md:block">
                <Navbar />
            </div>

            {/* Mobile header - simplified */}
            <header className="md:hidden sticky top-0 z-40 px-4 py-3 glass border-b border-border safe-area-top">
                <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-primary flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                            <Brain className="w-5 h-5 text-white" strokeWidth={2} />
                        </div>
                        <span className="font-serif">Мой КПТ</span>
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

// Mobile theme toggle with smooth animation
function MobileThemeToggle() {
    const [isDark, setIsDark] = React.useState(() => {
        if (typeof window !== 'undefined') {
            return document.documentElement.classList.contains('dark');
        }
        return false;
    });

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
            className="w-10 h-10 flex items-center justify-center rounded-xl glass border border-border hover:border-primary transition-all duration-300"
            aria-label="Переключить тему"
        >
            <div className="relative w-5 h-5">
                <Sun 
                    className={`absolute inset-0 w-5 h-5 text-accent transition-all duration-300 ${
                        isDark ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'
                    }`} 
                    strokeWidth={2} 
                />
                <Moon 
                    className={`absolute inset-0 w-5 h-5 text-primary transition-all duration-300 ${
                        isDark ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'
                    }`} 
                    strokeWidth={2} 
                />
            </div>
        </button>
    );
}
