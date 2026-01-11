import villa1 from '@assets/stock_images/luxury_modern_villa__af5bdb7a.jpg';
import villa2 from '@assets/stock_images/luxury_modern_villa__c8735b5a.jpg';
import villa3 from '@assets/stock_images/luxury_modern_villa__085cff89.jpg';
import villa4 from '@assets/stock_images/luxury_modern_villa__14cb313b.jpg';
import villa5 from '@assets/stock_images/luxury_modern_villa__4c791421.jpg';
import villa6 from '@assets/stock_images/luxury_modern_villa__4a9ce676.jpg';
import beach1 from '@assets/stock_images/beautiful_beachfront_b71e32a0.jpg';
import beach2 from '@assets/stock_images/beautiful_beachfront_7d5ce2f7.jpg';
import beach3 from '@assets/stock_images/beautiful_beachfront_aac13264.jpg';
import beach4 from '@assets/stock_images/beautiful_beachfront_96f08196.jpg';
import beach5 from '@assets/stock_images/beautiful_beachfront_a57ed8ae.jpg';
import beach6 from '@assets/stock_images/beautiful_beachfront_59ef3e61.jpg';
import mountain1 from '@assets/stock_images/mountain_chalet_cabi_fb4f54af.jpg';
import mountain2 from '@assets/stock_images/mountain_chalet_cabi_14c635af.jpg';
import mountain3 from '@assets/stock_images/mountain_chalet_cabi_496e3f7d.jpg';
import mountain4 from '@assets/stock_images/mountain_chalet_cabi_1af87789.jpg';
import mountain5 from '@assets/stock_images/mountain_chalet_cabi_1a6e3166.jpg';
import mountain6 from '@assets/stock_images/mountain_chalet_cabi_40f09bdd.jpg';
import urban1 from '@assets/stock_images/modern_penthouse_apa_4ad8dee2.jpg';
import urban2 from '@assets/stock_images/modern_penthouse_apa_e92f463d.jpg';
import urban3 from '@assets/stock_images/modern_penthouse_apa_99a57332.jpg';
import urban4 from '@assets/stock_images/modern_penthouse_apa_53924152.jpg';

export type Season = 'high' | 'mid' | 'low';
export type UsageMode = 'living' | 'investment' | 'rental';
export type FractionStatus = 'available' | 'reserved' | 'pre-sale';

export interface Fraction {
  id: string;
  propertyId: string;
  fractionNumber: number;
  ownershipPercentage: number;
  usageWeeks: { weekNumber: number; season: Season }[];
  usageMode: UsageMode;
  status: FractionStatus;
  price: number;
}

export interface Property {
  id: string;
  title: string;
  location: string;
  country: string;
  description: string;
  images: string[];
  totalFractions: number;
  availableFractions: number;
  startingPrice: number;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  amenities: string[];
  fractions: Fraction[];
}

const allImages = [
  [villa1, villa2, villa3, villa4, villa5, villa6],
  [beach1, beach2, beach3, beach4, beach5, beach6],
  [mountain1, mountain2, mountain3, mountain4, mountain5, mountain6],
  [urban1, urban2, urban3, urban4],
];

const locations = [
  { city: 'Marbella', country: 'Spain', type: 'villa' },
  { city: 'Santorini', country: 'Greece', type: 'villa' },
  { city: 'Algarve', country: 'Portugal', type: 'beach' },
  { city: 'Côte d\'Azur', country: 'France', type: 'beach' },
  { city: 'Amalfi Coast', country: 'Italy', type: 'beach' },
  { city: 'Aspen', country: 'USA', type: 'mountain' },
  { city: 'Chamonix', country: 'France', type: 'mountain' },
  { city: 'Zermatt', country: 'Switzerland', type: 'mountain' },
  { city: 'Manhattan', country: 'USA', type: 'urban' },
  { city: 'London', country: 'UK', type: 'urban' },
  { city: 'Dubai', country: 'UAE', type: 'urban' },
  { city: 'Monaco', country: 'Monaco', type: 'urban' },
  { city: 'Ibiza', country: 'Spain', type: 'beach' },
  { city: 'Mykonos', country: 'Greece', type: 'beach' },
  { city: 'Bali', country: 'Indonesia', type: 'villa' },
  { city: 'Phuket', country: 'Thailand', type: 'beach' },
  { city: 'St. Moritz', country: 'Switzerland', type: 'mountain' },
  { city: 'Lake Como', country: 'Italy', type: 'villa' },
  { city: 'Barcelona', country: 'Spain', type: 'urban' },
  { city: 'Miami Beach', country: 'USA', type: 'beach' },
];

const propertyTitles: Record<string, string[]> = {
  villa: ['Modern Villa with Infinity Pool', 'Contemporary Estate', 'Luxury Private Villa', 'Designer Residence', 'Architectural Masterpiece', 'Exclusive Villa Retreat'],
  beach: ['Beachfront Paradise', 'Oceanview Sanctuary', 'Coastal Dream Home', 'Seaside Luxury Estate', 'Beach House Haven', 'Waterfront Villa'],
  mountain: ['Alpine Chalet', 'Mountain Lodge Retreat', 'Ski-in Ski-out Residence', 'Highland Sanctuary', 'Peak View Estate', 'Forest Cabin Luxury'],
  urban: ['Penthouse Suite', 'City View Apartment', 'Downtown Luxury Loft', 'Metropolitan Residence'],
};

function getImagesByType(type: string): string[] {
  const typeIndex = type === 'villa' ? 0 : type === 'beach' ? 1 : type === 'mountain' ? 2 : 3;
  const images = allImages[typeIndex];
  const shuffled = [...images].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(4, shuffled.length));
}

function generateFractions(propertyId: string, count: number): Fraction[] {
  const fractions: Fraction[] = [];
  const seasons: Season[] = ['high', 'mid', 'low'];
  const usageModes: UsageMode[] = ['living', 'investment', 'rental'];
  const statuses: FractionStatus[] = ['available', 'reserved', 'pre-sale'];

  for (let i = 1; i <= count; i++) {
    const usageWeeks: { weekNumber: number; season: Season }[] = [];
    const baseWeek = Math.floor(Math.random() * 50) + 1;
    
    for (let w = 0; w < 3; w++) {
      usageWeeks.push({
        weekNumber: ((baseWeek + w * 17) % 52) + 1,
        season: seasons[w % 3],
      });
    }

    fractions.push({
      id: `${propertyId}-F${i.toString().padStart(2, '0')}`,
      propertyId,
      fractionNumber: i,
      ownershipPercentage: Number((100 / count).toFixed(2)),
      usageWeeks,
      usageMode: usageModes[Math.floor(Math.random() * usageModes.length)],
      status: Math.random() > 0.3 ? 'available' : statuses[Math.floor(Math.random() * statuses.length)],
      price: Math.floor(50000 + Math.random() * 200000),
    });
  }

  return fractions;
}

export const properties: Property[] = locations.map((loc, index) => {
  const titles = propertyTitles[loc.type];
  const title = titles[index % titles.length];
  const fractions = generateFractions(`P${(index + 1).toString().padStart(3, '0')}`, 14);
  const availableFractions = fractions.filter(f => f.status === 'available').length;

  return {
    id: `P${(index + 1).toString().padStart(3, '0')}`,
    title,
    location: loc.city,
    country: loc.country,
    description: `Experience luxury living in this stunning ${loc.type === 'villa' ? 'private villa' : loc.type === 'beach' ? 'beachfront property' : loc.type === 'mountain' ? 'mountain retreat' : 'urban residence'} located in the heart of ${loc.city}. This exceptional property offers world-class amenities and breathtaking views, perfect for both personal enjoyment and investment opportunities.`,
    images: getImagesByType(loc.type),
    totalFractions: 14,
    availableFractions,
    startingPrice: Math.min(...fractions.map(f => f.price)),
    propertyType: loc.type.charAt(0).toUpperCase() + loc.type.slice(1),
    bedrooms: Math.floor(3 + Math.random() * 4),
    bathrooms: Math.floor(2 + Math.random() * 3),
    sqft: Math.floor(2000 + Math.random() * 4000),
    amenities: ['Pool', 'Spa', 'Gym', 'Concierge', 'Private Parking', 'Smart Home'].slice(0, 4 + Math.floor(Math.random() * 3)),
    fractions,
  };
});

export function getPropertyById(id: string): Property | undefined {
  return properties.find(p => p.id === id);
}

export function getFractionById(propertyId: string, fractionId: string): Fraction | undefined {
  const property = getPropertyById(propertyId);
  return property?.fractions.find(f => f.id === fractionId);
}

export function getWeekDateRange(weekNumber: number, year: number = 2026): { start: Date; end: Date } {
  const firstDayOfYear = new Date(year, 0, 1);
  const daysOffset = (weekNumber - 1) * 7;
  const start = new Date(firstDayOfYear.getTime() + daysOffset * 24 * 60 * 60 * 1000);
  const end = new Date(start.getTime() + 6 * 24 * 60 * 60 * 1000);
  return { start, end };
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export const userDashboard = {
  ownedProperties: [properties[0], properties[3]],
  ownedFractions: [
    { property: properties[0], fraction: properties[0].fractions[2] },
    { property: properties[3], fraction: properties[3].fractions[5] },
  ],
  upcomingWeeks: [
    { property: properties[0], fraction: properties[0].fractions[2], week: properties[0].fractions[2].usageWeeks[0] },
  ],
};
