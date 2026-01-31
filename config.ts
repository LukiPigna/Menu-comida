
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
  adminPassword?: string; // Se guarda en el navegador (frontend).
  whatsappMessageTemplate: string;
  logoUrl: string; // URL para el logo del restaurante
  headerTextAlignment: 'left' | 'center'; // Alineación del texto/logo en la cabecera
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
  /**
   * Menú inicial.
   * Nota: el menú “real” lo mantenemos en `menuItems` (localStorage),
   * pero dejamos este campo para bootstrap/import.
   */
  menu?: MenuItem[];
}

/**
 * Fallback local: si no existe `public/config/restaurant.json` y/o `public/config/menu.json`.
 */
export const defaultRestaurantConfig: RestaurantConfig = {
  name: 'Tu Restaurante',
  whatsappNumber: '5491122334455',
  logoUrl: '',
  headerTextAlignment: 'left',
  whatsappMessageTemplate: `¡Hola {{RESTAURANT_NAME}}! Quisiera hacer el siguiente pedido:\n\n{{DATOS_CLIENTE}}\n\n{{RESUMEN_PEDIDO}}\n\n{{NOTAS}}\n\n*Total: {{TOTAL}}*`,
  theme: {
    'primary-50': '#fffbeb',
    'primary-100': '#fef3c7',
    'primary-200': '#fde68a',
    'primary-300': '#fcd34d',
    'primary-400': '#fbbf24',
    'primary-500': '#f59e0b',
    'primary-600': '#d97706',
    'primary-700': '#b45309',
    'primary-800': '#92400e',
    'primary-900': '#78350f'
  },
  menu: []
};
