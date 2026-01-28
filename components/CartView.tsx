
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { PlusIcon } from './icons/PlusIcon';
import { MinusIcon } from './icons/MinusIcon';
import { TrashIcon } from './icons/TrashIcon';
import CheckoutModal from './CheckoutModal';

interface CartViewProps {
    isOpen: boolean;
    onClose: () => void;
}

const CartView: React.FC<CartViewProps> = ({ isOpen, onClose }) => {
    const { cartItems, updateCartItemQuantity, removeFromCart, cartTotal } = useAppContext();
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [isRendered, setIsRendered] = useState(false);

    useEffect(() => {
      if (isOpen) {
        setIsRendered(true);
      }
    }, [isOpen]);

    const handleTransitionEnd = () => {
      if (!isOpen) {
        setIsRendered(false);
      }
    };

    const handleProceedToCheckout = () => {
        setIsCheckoutOpen(true);
    };

    if (!isRendered) return null;

    return (
        <>
            <div 
                className={`fixed inset-0 bg-black z-50 transition-opacity duration-300 ${isOpen ? 'bg-opacity-60' : 'bg-opacity-0'}`} 
                onClick={onClose} 
                role="dialog" 
                aria-modal="true"
            >
                <div 
                    className={`bg-base-50 w-full max-w-md h-full flex flex-col shadow-2xl absolute right-0 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
                    onClick={e => e.stopPropagation()}
                    onTransitionEnd={handleTransitionEnd}
                >
                    <div className="flex justify-between items-center p-6 border-b border-base-200">
                        <h2 className="text-2xl font-bold font-serif text-content-dark">Tu Pedido</h2>
                        <button onClick={onClose} className="text-content-light hover:text-content-dark text-3xl" aria-label="Cerrar">&times;</button>
                    </div>

                    <div className="flex-grow p-6 overflow-y-auto">
                        {cartItems.length === 0 ? (
                            <p className="text-content-light text-center mt-10">Tu carrito está vacío.</p>
                        ) : (
                            <ul className="divide-y divide-base-200">
                                {cartItems.map(item => (
                                    <li key={item.cartId} className="flex items-center py-5">
                                        <img src={item.imageUrl} alt={item.name} className="w-16 h-16 rounded-lg object-cover"/>
                                        <div className="flex-grow ml-4">
                                            <h3 className="font-semibold text-content-dark">{item.name}</h3>
                                            {item.selectedOptions && (
                                                <p className="text-xs text-content-light mt-1">
                                                    {item.selectedOptions.map(opt => opt.choice).join(', ')}
                                                </p>
                                            )}
                                            <div className="flex items-center mt-2">
                                                <div className="flex items-center border border-base-200 rounded-full w-fit">
                                                    <button onClick={() => updateCartItemQuantity(item.cartId, item.quantity - 1)} className="p-1.5 text-content-light hover:bg-base-100 rounded-l-full" aria-label="Reducir cantidad"><MinusIcon /></button>
                                                    <span className="px-3 text-sm font-semibold text-content-dark">{item.quantity}</span>
                                                    <button onClick={() => updateCartItemQuantity(item.cartId, item.quantity + 1)} className="p-1.5 text-content-light hover:bg-base-100 rounded-r-full" aria-label="Aumentar cantidad"><PlusIcon /></button>
                                                </div>
                                                <button onClick={() => removeFromCart(item.cartId)} className="text-content-light hover:text-red-500 p-1 ml-auto" aria-label={`Eliminar ${item.name}`}><TrashIcon /></button>
                                            </div>
                                        </div>
                                        <span className="font-semibold text-lg text-content-dark ml-4">${(item.price * item.quantity).toFixed(2)}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {cartItems.length > 0 && (
                        <div className="p-6 border-t border-base-200 bg-white">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-lg font-semibold text-content-dark">Total</span>
                                <span className="text-2xl font-bold text-content-dark">${cartTotal.toFixed(2)}</span>
                            </div>
                            <button
                                onClick={handleProceedToCheckout}
                                className="w-full bg-primary-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-600 transition-all duration-300 text-lg shadow-lg hover:shadow-primary-500/50"
                            >
                                Continuar Pedido
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <CheckoutModal 
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
                onOrderSuccess={onClose}
            />
        </>
    );
};

export default CartView;
