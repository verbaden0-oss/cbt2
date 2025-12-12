import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Button } from './ui/Button';
import { Brain, Sun, Moon, Menu, X, BarChart3, Trophy } from 'lucide-react';

export default function Navbar() {
    const logout = useAuthStore((s) => s.logout);
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDark, setIsDark] = useState(false);

    // Toggle Dark Mode
    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDark]);

    const navLinks = [
        { path: '/', label: 'Главная' },
        { path: '/dashboard', label: 'Статистика', icon: BarChart3 },
        { path: '/journal', label: 'Дневник' },
        { path: '/cbt', label: 'КПТ' },
        { path: '/sobriety', label: 'Трезвость' },
        { path: '/triggers', label: 'Триггеры' },
        { path: '/achievements', label: 'Бейджи', icon: Trophy },
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <nav className="sticky top-0 z-50 w-full glass border-b border-white/20">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="text-xl font-bold text-primary flex items-center gap-2">
                        <Brain className="w-6 h-6" strokeWidth={2} />
                        <span>Мой КПТ</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`text-sm font-medium transition-colors hover:text-primary flex items-center gap-1.5 ${isActive(link.path) ? 'text-primary font-bold' : 'text-text-secondary'
                                    }`}
                            >
                                {link.icon && React.createElement(link.icon, { className: 'w-4 h-4', strokeWidth: 2 })}
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right Side Actions */}
                    <div className="hidden md:flex items-center gap-4">
                        <button
                            onClick={() => setIsDark(!isDark)}
                            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                            aria-label="Переключить тему"
                        >
                            {isDark ? (
                                <Sun className="w-5 h-5 text-text-primary" strokeWidth={2} />
                            ) : (
                                <Moon className="w-5 h-5 text-text-primary" strokeWidth={2} />
                            )}
                        </button>

                        {!isAuthenticated ? (
                            <Link to="/login">
                                <Button size="sm">Войти</Button>
                            </Link>
                        ) : (
                            <Button variant="ghost" size="sm" onClick={logout}>
                                Выйти
                            </Button>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-4">
                        <button
                            onClick={() => setIsDark(!isDark)}
                            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                        >
                            {isDark ? (
                                <Sun className="w-5 h-5 text-text-primary" strokeWidth={2} />
                            ) : (
                                <Moon className="w-5 h-5 text-text-primary" strokeWidth={2} />
                            )}
                        </button>
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 text-text-primary focus:outline-none"
                        >
                            {isMenuOpen ? (
                                <X className="w-6 h-6" strokeWidth={2} />
                            ) : (
                                <Menu className="w-6 h-6" strokeWidth={2} />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden glass border-t border-white/20 animate-slide-up">
                    <div className="space-y-1 px-4 py-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setIsMenuOpen(false)}
                                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${isActive(link.path)
                                    ? 'bg-blue-50 text-primary'
                                    : 'text-text-secondary hover:bg-black/5 dark:hover:bg-white/5'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className="pt-4 border-t border-gray-200 dark:border-gray-700 mt-2">
                            {!isAuthenticated ? (
                                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                                    <Button fullWidth>Войти</Button>
                                </Link>
                            ) : (
                                <Button variant="ghost" fullWidth onClick={() => { logout(); setIsMenuOpen(false); }}>
                                    Выйти
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
