import React from 'react';
import { Link } from 'react-router-dom';
import { Palmtree, Mail, Phone, MapPin, Instagram, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Palmtree className="w-8 h-8 text-primary" />
              <span className="text-lg font-bold">Wonderfultoba.com</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Platform wisata Danau Toba terlengkap. Jelajahi keindahan nusantara bersama kami.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Layanan</h4>
            <div className="space-y-3">
              <Link to="/packages" className="block text-sm text-background/60 hover:text-primary transition-colors">Paket Wisata</Link>
              <Link to="/rentals" className="block text-sm text-background/60 hover:text-primary transition-colors">Rental Mobil</Link>
              <Link to="/custom-trip" className="block text-sm text-background/60 hover:text-primary transition-colors">Custom Trip</Link>
              <Link to="/blog" className="block text-sm text-background/60 hover:text-primary transition-colors">Blog</Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Kontak</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4" /> info@wonderfultoba.com
              </div>
              <div className="flex items-center gap-2 text-sm text-background/60">
                <Phone className="w-4 h-4" /> +62 812 3456 7890
              </div>
              <div className="flex items-center gap-2 text-sm text-background/60">
                <MapPin className="w-4 h-4" /> Jakarta, Indonesia
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Sosial Media</h4>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-lg bg-background/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-background/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-background/10 mt-12 pt-8 text-center">
          <p className="text-sm">
            © 2026 Wonderfultoba.com. Semua hak dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
}
