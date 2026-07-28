export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Resumen', icon: '◆' },
  { id: 'products', label: 'Productos', icon: '❀' },
  { id: 'categories', label: 'Categorías', icon: '◈' },
  { id: 'stock', label: 'Stock', icon: '▣' },
  { id: 'alerts', label: 'Alertas', icon: '⚠' },
  { id: 'reports', label: 'Reportes', icon: '✦' },
];

export const COFFEE_URL = 'https://aurora-coffee-bay.vercel.app/';
export const BOOKING_URL = 'https://aurora-booking-rho.vercel.app/';
export const DASHBOARD_URL = 'https://aurora-dashboard-tawny.vercel.app/';

const LOCAL_API = 'http://localhost:8080/api';
const RAILWAY_API = 'https://aurorainventory-production.up.railway.app/api';

export const API_BASE =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? RAILWAY_API : LOCAL_API);

export const MOVEMENT_LABELS = {
  IN: 'Entrada',
  OUT: 'Salida',
  ADJUSTMENT: 'Ajuste',
};
