import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Edit, Plus, Zap, PenTool } from 'lucide-react';

interface FABAction {
    path: string;
    icon: React.ComponentType<{ className?: string }>;
    label: string;
}

const pageActions: Record<string, FABAction> = {
    '/journal': { path: '/journal', icon: Edit, label: 'Новая запись' },
    '/cbt': { path: '/cbt', icon: Plus, label: 'Новое упражнение' },
    '/triggers': { path: '/triggers', icon: Zap, label: 'Добавить триггер' },
    '/dashboard': { path: '/journal', icon: PenTool, label: 'Записать' },
    '/': { path: '/journal', icon: PenTool, label: 'Начать' },
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
            {React.createElement(action.icon, { className: 'w-6 h-6' })}
        </button>
    );
}
