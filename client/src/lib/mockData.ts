import villa1 from '@assets/stock_images/luxury_modern_villa__af5bdb7a.jpg';
import villa2 from '@assets/stock_images/luxury_modern_villa__c8735b5a.jpg';
import villa3 from '@assets/stock_images/luxury_modern_villa__085cff89.jpg';
import beach1 from '@assets/stock_images/beautiful_beachfront_b71e32a0.jpg';
import beach2 from '@assets/stock_images/beautiful_beachfront_7d5ce2f7.jpg';
import mountain1 from '@assets/stock_images/mountain_chalet_cabi_fb4f54af.jpg';
import urban1 from '@assets/stock_images/modern_penthouse_apa_4ad8dee2.jpg';
import yacht1 from '@assets/stock_images/luxury_superyacht_in_c8c4f174.jpg';
import yacht2 from '@assets/stock_images/luxury_superyacht_in_8112db4a.jpg';
import commercial1 from '@assets/stock_images/modern_luxury_office_cef08e7a.jpg';
import commercial2 from '@assets/stock_images/modern_luxury_office_b44ff32f.jpg';
import experience1 from '@assets/stock_images/luxury_lifestyle_exp_660e1875.jpg';
import experience2 from '@assets/stock_images/luxury_lifestyle_exp_d4974d66.jpg';

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

export const categories: { id: Category; label: string; image: string }[] = [
  { id: 'Propiedades', label: 'Propiedades', image: villa1 },
  { id: 'Yachts', label: 'Yachts', image: yacht1 },
  { id: 'Experiences', label: 'Experiences', image: experience1 },
  { id: 'Commercial', label: 'Commercial', image: commercial1 },
  { id: 'Rewards', label: 'Rewards & Benefits', image: villa2 },
  { id: 'LastMinute', label: 'Last Minute Access', image: mountain1 },
];

export const properties: Property[] = [
  {
    id: '1',
    category: 'Propiedades',
    title: 'Casa Infinity',
    location: 'Marbella, Spain',
    description: 'A masterpiece of modern design overlooking the Mediterranean. Experience the pinnacle of coastal living with infinity pools and private beach access.',
    images: [villa1, villa2, villa3],
    conditions: ['3 Weeks Minimum', 'No Pets', 'Max 10 Guests'],
  },
  {
    id: '2',
    category: 'Yachts',
    title: 'Ocean Sovereign',
    location: 'Monaco Port',
    description: '40m Superyacht available for fractional ownership. Explore the French Riviera in unmatched style and comfort.',
    images: [yacht1, yacht2, beach1],
    conditions: ['Crew Included', 'Fuel Extra', 'Port Fees Excluded'],
  },
  {
    id: '3',
    category: 'Commercial',
    title: 'Tech Hub One',
    location: 'Dubai, UAE',
    description: 'Premium office space in the heart of Innovation District. Smart building features and exclusive networking access.',
    images: [commercial1, commercial2, urban1],
    conditions: ['Commercial License Required', '5 Year Lease Minimum'],
  },
  {
    id: '4',
    category: 'Experiences',
    title: 'Alpine Heli-Skiing',
    location: 'Zermatt, Switzerland',
    description: 'Exclusive access to untouched powder runs. Includes private guide and gourmet mountain dining.',
    images: [experience1, experience2, mountain1],
    conditions: ['Advanced Ski Level', 'Insurance Required'],
  }
];

export function getPropertyById(id: string): Property | undefined {
  return properties.find(p => p.id === id);
}

// Helper to generate weeks
export function generateWeeks() {
  return Array.from({ length: 52 }, (_, i) => ({
    weekNumber: i + 1,
    available: Math.random() > 0.3
  }));
}
