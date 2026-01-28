
export interface CustomizationOption {
  name: string;
  // En el futuro, se podría añadir un 'priceModifier' aquí.
}

export interface CustomizationCategory {
  title: string;
  options: CustomizationOption[];
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  customizations?: CustomizationCategory[];
}

export interface CartItem extends MenuItem {
  cartId: string; // ID único para este item en el carrito (producto + personalización)
  quantity: number;
  selectedOptions?: { title: string; choice: string }[];
}

// Interfaz exportada para ser usada en el contexto
export type { RestaurantConfig } from './config';
