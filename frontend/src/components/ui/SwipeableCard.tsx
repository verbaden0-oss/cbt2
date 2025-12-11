import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { Trash2 } from 'lucide-react';

interface SwipeableCardProps {
    children: React.ReactNode;
    onDelete: () => void;
    className?: string;
}

export const SwipeableCard: React.FC<SwipeableCardProps> = ({ children, onDelete, className = '' }) => {
    const x = useMotionValue(0);
    const [isDragging, setIsDragging] = useState(false);

    // Transform x value to opacity/color for background
    const backgroundOpacity = useTransform(x, [-100, 0], [1, 0]);
    const iconScale = useTransform(x, [-100, -20], [1, 0.5]);

    const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        setIsDragging(false);
        if (info.offset.x < -100) {
            // Swiped far enough
            onDelete();
        }
    };

    return (
        <div className={`relative overflow-hidden rounded-xl ${className}`}>
            {/* Background Action Layer */}
            <motion.div
                style={{ opacity: backgroundOpacity }}
                className="absolute inset-0 bg-red-500 flex items-center justify-end px-6 rounded-xl"
            >
                <motion.div style={{ scale: iconScale }}>
                    <Trash2 className="w-6 h-6 text-white" />
                </motion.div>
            </motion.div>

            {/* Foreground Content Layer */}
            <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={{ left: 0.5, right: 0.05 }}
                onDragStart={() => setIsDragging(true)}
                onDragEnd={handleDragEnd}
                style={{ x }}
                className="bg-white dark:bg-gray-800 relative z-10 rounded-xl"
                whileTap={{ cursor: 'grabbing' }}
            >
                {children}
            </motion.div>
        </div>
    );
};
