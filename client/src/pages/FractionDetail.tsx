import { useState } from 'react';
import { useParams, Link } from 'wouter';
import { ChevronLeft, Share, Heart, Calendar, Home, TrendingUp, Building, Check, Info, Clock } from 'lucide-react';
import { Header } from '@/components/Header';
import { SeasonBadge } from '@/components/SeasonBadge';
import { getPropertyById, getFractionById, formatPrice, getWeekDateRange, UsageMode } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export default function FractionDetail() {
  const { propertyId, fractionId } = useParams<{ propertyId: string; fractionId: string }>();
  const property = getPropertyById(propertyId || '');
  const fraction = property ? getFractionById(propertyId || '', fractionId || '') : undefined;
  const [selectedUsage, setSelectedUsage] = useState<UsageMode>(fraction?.usageMode || 'living');
  const [isFavorite, setIsFavorite] = useState(false);

  if (!property || !fraction) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-[1760px] mx-auto px-6 md:px-10 lg:px-20 py-12">
          <p className="text-center text-muted-foreground">Fraction not found</p>
          <Link href="/">
            <Button variant="outline" className="mx-auto mt-4 block">Back to Explore</Button>
          </Link>
        </div>
      </div>
    );
  }

  const usageModes = [
    { mode: 'living' as UsageMode, icon: Home, label: 'Personal Living', description: 'Use your weeks for personal stays' },
    { mode: 'investment' as UsageMode, icon: TrendingUp, label: 'Investment', description: 'Hold for value appreciation' },
    { mode: 'rental' as UsageMode, icon: Building, label: 'Rental', description: 'Generate rental income' },
  ];

  const statusConfig = {
    available: { label: 'Available', color: 'bg-black', textColor: 'text-black' },
    reserved: { label: 'Reserved', color: 'bg-[#999]', textColor: 'text-[#888]' },
    'pre-sale': { label: 'Pre-sale', color: 'bg-black/5', textColor: 'text-black' },
  };

  const status = statusConfig[fraction.status];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-[1760px] mx-auto px-6 md:px-10 lg:px-20 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link href={`/property/${property.id}`} data-testid="link-back-property">
              <span className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground cursor-pointer mb-2">
                <ChevronLeft className="w-4 h-4" />
                Back to {property.title}
              </span>
            </Link>
            <h1 className="text-2xl md:text-3xl font-semibold" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300 }} data-testid="text-fraction-title">
              Fraction #{fraction.fractionNumber}
            </h1>
            <p className="text-muted-foreground mt-1">
              {property.title} · {property.location}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2" data-testid="button-share-fraction">
              <Share className="w-4 h-4" />
              Share
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => setIsFavorite(!isFavorite)}
              data-testid="button-save-fraction"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-primary text-primary' : ''}`} />
              Save
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 rounded-md overflow-hidden mb-8 max-h-[400px]">
          {property.images.slice(0, 2).map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`${property.title} ${idx + 1}`}
              className="w-full h-full object-cover"
            />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center gap-4">
              <span className={cn('inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium', status.textColor, 'bg-opacity-10', status.color.replace('bg-', 'bg-opacity-10 bg-'))}>
                <span className={cn('w-2 h-2 rounded-full', status.color)} />
                {status.label}
              </span>
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground">Fraction ID: {fraction.id}</span>
            </div>

            <Separator />

            <div className="space-y-4">
              <h2 className="text-xl font-semibold" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400 }}>Ownership Details</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Ownership Percentage</p>
                  <p className="text-2xl font-semibold">{fraction.ownershipPercentage}%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Usage Weeks/Year</p>
                  <p className="text-2xl font-semibold">{fraction.usageWeeks.length}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Price</p>
                  <p className="text-2xl font-semibold text-primary">{formatPrice(fraction.price)}</p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h2 className="text-xl font-semibold" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400 }}>Assigned Usage Weeks</h2>
              <div className="space-y-3">
                {fraction.usageWeeks.map((week, idx) => {
                  const { start, end } = getWeekDateRange(week.weekNumber);
                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-4 bg-muted/50 rounded-md"
                      data-testid={`week-${idx}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-md bg-background flex items-center justify-center">
                          <Calendar className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Week {week.weekNumber}</p>
                          <p className="text-sm text-muted-foreground">
                            {format(start, 'MMM d')} - {format(end, 'MMM d, yyyy')}
                          </p>
                        </div>
                      </div>
                      <SeasonBadge season={week.season} />
                    </div>
                  );
                })}
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h2 className="text-xl font-semibold" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400 }}>Usage Mode</h2>
              <p className="text-muted-foreground">Select how you plan to use this fraction:</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {usageModes.map(({ mode, icon: Icon, label, description }) => (
                  <button
                    key={mode}
                    onClick={() => setSelectedUsage(mode)}
                    className={cn(
                      'p-4 rounded-md border text-left transition-all',
                      selectedUsage === mode
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    )}
                    data-testid={`usage-${mode}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <Icon className={cn('w-6 h-6', selectedUsage === mode ? 'text-primary' : 'text-muted-foreground')} />
                      {selectedUsage === mode && <Check className="w-5 h-5 text-primary" />}
                    </div>
                    <p className="font-semibold mb-1">{label}</p>
                    <p className="text-sm text-muted-foreground">{description}</p>
                  </button>
                ))}
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h2 className="text-xl font-semibold" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400 }}>Ownership Rules</h2>
              <div className="space-y-3">
                {[
                  'Deeded ownership with legal title to your fraction',
                  'Transferable and can be sold on the secondary market',
                  'Usage weeks are assigned and guaranteed annually',
                  'Access to owner exchange program for week swapping',
                  'Professional property management included',
                  'Proportional share of rental income (if applicable)',
                ].map((rule, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-black mt-0.5 shrink-0" />
                    <p className="text-muted-foreground">{rule}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-28 border border-border rounded-md p-6">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl font-semibold">{formatPrice(fraction.price)}</span>
              </div>
              <p className="text-muted-foreground mb-6">
                {fraction.ownershipPercentage}% ownership · {fraction.usageWeeks.length} weeks/year
              </p>

              <Button className="w-full h-12 text-base mb-4" data-testid="button-select-fraction">
                Select This Fraction
              </Button>

              <Button variant="outline" className="w-full h-12 text-base" data-testid="button-schedule-tour">
                Schedule a Tour
              </Button>

              <Separator className="my-6" />

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>Typically responds within 24 hours</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Info className="w-4 h-4" />
                  <span>No commitment required to inquire</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
