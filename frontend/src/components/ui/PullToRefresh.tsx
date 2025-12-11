import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Loader2, ArrowDown } from 'lucide-react';

interface PullToRefreshProps {
    onRefresh: () => Promise<void>;
    children: React.ReactNode;
}

export const PullToRefresh: React.FC<PullToRefreshProps> = ({ onRefresh, children }) => {
    const [startPoint, setStartPoint] = useState(0);
    const [pullChange, setPullChange] = useState(0);
    const [refreshing, setRefreshing] = useState(false);
    const controls = useAnimation();

    const pullThreshold = 80;

    const initTouch = (e: React.TouchEvent) => {
        if (window.scrollY === 0) {
            setStartPoint(e.touches[0].clientY);
        }
    };

    const touchMove = (e: React.TouchEvent) => {
        if (window.scrollY === 0 && startPoint > 0) {
            const pull = e.touches[0].clientY - startPoint;
            if (pull > 0) {
                setPullChange(pull < 150 ? pull : 150); // Cap at 150px
            }
        }
    };

    const endTouch = async () => {
        if (pullChange > pullThreshold) {
            setRefreshing(true);
            setPullChange(pullThreshold); // Snap to threshold
            await onRefresh();
            setRefreshing(false);
        }
        setPullChange(0);
        setStartPoint(0);
    };

    useEffect(() => {
        controls.start({ y: refreshing ? pullThreshold : pullChange });
    }, [refreshing, pullChange, controls]);

    return (
        <div
            onTouchStart={initTouch}
            onTouchMove={touchMove}
            onTouchEnd={endTouch}
            className="relative min-h-screen"
        >
            {/* Refresh Indicator */}
            <motion.div
                style={{ height: pullChange }}
                className="flex items-center justify-center overflow-hidden w-full absolute top-0 left-0 z-0"
            >
                <div className="flex items-center gap-2 text-text-secondary text-sm">
                    {refreshing ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Обновление...</span>
                        </>
                    ) : (
                        <>
                            <ArrowDown
                                className="w-5 h-5 transition-transform"
                                style={{ transform: `rotate(${pullChange > pullThreshold ? 180 : 0}deg)` }}
                            />
                            <span>{pullChange > pullThreshold ? 'Отпустите' : 'Потяните'}</span>
                        </>
                    )}
                </div>
            </motion.div>

            {/* Content */}
            <motion.div
                animate={{ y: pullChange > 0 ? pullChange : 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="relative z-10 bg-background"
            >
                {children}
            </motion.div>
        </div>
    );
};
