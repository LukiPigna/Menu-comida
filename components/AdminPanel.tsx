
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import type { MenuItem } from '../types';
import MenuItemForm from './MenuItemForm';
import RestaurantSettings from './RestaurantSettings';
import { EditIcon } from './icons/EditIcon';
import { TrashIcon } from './icons/TrashIcon';
import { LogoutIcon } from './icons/LogoutIcon';
import { PlusIcon } from './icons/PlusIcon';

type AdminTab = 'menu' | 'settings';

const AdminPanel: React.FC = () => {
    const { menuItems, deleteMenuItem, logout } = useAppContext();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
    const [activeTab, setActiveTab] = useState<AdminTab>('menu');

    const handleAddNew = () => {
        setEditingItem(null);
        setIsFormOpen(true);
    };

    const handleEdit = (item: MenuItem) => {
        setEditingItem(item);
        setIsFormOpen(true);
    };
    
    const handleDelete = (itemId: string) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este artículo?')) {
            deleteMenuItem(itemId);
        }
    };

    return (
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl">
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 border-b pb-4">
                <h2 className="text-3xl font-bold text-gray-800 mb-3 md:mb-0">Panel de Administración</h2>
                <button onClick={logout} className="flex items-center space-x-2 text-sm text-gray-600 hover:text-primary-600 font-semibold transition self-start md:self-center">
                    <LogoutIcon />
                    <span>Cerrar Sesión</span>
                </button>
            </div>

            {/* Tab Navigation */}
            <div className="mb-6 border-b">
                <nav className="flex space-x-4">
                    <button onClick={() => setActiveTab('menu')} className={`py-2 px-4 text-sm font-medium ${activeTab === 'menu' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}>
                        Gestionar Menú
                    </button>
                    <button onClick={() => setActiveTab('settings')} className={`py-2 px-4 text-sm font-medium ${activeTab === 'settings' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}>
                        Ajustes del Restaurante
                    </button>
                </nav>
            </div>

            {/* Content based on active tab */}
            {activeTab === 'menu' && (
                <div>
                    <div className="flex justify-end mb-6">
                        <button
                            onClick={handleAddNew}
                            className="flex items-center space-x-2 bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded-lg transition"
                        >
                            <PlusIcon />
                            <span>Agregar Artículo</span>
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Imagen</th>
                                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {menuItems.map(item => (
                                    <tr key={item.id}>
                                        <td className="py-4 px-6 whitespace-nowrap">
                                            <img src={item.imageUrl} alt={item.name} className="w-16 h-12 rounded-md object-cover" />
                                        </td>
                                        <td className="py-4 px-6 whitespace-nowrap font-medium text-gray-900">{item.name}</td>
                                        <td className="py-4 px-6 whitespace-nowrap text-gray-500">{item.category}</td>
                                        <td className="py-4 px-6 whitespace-nowrap text-gray-500">${item.price.toFixed(2)}</td>
                                        <td className="py-4 px-6 whitespace-nowrap space-x-4">
                                            <button onClick={() => handleEdit(item)} className="text-blue-500 hover:text-blue-700"><EditIcon /></button>
                                            <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700"><TrashIcon /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {menuItems.length === 0 && <p className="text-center py-8 text-gray-500">No hay artículos en el menú. ¡Agrega uno!</p>}
                    </div>
                </div>
            )}

            {activeTab === 'settings' && <RestaurantSettings />}

            {isFormOpen && (
                <MenuItemForm
                    item={editingItem}
                    onClose={() => setIsFormOpen(false)}
                />
            )}
        </div>
    );
};

export default AdminPanel;
