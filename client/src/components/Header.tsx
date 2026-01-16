import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Search, Globe, Menu, User, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import logoImage from '@assets/generated_images/minimalist_single_ring_logo_for_all_living.png';

export function Header() {
  const [location] = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border/60">
      <div className="max-w-[1760px] mx-auto px-6 md:px-10 lg:px-20">
        <div className="flex items-center justify-between h-20">
          <Link href="/" data-testid="link-home">
            <div className="flex items-center gap-3 cursor-pointer">
              <img src={logoImage} alt="Republica" className="w-10 h-10 object-contain" />
              <div className="hidden sm:block">
                <span className="text-xl font-semibold text-foreground tracking-tight block leading-none">
                  Republica
                </span>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">Fractional Experience</p>
              </div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-6">
            <Link href="/" data-testid="link-explore">
              <span className={`text-sm font-medium cursor-pointer transition-colors ${location === '/' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
                Experience
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
                  <div className="w-7 h-7 rounded-full bg-black flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem data-testid="menu-item-login">
                  <span className="font-medium">Log in</span>
                </DropdownMenuItem>
                <DropdownMenuItem data-testid="menu-item-signup">Sign up</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem data-testid="menu-item-help">Help Center</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
