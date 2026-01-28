
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { LockIcon } from './icons/LockIcon';

const AdminLogin: React.FC = () => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAppContext();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!login(password)) {
            setError('Contraseña incorrecta. Inténtalo de nuevo.');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            <div className="bg-white p-8 rounded-lg shadow-xl border border-base-200">
                <div className="flex flex-col items-center mb-6">
                    <div className="bg-primary-100 p-3 rounded-full mb-3">
                        <LockIcon className="text-primary-600" />
                    </div>
                    <h2 className="text-3xl font-bold font-serif text-center text-content-dark">Panel de Control</h2>
                    <p className="text-content-light text-sm mt-1">Ingresa para gestionar el menú.</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-content">Contraseña</label>
                        <div className="mt-1">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="appearance-none block w-full px-3 py-2 border border-base-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            />
                        </div>
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                            Ingresar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
