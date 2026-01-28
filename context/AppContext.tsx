
import React, { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react';
import type { MenuItem, CartItem } from '../types';
import type { RestaurantConfig } from '../config';
import { ADMIN_PASSWORD, LOCAL_STORAGE_MENU_KEY, LOCAL_STORAGE_CART_KEY, LOCAL_STORAGE_CONFIG_KEY } from '../constants';
import useLocalStorage from '../hooks/useLocalStorage';
import { defaultRestaurantConfig } from '../config';

// Función para aplicar el tema a la UI
const applyTheme = (theme: RestaurantConfig['theme']) => {
  const root = document.documentElement;
  for (const [key, value] of Object.entries(theme)) {
    root.style.setProperty(`--${key}`, value);
  }
};

interface AppContextType {
    config: RestaurantConfig;
    updateConfig: (newConfig: Partial<RestaurantConfig>) => void;
    menuItems: MenuItem[];
    cartItems: CartItem[];
    isAdminAuthenticated: boolean;
    login: (password: string) => boolean;
    logout: () => void;
    addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
    updateMenuItem: (item: MenuItem) => void;
    deleteMenuItem: (itemId: string) => void;
    addToCart: (item: MenuItem, selectedOptions?: { title: string; choice: string }[]) => void;
    updateCartItemQuantity: (cartId: string, quantity: number) => void;
    removeFromCart: (cartId: string) => void;
    clearCart: () => void;
    getCartItemByMenuId: (menuId: string) => CartItem | undefined;
    cartTotal: number;
    cartCount: number;
    toastMessage: string;
    isToastVisible: boolean;
    showToast: (message: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [config, setConfig] = useLocalStorage<RestaurantConfig>(LOCAL_STORAGE_CONFIG_KEY, defaultRestaurantConfig);
    const [menuItems, setMenuItems] = useLocalStorage<MenuItem[]>(LOCAL_STORAGE_MENU_KEY, config.menu);
    const [cartItems, setCartItems] = useLocalStorage<CartItem[]>(LOCAL_STORAGE_CART_KEY, []);
    const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [isToastVisible, setIsToastVisible] = useState(false);

    // Aplicar tema y título al cargar y cuando la configuración cambia
    useEffect(() => {
        applyTheme(config.theme);
        document.title = `${config.name} - Menú Digital`;
    }, [config]);

    const updateConfig = (newConfig: Partial<RestaurantConfig>) => {
        setConfig(prev => {
            const updatedConfig = { ...prev, ...newConfig };
            // Si el menú cambia en la configuración, actualizamos también el estado del menú
            if (newConfig.menu) {
                setMenuItems(newConfig.menu);
            }
            return updatedConfig;
        });
    };

    const showToast = useCallback((message: string) => {
        setToastMessage(message);
        setIsToastVisible(true);
        setTimeout(() => {
            setIsToastVisible(false);
        }, 3000);
    }, []);

    const login = (password: string): boolean => {
        if (password === ADMIN_PASSWORD) {
            setIsAdminAuthenticated(true);
            return true;
        }
        return false;
    };

    const logout = () => setIsAdminAuthenticated(false);

    const addMenuItem = (item: Omit<MenuItem, 'id'>) => {
        const newItem = { ...item, id: Date.now().toString() };
        setMenuItems(prev => [...prev, newItem]);
    };

    const updateMenuItem = (updatedItem: MenuItem) => {
        setMenuItems(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
    };

    const deleteMenuItem = (itemId: string) => {
        setMenuItems(prev => prev.filter(item => item.id !== itemId));
    };

    const addToCart = useCallback((item: MenuItem, selectedOptions?: { title: string; choice: string }[]) => {
        setCartItems(prev => {
            const optionsString = selectedOptions ? JSON.stringify(selectedOptions.sort((a, b) => a.title.localeCompare(b.title))) : 'default';
            const cartId = `${item.id}-${optionsString}`;
            
            const existingItem = prev.find(cartItem => cartItem.cartId === cartId);

            if (existingItem) {
                return prev.map(cartItem =>
                    cartItem.cartId === cartId ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
                );
            }

            const newCartItem: CartItem = { ...item, cartId, quantity: 1, selectedOptions };
            return [...prev, newCartItem];
        });
        showToast(`✓ ${item.name} añadido`);
    }, [showToast]);

    const removeFromCart = useCallback((cartId: string) => {
        setCartItems(prev => prev.filter(item => item.cartId !== cartId));
    }, []);

    const updateCartItemQuantity = useCallback((cartId: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(cartId);
        } else {
            setCartItems(prev => prev.map(item => item.cartId === cartId ? { ...item, quantity } : item));
        }
    }, [removeFromCart]);

    const getCartItemByMenuId = useCallback((menuId: string): CartItem | undefined => {
        return cartItems.find(item => item.id === menuId);
    }, [cartItems]);

    const clearCart = () => setCartItems([]);

    const cartTotal = useMemo(() => cartItems.reduce((total, item) => total + item.price * item.quantity, 0), [cartItems]);
    const cartCount = useMemo(() => cartItems.reduce((count, item) => count + item.quantity, 0), [cartItems]);

    const value = {
        config,
        updateConfig,
        menuItems,
        cartItems,
        isAdminAuthenticated,
        login,
        logout,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        addToCart,
        updateCartItemQuantity,
        removeFromCart,
        clearCart,
        getCartItemByMenuId,
        cartTotal,
        cartCount,
        toastMessage,
        isToastVisible,
        showToast,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};
