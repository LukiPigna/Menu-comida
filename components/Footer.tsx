
import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const Footer: React.FC = () => {
    const { config } = useAppContext();

    return (
        <footer className="bg-base-900 text-base-100 mt-auto">
            <div className="container mx-auto px-4 py-6 text-center">
                <p className="text-sm">
                    &copy; {new Date().getFullYear()} {config?.name || 'Menú Digital'}. Todos los derechos reservados.
                </p>
                <div className="mt-2">
                    <Link to="/admin" className="text-xs text-base-300 hover:text-white transition-colors">
                        Panel de Administrador
                    </Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
