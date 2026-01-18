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

export function getPropertyById(id: string): Property | undefined {
  return properties.find(p => p.id === id);
}

export function generateWeeks() {
  return Array.from({ length: 52 }, (_, i) => ({
    weekNumber: i + 1,
    available: true
  }));
}
