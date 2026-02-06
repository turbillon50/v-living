export type Category = 'Propiedades' | 'Yachts' | 'Experiences' | 'Commercial' | 'Rewards' | 'LastMinute';

export interface Property {
  id: string;
  category: Category;
  title: string;
  location: string;
  description: string;
  images: string[];
  conditions: string[];
}

export const categories: { id: Category; label: string }[] = [
  { id: 'Propiedades', label: 'Propiedades' },
  { id: 'Yachts', label: 'Yachts' },
  { id: 'Experiences', label: 'Experiences' },
  { id: 'Commercial', label: 'Commercial' },
  { id: 'Rewards', label: 'Rewards & Benefits' },
  { id: 'LastMinute', label: 'Last Minute Access' },
];

export const properties: Property[] = [];

export type Season = 'high' | 'mid' | 'low';
export type UsageMode = 'living' | 'investment' | 'rental';

export interface UsageWeek {
  weekNumber: number;
  season: Season;
}

export interface Fraction {
  id: string;
  fractionNumber: number;
  ownershipPercentage: number;
  price: number;
  status: 'available' | 'reserved' | 'pre-sale';
  usageMode: UsageMode;
  usageWeeks: UsageWeek[];
}

export function getPropertyById(id: string): Property | undefined {
  return properties.find(p => p.id === id);
}

export function getFractionById(_propertyId: string, _fractionId: string): Fraction | undefined {
  return undefined;
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(price);
}

export function getWeekDateRange(weekNumber: number): { start: Date; end: Date } {
  const year = new Date().getFullYear();
  const start = new Date(year, 0, 1 + (weekNumber - 1) * 7);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  return { start, end };
}

export function generateWeeks() {
  return Array.from({ length: 52 }, (_, i) => ({
    weekNumber: i + 1,
    available: true
  }));
}
