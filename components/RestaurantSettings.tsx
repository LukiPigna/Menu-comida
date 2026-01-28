
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import type { RestaurantConfig } from '../config';

const RestaurantSettings: React.FC = () => {
    const { config, updateConfig, showToast } = useAppContext();
    const [formData, setFormData] = useState(config);

    useEffect(() => {
        setFormData(config);
    }, [config]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleThemeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            theme: {
                ...prev.theme,
                [name]: value,
            }
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateConfig(formData);
        showToast('✓ Ajustes guardados correctamente');
    };
    
    if (!formData) return null;

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Información General</h3>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre del Restaurante</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="whatsappNumber" className="block text-sm font-medium text-gray-700">Número de WhatsApp</label>
                         <input
                            type="text"
                            id="whatsappNumber"
                            name="whatsappNumber"
                            value={formData.whatsappNumber}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            placeholder="Ej: 5491112345678"
                            required
                        />
                         <p className="text-xs text-gray-500 mt-1">Incluir código de país sin el símbolo '+'.</p>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Plantilla de Mensaje de WhatsApp</h3>
                 <div>
                    <label htmlFor="whatsappMessageTemplate" className="block text-sm font-medium text-gray-700">Mensaje de Pedido</label>
                    <textarea
                        id="whatsappMessageTemplate"
                        name="whatsappMessageTemplate"
                        value={formData.whatsappMessageTemplate}
                        onChange={handleChange}
                        rows={6}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 font-mono text-sm"
                        required
                    />
                    <p className="text-xs text-gray-500 mt-2">
                        Usa estas variables para autocompletar la información del pedido: <br/>
                        <code className="bg-gray-200 px-1 rounded">{`{{RESTAURANT_NAME}}`}</code>, <code className="bg-gray-200 px-1 rounded">{`{{DATOS_CLIENTE}}`}</code>, <code className="bg-gray-200 px-1 rounded">{`{{RESUMEN_PEDIDO}}`}</code>, <code className="bg-gray-200 px-1 rounded">{`{{NOTAS}}`}</code>, <code className="bg-gray-200 px-1 rounded">{`{{TOTAL}}`}</code>
                    </p>
                 </div>
            </div>

            <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Personalización de Colores</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex items-center space-x-4">
                        <label htmlFor="primary-500" className="text-sm font-medium text-gray-700">Color Principal</label>
                        <input
                            type="color"
                            id="primary-500"
                            name="primary-500"
                            value={formData.theme['primary-500']}
                            onChange={handleThemeChange}
                            className="h-10 w-10 p-1 border rounded-md"
                        />
                    </div>
                     <div className="flex items-center space-x-4">
                        <label htmlFor="primary-600" className="text-sm font-medium text-gray-700">Color Secundario (Hover)</label>
                        <input
                            type="color"
                            id="primary-600"
                            name="primary-600"
                            value={formData.theme['primary-600']}
                            onChange={handleThemeChange}
                            className="h-10 w-10 p-1 border rounded-md"
                        />
                    </div>
                </div>
                 <p className="text-xs text-gray-500 mt-2">La aplicación se actualizará en tiempo real a medida que cambies los colores.</p>
            </div>
            
            <div className="flex justify-end pt-6 border-t">
                <button
                    type="submit"
                    className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-6 rounded-lg transition"
                >
                    Guardar Ajustes
                </button>
            </div>
        </form>
    );
};

export default RestaurantSettings;
