import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Send, MapPin, Calendar, Users, 
  MessageSquare, User, Phone, CheckCircle2 
} from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function CustomTripForm() {
  const [formData, setFormData] = useState({
    customer_name: '',
    phone: '',
    destination: '',
    travel_date: '',
    duration_days: '',
    pax: '',
    requirements: ''
  });

  const mutation = useMutation({
    mutationFn: (data) => base44.entities.CustomTrip.create(data),
    onSuccess: () => {
      toast({
        title: "Permintaan Terkirim!",
        description: "Tim kami akan menghubungi Anda segera melalui WhatsApp.",
      });
      setFormData({
        customer_name: '',
        phone: '',
        destination: '',
        travel_date: '',
        duration_days: '',
        pax: '',
        requirements: ''
      });
    },
    onError: (e) => {
      toast({
        variant: "destructive",
        title: "Gagal Mengirim",
        description: "Pastikan data terisi dengan benar.",
      });
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  return (
    <div className="min-h-screen bg-muted/20 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center pt-24">
        {/* Left Side: Info */}
        <div className="space-y-12">
          <div className="space-y-6">
            <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-1.5 font-bold text-sm tracking-widest italic uppercase">
              The Journey of Your Choice
            </Badge>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none italic">Rancang Perjalanan Anda Sendiri</h1>
            <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
              Ingin rute yang berbeda? Kunjungi destinasi tersembunyi dengan jadwal fleksibel. Ceritakan rencana Anda, biarkan tim lokal kami yang mewujudkannya.
            </p>
          </div>

          <div className="space-y-8">
            {[
              { t: 'Pilih Destinasi', d: 'Tentukan lokasi yang ingin Anda kunjungi di Sumatera Utara.' },
              { t: 'Rencanakan Waktu', d: 'Bebas menentukan tanggal dan durasi perjalanan.' },
              { t: 'Fasilitas Sesuai Budget', d: 'Pilih akomodasi dan transportasi sesuai keinginan Anda.' }
            ].map((step, i) => (
              <div key={i} className="flex gap-6 relative group">
                <div className="w-14 h-14 rounded-[1.5rem] bg-white shadow-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <span className="text-xl font-black">{i + 1}</span>
                </div>
                <div>
                   <h4 className="text-xl font-bold tracking-tight italic">{step.t}</h4>
                   <p className="text-muted-foreground text-sm font-medium">{step.d}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-8 bg-primary rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-10">
                <Send className="w-32 h-32" />
             </div>
             <p className="text-sm opacity-80 mb-2 font-bold uppercase tracking-widest italic">Testimoni Custom Trip</p>
             <p className="text-2xl font-bold italic leading-tight mb-6">"Perjalanan keluarga kami ke Pulau Samosir sangat berkesan berkat rute yang disesuaikan khusus untuk kami!"</p>
             <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full border-2 border-white/20 overflow-hidden">
                   <img src="https://i.pravatar.cc/100?u=custom" alt="" />
                </div>
                <div>
                   <p className="font-bold text-sm tracking-tight text-white italic">Andi & Keluarga</p>
                   <p className="text-xs opacity-70">Desember 2023</p>
                </div>
             </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <Card className="rounded-[3rem] shadow-2xl border-none p-4 md:p-8 bg-white overflow-hidden relative group">
           <CardHeader className="space-y-2 mb-6">
              <CardTitle className="text-3xl font-black tracking-tight italic">Formulir Custom Trip</CardTitle>
              <CardDescription className="text-sm font-medium">Isi detail di bawah ini, admin kami akan mengirimkan invoice penawaran segera.</CardDescription>
           </CardHeader>
           <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 relative">
                       <Label htmlFor="customer_name" className="text-xs font-bold uppercase tracking-widest text-muted-foreground italic">Nama Lengkap</Label>
                       <div className="relative">
                          <User className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                          <Input 
                             id="customer_name" 
                             placeholder="Misal: Budi Santoso" 
                             className="h-12 pl-10 bg-muted/20 border-none rounded-2xl focus-visible:ring-primary shadow-sm"
                             value={formData.customer_name}
                             onChange={handleChange}
                             required
                          />
                       </div>
                    </div>
                    <div className="space-y-2 relative">
                       <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-widest text-muted-foreground italic">WhatsApp / Telepon</Label>
                       <div className="relative">
                          <Phone className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                          <Input 
                             id="phone" 
                             placeholder="Misal: 08123xxx" 
                             className="h-12 pl-10 bg-muted/20 border-none rounded-2xl focus-visible:ring-primary shadow-sm"
                             value={formData.phone}
                             onChange={handleChange}
                             required
                          />
                       </div>
                    </div>
                 </div>

                 <div className="space-y-2 relative">
                    <Label htmlFor="destination" className="text-xs font-bold uppercase tracking-widest text-muted-foreground italic">Tujuan Utama / Destinasi Impian</Label>
                    <div className="relative">
                       <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                       <Input 
                          id="destination" 
                          placeholder="Misal: Parapat, Berastagi, atau Desa Wisata..." 
                          className="h-12 pl-10 bg-muted/20 border-none rounded-2xl focus-visible:ring-primary shadow-sm"
                          value={formData.destination}
                          onChange={handleChange}
                          required
                       />
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2 relative">
                       <Label htmlFor="travel_date" className="text-xs font-bold uppercase tracking-widest text-muted-foreground italic">Tanggal</Label>
                       <div className="relative">
                          <Calendar className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                          <Input 
                             id="travel_date" 
                             type="date"
                             className="h-12 pl-10 bg-muted/20 border-none rounded-2xl focus-visible:ring-primary shadow-sm"
                             value={formData.travel_date}
                             onChange={handleChange}
                             required
                          />
                       </div>
                    </div>
                    <div className="space-y-2 relative">
                       <Label htmlFor="duration_days" className="text-xs font-bold uppercase tracking-widest text-muted-foreground italic">Durasi</Label>
                       <Input 
                          id="duration_days" 
                          placeholder="Hari" 
                          type="number"
                          className="h-12 bg-muted/20 border-none rounded-2xl focus-visible:ring-primary shadow-sm text-center"
                          value={formData.duration_days}
                          onChange={handleChange}
                          required
                       />
                    </div>
                    <div className="space-y-2 relative">
                       <Label htmlFor="pax" className="text-xs font-bold uppercase tracking-widest text-muted-foreground italic">Peserta</Label>
                       <div className="relative">
                          <Users className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                          <Input 
                             id="pax" 
                             placeholder="Orang" 
                             type="number"
                             className="h-12 pl-10 bg-muted/20 border-none rounded-2xl focus-visible:ring-primary shadow-sm"
                             value={formData.pax}
                             onChange={handleChange}
                             required
                          />
                       </div>
                    </div>
                 </div>

                 <div className="space-y-2 relative">
                    <Label htmlFor="requirements" className="text-xs font-bold uppercase tracking-widest text-muted-foreground italic">Detail Permintaan / Keinginan Khusus</Label>
                    <div className="relative">
                       <MessageSquare className="absolute left-3 top-4 h-4 w-4 text-muted-foreground" />
                       <Textarea 
                          id="requirements" 
                          placeholder="Misal: Perlu kursi bayi, Hotel Bintang 5, atau Menu Makanan Vegetarian..." 
                          className="min-h-[120px] pl-10 bg-muted/20 border-none rounded-2xl focus-visible:ring-primary shadow-sm pt-3.5"
                          value={formData.requirements}
                          onChange={handleChange}
                       />
                    </div>
                 </div>

                 <Button 
                   type="submit" 
                   className="w-full h-16 rounded-3xl text-xl font-black italic tracking-tight gap-4 shadow-xl shadow-primary/25 transition-all active:scale-95 duration-300"
                   disabled={mutation.isPending}
                 >
                   {mutation.isPending ? "Mengirim..." : (
                     <>Dapatkan Penawaran Terbaik <Send className="w-6 h-6" /></>
                   )}
                 </Button>
                 
                 <div className="flex items-center justify-center gap-2 text-muted-foreground text-[10px] font-bold uppercase tracking-[0.2em] italic">
                    <CheckCircle2 className="w-3 h-3 text-green-500" /> Jaminan Privasi Data Terjaga
                 </div>
              </form>
           </CardContent>
        </Card>
      </div>
    </div>
  );
}
