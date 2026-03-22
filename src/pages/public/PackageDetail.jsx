import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { formatPrice } from '@/components/shared/PriceFormatter';
import { 
  MapPin, Clock, Users, Calendar, CheckCircle2, 
  ChevronRight, ArrowLeft, Star, Phone, Mail, Share2, X
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Tabs, TabsContent, TabsList, TabsTrigger 
} from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

import { SEED_PACKAGES } from '@/lib/seeds';

export default function PackageDetail() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('detail');
  const [isBooking, setIsBooking] = useState(false);
  const [bookingData, setBookingData] = useState({ 
    pax: 2, 
    date: '', 
    customer_name: '', 
    email: '', 
    phone: '' 
  });

  const { data: pkg, isLoading } = useQuery({
    queryKey: ['package', id],
    queryFn: () => {
      if (id?.startsWith('seed-')) {
        return SEED_PACKAGES.find(p => p.id === id);
      }
      return base44.entities.Package.get(id, { populate: ['region'] });
    },
    enabled: !!id
  });

  const bookMutation = useMutation({
    mutationFn: async () => {
      const price = pkg.price || pkg.base_price || 0;
      
      const payload = {
        customer_name: bookingData.customer_name || 'Tamu Tanpa Nama',
        email: bookingData.email,
        phone: bookingData.phone,
        status: 'pending',
        pax: bookingData.pax,
        trip_date: bookingData.date || new Date().toISOString(),
        total_price: price * bookingData.pax
      };
      
      // Prevent MongoDB Cast Error for relation id
      if (!pkg.id?.startsWith('seed-')) {
        payload.package = pkg.id;
      }

      try {
        return await base44.entities.Booking.create(payload);
      } catch (err) {
        console.error("Booking Error:", err);
        throw err;
      }
    },
    onSuccess: () => {
      setIsBooking(false);
      toast({
        title: "Pesanan Berhasil!",
        description: "Tim kami akan segera menghubungi Anda melalui WhatsApp untuk tahap selanjutnya.",
      });
    },
    onError: (err) => {
      toast({
        variant: "destructive",
        title: "Gagal Terkirim",
        description: `Error: ${err.message || 'Pastikan data valid.'}`
      });
    }
  });

  if (isLoading) return <div className="h-screen flex items-center justify-center animate-pulse font-bold">Memuat Paket...</div>;
  if (!pkg) return <div className="h-screen flex items-center justify-center font-bold">Paket tidak ditemukan.</div>;

  const basePrice = pkg.price || pkg.base_price || 0;

  return (
    <div className="min-h-screen bg-muted/20 pb-20">
      {/* Navbar Overlap spacing */}
      <div className="h-20" />

      {/* Hero Header */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <Link to="/packages" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-4">
           <ArrowLeft className="w-4 h-4" /> Kembali ke Paket
        </Link>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 px-2 py-0.5 font-bold uppercase tracking-wider">
                {pkg.region?.name || 'Sumatera Utara'}
              </Badge>
              <Badge className="bg-amber-100 text-amber-600 border-none shadow-none font-bold italic flex items-center gap-1">
                <Star className="w-3 h-3 fill-current" /> 4.9 (120+ Review)
              </Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-tight">{pkg.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-sm font-medium">
               <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {pkg.duration_days || 3} Hari {pkg.duration_nights || 2} Malam</span>
               <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> Min. 2 Orang</span>
               <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> Titik Kumpul: Medan / Bandara KNO</span>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-6 border flex items-center justify-between lg:block lg:text-right gap-8 min-w-[300px]">
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">Harga per pax mulai dari</p>
              <p className="text-3xl font-black text-primary tracking-tight">{formatPrice(basePrice)}</p>
            </div>
            
            <Dialog open={isBooking} onOpenChange={setIsBooking}>
              <DialogTrigger asChild>
                <Button size="lg" className="w-full h-14 text-lg rounded-xl shadow-lg shadow-primary/25 gap-2">
                  Pesan Sekarang <ChevronRight className="w-5 h-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Konfirmasi Pesanan</DialogTitle>
                  <DialogDescription>
                    Isi detail data diri dan jadwal perjalanan Anda untuk paket <strong>{pkg.name}</strong>.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto px-1">
                  <div className="space-y-2">
                    <Label>Nama Lengkap</Label>
                    <Input 
                      placeholder="Misal: Budi Santoso" 
                      value={bookingData.customer_name}
                      onChange={(e) => setBookingData({ ...bookingData, customer_name: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                       <Label>No. WhatsApp</Label>
                       <Input 
                         type="tel"
                         placeholder="0812..." 
                         value={bookingData.phone}
                         onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                       />
                     </div>
                     <div className="space-y-2">
                       <Label>Alamat Email</Label>
                       <Input 
                         type="email"
                         placeholder="nama@email.com" 
                         value={bookingData.email}
                         onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                       />
                     </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                       <Label>Jumlah Peserta</Label>
                       <Input 
                         type="number" 
                         min="1" 
                         value={bookingData.pax}
                         onChange={(e) => setBookingData({ ...bookingData, pax: parseInt(e.target.value) || 1 })}
                       />
                     </div>
                     <div className="space-y-2">
                       <Label>Jadwal Trip</Label>
                       <Input 
                         type="date" 
                         value={bookingData.date}
                         onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                       />
                     </div>
                  </div>
                  
                  <div className="bg-muted p-4 rounded-xl flex items-center justify-between font-bold border mt-2">
                    <span>Total Estimasi:</span>
                    <span className="text-primary text-xl">
                      {formatPrice(basePrice * (bookingData.pax || 1))}
                    </span>
                  </div>
                </div>
                <Button 
                  size="lg" 
                  className="w-full h-12 font-bold"
                  disabled={bookMutation.isPending}
                  onClick={() => bookMutation.mutate()}
                >
                  {bookMutation.isPending ? 'Sedang Memproses...' : 'Kirim Pesanan (Live)'}
                </Button>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Content */}
        <div className="lg:col-span-2 space-y-12">
          {/* Gallery Mock */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 grid-rows-2 gap-4 h-[500px] rounded-3xl overflow-hidden shadow-2xl">
             <div className="col-span-1 md:col-span-2 row-span-2">
                <img src={pkg.images?.[0] || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5997'} className="w-full h-full object-cover" alt="" />
             </div>
             <div className="col-span-1 md:col-span-2 row-span-1">
                <img src={pkg.images?.[1] || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2'} className="w-full h-full object-cover" alt="" />
             </div>
             <div className="col-span-1 row-span-1">
                <img src={pkg.images?.[2] || 'https://images.unsplash.com/photo-1501785888041-af3ef285b470'} className="w-full h-full object-cover" alt="" />
             </div>
             <div className="col-span-1 row-span-1 relative bg-black">
                <img src={pkg.images?.[3] || 'https://images.unsplash.com/photo-1533038590840-1cde6e668a91'} className="w-full h-full object-cover opacity-60" alt="" />
                <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg">+12 Foto</div>
             </div>
          </div>

          {/* Section Detail */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="bg-white p-6 rounded-3xl shadow-lg border">
            <TabsList className="bg-muted/50 p-1 rounded-2xl mb-8 w-full md:w-fit overflow-x-auto">
              <TabsTrigger value="detail" className="px-8 font-bold data-[state=active]:bg-primary data-[state=active]:text-white rounded-xl">Deskripsi</TabsTrigger>
              <TabsTrigger value="itinerary" className="px-8 font-bold data-[state=active]:bg-primary data-[state=active]:text-white rounded-xl">Itinerary</TabsTrigger>
              <TabsTrigger value="inclusions" className="px-8 font-bold data-[state=active]:bg-primary data-[state=active]:text-white rounded-xl">Fasilitas</TabsTrigger>
              <TabsTrigger value="faq" className="px-8 font-bold data-[state=active]:bg-primary data-[state=active]:text-white rounded-xl">FAQ</TabsTrigger>
            </TabsList>
            
            <TabsContent value="detail" className="prose prose-lg max-w-none text-muted-foreground leading-relaxed animate-in fade-in duration-500">
               <p className="text-xl font-medium text-foreground mb-4">Nikmati keajaiban alam Sumatera Utara melalui paket eksklusif kami.</p>
               <div dangerouslySetInnerHTML={{ __html: pkg.content || 'Detail paket sedang disiapkan...' }} />
            </TabsContent>
            
            <TabsContent value="itinerary" className="space-y-8 animate-in slide-in-from-left-4 duration-500">
                {[1, 2, 3].map(day => (
                  <div key={day} className="flex gap-6 relative">
                    <div className="flex flex-col items-center">
                       <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-black text-lg z-10 shadow-lg shadow-primary/20">H{day}</div>
                       {day < 3 && <div className="w-0.5 h-full bg-muted-foreground/10 absolute top-12 bottom-0" />}
                    </div>
                    <div className="flex-1 pb-8">
                       <h4 className="text-xl font-bold mb-3">Hari ke-{day}: Penjelajahan Penuh Makna</h4>
                       <ul className="space-y-4">
                          <li className="flex gap-3 text-muted-foreground">
                             <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                             <span>Penjemputan di Bandara Kualanamu / Hotel Kota Medan oleh tim profesional kami.</span>
                          </li>
                          <li className="flex gap-3 text-muted-foreground">
                             <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                             <span>Makan siang di restoran lokal dengan menu otentik khas daerah.</span>
                          </li>
                       </ul>
                    </div>
                  </div>
                ))}
            </TabsContent>

            <TabsContent value="inclusions" className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in zoom-in-95 duration-500">
                <div className="space-y-6 bg-green-50/30 p-6 rounded-2xl border border-green-100">
                   <h4 className="text-xl font-bold text-green-800 flex items-center gap-2 px-2">
                     <CheckCircle2 className="w-6 h-6" /> Biaya Termasuk (Inclusion)
                   </h4>
                   <ul className="grid grid-cols-1 gap-3">
                      {['Transportasi AC', 'Hotel Bintang 3/4', 'Makan 3x Sehari', 'Tiket Masuk Wisata', 'Pemandu Berlisensi', 'Air Mineral 600ml'].map(item => (
                        <li key={item} className="bg-white p-3 rounded-xl border flex items-center gap-3 font-medium text-green-700 shadow-sm">
                           <CheckCircle2 className="w-4 h-4" /> {item}
                        </li>
                      ))}
                   </ul>
                </div>
                <div className="space-y-6 bg-red-50/30 p-6 rounded-2xl border border-red-100">
                   <h4 className="text-xl font-bold text-red-800 flex items-center gap-2 px-2">
                     <X className="w-6 h-6" /> Tidak Termasuk (Exclusion)
                   </h4>
                   <ul className="grid grid-cols-1 gap-3">
                      {['Tiket Pesawat PP', 'Keperluan Pribadi', 'Tipping Guide/Driver', 'Asuransi Perjalanan', 'Makan di Luar Paket'].map(item => (
                        <li key={item} className="bg-white p-3 rounded-xl border flex items-center gap-3 font-medium text-red-700 shadow-sm opacity-80">
                           <X className="w-4 h-4" /> {item}
                        </li>
                      ))}
                   </ul>
                </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Sidebar - Sticky */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
             {/* Contact Support */}
             <Card className="rounded-3xl shadow-xl overflow-hidden border-none bg-primary text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                   <Share2 className="w-24 h-24" />
                </div>
                <CardContent className="p-8 space-y-6">
                   <h3 className="text-2xl font-black">Butuh Bantuan?</h3>
                   <p className="opacity-90 italic">Konsultasikan rencana perjalanan Anda dengan Admin kami secara gratis melalui WhatsApp.</p>
                   <div className="space-y-3">
                     <Button variant="secondary" className="w-full font-bold h-14 rounded-2xl gap-2 text-primary shadow-lg shadow-black/10">
                        <Phone className="w-5 h-5 fill-current" /> Hubungi WhatsApp
                     </Button>
                     <Button variant="outline" className="w-full font-bold h-12 rounded-2xl gap-2 bg-white/20 border-white/40 hover:bg-white/30 text-white">
                        <Mail className="w-4 h-4" /> Kirim Email
                     </Button>
                   </div>
                   <Separator className="bg-white/20" />
                   <div className="flex items-center justify-center gap-4 text-sm opacity-80">
                      <span>Respon Cepat 24/7</span>
                      <span className="w-1 h-1 bg-white rounded-full" />
                      <span>Terpercaya</span>
                   </div>
                </CardContent>
             </Card>

             {/* Why Book with us */}
             <Card className="rounded-3xl shadow-sm border p-6 space-y-6">
                <h4 className="font-bold text-lg flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-500 fill-current" /> Kenapa Memilih Kami?
                </h4>
                <div className="space-y-4">
                  {[
                    { t: 'Pemandu Lokal', d: 'Didampingi oleh warga lokal Sumatera Utara yang berpengalaman.' },
                    { s: 'Tanpa Biaya Tersembunyi', d: 'Harga transparan sesuai dengan fasilitas yang dijanjikan.' },
                    { f: 'Fleksibel', d: 'Bisa custom rute dan durasi sesuai keinginan Anda.' }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4">
                       <CheckCircle2 className="w-5 h-5 text-primary mt-1 shrink-0" />
                       <div>
                          <p className="font-bold text-sm tracking-tight">{item.t || item.s || item.f}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{item.d}</p>
                       </div>
                    </div>
                  ))}
                </div>
             </Card>
          </div>
        </aside>
      </main>
    </div>
  );
}
