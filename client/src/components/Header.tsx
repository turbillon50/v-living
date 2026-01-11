import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Search, Globe, Menu, User, ChevronDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SearchBar } from './SearchBar';

export function Header() {
  const [location] = useLocation();
  const [showSearch, setShowSearch] = useState(false);
  const isHome = location === '/';

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-border/60">
        <div className="max-w-[1760px] mx-auto px-6 md:px-10 lg:px-20">
          <div className="flex items-center justify-between h-20">
            <Link href="/" data-testid="link-home">
              <div className="flex items-center gap-2 cursor-pointer">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AL</span>
                </div>
                <span className="text-xl font-semibold text-primary hidden sm:block">
                  all living
                </span>
              </div>
            </Link>

            {isHome && !showSearch && (
              <button
                onClick={() => setShowSearch(true)}
                className="hidden md:flex items-center gap-4 px-4 py-2 border border-border rounded-full shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                data-testid="button-open-search"
              >
                <span className="text-sm font-medium">Anywhere</span>
                <span className="h-6 w-px bg-border" />
                <span className="text-sm font-medium">Any season</span>
                <span className="h-6 w-px bg-border" />
                <span className="text-sm text-muted-foreground">Any usage</span>
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <Search className="w-4 h-4 text-white" />
                </div>
              </button>
            )}

            <nav className="hidden lg:flex items-center gap-6">
              <Link href="/" data-testid="link-explore">
                <span className={`text-sm font-medium cursor-pointer transition-colors ${location === '/' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
                  Explore
                </span>
              </Link>
              <Link href="/dashboard" data-testid="link-dashboard">
                <span className={`text-sm font-medium cursor-pointer transition-colors ${location === '/dashboard' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
                  My Portfolio
                </span>
              </Link>
            </nav>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="hidden md:flex text-sm font-medium" data-testid="button-language">
                <Globe className="w-4 h-4 mr-1" />
                EN
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 rounded-full px-3 py-2 h-auto border-border hover:shadow-md transition-shadow"
                    data-testid="button-user-menu"
                  >
                    <Menu className="w-4 h-4" />
                    <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center">
                      <User className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem data-testid="menu-item-login">
                    <span className="font-medium">Log in</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem data-testid="menu-item-signup">Sign up</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem data-testid="menu-item-access-code">Enter access code</DropdownMenuItem>
                  <DropdownMenuItem data-testid="menu-item-help">Help Center</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {showSearch && (
        <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm" onClick={() => setShowSearch(false)}>
          <div className="bg-white border-b shadow-lg" onClick={e => e.stopPropagation()}>
            <div className="max-w-[1760px] mx-auto px-6 md:px-10 lg:px-20 py-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Find your ownership</h2>
                <Button variant="ghost" size="icon" onClick={() => setShowSearch(false)} data-testid="button-close-search">
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <SearchBar onSearch={() => setShowSearch(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
