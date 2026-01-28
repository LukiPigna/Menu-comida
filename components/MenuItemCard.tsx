
import React, { useState } from 'react';
import type { MenuItem } from '../types';
import { useAppContext } from '../context/AppContext';
import QuantitySelector from './QuantitySelector';
import CustomizationModal from './CustomizationModal';
import ConfirmationModal from './ConfirmationModal';

interface MenuItemCardProps {
    item: MenuItem;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item }) => {
    const { addToCart, updateCartItemQuantity, getCartItemByMenuId } = useAppContext();
    const [isCustomizationModalOpen, setIsCustomizationModalOpen] = useState(false);
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

    const cartItem = getCartItemByMenuId(item.id);

    const handleSaveCustomization = (selectedOptions: { title: string; choice: string }[]) => {
        addToCart(item, selectedOptions);
        setIsCustomizationModalOpen(false);
    };

    const handleAddWithDefaults = () => {
        const defaultOptions = item.customizations?.map(cat => ({
            title: cat.title,
            choice: cat.options[0]?.name || ''
        })) || [];
        addToCart(item, defaultOptions);
        setIsConfirmationModalOpen(false);
    };
    
    const handleGoToCustomize = () => {
        setIsConfirmationModalOpen(false);
        setIsCustomizationModalOpen(true);
    };

    const hasCustomizations = item.customizations && item.customizations.length > 0;
    const showQuantitySelector = cartItem && !hasCustomizations;

    return (
        <>
            <div className="bg-white rounded-lg shadow-md overflow-hidden flex transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
                <img src={item.imageUrl} alt={item.name} className="w-28 h-full object-cover flex-shrink-0" />
                <div className="p-5 flex flex-col flex-grow">
                    <div>
                        <div className="flex justify-between items-start">
                            <h3 className="text-xl font-bold text-content-dark">{item.name}</h3>
                            <p className="text-xl font-bold text-content-dark ml-4 flex-shrink-0">${item.price.toFixed(2)}</p>
                        </div>
                        <p className="text-sm text-content-light mt-1">{item.description}</p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-base-200 flex items-center justify-end space-x-3">
                        {showQuantitySelector ? (
                            <QuantitySelector
                                quantity={cartItem.quantity}
                                onDecrease={() => updateCartItemQuantity(cartItem.cartId, cartItem.quantity - 1)}
                                onIncrease={() => updateCartItemQuantity(cartItem.cartId, cartItem.quantity + 1)}
                            />
                        ) : hasCustomizations ? (
                            <>
                                <button
                                    onClick={() => setIsCustomizationModalOpen(true)}
                                    className="border border-primary-500 text-primary-600 font-semibold py-2 px-5 rounded-full text-sm flex items-center justify-center transition-colors duration-200 hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                >
                                   Personalizar
                                </button>
                                <button
                                    onClick={() => setIsConfirmationModalOpen(true)}
                                    className="bg-primary-500 text-white font-semibold py-2 px-5 rounded-full text-sm flex items-center justify-center transition-colors duration-200 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                >
                                   Agregar
                                </button>
                            </>
                        ) : (
                             <button
                                onClick={() => addToCart(item)}
                                className="bg-primary-500 text-white font-semibold py-2 px-5 rounded-full text-sm flex items-center justify-center transition-colors duration-200 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            >
                               Agregar
                            </button>
                        )}
                    </div>
                </div>
            </div>
            {hasCustomizations && (
                <>
                    <CustomizationModal
                        isOpen={isCustomizationModalOpen}
                        onClose={() => setIsCustomizationModalOpen(false)}
                        item={item}
                        onSave={handleSaveCustomization}
                    />
                    <ConfirmationModal
                        isOpen={isConfirmationModalOpen}
                        onClose={() => setIsConfirmationModalOpen(false)}
                        onConfirm={handleAddWithDefaults}
                        onCustomize={handleGoToCustomize}
                    />
                </>
            )}
        </>
    );
};

export default MenuItemCard;
