
import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { LockIcon } from './icons/LockIcon';

const AdminSetup: React.FC = () => {
    const { initializeConfig, bootstrapRestaurantConfig } = useAppContext();

    const [formData, setFormData] = useState({
        name: bootstrapRestaurantConfig?.name ?? '',
        whatsappNumber: bootstrapRestaurantConfig?.whatsappNumber ?? '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');

    // Si llega bootstrap después del primer render, precargamos si el usuario todavía no tocó el form.
    useEffect(() => {
        if (!bootstrapRestaurantConfig) return;
        setFormData(prev => {
            const shouldAutofillName = prev.name.trim().length === 0;
            const shouldAutofillWhatsapp = prev.whatsappNumber.trim().length === 0;
            if (!shouldAutofillName && !shouldAutofillWhatsapp) return prev;
            return {
                ...prev,
                name: shouldAutofillName ? bootstrapRestaurantConfig.name : prev.name,
                whatsappNumber: shouldAutofillWhatsapp ? bootstrapRestaurantConfig.whatsappNumber : prev.whatsappNumber,
            };
        });
    }, [bootstrapRestaurantConfig]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (formData.password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres.');
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }
        
        initializeConfig({
            name: formData.name,
            whatsappNumber: formData.whatsappNumber,
            adminPassword: formData.password
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-100 p-4">
            <div className="max-w-lg w-full">
                <div className="bg-white p-8 rounded-lg shadow-xl border border-base-200">
                    <div className="flex flex-col items-center mb-6">
                        <div className="bg-primary-100 p-3 rounded-full mb-3">
                            <LockIcon className="text-primary-600" />
                        </div>
                        <h2 className="text-3xl font-bold font-serif text-center text-content-dark">¡Bienvenido!</h2>
                        <p className="text-content-light text-sm mt-1 text-center">Configura la información de tu restaurante para empezar.</p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-content">Nombre del Restaurante</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="mt-1 appearance-none block w-full px-3 py-2 border border-base-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                            />
                        </div>
                         <div>
                            <label htmlFor="whatsappNumber" className="block text-sm font-medium text-content">Número de WhatsApp</label>
                            <input
                                id="whatsappNumber"
                                name="whatsappNumber"
                                type="text"
                                placeholder="Ej: 5491122334455"
                                required
                                value={formData.whatsappNumber}
                                onChange={handleChange}
                                className="mt-1 appearance-none block w-full px-3 py-2 border border-base-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                            />
                             <p className="text-xs text-gray-500 mt-1">Incluir código de país sin el símbolo '+'.</p>
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-content">Crea tu Contraseña de Administrador</label>
                             <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="mt-1 appearance-none block w-full px-3 py-2 border border-base-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-content">Confirma la Contraseña</label>
                             <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                required
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="mt-1 appearance-none block w-full px-3 py-2 border border-base-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                            />
                        </div>
                        
                        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                        
                        <div className="pt-2">
                            <button
                                type="submit"
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            >
                                Guardar y Continuar
                            </button>
                        </div>
                    </form>
                </div>
                <p className="text-xs text-gray-500 mt-4 text-center">
                    <strong>Importante:</strong> Esta configuración se guarda en tu navegador. Si borras los datos de navegación, deberás volver a configurarla.
                </p>
            </div>
        </div>
    );
};

export default AdminSetup;
