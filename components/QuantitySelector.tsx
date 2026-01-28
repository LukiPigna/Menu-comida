
import React from 'react';
import { MinusIcon } from './icons/MinusIcon';
import { PlusIcon } from './icons/PlusIcon';

interface QuantitySelectorProps {
    quantity: number;
    onDecrease: () => void;
    onIncrease: () => void;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({ quantity, onDecrease, onIncrease }) => {
    return (
        <div className="flex items-center border border-gray-300 rounded-full">
            <button
                onClick={onDecrease}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-l-full"
                aria-label="Reducir cantidad"
            >
                <MinusIcon />
            </button>
            <span className="px-4 text-sm font-semibold">{quantity}</span>
            <button
                onClick={onIncrease}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-r-full"
                aria-label="Aumentar cantidad"
            >
                <PlusIcon />
            </button>
        </div>
    );
};

export default QuantitySelector;
