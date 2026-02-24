import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Header } from '@/components/Header';
import { AGHFooter } from '@/components/AGHFooter';
import { useLanguage } from '@/lib/LanguageContext';
import { RealEstateListing } from '@shared/schema';
import { MapPin, Bed, Bath, Maximize, Filter, Search, Phone, Mail, ChevronRight, Building2, Home as HomeIcon, TreePine, Store, ArrowLeft, X, Heart, Crown, LayoutGrid, Landmark, Palmtree, Warehouse } from 'lucide-react';
import { Link } from 'wouter';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

const propertyTypes = [
  { value: 'todos', label: 'Todos', labelEn: 'All', Icon: LayoutGrid },
  { value: 'casa', label: 'Casa', labelEn: 'House', Icon: HomeIcon },
  { value: 'departamento', label: 'Departamento', labelEn: 'Apartment', Icon: Building2 },
  { value: 'penthouse', label: 'Penthouse', labelEn: 'Penthouse', Icon: Crown },
  { value: 'terreno', label: 'Terreno', labelEn: 'Land', Icon: Palmtree },
  { value: 'comercial', label: 'Comercial', labelEn: 'Commercial', Icon: Warehouse },
];

function formatPrice(price: number, currency: string = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(price);
}

export default function Inmobiliaria() {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [selectedType, setSelectedType] = useState('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedListing, setSelectedListing] = useState<RealEstateListing | null>(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactData, setContactData] = useState({ name: '', email: '', phone: '', message: '' });

  const { data: listings = [], isLoading } = useQuery<RealEstateListing[]>({
    queryKey: ['/api/real-estate'],
  });

  const filteredListings = listings.filter(l => {
    const matchesType = selectedType === 'todos' || l.propertyType === selectedType;
    const matchesSearch = searchQuery === '' || 
      l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const featuredListings = filteredListings.filter(l => l.isFeatured);
  const regularListings = filteredListings.filter(l => !l.isFeatured);

  if (selectedListing) {
    return (
      <div className="min-h-screen bg-[#fafcfd] pb-24">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-6">
          <button onClick={() => setSelectedListing(null)} className="flex items-center gap-2 text-[#0891b2] mb-6 hover:underline" data-testid="button-back-listings">
            <ArrowLeft className="w-4 h-4" />
            {language === 'es' ? 'Volver al listado' : 'Back to listings'}
          </button>

          {selectedListing.images && (selectedListing.images as string[]).length > 0 ? (
            <div className="relative rounded-2xl overflow-hidden mb-6 h-[300px] md:h-[400px]">
              <img src={(selectedListing.images as string[])[0]} alt={selectedListing.title} className="w-full h-full object-cover" />
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  selectedListing.status === 'disponible' ? 'bg-emerald-500/90 text-white' :
                  selectedListing.status === 'reservada' ? 'bg-amber-500/90 text-white' :
                  'bg-red-500/90 text-white'
                }`}>
                  {selectedListing.status === 'disponible' ? (language === 'es' ? 'Disponible' : 'Available') :
                   selectedListing.status === 'reservada' ? (language === 'es' ? 'Reservada' : 'Reserved') :
                   (language === 'es' ? 'Vendida' : 'Sold')}
                </span>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl bg-gradient-to-br from-[#0a1628]/5 via-[#0891b2]/10 to-[#22d3ee]/5 h-[300px] flex items-center justify-center mb-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#0891b2]/20 to-[#22d3ee]/20 flex items-center justify-center">
                <Building2 className="w-10 h-10 text-[#0891b2]/40" />
              </div>
            </div>
          )}

          {(selectedListing.images as string[])?.length > 1 && (
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {(selectedListing.images as string[]).map((img, i) => (
                <img key={i} src={img} alt="" className="w-20 h-20 rounded-lg object-cover flex-shrink-0 border-2 border-transparent hover:border-[#0891b2] cursor-pointer transition-all" />
              ))}
            </div>
          )}

          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl text-[#0a1628] mb-2" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 500 }} data-testid="text-listing-title">
                {selectedListing.title}
              </h1>
              <p className="flex items-center gap-1.5 text-[#64748b] text-sm">
                <MapPin className="w-4 h-4 text-[#0891b2]" />
                {selectedListing.location}, {selectedListing.country}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-[#0891b2]" data-testid="text-listing-price">
                {formatPrice(selectedListing.price, selectedListing.currency || 'USD')}
              </p>
              <p className="text-xs text-[#94a3b8] uppercase tracking-wider">{selectedListing.currency}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mb-6 py-4 border-y border-[#e2e8f0]">
            {selectedListing.bedrooms && (
              <div className="flex items-center gap-2 text-[#64748b]">
                <Bed className="w-4 h-4 text-[#0891b2]" />
                <span className="text-sm">{selectedListing.bedrooms} {language === 'es' ? 'Recámaras' : 'Bedrooms'}</span>
              </div>
            )}
            {selectedListing.bathrooms && (
              <div className="flex items-center gap-2 text-[#64748b]">
                <Bath className="w-4 h-4 text-[#0891b2]" />
                <span className="text-sm">{selectedListing.bathrooms} {language === 'es' ? 'Baños' : 'Bathrooms'}</span>
              </div>
            )}
            {selectedListing.sqMeters && (
              <div className="flex items-center gap-2 text-[#64748b]">
                <Maximize className="w-4 h-4 text-[#0891b2]" />
                <span className="text-sm">{selectedListing.sqMeters} m²</span>
              </div>
            )}
            {selectedListing.yearBuilt && (
              <div className="flex items-center gap-2 text-[#64748b]">
                <Building2 className="w-4 h-4 text-[#0891b2]" />
                <span className="text-sm">{language === 'es' ? 'Año' : 'Year'} {selectedListing.yearBuilt}</span>
              </div>
            )}
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-[#0a1628] mb-3" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
              {language === 'es' ? 'Descripción' : 'Description'}
            </h3>
            <p className="text-[#64748b] leading-relaxed whitespace-pre-line">{selectedListing.description}</p>
          </div>

          {(selectedListing.features as string[])?.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-[#0a1628] mb-3" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                {language === 'es' ? 'Características' : 'Features'}
              </h3>
              <div className="flex flex-wrap gap-2">
                {(selectedListing.features as string[]).map((f, i) => (
                  <span key={i} className="px-3 py-1.5 bg-[#0891b2]/5 text-[#0891b2] rounded-full text-sm border border-[#0891b2]/10">
                    {f}
                  </span>
                ))}
              </div>
            </div>
          )}

          {(selectedListing.amenities as string[])?.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-[#0a1628] mb-3" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                {language === 'es' ? 'Amenidades' : 'Amenities'}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {(selectedListing.amenities as string[]).map((a, i) => (
                  <div key={i} className="flex items-center gap-2 text-[#64748b] text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#22d3ee]" />
                    {a}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-gradient-to-br from-[#0891b2]/5 to-[#22d3ee]/5 rounded-2xl p-6 border border-[#0891b2]/10">
            <h3 className="text-lg font-semibold text-[#0a1628] mb-4" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
              {language === 'es' ? '¿Te interesa esta propiedad?' : 'Interested in this property?'}
            </h3>
            
            {selectedListing.contactPhone && (
              <a href={`https://wa.me/${selectedListing.contactPhone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola, me interesa la propiedad: ${selectedListing.title}`)}`} target="_blank" rel="noopener noreferrer" className="w-full py-3 fl-btn-primary text-sm flex items-center justify-center gap-2 mb-3" data-testid="button-whatsapp-listing">
                <Phone className="w-4 h-4" />
                {language === 'es' ? 'Contactar por WhatsApp' : 'Contact via WhatsApp'}
              </a>
            )}
            {selectedListing.contactEmail && (
              <a href={`mailto:${selectedListing.contactEmail}?subject=${encodeURIComponent(`Interés en: ${selectedListing.title}`)}`} className="w-full py-3 border border-[#0891b2] text-[#0891b2] rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-[#0891b2]/5 transition-colors" data-testid="button-email-listing">
                <Mail className="w-4 h-4" />
                {language === 'es' ? 'Enviar correo' : 'Send email'}
              </a>
            )}
            {!selectedListing.contactPhone && !selectedListing.contactEmail && (
              <a href="https://wa.me/529984292748?text=Hola,%20me%20interesa%20una%20propiedad%20en%20venta" target="_blank" rel="noopener noreferrer" className="w-full py-3 fl-btn-primary text-sm flex items-center justify-center gap-2" data-testid="button-whatsapp-general">
                <Phone className="w-4 h-4" />
                {language === 'es' ? 'Contactar asesor' : 'Contact advisor'}
              </a>
            )}

            <Link href="/creditos">
              <button className="w-full mt-3 py-3 bg-[#0a1628] text-white rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-[#0a1628]/90 transition-colors" data-testid="button-simulate-credit">
                {language === 'es' ? 'Simular Crédito Hipotecario' : 'Simulate Mortgage'}
              </button>
            </Link>
          </div>
        </div>
        <AGHFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafcfd] pb-24">
      <Header />
      
      <section className="relative overflow-hidden">
        <div className="relative h-[320px] md:h-[380px]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628] via-[#0a1628]/95 to-[#0891b2]/30" />
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
          <div className="absolute top-0 left-0 w-[400px] h-[400px] rounded-full bg-[#0891b2]/8 blur-[100px] -translate-y-1/3 -translate-x-1/4" />
          <div className="absolute bottom-0 right-0 w-[350px] h-[350px] rounded-full bg-[#22d3ee]/6 blur-[80px] translate-y-1/3 translate-x-1/4" />
          
          <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center">
            <div className="fl-fade-in">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0891b2] to-[#22d3ee] flex items-center justify-center mx-auto mb-5 shadow-lg shadow-[#0891b2]/30">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <p className="text-[#22d3ee] text-[10px] uppercase tracking-[0.35em] mb-3 font-medium">Fractional Living</p>
              <h1 className="text-3xl md:text-4xl text-white tracking-wide mb-3" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300 }} data-testid="hero-title-inmobiliaria">
                {language === 'es' ? 'Inmobiliaria' : 'Real Estate'}
              </h1>
              <p className="text-white/50 text-sm font-light max-w-md mx-auto">
                {language === 'es' ? 'Propiedades premium en venta en el Caribe y más' : 'Premium properties for sale in the Caribbean and beyond'}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-lg border border-[#e2e8f0]/60 p-4 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'es' ? 'Buscar por nombre o ubicación...' : 'Search by name or location...'}
                className="w-full pl-10 pr-4 py-2.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl text-sm focus:outline-none focus:border-[#0891b2] focus:ring-1 focus:ring-[#0891b2]/20"
                data-testid="input-search-realestate"
              />
            </div>
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-1">
            {propertyTypes.map(type => (
              <button
                key={type.value}
                onClick={() => setSelectedType(type.value)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  selectedType === type.value
                    ? 'bg-[#0891b2] text-white shadow-md shadow-[#0891b2]/20'
                    : 'bg-[#f1f5f9] text-[#64748b] hover:bg-[#0891b2]/10 hover:text-[#0891b2]'
                }`}
                data-testid={`button-filter-${type.value}`}
              >
                <type.Icon className="w-3.5 h-3.5" />
                {language === 'es' ? type.label : type.labelEn}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3].map(i => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                <div className="h-48 bg-[#e2e8f0]" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-[#e2e8f0] rounded w-3/4" />
                  <div className="h-3 bg-[#e2e8f0] rounded w-1/2" />
                  <div className="h-6 bg-[#e2e8f0] rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#0891b2]/10 to-[#22d3ee]/10 flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-10 h-10 text-[#0891b2]/30" />
            </div>
            <h3 className="text-xl text-[#0a1628] mb-2" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
              {language === 'es' ? 'No hay propiedades disponibles' : 'No properties available'}
            </h3>
            <p className="text-[#94a3b8] text-sm max-w-md mx-auto">
              {language === 'es' 
                ? 'Pronto agregaremos nuevas propiedades. Contáctanos para conocer nuestro catálogo completo.'
                : 'We will add new properties soon. Contact us to see our full catalog.'}
            </p>
            <a href="https://wa.me/529984292748?text=Hola,%20busco%20propiedades%20en%20venta" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-6 px-6 py-3 fl-btn-primary text-sm" data-testid="button-contact-empty">
              <Phone className="w-4 h-4" />
              {language === 'es' ? 'Contactar Asesor' : 'Contact Advisor'}
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map(listing => (
              <div
                key={listing.id}
                onClick={() => setSelectedListing(listing)}
                className="bg-white rounded-2xl overflow-hidden border border-[#e2e8f0]/60 hover:shadow-xl hover:shadow-[#0891b2]/5 transition-all duration-300 cursor-pointer group"
                data-testid={`card-listing-${listing.id}`}
              >
                <div className="relative h-48 overflow-hidden">
                  {(listing.images as string[])?.length > 0 ? (
                    <img src={(listing.images as string[])[0]} alt={listing.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#0a1628]/5 via-[#0891b2]/10 to-[#22d3ee]/5 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#0891b2]/15 to-[#22d3ee]/15 flex items-center justify-center">
                        <Building2 className="w-7 h-7 text-[#0891b2]/30" />
                      </div>
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-medium ${
                      listing.status === 'disponible' ? 'bg-emerald-500/90 text-white' :
                      listing.status === 'reservada' ? 'bg-amber-500/90 text-white' :
                      'bg-red-500/90 text-white'
                    }`}>
                      {listing.status === 'disponible' ? (language === 'es' ? 'Disponible' : 'Available') :
                       listing.status === 'reservada' ? (language === 'es' ? 'Reservada' : 'Reserved') :
                       (language === 'es' ? 'Vendida' : 'Sold')}
                    </span>
                  </div>
                  {listing.isFeatured && (
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-[#0891b2] text-white">
                        {language === 'es' ? 'Destacada' : 'Featured'}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <div className="flex items-center gap-1.5 text-[#94a3b8] text-xs mb-2">
                    <MapPin className="w-3 h-3" />
                    {listing.location}
                  </div>
                  <h3 className="text-[#0a1628] font-medium mb-2 line-clamp-1" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.1rem' }}>
                    {listing.title}
                  </h3>
                  <div className="flex items-center gap-3 text-[#94a3b8] text-xs mb-3">
                    {listing.bedrooms && <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5" /> {listing.bedrooms}</span>}
                    {listing.bathrooms && <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5" /> {listing.bathrooms}</span>}
                    {listing.sqMeters && <span className="flex items-center gap-1"><Maximize className="w-3.5 h-3.5" /> {listing.sqMeters}m²</span>}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-bold text-[#0891b2]">
                      {formatPrice(listing.price, listing.currency || 'USD')}
                    </p>
                    <ChevronRight className="w-4 h-4 text-[#cbd5e1] group-hover:text-[#0891b2] transition-colors" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 bg-gradient-to-br from-[#0a1628] to-[#0891b2]/90 rounded-2xl p-8 text-center">
          <h2 className="text-2xl text-white mb-3" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300 }}>
            {language === 'es' ? '¿Necesitas financiamiento?' : 'Need financing?'}
          </h2>
          <p className="text-white/70 text-sm mb-6 max-w-md mx-auto">
            {language === 'es' 
              ? 'Simula tu crédito hipotecario y obtén pre-aprobación en minutos'
              : 'Simulate your mortgage and get pre-approval in minutes'}
          </p>
          <Link href="/creditos">
            <button className="px-8 py-3 bg-white text-[#0891b2] rounded-xl text-sm font-medium hover:bg-white/90 transition-colors inline-flex items-center gap-2" data-testid="button-go-credits">
              {language === 'es' ? 'Simulador de Crédito' : 'Credit Simulator'}
              <ChevronRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>
      
      <div className="mt-16">
        <AGHFooter />
      </div>
    </div>
  );
}
