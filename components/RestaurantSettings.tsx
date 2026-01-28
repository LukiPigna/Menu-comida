
import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import type { RestaurantConfig } from '../config';

const WhatsAppMessagePreview: React.FC<{ template: string, restaurantName: string }> = ({ template, restaurantName }) => {
    const customerData = `*DATOS DEL CLIENTE*\n▪️ *Tipo:* Delivery\n▪️ *Nombre:* Juan Pérez\n▪️ *Dirección:* Av. Siempreviva 742\n▪️ *Método de Pago:* Efectivo`;
    const orderSummary = `*RESUMEN DEL PEDIDO*\n- 2x Hamburguesa de Ejemplo ($17.00)\n- 1x Ensalada de Ejemplo ($7.00)`;
    const notesSection = `*NOTAS ADICIONALES:*\nSin pepinillos, por favor.`;
    const total = `$24.00`;

    const formattedMessage = template
        .replace('{{RESTAURANT_NAME}}', restaurantName)
        .replace('{{DATOS_CLIENTE}}', customerData)
        .replace('{{RESUMEN_PEDIDO}}', orderSummary)
        .replace('{{NOTAS}}', notesSection)
        .replace('{{TOTAL}}', total);

    return (
        <div className="mt-4 p-4 rounded-lg bg-[#E7FFDB] w-full max-w-md mx-auto shadow-inner">
            <p className="text-sm text-gray-800" style={{ whiteSpace: 'pre-wrap' }}>{formattedMessage}</p>
        </div>
    );
};


const RestaurantSettings: React.FC = () => {
    const { config, updateConfig, showToast } = useAppContext();
    const [formData, setFormData] = useState(config);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

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
    
    const handleInsertPlaceholder = (placeholder: string) => {
        if (!textareaRef.current) return;
        const textarea = textareaRef.current;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const newText = text.substring(0, start) + placeholder + text.substring(end);
        
        setFormData(prev => ({ ...prev, whatsappMessageTemplate: newText }));
        
        // Focus and set cursor position after insertion
        setTimeout(() => {
            textarea.focus();
            textarea.selectionStart = textarea.selectionEnd = start + placeholder.length;
        }, 0);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateConfig(formData);
        showToast('✓ Ajustes guardados correctamente');
    };
    
    if (!formData) return null;

    const placeholders = [
        '{{RESTAURANT_NAME}}',
        '{{DATOS_CLIENTE}}',
        '{{RESUMEN_PEDIDO}}',
        '{{NOTAS}}',
        '{{TOTAL}}'
    ];

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

            <div className="border-t pt-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Plantilla de Mensaje de WhatsApp</h3>
                 <div>
                    <label htmlFor="whatsappMessageTemplate" className="block text-sm font-medium text-gray-700">Editor de Mensaje</label>
                     <div className="mt-2 flex flex-wrap gap-2">
                        {placeholders.map(p => (
                            <button
                                type="button"
                                key={p}
                                onClick={() => handleInsertPlaceholder(p)}
                                className="bg-primary-100 text-primary-800 text-xs font-semibold px-2 py-1 rounded-full hover:bg-primary-200 transition-colors"
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                    <textarea
                        ref={textareaRef}
                        id="whatsappMessageTemplate"
                        name="whatsappMessageTemplate"
                        value={formData.whatsappMessageTemplate}
                        onChange={handleChange}
                        rows={8}
                        className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm p-2 font-mono text-sm"
                        required
                    />
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Vista Previa del Mensaje</label>
                        <WhatsAppMessagePreview template={formData.whatsappMessageTemplate} restaurantName={formData.name} />
                    </div>
                 </div>
            </div>

            <div className="border-t pt-8">
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
