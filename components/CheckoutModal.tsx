
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    onOrderSuccess: () => void;
}

type OrderType = 'pickup' | 'delivery';
type PaymentMethod = 'cash' | 'card' | 'transfer';

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, onOrderSuccess }) => {
    const { cartItems, cartTotal, clearCart, config } = useAppContext();
    const [orderType, setOrderType] = useState<OrderType>('pickup');
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
    const [customerName, setCustomerName] = useState('');
    const [address, setAddress] = useState('');
    const [notes, setNotes] = useState('');
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const validateForm = () => {
        if (!customerName.trim()) {
            setError('Por favor, ingresa tu nombre.');
            return false;
        }
        if (orderType === 'delivery' && !address.trim()) {
            setError('Por favor, ingresa tu dirección para el delivery.');
            return false;
        }
        setError('');
        return true;
    };

    const handleConfirmOrder = () => {
        if (!validateForm() || !config) return;

        const paymentMethodText = {
            cash: 'Efectivo',
            card: 'Tarjeta',
            transfer: 'Transferencia / MP'
        }[paymentMethod];

        const customerData = `*DATOS DEL CLIENTE*\n▪️ *Tipo:* ${orderType === 'delivery' ? 'Delivery' : 'Retiro en local'}\n▪️ *Nombre:* ${customerName}` +
        (orderType === 'delivery' ? `\n▪️ *Dirección:* ${address}` : '') + `\n▪️ *Método de Pago:* ${paymentMethodText}`;

        const orderSummary = '*RESUMEN DEL PEDIDO*\n' +
            cartItems.map(item => {
                const optionsText = item.selectedOptions?.map(opt => `${opt.choice}`).join(', ') || '';
                return `- ${item.quantity}x ${item.name}${optionsText ? ` (${optionsText})` : ''} ($${(item.price * item.quantity).toFixed(2)})`;
            }).join('\n');
            
        const notesSection = notes.trim() ? `*NOTAS ADICIONALES:*\n${notes.trim()}` : '';

        const message = config.whatsappMessageTemplate
            .replace('{{RESTAURANT_NAME}}', config.name)
            .replace('{{DATOS_CLIENTE}}', customerData)
            .replace('{{RESUMEN_PEDIDO}}', orderSummary)
            .replace('{{NOTAS}}', notesSection)
            .replace('{{TOTAL}}', `$${cartTotal.toFixed(2)}`);

        const whatsappUrl = `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
        
        clearCart();
        onClose();
        onOrderSuccess();
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 z-[60] flex items-center justify-center p-4 transition-opacity duration-300" 
            onClick={onClose} 
            role="dialog" 
            aria-modal="true"
        >
            <div 
                className="bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-6 border-b border-base-200">
                    <h3 className="text-2xl font-bold font-serif text-content-dark">Completa tu Pedido</h3>
                </div>
                <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
                    <div>
                        <label className="block text-sm font-bold text-content-dark mb-2">Tipo de Entrega</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={() => setOrderType('pickup')} className={`p-3 border rounded-lg text-sm font-semibold transition-colors ${orderType === 'pickup' ? 'bg-primary-50 border-primary-500 ring-2 ring-primary-500' : 'border-base-300 hover:bg-base-100'}`}>
                                Retiro en local
                            </button>
                            <button onClick={() => setOrderType('delivery')} className={`p-3 border rounded-lg text-sm font-semibold transition-colors ${orderType === 'delivery' ? 'bg-primary-50 border-primary-500 ring-2 ring-primary-500' : 'border-base-300 hover:bg-base-100'}`}>
                                Delivery
                            </button>
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm font-bold text-content-dark mb-2">Método de Pago</label>
                        <div className="grid grid-cols-3 gap-3">
                            <button onClick={() => setPaymentMethod('cash')} className={`p-3 border rounded-lg text-sm font-semibold transition-colors ${paymentMethod === 'cash' ? 'bg-primary-50 border-primary-500 ring-2 ring-primary-500' : 'border-base-300 hover:bg-base-100'}`}>
                                Efectivo
                            </button>
                            <button onClick={() => setPaymentMethod('card')} className={`p-3 border rounded-lg text-sm font-semibold transition-colors ${paymentMethod === 'card' ? 'bg-primary-50 border-primary-500 ring-2 ring-primary-500' : 'border-base-300 hover:bg-base-100'}`}>
                                Tarjeta
                            </button>
                            <button onClick={() => setPaymentMethod('transfer')} className={`p-3 border rounded-lg text-sm font-semibold transition-colors ${paymentMethod === 'transfer' ? 'bg-primary-50 border-primary-500 ring-2 ring-primary-500' : 'border-base-300 hover:bg-base-100'}`}>
                                Transferencia
                            </button>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="name" className="block text-sm font-bold text-content-dark mb-1">Tu Nombre</label>
                        <input type="text" id="name" value={customerName} onChange={e => setCustomerName(e.target.value)} className="w-full p-2 border border-base-300 rounded-md focus:ring-primary-500 focus:border-primary-500 bg-white text-content-dark" placeholder="Ej: Juan Pérez" />
                    </div>
                    {orderType === 'delivery' && (
                         <div>
                            <label htmlFor="address" className="block text-sm font-bold text-content-dark mb-1">Dirección de Entrega</label>
                            <input type="text" id="address" value={address} onChange={e => setAddress(e.target.value)} className="w-full p-2 border border-base-300 rounded-md focus:ring-primary-500 focus:border-primary-500 bg-white text-content-dark" placeholder="Ej: Av. Siempreviva 742" />
                        </div>
                    )}
                     <div>
                        <label htmlFor="notes" className="block text-sm font-bold text-content-dark mb-1">Notas Adicionales (Opcional)</label>
                        <textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} className="w-full p-2 border border-base-300 rounded-md focus:ring-primary-500 focus:border-primary-500 bg-white text-content-dark" rows={3} placeholder="Ej: Dejar en portería, el timbre no funciona."></textarea>
                    </div>
                    {error && <p className="text-sm text-red-600">{error}</p>}
                </div>
                <div className="bg-base-100 px-6 py-4 flex flex-col sm:flex-row-reverse gap-3 rounded-b-lg">
                    <button onClick={handleConfirmOrder} className="bg-primary-600 text-white py-2.5 px-6 rounded-full shadow-sm text-sm font-bold hover:bg-primary-700 transition-colors">
                        Confirmar y Pedir por WhatsApp
                    </button>
                     <button type="button" onClick={onClose} className="bg-white py-2.5 px-6 border border-base-300 rounded-full shadow-sm text-sm font-medium text-content hover:bg-base-100">
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CheckoutModal;
