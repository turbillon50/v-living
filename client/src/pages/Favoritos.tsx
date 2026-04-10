import { Header } from '@/components/Header';
import { AGHFooter } from '@/components/AGHFooter';
import { PropertyCardCarousel } from '@/components/PropertyCardCarousel';
import { useLanguage } from '@/lib/LanguageContext';
import { useFavorites } from '@/lib/FavoritesContext';
import { useQuery } from '@tanstack/react-query';
import { Property } from '@shared/schema';
import { Link } from 'wouter';
import { ArrowRight } from 'lucide-react';

export default function Favoritos() {
  const { language } = useLanguage();
  const { favorites } = useFavorites();

  const { data: properties = [] } = useQuery<Property[]>({
    queryKey: ['/api/properties'],
  });

  const favoriteProperties = properties.filter(p => favorites.includes(p.id));

  return (
    <div className="min-h-screen bg-white pb-24">
      <Header />

      <div className="pt-24 px-5 max-w-7xl mx-auto">
        <h1 className="text-2xl text-[#222] mb-2" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 500 }} data-testid="text-favoritos-title">
          {language === 'es' ? 'Favoritos' : 'Favorites'}
        </h1>
        <p className="text-[#717171] text-sm mb-8">
          {language === 'es' ? 'Las propiedades y experiencias que has guardado.' : 'Properties and experiences you\'ve saved.'}
        </p>

        {favoriteProperties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" data-testid="favorites-grid">
            {favoriteProperties.map(property => (
              <PropertyCardCarousel key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="relative rounded-2xl overflow-hidden aspect-[16/9] mb-6">
            <img src="/hero-ocean.jpg" alt={language === 'es' ? 'Vista del Caribe' : 'Caribbean view'} className="w-full h-full object-cover opacity-40" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
              <p className="text-[#717171] text-sm mb-4" data-testid="text-no-favorites">
                {language === 'es' ? 'Aún no tienes favoritos guardados' : 'No saved favorites yet'}
              </p>
              <Link href="/home">
                <button className="py-3 px-6 bg-[#222] text-white text-sm font-semibold rounded-xl inline-flex items-center gap-2 active:scale-[0.97] transition-transform" data-testid="button-explore-favoritos">
                  {language === 'es' ? 'Explorar Propiedades' : 'Explore Properties'} <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>

      <AGHFooter />
    </div>
  );
}
