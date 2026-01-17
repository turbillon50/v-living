import { useState, useMemo } from 'react';
import { useParams, Link } from 'wouter';
import { ChevronLeft, Share, Check, Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { getPropertyById, getBookedWeeks, createPreBooking } from '@/lib/api';
import { FloatingButtons } from '@/components/FloatingButtons';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export default function PropertyDetail() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  
  const [selectedWeeks, setSelectedWeeks] = useState<number[]>([]);
  const [email, setEmail] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // Fetch property
  const { data: property, isLoading: propertyLoading } = useQuery({
    queryKey: ['property', id],
    queryFn: () => getPropertyById(id!),
    enabled: !!id,
  });

  // Fetch booked weeks
  const { data: bookedWeeks = [] } = useQuery({
    queryKey: ['bookings', id],
    queryFn: () => getBookedWeeks(id!),
    enabled: !!id,
  });

  // Generate weeks with availability
  const weeks = useMemo(() => {
    return Array.from({ length: 52 }, (_, i) => ({
      weekNumber: i + 1,
      available: !bookedWeeks.includes(i + 1)
    }));
  }, [bookedWeeks]);

  // Pre-booking mutation
  const bookingMutation = useMutation({
    mutationFn: createPreBooking,
    onSuccess: () => {
      setShowSuccess(true);
    },
    onError: (error: any) => {
      toast({
        title: "Booking Failed",
        description: error.message || "Failed to create pre-booking",
        variant: "destructive"
      });
    }
  });

  if (propertyLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-[1760px] mx-auto px-6 md:px-10 lg:px-20 py-12">
          <p className="text-center text-muted-foreground">Property not found</p>
          <Link href="/">
            <Button variant="outline" className="mx-auto mt-4 block">Back to Explore</Button>
          </Link>
        </div>
      </div>
    );
  }

  const toggleWeek = (weekNum: number) => {
    if (selectedWeeks.includes(weekNum)) {
      setSelectedWeeks(selectedWeeks.filter(w => w !== weekNum));
    } else {
      if (selectedWeeks.length >= 3) {
        toast({
          title: "Limit Reached",
          description: "You must select exactly 3 weeks.",
          variant: "destructive"
        });
        return;
      }
      setSelectedWeeks([...selectedWeeks, weekNum].sort((a, b) => a - b));
    }
  };

  const handlePreBook = () => {
    if (selectedWeeks.length !== 3) {
      toast({
        title: "Selection Required",
        description: "Please select exactly 3 weeks to proceed.",
        variant: "destructive"
      });
      return;
    }
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive"
      });
      return;
    }

    bookingMutation.mutate({
      propertyId: id!,
      email,
      selectedWeeks,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-[1760px] mx-auto px-6 md:px-10 lg:px-20 py-8">
        {/* Navigation & Title */}
        <div className="mb-8">
          <Link href="/">
            <button className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back to Experience
            </button>
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-light tracking-tight mb-2">{property.title}</h1>
              <p className="text-lg text-muted-foreground flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                {property.location}
              </p>
            </div>
            <Button variant="outline" size="sm" className="gap-2 self-start md:self-auto">
              <Share className="w-4 h-4" /> Share
            </Button>
          </div>
        </div>

        {/* Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 rounded-2xl overflow-hidden h-[50vh] md:h-[60vh] mb-12">
          <img src={property.images[0]} alt="Main view" className="w-full h-full object-cover" />
          <div className="hidden md:grid grid-rows-2 gap-2 h-full">
            <img src={property.images[1]} alt="Detail view" className="w-full h-full object-cover" />
            <img src={property.images[2]} alt="Interior view" className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Details Column */}
          <div className="lg:col-span-2 space-y-10">
            <div>
              <h2 className="text-2xl font-light mb-4">About this experience</h2>
              <p className="text-muted-foreground leading-relaxed text-lg">
                {property.description}
              </p>
            </div>

            <Separator />

            <div>
              <h2 className="text-2xl font-light mb-6">Experience Conditions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {property.conditions.map((condition, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-4 bg-muted/30 rounded-xl">
                    <Check className="w-5 h-5 text-green-600" />
                    <span>{condition}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Column */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-white border border-border rounded-2xl p-6 shadow-xl shadow-black/5">
              <div className="mb-6">
                <h3 className="text-xl font-medium mb-2">Select Your Experience</h3>
                <p className="text-sm text-muted-foreground">
                  Select exactly 3 weeks for your annual fractional ownership.
                </p>
              </div>

              {/* Weeks Grid */}
              <div className="grid grid-cols-7 gap-1 mb-6">
                {weeks.map((week) => (
                  <button
                    key={week.weekNumber}
                    onClick={() => toggleWeek(week.weekNumber)}
                    disabled={!week.available}
                    className={cn(
                      "aspect-square rounded-md text-xs font-medium transition-all flex items-center justify-center",
                      !week.available && "bg-muted text-muted-foreground opacity-30 cursor-not-allowed",
                      week.available && !selectedWeeks.includes(week.weekNumber) && "bg-muted/50 hover:bg-muted text-foreground",
                      selectedWeeks.includes(week.weekNumber) && "bg-black text-white shadow-md scale-105"
                    )}
                  >
                    {week.weekNumber}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span>Selected Weeks</span>
                  <span className="font-medium">{selectedWeeks.length} / 3</span>
                </div>
                
                <Separator />
                
                <Input 
                  placeholder="Enter your email address" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12"
                />

                <Button 
                  className="w-full h-12 text-lg" 
                  onClick={handlePreBook}
                  disabled={bookingMutation.isPending}
                >
                  {bookingMutation.isPending ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</>
                  ) : "Confirm Pre-Booking"}
                </Button>

                <p className="text-xs text-center text-muted-foreground mt-4">
                  Free 5-day hold. No wallet required. No payment today.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <FloatingButtons />

      {/* Success Dialog */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-light pt-4">Pre-Booking Confirmed</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center py-6 text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-2">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-muted-foreground">
              Your 3 weeks have been reserved for 5 days.
            </p>
            <p className="text-sm">
              An advisor will contact you at <span className="font-medium text-foreground">{email}</span> shortly to finalize your experience.
            </p>
            <Button onClick={() => setShowSuccess(false)} className="w-full mt-4">
              Return to Experience
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
