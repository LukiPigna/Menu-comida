
import type { MenuItem } from './types';

// ======================================================================================
// CONFIGURACIÓN POR DEFECTO DEL RESTAURANTE
// Estos son los valores que se usarán la primera vez que la aplicación se cargue,
// o si no hay ninguna configuración guardada por el administrador.
// El administrador podrá cambiar estos valores desde el panel de control.
// ======================================================================================

export interface RestaurantConfig {
  name: string;
  whatsappNumber: string;
  theme: {
    'primary-50': string;
    'primary-100': string;
    'primary-200': string;
    'primary-300': string;
    'primary-400': string;
    'primary-500': string;
    'primary-600': string;
    'primary-700': string;
    'primary-800': string;
    'primary-900': string;
  };
  menu: MenuItem[];
}

export const defaultRestaurantConfig: RestaurantConfig = {
  // Información del Restaurante
  name: 'Tu Restaurante',
  whatsappNumber: '1122334455', // Código de país sin '+' seguido del número

  // Tema de Colores por defecto (Naranja/Ámbar)
  theme: {
    'primary-50': '#fffbeb',
    'primary-100': '#fef3c7',
    'primary-200': '#fde68a',
    'primary-300': '#fcd34d',
    'primary-400': '#fbbf24',
    'primary-500': '#f59e0b', // Color principal para botones y acentos
    'primary-600': '#d97706', // Color para hover/estados activos
    'primary-700': '#b45309',
    'primary-800': '#92400e',
    'primary-900': '#78350f',
  },

  // Menú de ejemplo
  menu: [
    { 
        id: '1', 
        name: 'Hamburguesa de Ejemplo', 
        description: 'Personaliza este menú desde el panel de administración.', 
        price: 8.50, 
        category: 'Principales', 
        imageUrl: 'https://picsum.photos/id/1060/400/300',
    },
    { id: '2', name: 'Pizza de Ejemplo', description: 'Usa la contraseña "admin123" para ingresar.', price: 10.00, category: 'Principales', imageUrl: 'https://picsum.photos/id/292/400/300' },
    { id: '3', name: 'Ensalada de Ejemplo', description: 'Puedes cambiar los colores y el logo.', price: 7.00, category: 'Entradas', imageUrl: 'https://picsum.photos/id/201/400/300' },
  ]
};
