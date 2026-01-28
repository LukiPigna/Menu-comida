
import React, { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react';
import type { MenuItem, CartItem } from '../types';
import type { RestaurantConfig } from '../config';
import { LOCAL_STORAGE_MENU_KEY, LOCAL_STORAGE_CART_KEY, LOCAL_STORAGE_CONFIG_KEY } from '../constants';
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
    config: RestaurantConfig | null;
    initializeConfig: (data: Pick<RestaurantConfig, 'name' | 'whatsappNumber' | 'adminPassword'>) => void;
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
    const [config, setConfig] = useLocalStorage<RestaurantConfig | null>(LOCAL_STORAGE_CONFIG_KEY, null);
    const [menuItems, setMenuItems] = useLocalStorage<MenuItem[]>(LOCAL_STORAGE_MENU_KEY, config?.menu || []);
    const [cartItems, setCartItems] = useLocalStorage<CartItem[]>(LOCAL_STORAGE_CART_KEY, []);
    const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [isToastVisible, setIsToastVisible] = useState(false);

    useEffect(() => {
        if (config) {
            applyTheme(config.theme);
            document.title = `${config.name} - Menú Digital`;
        } else {
            document.title = 'Configura tu Menú Digital';
        }
    }, [config]);

    const initializeConfig = (data: Pick<RestaurantConfig, 'name' | 'whatsappNumber' | 'adminPassword'>) => {
        const newConfig: RestaurantConfig = {
            ...defaultRestaurantConfig,
            name: data.name,
            whatsappNumber: data.whatsappNumber,
            adminPassword: data.adminPassword
        };
        setConfig(newConfig);
        setMenuItems(newConfig.menu);
        setIsAdminAuthenticated(true); // Auto-login after setup
    };

    const updateConfig = (newConfig: Partial<RestaurantConfig>) => {
        setConfig(prev => {
            if (!prev) return null;
            const updatedConfig = { ...prev, ...newConfig };
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
        if (config && password === config.adminPassword) {
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

    const removeFromCart = useCallback((cartId: string) => setCartItems(prev => prev.filter(item => item.cartId !== cartId)), []);

    const updateCartItemQuantity = useCallback((cartId: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(cartId);
        } else {
            setCartItems(prev => prev.map(item => item.cartId === cartId ? { ...item, quantity } : item));
        }
    }, [removeFromCart]);

    const getCartItemByMenuId = useCallback((menuId: string): CartItem | undefined => cartItems.find(item => item.id === menuId), [cartItems]);
    
    const clearCart = () => setCartItems([]);

    const cartTotal = useMemo(() => cartItems.reduce((total, item) => total + item.price * item.quantity, 0), [cartItems]);
    const cartCount = useMemo(() => cartItems.reduce((count, item) => count + item.quantity, 0), [cartItems]);

    const value = {
        config,
        initializeConfig,
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
