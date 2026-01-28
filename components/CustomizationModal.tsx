
import React, { useState, useEffect } from 'react';
import type { MenuItem } from '../types';

interface CustomizationModalProps {
    isOpen: boolean;
    onClose: () => void;
    item: MenuItem;
    onSave: (selectedOptions: { title: string; choice: string }[]) => void;
}

const CustomizationModal: React.FC<CustomizationModalProps> = ({ isOpen, onClose, item, onSave }) => {
    const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (isOpen && item.customizations) {
            const initialSelections: { [key: string]: string } = {};
            item.customizations.forEach(category => {
                if (category.options.length > 0) {
                    initialSelections[category.title] = category.options[0].name;
                }
            });
            setSelectedOptions(initialSelections);
        }
    }, [item.customizations, isOpen]);

    if (!isOpen) return null;

    const handleOptionChange = (title: string, choice: string) => {
        setSelectedOptions(prev => ({ ...prev, [title]: choice }));
    };

    const handleSave = () => {
        const formattedOptions = Object.entries(selectedOptions).map(([title, choice]) => ({ title, choice }));
        onSave(formattedOptions);
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 transition-opacity duration-300"
            onClick={onClose} 
            role="dialog" 
            aria-modal="true"
        >
            <div 
                className="bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-6 border-b border-base-200">
                    <h3 className="text-2xl font-bold font-serif text-content-dark">{item.name}</h3>
                    <p className="text-sm text-content-light mt-1">{item.description}</p>
                </div>
                <div className="p-6 space-y-6 max-h-[50vh] overflow-y-auto">
                    {item.customizations?.map((category, catIndex) => (
                        <fieldset key={catIndex}>
                            <legend className="text-lg font-semibold text-content-dark mb-3">{category.title}</legend>
                            <div className="space-y-3">
                                {category.options.map((option, optIndex) => (
                                    <label key={optIndex} className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${selectedOptions[category.title] === option.name ? 'bg-primary-50 border-primary-500 ring-2 ring-primary-500' : 'border-base-300 hover:bg-base-100'}`}>
                                        <input
                                            type="radio"
                                            name={category.title}
                                            value={option.name}
                                            checked={selectedOptions[category.title] === option.name}
                                            onChange={() => handleOptionChange(category.title, option.name)}
                                            className="sr-only"
                                        />
                                        <span className="text-sm text-content font-medium">{option.name}</span>
                                    </label>
                                ))}
                            </div>
                        </fieldset>
                    ))}
                </div>
                <div className="bg-base-100 px-6 py-4 flex justify-end space-x-3 rounded-b-lg">
                    <button type="button" onClick={onClose} className="bg-white py-2 px-4 border border-base-300 rounded-full shadow-sm text-sm font-medium text-content hover:bg-base-100">Cancelar</button>
                    <button onClick={handleSave} className="bg-primary-600 text-white py-2 px-5 rounded-full shadow-sm text-sm font-medium hover:bg-primary-700">Agregar al Pedido</button>
                </div>
            </div>
        </div>
    );
};

export default CustomizationModal;
