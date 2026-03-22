import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice } from '@/components/shared/PriceFormatter';
import { Navigation, MapPin, Calendar, Users, Filter, Search, ChevronRight } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SEED_PACKAGES, SEED_REGIONS } from '@/lib/seeds';

export default function PackagesList() {
  const [search, setSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');

  const { data: packagesData, isLoading } = useQuery({
    queryKey: ['public-packages'],
    queryFn: () => base44.entities.Package.list({ limit: 50, populate: ['region'] }),
    refetchInterval: 30000 // Poll every 30s for public
  });

  const { data: regionsData } = useQuery({
    queryKey: ['public-regions'],
    queryFn: () => base44.entities.Region.list({ limit: 50 })
  });
  
  // Use data from API or fall back to seeds
  const allPackages = packagesData?.data && packagesData.data.length > 0 ? packagesData.data : SEED_PACKAGES;
  const allRegions = regionsData?.data && regionsData.data.length > 0 ? regionsData.data : SEED_REGIONS;

  const filtered = allPackages.filter(p => 
    (selectedRegion === 'all' || p.region_id === selectedRegion || p.region?.name === selectedRegion) &&
    (p.name.toLowerCase().includes(search.toLowerCase()) || 
     p.excerpt?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header Section */}
      <section className="relative h-[250px] flex items-center justify-center bg-primary overflow-hidden">
        <div className="absolute inset-0 opacity-20">
           <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb" className="w-full h-full object-cover" alt="" />
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Paket Wisata Pilihan</h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">Temukan petualangan impian Anda di Sumatera Utara dengan paket terlengkap dan termurah.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20 pb-20">
        {/* Filter Bar */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-12 border flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="Cari destinasi atau nama paket..." 
              className="pl-10 h-11 bg-muted/20 border-none rounded-xl focus-visible:ring-primary"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <Button 
               variant={selectedRegion === 'all' ? 'default' : 'outline'} 
               size="sm" 
               className="rounded-full"
               onClick={() => setSelectedRegion('all')}
            >
              Semua Wilayah
            </Button>
            {allRegions.map(region => (
              <Button 
                key={region.id || region.name}
                variant={selectedRegion === region.id || selectedRegion === region.name ? 'default' : 'outline'} 
                size="sm" 
                className="rounded-full whitespace-nowrap"
                onClick={() => setSelectedRegion(region.id || region.name)}
              >
                {region.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Package Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-3xl overflow-hidden border h-[450px] animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-2 flex flex-col items-center">
             <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
               <MapPin className="w-8 h-8 text-muted-foreground" />
             </div>
             <h3 className="text-xl font-bold">Tidak ada paket ditemukan</h3>
             <p className="text-muted-foreground mt-1">Coba sesuaikan pencarian atau filter wilayah Anda.</p>
             <Button variant="link" onClick={() => {setSearch(''); setSelectedRegion('all')}} className="mt-4">Reset Filter</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((pkg, idx) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group bg-white rounded-3xl overflow-hidden border hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                <div className="relative h-[250px] overflow-hidden">
                  <img 
                    src={pkg.images?.[0] || 'https://images.unsplash.com/photo-1501785888041-af3ef285b470'} 
                    alt={pkg.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-white/90 text-primary hover:bg-white backdrop-blur-md px-3 py-1 font-bold">
                       {pkg.region?.name || 'Sumatera Utara'}
                    </Badge>
                  </div>
                  {pkg.featured && (
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-amber-500 text-white border-none px-3 py-1 font-bold shadow-lg">
                        Unggulan
                      </Badge>
                    </div>
                  )}
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-1">{pkg.name}</h3>
                    <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
                      <Navigation className="w-3.5 h-3.5" />
                      <span>{pkg.duration_days || 3} Hari {pkg.duration_nights || 2} Malam</span>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
                    {pkg.excerpt || 'Nikmati keindahan alam Sumatera Utara dengan paket wisata menarik yang dikemas secara profesional.'}
                  </p>

                  <div className="pt-4 border-t flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">Mulai dari</p>
                      <p className="text-xl font-bold text-primary">{formatPrice(pkg.price)}</p>
                    </div>
                    <Link to={`/packages/${pkg.id}`}>
                      <Button className="rounded-xl group-hover:px-6 transition-all duration-300 gap-2">
                        Detail <ChevronRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
