import type { MenuItem } from '../types';
import type { RestaurantConfig } from '../config';

export type RestaurantBootstrapConfig = Omit<RestaurantConfig, 'adminPassword' | 'menu'>;

export async function loadBootstrapRestaurantConfig(): Promise<RestaurantBootstrapConfig | null> {
  try {
    const res = await fetch(`${import.meta.env.BASE_URL}config/restaurant.json`, { cache: 'no-store' });
    if (!res.ok) return null;
    return (await res.json()) as RestaurantBootstrapConfig;
  } catch {
    return null;
  }
}

export async function loadBootstrapMenu(): Promise<MenuItem[] | null> {
  try {
    const res = await fetch(`${import.meta.env.BASE_URL}config/menu.json`, { cache: 'no-store' });
    if (!res.ok) return null;
    return (await res.json()) as MenuItem[];
  } catch {
    return null;
  }
}
