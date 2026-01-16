import { useState } from 'react';
import { Link } from 'wouter';
import { ChevronRight, Plus, X, Upload } from 'lucide-react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { categories, properties as initialProperties, Property, Category } from '@/lib/mockData';
import { AlexAssistant } from '@/components/AlexAssistant';

export default function Home() {
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [showCreator, setShowCreator] = useState(false);
  
  // Creator Form State
  const [newProp, setNewProp] = useState<Partial<Property>>({
    title: '',
    location: '',
    description: '',
    conditions: [],
    category: 'Villas',
    images: []
  });

  const handleAddProperty = () => {
    if (!newProp.title || !newProp.location) return;
    
    const property: Property = {
      id: `custom-${Date.now()}`,
      title: newProp.title || '',
      location: newProp.location || '',
      description: newProp.description || '',
      conditions: newProp.conditions || ['Standard Terms'],
      category: (newProp.category as Category) || 'Villas',
      images: ['https://images.unsplash.com/photo-1600596542815-e32870110274?auto=format&fit=crop&w=1600&q=80'] // Placeholder for demo
    };

    setProperties([property, ...properties]);
    setShowCreator(false);
    setNewProp({ title: '', location: '', description: '', conditions: [], category: 'Villas' });
  };

  const filteredProperties = selectedCategory === 'All' 
    ? properties 
    : properties.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />

      <main className="max-w-[1760px] mx-auto px-6 md:px-10 lg:px-20 pt-8">
        
        {/* Categories Grid */}
        <section className="mb-16">
          <h1 className="text-3xl font-light mb-8 tracking-tight">Discover Experiences</h1>
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
            <Dialog open={showCreator} onOpenChange={setShowCreator}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Creator Mode
                </Button>
              </DialogTrigger>
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
                  <Button onClick={handleAddProperty} className="w-full">Create Experience</Button>
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

      <AlexAssistant />
    </div>
  );
}
