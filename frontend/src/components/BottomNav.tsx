import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const navItems = [
    { path: '/', icon: '🏠', label: 'Главная' },
    { path: '/dashboard', icon: '📊', label: 'Статистика' },
    { path: '/journal', icon: '📝', label: 'Дневник' },
    { path: '/cbt', icon: '🧠', label: 'КПТ' },
    { path: '/sobriety', icon: '🛡️', label: 'Трезвость' },
];

export default function BottomNav() {
    const location = useLocation();
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

    // Hide on login page
    if (location.pathname === '/login') return null;

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 safe-area-bottom">
            {/* Glass background with blur */}
            <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/90 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-700/50" />

            <div className="relative flex items-center justify-around h-16 px-2">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;

                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={`flex flex-col items-center justify-center w-16 h-14 rounded-2xl transition-all duration-300 ${isActive
                                    ? 'bg-primary/10 scale-105'
                                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                                }`}
                        >
                            <span className={`text-xl mb-0.5 transition-transform ${isActive ? 'scale-110' : ''}`}>
                                {item.icon}
                            </span>
                            <span className={`text-[10px] font-medium transition-colors ${isActive
                                    ? 'text-primary'
                                    : 'text-text-secondary'
                                }`}>
                                {item.label}
                            </span>

                            {/* Active indicator dot */}
                            {isActive && (
                                <span className="absolute bottom-1 w-1 h-1 bg-primary rounded-full" />
                            )}
                        </NavLink>
                    );
                })}

                {/* Profile/Login button */}
                <NavLink
                    to={isAuthenticated ? '/achievements' : '/login'}
                    className={`flex flex-col items-center justify-center w-16 h-14 rounded-2xl transition-all duration-300 ${location.pathname === '/login' || location.pathname === '/achievements'
                            ? 'bg-primary/10 scale-105'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                >
                    <span className="text-xl mb-0.5">
                        {isAuthenticated ? '🏆' : '👤'}
                    </span>
                    <span className={`text-[10px] font-medium ${location.pathname === '/login' || location.pathname === '/achievements'
                            ? 'text-primary'
                            : 'text-text-secondary'
                        }`}>
                        {isAuthenticated ? 'Бейджи' : 'Войти'}
                    </span>
                </NavLink>
            </div>
        </nav>
    );
}
