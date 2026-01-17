import { useState } from 'react';
import { Link } from 'wouter';
import { ChevronRight, Plus, X, Upload, Loader2, ArrowRight } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { categories, Category } from '@/lib/mockData';
import { Property, InsertProperty } from '@shared/schema';
import { getProperties, createProperty } from '@/lib/api';
import { FloatingButtons } from '@/components/FloatingButtons';
import { useToast } from '@/hooks/use-toast';

const CREATOR_PASSWORD = 'lumamijuvisado';

export default function Home() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [showCreator, setShowCreator] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [creatorPassword, setCreatorPassword] = useState('');
  const [isCreatorUnlocked, setIsCreatorUnlocked] = useState(false);
  
  // Fetch properties from API
  const { data: properties = [], isLoading } = useQuery({
    queryKey: ['properties'],
    queryFn: getProperties,
  });

  // Creator Form State
  const [newProp, setNewProp] = useState<Partial<InsertProperty>>({
    title: '',
    location: '',
    description: '',
    conditions: [],
    category: 'Propiedades',
    images: []
  });

  const handleCreatorAccess = () => {
    if (isCreatorUnlocked) {
      setShowCreator(true);
    } else {
      setShowPasswordDialog(true);
    }
  };

  const verifyPassword = () => {
    if (creatorPassword === CREATOR_PASSWORD) {
      setIsCreatorUnlocked(true);
      setShowPasswordDialog(false);
      setShowCreator(true);
      setCreatorPassword('');
      toast({
        title: "Modo Creador Activado",
        description: "Ahora puedes crear y editar experiencias",
      });
    } else {
      toast({
        title: "Contraseña Incorrecta",
        description: "Por favor, intenta de nuevo",
        variant: "destructive"
      });
    }
  };

  // Create property mutation
  const createMutation = useMutation({
    mutationFn: createProperty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      setShowCreator(false);
      setNewProp({ title: '', location: '', description: '', conditions: [], category: 'Propiedades', images: [] });
      toast({
        title: "Success",
        description: "Property created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create property",
        variant: "destructive"
      });
    }
  });

  const handleAddProperty = () => {
    if (!newProp.title || !newProp.location) {
      toast({
        title: "Missing fields",
        description: "Please fill in title and location",
        variant: "destructive"
      });
      return;
    }
    
    const propertyData: InsertProperty = {
      title: newProp.title,
      location: newProp.location,
      description: newProp.description || '',
      conditions: newProp.conditions || [],
      category: newProp.category || 'Propiedades',
      images: ['https://images.unsplash.com/photo-1600596542815-e32870110274?auto=format&fit=crop&w=1600&q=80']
    };

    createMutation.mutate(propertyData);
  };

  const filteredProperties = selectedCategory === 'All' 
    ? properties 
    : properties.filter(p => p.category === selectedCategory);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header />

      <main className="max-w-[1760px] mx-auto px-6 md:px-10 lg:px-20 pt-8">
        
        {/* Hero Story Section */}
        <section className="mb-16 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-light mb-6 tracking-tight leading-tight">
            Fractional Living
          </h1>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            Plataforma de fracciones inmobiliarias de lujo que conecta propiedad, uso y valor en un solo activo.
            Vive, invierte y construye patrimonio en el Caribe bajo un modelo fractional real, legal y heredable.
          </p>
          
          <div className="bg-muted/50 rounded-2xl p-8 mb-8">
            <p className="text-lg mb-6 font-medium">
              Fractional Living nace para resolver lo que el tiempo compartido nunca pudo: 
              propiedad real, valor patrimonial y libertad de uso.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-4 bg-white rounded-xl border border-border">
                <h4 className="font-medium text-red-600 mb-3">❌ Tiempo compartido:</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Compras solo tiempo vacacional</li>
                  <li>• Sin propiedad real</li>
                  <li>• Sin valor de reventa</li>
                </ul>
              </div>
              <div className="p-4 bg-white rounded-xl border border-primary/30">
                <h4 className="font-medium text-primary mb-3">✅ Fractional:</h4>
                <ul className="space-y-2 text-sm">
                  <li>• Eres dueño de una fracción inmobiliaria real</li>
                  <li>• Activo legal, heredable y con plusvalía</li>
                  <li>• Puedes usarla, rentarla o revenderla</li>
                </ul>
              </div>
            </div>
          </div>

          <Link href="/fractional">
            <Button size="lg" className="gap-2 text-lg px-8 h-14">
              Ver Fracciones Disponibles
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </section>

        {/* Categories Grid */}
        <section className="mb-16">
          <h2 className="text-2xl font-light mb-8 tracking-tight">Explora por Categoría</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <div 
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id === selectedCategory ? 'All' : cat.id)}
                className={`group relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${selectedCategory === cat.id ? 'ring-2 ring-black' : 'hover:shadow-lg'}`}
              >
                <img 
                  src={cat.image} 
                  alt={cat.label} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                <div className="absolute bottom-0 left-0 p-6">
                  <h3 className="text-white text-xl font-medium tracking-wide">{cat.label}</h3>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Creator Mode & Properties List */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-light tracking-tight">
              {selectedCategory === 'All' ? 'Curated Collection' : `${selectedCategory} Collection`}
            </h2>
            {/* Password Dialog */}
            <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
              <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                  <DialogTitle>Acceso Modo Creador</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid w-full gap-2">
                    <label className="text-sm font-medium">Contraseña</label>
                    <Input 
                      type="password"
                      placeholder="Ingresa la contraseña" 
                      value={creatorPassword}
                      onChange={e => setCreatorPassword(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && verifyPassword()}
                    />
                  </div>
                  <Button onClick={verifyPassword} className="w-full">
                    Acceder
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Button variant="outline" className="gap-2" onClick={handleCreatorAccess}>
              <Plus className="w-4 h-4" />
              {isCreatorUnlocked ? 'Modo Creador' : 'Creator Mode'}
            </Button>

            <Dialog open={showCreator} onOpenChange={setShowCreator}>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Add New Experience</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid w-full gap-2">
                    <label className="text-sm font-medium">Category</label>
                    <Select 
                      value={newProp.category} 
                      onValueChange={(val) => setNewProp({...newProp, category: val as Category})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid w-full gap-2">
                    <label className="text-sm font-medium">Title</label>
                    <Input 
                      placeholder="e.g. Sunset Villa" 
                      value={newProp.title}
                      onChange={e => setNewProp({...newProp, title: e.target.value})}
                    />
                  </div>
                  <div className="grid w-full gap-2">
                    <label className="text-sm font-medium">Location</label>
                    <Input 
                      placeholder="e.g. Amalfi Coast, Italy" 
                      value={newProp.location}
                      onChange={e => setNewProp({...newProp, location: e.target.value})}
                    />
                  </div>
                  <div className="grid w-full gap-2">
                    <label className="text-sm font-medium">Description</label>
                    <Textarea 
                      placeholder="Short description of the experience..." 
                      value={newProp.description}
                      onChange={e => setNewProp({...newProp, description: e.target.value})}
                    />
                  </div>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center justify-center text-muted-foreground cursor-pointer hover:bg-muted/50 transition-colors">
                    <Upload className="w-8 h-8 mb-2" />
                    <span className="text-sm">Drag images to upload</span>
                  </div>
                  <Button onClick={handleAddProperty} className="w-full" disabled={createMutation.isPending}>
                    {createMutation.isPending ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating...</>
                    ) : 'Create Experience'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((property) => (
              <Link key={property.id} href={`/property/${property.id}`}>
                <div className="group cursor-pointer space-y-4">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-muted">
                    <img 
                      src={property.images[0]} 
                      alt={property.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-lg font-medium tracking-tight group-hover:text-primary transition-colors">
                        {property.title}
                      </h3>
                      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground border border-border px-2 py-0.5 rounded-full">
                        {property.category}
                      </span>
                    </div>
                    <p className="text-muted-foreground">{property.location}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <FloatingButtons />
      <BottomNav />
    </div>
  );
}
