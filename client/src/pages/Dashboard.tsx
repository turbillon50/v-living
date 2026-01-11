import { Link } from 'wouter';
import { Calendar, Home, TrendingUp, Building, MapPin, ChevronRight, Clock } from 'lucide-react';
import { Header } from '@/components/Header';
import { SeasonBadge } from '@/components/SeasonBadge';
import { userDashboard, formatPrice, getWeekDateRange } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';

export default function Dashboard() {
  const { ownedFractions, upcomingWeeks } = userDashboard;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-[1760px] mx-auto px-6 md:px-10 lg:px-20 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold mb-2">My Portfolio</h1>
          <p className="text-muted-foreground">Manage your fractional ownership investments</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl border border-primary/20">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
              <Home className="w-6 h-6 text-primary" />
            </div>
            <p className="text-3xl font-semibold mb-1">{ownedFractions.length}</p>
            <p className="text-muted-foreground">Properties Owned</p>
          </div>

          <div className="p-6 bg-muted/50 rounded-2xl border border-border">
            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-foreground" />
            </div>
            <p className="text-3xl font-semibold mb-1">{ownedFractions.length * 3}</p>
            <p className="text-muted-foreground">Total Usage Weeks</p>
          </div>

          <div className="p-6 bg-muted/50 rounded-2xl border border-border">
            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-foreground" />
            </div>
            <p className="text-3xl font-semibold mb-1">
              {formatPrice(ownedFractions.reduce((acc, f) => acc + f.fraction.price, 0))}
            </p>
            <p className="text-muted-foreground">Portfolio Value</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">My Fractions</h2>
                <Link href="/" data-testid="link-explore-more">
                  <Button variant="ghost" size="sm" className="gap-1">
                    Explore More <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>

              <div className="space-y-4">
                {ownedFractions.map(({ property, fraction }) => (
                  <Link
                    key={fraction.id}
                    href={`/property/${property.id}/fraction/${fraction.id}`}
                    data-testid={`owned-fraction-${fraction.id}`}
                  >
                    <div className="flex gap-4 p-4 border border-border rounded-2xl hover:shadow-md transition-shadow cursor-pointer">
                      <img
                        src={property.images[0]}
                        alt={property.title}
                        className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-xl"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-semibold line-clamp-1">{property.title}</h3>
                            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                              <MapPin className="w-3.5 h-3.5" />
                              {property.location}, {property.country}
                            </p>
                          </div>
                          <span className="text-sm font-medium text-primary whitespace-nowrap">
                            Fraction #{fraction.fractionNumber}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 mt-3">
                          <div>
                            <p className="text-xs text-muted-foreground">Ownership</p>
                            <p className="font-medium">{fraction.ownershipPercentage}%</p>
                          </div>
                          <Separator orientation="vertical" className="h-8" />
                          <div>
                            <p className="text-xs text-muted-foreground">Value</p>
                            <p className="font-medium">{formatPrice(fraction.price)}</p>
                          </div>
                          <Separator orientation="vertical" className="h-8" />
                          <div>
                            <p className="text-xs text-muted-foreground">Usage</p>
                            <p className="font-medium capitalize">{fraction.usageMode}</p>
                          </div>
                        </div>

                        <div className="flex gap-1.5 mt-3">
                          {fraction.usageWeeks.map((w, i) => (
                            <SeasonBadge key={i} season={w.season} size="sm" showLabel={false} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="border border-border rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-4">Upcoming Usage</h2>

              {upcomingWeeks.length > 0 ? (
                <div className="space-y-4">
                  {upcomingWeeks.map(({ property, fraction, week }, idx) => {
                    const { start, end } = getWeekDateRange(week.weekNumber);
                    return (
                      <div key={idx} className="p-4 bg-muted/50 rounded-xl">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Clock className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">Week {week.weekNumber}</p>
                            <p className="text-sm text-muted-foreground">
                              {format(start, 'MMM d')} - {format(end, 'MMM d')}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{property.title}</p>
                        <SeasonBadge season={week.season} size="sm" />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">No upcoming usage scheduled</p>
              )}
            </div>

            <div className="border border-border rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start gap-3" data-testid="button-exchange-weeks">
                  <Calendar className="w-4 h-4" />
                  Exchange Weeks
                </Button>
                <Button variant="outline" className="w-full justify-start gap-3" data-testid="button-list-rental">
                  <Building className="w-4 h-4" />
                  List for Rental
                </Button>
                <Button variant="outline" className="w-full justify-start gap-3" data-testid="button-view-statements">
                  <TrendingUp className="w-4 h-4" />
                  View Statements
                </Button>
              </div>
            </div>

            <div className="border border-border rounded-2xl p-6 bg-gradient-to-br from-foreground to-foreground/90 text-background">
              <h2 className="text-lg font-semibold mb-2">Need Assistance?</h2>
              <p className="text-sm opacity-80 mb-4">
                Our ownership concierge is available to help with any questions.
              </p>
              <Button variant="secondary" className="w-full" data-testid="button-contact-concierge">
                Contact Concierge
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
