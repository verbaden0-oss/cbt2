import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface FABAction {
    path: string;
    icon: string;
    label: string;
}

const pageActions: Record<string, FABAction> = {
    '/journal': { path: '/journal', icon: '✏️', label: 'Новая запись' },
    '/cbt': { path: '/cbt', icon: '➕', label: 'Новое упражнение' },
    '/triggers': { path: '/triggers', icon: '⚡', label: 'Добавить триггер' },
    '/dashboard': { path: '/journal', icon: '📝', label: 'Записать' },
    '/': { path: '/journal', icon: '📝', label: 'Начать' },
};

export default function FloatingActionButton() {
    const location = useLocation();
    const navigate = useNavigate();
    const [isExpanded, setIsExpanded] = React.useState(false);

    const action = pageActions[location.pathname];

    // Hide on certain pages
    if (!action || location.pathname === '/login') return null;

    const handleClick = () => {
        if (location.pathname === '/journal') {
            // Scroll to form or trigger modal
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            navigate(action.path);
        }
    };

    return (
        <button
            onClick={handleClick}
            className="fab md:hidden press-scale"
            aria-label={action.label}
        >
            <span className="text-2xl">{action.icon}</span>
        </button>
    );
}
