
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { ShoppingCartIcon } from './icons/ShoppingCartIcon';
import CartView from './CartView';

const Header: React.FC = () => {
    const { cartCount, config } = useAppContext();
    const [isCartOpen, setIsCartOpen] = useState(false);

    return (
        <>
            <header className="bg-base-50/80 backdrop-blur-lg sticky top-0 z-40 border-b border-base-200">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <Link to="/" className="text-3xl font-serif text-content-dark hover:text-primary-700 transition-colors">
                        {config.name}
                    </Link>
                    <button
                        onClick={() => setIsCartOpen(true)}
                        className="relative text-content hover:text-primary-600 transition-colors"
                        aria-label="Abrir carrito"
                    >
                        <ShoppingCartIcon />
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-primary-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                {cartCount}
                            </span>
                        )}
                    </button>
                </div>
            </header>
            <CartView isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </>
    );
};

export default Header;
