import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice } from '@/components/shared/PriceFormatter';
import { 
  Car, Users, Fuel, Settings, CheckCircle2, 
  Search, ShieldCheck, HelpCircle, Phone, Info, ChevronRight
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SEED_RENTALS } from '@/lib/seeds';

export default function RentalsList() {
  const [search, setSearch] = useState('');

  const { data: rentalsData, isLoading } = useQuery({
    queryKey: ['public-rentals'],
    queryFn: () => base44.entities.Rental.list({ limit: 50 })
  });

  const rentals = rentalsData?.data && rentalsData.data.length > 0 ? rentalsData.data : SEED_RENTALS;

  const filtered = rentals.filter(r => 
    r.name.toLowerCase().includes(search.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Hero Header */}
      <section className="bg-primary text-white py-24 relative overflow-hidden">
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-muted/20 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
           <Badge variant="outline" className="text-white border-white/40 border-2 px-4 py-1 font-bold text-sm tracking-widest uppercase">
              Rent-A-Car & Mobil Wisata
           </Badge>
           <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none italic">Armada Terpercaya untuk Perjalanan Anda</h1>
           <p className="text-xl opacity-80 max-w-2xl mx-auto">Sewa mobil dengan lepas kunci atau dengan supir profesional untuk kenyamanan Anda di Sumatera Utara.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20 pb-20">
        <div className="bg-white rounded-3xl shadow-xl p-8 border mb-12 flex flex-col md:flex-row gap-6 items-center justify-between">
            <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                <Input 
                   placeholder="Cari merk atau tipe mobil..." 
                   className="pl-11 h-14 bg-muted/20 border-none rounded-2xl text-lg font-medium"
                   value={search}
                   onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <div className="flex gap-4 w-full md:w-auto">
                <div className="flex -space-x-2">
                   {[1, 2, 3, 4].map(i => (
                     <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-muted flex items-center justify-center overflow-hidden">
                        <img src={`https://i.pravatar.cc/100?u=${i}`} alt="" />
                     </div>
                   ))}
                </div>
                <div className="text-sm">
                   <p className="font-bold">1,200+ Pelanggan Puas</p>
                   <p className="text-muted-foreground text-xs italic">Review bintang 5 di Google</p>
                </div>
            </div>
        </div>

        {/* Rentals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
             [1, 2, 3, 4, 5, 6].map(i => (
               <div key={i} className="h-[500px] bg-white rounded-3xl animate-pulse" />
             ))
          ) : filtered.length === 0 ? (
            <div className="col-span-full py-32 text-center bg-white rounded-3xl border border-dashed flex flex-col items-center">
               <Car className="w-16 h-16 text-muted-foreground mb-4 opacity-20" />
               <h3 className="text-2xl font-bold">Armada tidak tersedia</h3>
               <p className="text-muted-foreground mt-2 max-w-sm">Maaf, saat ini belum ada kendaraan yang tersedia sesuai pencarian Anda.</p>
               <Button variant="outline" className="mt-6 rounded-xl" onClick={() => setSearch('')}>Lihat Semua Armada</Button>
            </div>
          ) : filtered.map((car) => (
            <Card key={car.id} className="rounded-[2.5rem] overflow-hidden border-none shadow-lg hover:shadow-2xl transition-all duration-500 group">
               <div className="relative h-[250px] overflow-hidden p-4">
                  <img 
                    src={car.image || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2'} 
                    alt={car.name}
                    className="w-full h-full object-cover rounded-[2rem] shadow-md transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute bottom-8 left-8">
                     <Badge className="bg-primary/90 text-white border-2 border-white/20 backdrop-blur-md px-4 py-1.5 font-bold shadow-xl">
                        {car.transmission || 'Automatic'}
                     </Badge>
                  </div>
               </div>
               <CardHeader className="px-8 pt-2">
                  <div className="flex items-center justify-between">
                     <CardTitle className="text-2xl font-bold italic tracking-tight">{car.name}</CardTitle>
                     <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <ShieldCheck className="w-5 h-5 shadow-sm" />
                     </div>
                  </div>
                  <CardDescription className="flex items-center gap-4 text-sm font-semibold mt-2">
                     <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-muted-foreground" /> {car.seats || 7} Kursi</span>
                     <span className="flex items-center gap-1.5"><Fuel className="w-4 h-4 text-muted-foreground" /> {car.fuel_type || 'Bensin'}</span>
                     <span className="flex items-center gap-1.5"><Settings className="w-4 h-4 text-muted-foreground" /> Model {car.year || '2022'}</span>
                  </CardDescription>
               </CardHeader>
               <CardContent className="px-8 pb-8 space-y-6">
                  <Separator className="bg-muted opacity-50" />
                  <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest italic">Harga Sewa / Hari</p>
                        <p className="text-3xl font-black text-primary italic tracking-tight">{formatPrice(car.price_per_day)}</p>
                      </div>
                      <Button 
                        className="h-14 px-8 rounded-2xl shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90 transition-all gap-2 font-bold text-lg"
                        onClick={() => {
                          const wamsg = encodeURIComponent(`Halo Admin Nusantara, saya tertarik menyewa mobil ${car.name} (${car.transmission}) dengan harga ${formatPrice(car.price_per_day)}/hari. Mohon info ketersediaannya.`);
                          window.open(`https://wa.me/6281234567890?text=${wamsg}`, '_blank');
                        }}
                      >
                        Sewa <ChevronRight className="w-5 h-5" />
                      </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                     <div className="text-[10px] font-bold text-muted-foreground flex items-center gap-1 uppercase tracking-tighter italic">
                       <CheckCircle2 className="w-3 h-3 text-green-500" /> Free Supir Profesional
                     </div>
                     <div className="text-[10px] font-bold text-muted-foreground flex items-center gap-1 uppercase tracking-tighter italic">
                       <CheckCircle2 className="w-3 h-3 text-green-500" /> Asuransi Kendaraan
                     </div>
                  </div>
               </CardContent>
            </Card>
          ))}
        </div>

        {/* Info Section */}
        <section className="mt-32 bg-white rounded-[3rem] p-12 shadow-2xl border flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1 space-y-8">
               <div className="space-y-4">
                  <h2 className="text-4xl font-black italic tracking-tighter">Ketentuan Sewa Unit</h2>
                  <p className="text-muted-foreground text-lg leading-relaxed">Kami memberikan kualitas armada terbaik untuk menjamin keselamatan dan kenyamanan perjalanan Anda selama di Sumatera Utara.</p>
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[
                    { t: 'Kondisi Prima', d: 'Unit rutin di-service di dealer resmi setiap bulan.' },
                    { t: 'Pilihan Fleksibel', d: 'Bisa harian, mingguan, atau kontrak bulanan.' },
                    { t: 'Supir Ramah', d: 'Supir berpengalaman sebagai tour guide lokal.' },
                    { t: 'Antar Jemput', d: 'Gratis antar jemput unit di Bandara Kualanamu.' }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4 group">
                       <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm">
                          <CheckCircle2 className="w-6 h-6" />
                       </div>
                       <div>
                          <p className="font-bold text-lg italic tracking-tight">{item.t}</p>
                          <p className="text-sm text-muted-foreground font-medium">{item.d}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
            <div className="flex-1 w-full max-w-md">
                <Card className="rounded-[2.5rem] bg-muted/30 border-none p-8 space-y-6">
                   <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-white shadow-lg">
                        <HelpCircle className="w-8 h-8" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold italic">Butuh Mobil Khusus?</h4>
                        <p className="text-sm text-muted-foreground">Kami menyediakan unit Bus & Wedding Car.</p>
                      </div>
                   </div>
                   <div className="p-6 bg-white rounded-3xl shadow-sm border space-y-4">
                      <div className="flex items-center gap-3">
                         <div className="w-2 h-12 rounded-full bg-primary" />
                         <p className="text-sm font-medium italic">"Tersedia Bus Pariwisata 25-45 seat dan mobil pengantin Alphard/Vellfire premium."</p>
                      </div>
                      <Button className="w-full h-14 rounded-2xl gap-2 text-lg font-bold shadow-md shadow-primary/20">
                         <Phone className="w-5 h-5 fill-current" /> Konsultasi Sekarang
                      </Button>
                   </div>
                </Card>
            </div>
        </section>
      </div>
    </div>
  );
}
