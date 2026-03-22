import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/packages?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <section className="relative h-[90vh] min-h-[600px] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://media.base44.com/images/public/69bf30b9d53fc5e28bedc065/7d28df02c_generated_ec72b0aa.png"
          alt="Keindahan alam Indonesia"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/70" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-white text-sm font-medium mb-6">
            <MapPin className="w-4 h-4" />
            Jelajahi Sumatera Utara
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Pesona Alam &
            <br />
            <span className="text-primary">Sumatera Utara</span>
          </h1>

          <p className="text-lg text-white/80 mb-8 max-w-lg leading-relaxed">
            Dari Danau Toba yang megah hingga hutan Bukit Lawang, dari pantai Sibolga hingga puncak Sibayak. 
            Rencanakan petualangan terbaik Anda bersama kami.
          </p>

          <form onSubmit={handleSearch} className="flex gap-2 max-w-lg">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Cari destinasi di Sumatera Utara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 rounded-xl bg-white/95 backdrop-blur-md border-0 text-foreground shadow-xl"
              />
            </div>
            <Button type="submit" size="lg" className="h-14 px-6 rounded-xl shadow-xl">
              <ArrowRight className="w-5 h-5" />
            </Button>
          </form>

          <div className="flex items-center gap-6 mt-8">
            {[
              { number: '50+', label: 'Destinasi' },
              { number: '1K+', label: 'Traveler' },
              { number: '4.9', label: 'Rating' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-white">{stat.number}</div>
                <div className="text-xs text-white/60">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
