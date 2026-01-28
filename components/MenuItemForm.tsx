
import React, { useState, useEffect } from 'react';
import type { MenuItem, CustomizationCategory, CustomizationOption } from '../types';
import { useAppContext } from '../context/AppContext';
import { TrashIcon } from './icons/TrashIcon';

interface MenuItemFormProps {
    item: MenuItem | null;
    onClose: () => void;
}

const MenuItemForm: React.FC<MenuItemFormProps> = ({ item, onClose }) => {
    const { addMenuItem, updateMenuItem } = useAppContext();
    const [formData, setFormData] = useState<Omit<MenuItem, 'id'>>({
        name: '',
        description: '',
        price: 0,
        category: '',
        imageUrl: '',
        customizations: []
    });

    useEffect(() => {
        if (item) {
            setFormData({
                name: item.name,
                description: item.description,
                price: item.price,
                category: item.category,
                imageUrl: item.imageUrl,
                customizations: item.customizations ? JSON.parse(JSON.stringify(item.customizations)) : [] // Deep copy
            });
        } else {
             setFormData({ name: '', description: '', price: 0, category: '', imageUrl: '', customizations: [] });
        }
    }, [item]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'price' ? parseFloat(value) || 0 : value }));
    };

    const handleCustomizationChange = (catIndex: number, optIndex: number, value: string) => {
        const newCustomizations = [...(formData.customizations || [])];
        newCustomizations[catIndex].options[optIndex].name = value;
        setFormData(prev => ({ ...prev, customizations: newCustomizations }));
    };

    const handleCategoryTitleChange = (catIndex: number, value: string) => {
        const newCustomizations = [...(formData.customizations || [])];
        newCustomizations[catIndex].title = value;
        setFormData(prev => ({ ...prev, customizations: newCustomizations }));
    };

    const addCategory = () => {
        const newCategory: CustomizationCategory = { title: '', options: [{ name: '' }] };
        setFormData(prev => ({ ...prev, customizations: [...(prev.customizations || []), newCategory] }));
    };

    const removeCategory = (catIndex: number) => {
        setFormData(prev => ({ ...prev, customizations: prev.customizations?.filter((_, i) => i !== catIndex) }));
    };

    const addOption = (catIndex: number) => {
        const newCustomizations = [...(formData.customizations || [])];
        newCustomizations[catIndex].options.push({ name: '' });
        setFormData(prev => ({ ...prev, customizations: newCustomizations }));
    };

    const removeOption = (catIndex: number, optIndex: number) => {
        const newCustomizations = [...(formData.customizations || [])];
        newCustomizations[catIndex].options = newCustomizations[catIndex].options.filter((_, i) => i !== optIndex);
        setFormData(prev => ({ ...prev, customizations: newCustomizations }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (item) {
            updateMenuItem({ ...formData, id: item.id });
        } else {
            addMenuItem(formData);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit} className="flex flex-col h-full">
                    <div className="p-6 border-b">
                        <h3 className="text-xl font-bold">{item ? 'Editar Artículo' : 'Nuevo Artículo'}</h3>
                    </div>
                    <div className="p-6 space-y-4 overflow-y-auto">
                        {/* Basic Info */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nombre</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Descripción</label>
                            <textarea name="description" value={formData.description} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Precio</label>
                                <input type="number" name="price" value={formData.price} onChange={handleChange} step="0.01" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Categoría</label>
                                <input type="text" name="category" value={formData.category} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">URL de Imagen</label>
                            <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                        </div>
                        
                        {/* Customizations */}
                        <div className="border-t pt-4">
                            <h4 className="text-lg font-semibold text-gray-800 mb-2">Opciones de Personalización</h4>
                            <div className="space-y-4">
                                {formData.customizations?.map((cat, catIndex) => (
                                    <div key={catIndex} className="p-4 border rounded-md bg-gray-50">
                                        <div className="flex justify-between items-center mb-2">
                                            <input 
                                                type="text" 
                                                placeholder="Título de la Categoría (ej. Tamaño)" 
                                                value={cat.title}
                                                onChange={(e) => handleCategoryTitleChange(catIndex, e.target.value)}
                                                className="font-semibold text-gray-700 border-b w-full"
                                            />
                                            <button type="button" onClick={() => removeCategory(catIndex)} className="text-red-500 hover:text-red-700 ml-4"><TrashIcon /></button>
                                        </div>
                                        <div className="space-y-2">
                                            {cat.options.map((opt, optIndex) => (
                                                <div key={optIndex} className="flex items-center">
                                                    <input 
                                                        type="text" 
                                                        placeholder="Nombre de la Opción"
                                                        value={opt.name}
                                                        onChange={(e) => handleCustomizationChange(catIndex, optIndex, e.target.value)}
                                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                                                    />
                                                    <button type="button" onClick={() => removeOption(catIndex, optIndex)} className="text-red-500 hover:text-red-700 ml-2"><TrashIcon /></button>
                                                </div>
                                            ))}
                                        </div>
                                        <button type="button" onClick={() => addOption(catIndex)} className="text-sm text-primary-600 hover:text-primary-800 font-semibold mt-2">Agregar Opción</button>
                                    </div>
                                ))}
                                <button type="button" onClick={addCategory} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg transition text-sm">
                                    + Agregar Categoría de Opción
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-3 rounded-b-lg mt-auto">
                        <button type="button" onClick={onClose} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">Cancelar</button>
                        <button type="submit" className="bg-primary-600 text-white py-2 px-4 rounded-md shadow-sm text-sm font-medium hover:bg-primary-700">{item ? 'Guardar Cambios' : 'Crear Artículo'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MenuItemForm;
