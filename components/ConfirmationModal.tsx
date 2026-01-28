
import React from 'react';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    onCustomize: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, onCustomize }) => {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 transition-opacity duration-300" 
            onClick={onClose} 
            role="dialog" 
            aria-modal="true"
        >
            <div 
                className="bg-white rounded-lg shadow-xl w-full max-w-sm transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-6 text-center">
                    <h3 className="text-lg font-semibold font-serif text-content-dark">¿Agregar sin personalizar?</h3>
                    <p className="text-sm text-content-light mt-2">
                        Este plato tiene opciones. Puedes agregarlo con la configuración por defecto o personalizarlo a tu gusto.
                    </p>
                </div>
                <div className="bg-base-100 px-6 py-4 flex flex-col sm:flex-row-reverse gap-3 rounded-b-lg">
                    <button
                        onClick={onConfirm}
                        className="w-full sm:w-auto bg-primary-600 text-white py-2 px-4 rounded-full shadow-sm text-sm font-medium hover:bg-primary-700"
                    >
                        Agregar por Defecto
                    </button>
                    <button
                        onClick={onCustomize}
                        className="w-full sm:w-auto bg-white py-2 px-4 border border-base-300 rounded-full shadow-sm text-sm font-medium text-content hover:bg-base-100"
                    >
                        Ir a Personalizar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
