import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X, Palmtree, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { label: 'Beranda', path: '/' },
  { label: 'Paket Wisata', path: '/packages' },
  { label: 'Rental Mobil', path: '/rentals' },
  { label: 'Custom Trip', path: '/custom-trip' },
  { label: 'Blog', path: '/blog' },
];

export default function Navbar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isHome = location.pathname === '/';

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isTransparent = isHome && !scrolled;

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isTransparent ? 'bg-transparent' : 'bg-background/95 backdrop-blur-md border-b'}`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link to="/" className="flex items-center gap-2">
            <Palmtree className={`w-7 h-7 ${isTransparent ? 'text-white' : 'text-primary'}`} />
            <span className={`text-xl font-bold tracking-tight ${isTransparent ? 'text-white' : 'text-foreground'}`}>
              Nusantara
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? isTransparent ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'
                    : isTransparent ? 'text-white/80 hover:text-white hover:bg-white/10' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
          </div>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className={isTransparent ? 'text-white' : ''}>
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col gap-2 mt-8">
                {navLinks.map(link => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setOpen(false)}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      location.pathname === link.path
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="border-t my-2" />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
