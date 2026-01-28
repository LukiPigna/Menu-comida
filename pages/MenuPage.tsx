
import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import MenuItemCard from '../components/MenuItemCard';
import type { MenuItem } from '../types';

const MenuPage: React.FC = () => {
    const { menuItems } = useAppContext();
    const [activeCategory, setActiveCategory] = useState<string>('Todos');

    const categoryOrder = ['Entradas', 'Principales', 'Acompañamientos', 'Postres', 'Bebidas'];
    
    const categories = useMemo(() => {
        const allCategories = new Set<string>(menuItems.map(item => item.category));
        const sorted = categoryOrder.filter(cat => allCategories.has(cat));
        const remaining = [...allCategories].filter(cat => !categoryOrder.includes(cat));
        return ['Todos', ...sorted, ...remaining];
    }, [menuItems]);

    const filteredMenuItems = useMemo(() => {
        if (activeCategory === 'Todos') {
            return menuItems;
        }
        return menuItems.filter(item => item.category === activeCategory);
    }, [menuItems, activeCategory]);

    const groupedMenu = menuItems.reduce((acc, item) => {
        (acc[item.category] = acc[item.category] || []).push(item);
        return acc;
    }, {} as Record<string, MenuItem[]>);

    const sortedGroupedKeys = Object.keys(groupedMenu).sort((a, b) => {
        const indexA = categoryOrder.indexOf(a);
        const indexB = categoryOrder.indexOf(b);
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
    });

    return (
        <>
            <div className="sticky top-[69px] bg-base-50/80 backdrop-blur-lg z-30 border-b border-base-200">
                <div className="container mx-auto px-4 py-3">
                    <div className="overflow-x-auto pb-2 -mb-2">
                         <div className="flex space-x-2 justify-center">
                            {categories.map(category => (
                                <button
                                    key={category}
                                    onClick={() => setActiveCategory(category)}
                                    className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors whitespace-nowrap ${
                                        activeCategory === category
                                            ? 'bg-primary-500 text-white'
                                            : 'bg-base-200 text-content hover:bg-base-300'
                                    }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                {filteredMenuItems.length > 0 ? (
                    activeCategory === 'Todos' ? (
                        sortedGroupedKeys.map(category => (
                            <div key={category} className="mb-16">
                                <h2 className="text-4xl font-serif mb-8 text-content-dark text-center">{category}</h2>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {groupedMenu[category].map(item => <MenuItemCard key={item.id} item={item} />)}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {filteredMenuItems.map(item => <MenuItemCard key={item.id} item={item} />)}
                        </div>
                    )
                ) : (
                    <div className="text-center py-20">
                        <h2 className="text-2xl font-semibold text-content-light">
                           No hay platos en esta categoría
                        </h2>
                        <p className="text-content-light mt-2">
                           Selecciona otra categoría para continuar.
                        </p>
                    </div>
                )}
            </div>
        </>
    );
};

export default MenuPage;
