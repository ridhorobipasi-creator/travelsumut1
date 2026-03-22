import React from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Star, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { SEED_PACKAGES } from '@/lib/seeds';

function formatPrice(price) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
}

function PackageCard({ pkg, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <Link to={`/packages/${pkg.id}`}>
        <Card className="group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300">
          <div className="relative h-56 overflow-hidden">
            <img
              src={pkg.images?.[0] || pkg.cover_image || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5997'}
              alt={pkg.name || pkg.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {pkg.discounted_price && (
              <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground">
                Promo
              </Badge>
            )}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-4">
              <div className="flex items-center gap-1 text-white text-sm">
                <MapPin className="w-3.5 h-3.5" />
                <span>{pkg.region?.name || pkg.destination_name || 'Sumatera Utara'}</span>
              </div>
            </div>
          </div>
          <div className="p-5">
            <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-1">
              {pkg.name || pkg.title}
            </h3>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {pkg.duration_days} Hari
              </span>
              {(pkg.rating || 4.8) > 0 && (
                <span className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {pkg.rating || 4.8}
                </span>
              )}
            </div>
            <div className="flex items-end justify-between">
              <div>
                {pkg.discounted_price ? (
                  <>
                    <span className="text-sm text-muted-foreground line-through">{formatPrice(pkg.price || pkg.base_price)}</span>
                    <div className="text-lg font-bold text-primary">{formatPrice(pkg.discounted_price)}</div>
                  </>
                ) : (
                  <div className="text-lg font-bold text-primary">{formatPrice(pkg.price || pkg.base_price)}</div>
                )}
                <span className="text-xs text-muted-foreground">/orang</span>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}

export default function FeaturedPackages() {
  const { data: packagesData } = useQuery({
    queryKey: ['featured-packages'],
    queryFn: () => base44.entities.Package.list({ limit: 6, populate: ['region'], status: 'published' }),
  });

  const displayPackages = packagesData?.data && packagesData.data.length > 0 
    ? packagesData.data.slice(0, 3) 
    : SEED_PACKAGES.filter(p => p.featured).slice(0, 3);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex items-end justify-between mb-10">
        <div>
          <span className="text-sm font-medium text-primary uppercase tracking-wider">Paket Populer</span>
          <h2 className="text-3xl font-bold mt-2">Paket Wisata Sumatera Utara</h2>
        </div>
        <Link to="/packages">
          <Button variant="ghost" className="hidden sm:flex">
            Lihat Semua <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>

      {displayPackages.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayPackages.map((pkg, i) => (
            <PackageCard key={pkg.id} pkg={pkg} index={i} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-muted-foreground">
          <p>Belum ada paket wisata unggulan. Tambahkan melalui Admin Dashboard.</p>
        </div>
      )}
    </section>
  );
}
