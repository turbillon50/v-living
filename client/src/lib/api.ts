import { Property, InsertProperty, PreBooking, InsertPreBooking } from '@shared/schema';

const API_BASE = '/api';

// Properties
export async function getProperties(): Promise<Property[]> {
  const res = await fetch(`${API_BASE}/properties`);
  if (!res.ok) throw new Error('Failed to fetch properties');
  return res.json();
}

export async function getPropertyById(id: string): Promise<Property> {
  const res = await fetch(`${API_BASE}/properties/${id}`);
  if (!res.ok) throw new Error('Failed to fetch property');
  return res.json();
}

export async function getPropertiesByCategory(category: string): Promise<Property[]> {
  const res = await fetch(`${API_BASE}/properties/category/${category}`);
  if (!res.ok) throw new Error('Failed to fetch properties');
  return res.json();
}

export async function createProperty(property: InsertProperty): Promise<Property> {
  const res = await fetch(`${API_BASE}/properties`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(property),
  });
  if (!res.ok) throw new Error('Failed to create property');
  return res.json();
}

// Pre-bookings
export async function getBookedWeeks(propertyId: string): Promise<number[]> {
  const res = await fetch(`${API_BASE}/properties/${propertyId}/bookings`);
  if (!res.ok) throw new Error('Failed to fetch bookings');
  const data = await res.json();
  return data.bookedWeeks;
}

export async function createPreBooking(booking: Omit<InsertPreBooking, 'expiresAt'>): Promise<PreBooking> {
  const res = await fetch(`${API_BASE}/pre-bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(booking),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to create pre-booking');
  }
  return res.json();
}

export async function getPreBookingsByEmail(email: string): Promise<PreBooking[]> {
  const res = await fetch(`${API_BASE}/pre-bookings/${email}`);
  if (!res.ok) throw new Error('Failed to fetch bookings');
  return res.json();
}
