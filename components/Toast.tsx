
import React, { useEffect, useState } from 'react';

interface ToastProps {
    message: string;
    isVisible: boolean;
}

const Toast: React.FC<ToastProps> = ({ message, isVisible }) => {
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
        if (isVisible) {
            setShouldRender(true);
        }
    }, [isVisible]);

    const handleAnimationEnd = () => {
        if (!isVisible) {
            setShouldRender(false);
        }
    };

    if (!shouldRender) {
        return null;
    }

    return (
        <div
            onAnimationEnd={handleAnimationEnd}
            className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-[100] p-4 rounded-lg shadow-lg bg-content-dark text-white text-sm font-semibold transition-all duration-300 ${isVisible ? 'animate-fade-in-up' : 'animate-fade-out-down'}`}
        >
            {message}
        </div>
    );
};

export default Toast;
