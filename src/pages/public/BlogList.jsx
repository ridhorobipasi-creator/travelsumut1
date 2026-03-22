import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { 
  Plus, Search, User, Calendar, BookOpen, 
  ChevronRight, TrendingUp, History, Compass 
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import { SEED_ARTICLES } from '@/lib/seeds';

export default function BlogList() {
  const [search, setSearch] = useState('');

  const { data: articlesData, isLoading } = useQuery({
    queryKey: ['public-articles'],
    queryFn: () => base44.entities.Article.list({ limit: 50, status: 'published' })
  });
  
  const articles = articlesData?.data && articlesData.data.length > 0 ? articlesData.data : SEED_ARTICLES;

  const filtered = articles.filter(a => 
    a.title.toLowerCase().includes(search.toLowerCase()) || 
    a.excerpt?.toLowerCase().includes(search.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Blog Intro Section */}
      <section className="bg-white py-24 pb-32 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-32 opacity-10">
           <BookOpen className="w-64 h-64 text-primary" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
           <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 px-4 py-1 font-bold text-sm tracking-widest uppercase italic">
              Cerita Dari Wonderfultoba.com
           </Badge>
           <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter leading-none">Jurnal Perjalanan & Tips Wisata</h1>
           <p className="text-xl text-muted-foreground max-w-2xl mx-auto italic">Temukan inspirasi destinasi, panduan budaya, dan kuliner terbaik di Sumatera Utara.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
           {/* Sidebar - Trending & Info */}
           <aside className="lg:col-span-1 space-y-12">
              <div className="space-y-6 bg-white p-8 rounded-[2.5rem] shadow-xl border relative group h-fit">
                <h3 className="text-xl font-bold tracking-tight italic flex items-center gap-2">
                   <TrendingUp className="w-5 h-5 text-primary" /> Populer Saat Ini
                </h3>
                <div className="space-y-6">
                   {[1, 2, 3].map(i => (
                     <div key={i} className="group relative flex gap-4 cursor-pointer">
                        <div className="w-16 h-16 rounded-2xl bg-muted overflow-hidden shrink-0">
                           <img src={`https://images.unsplash.com/photo-1544620347-c4fd4a3d5997?u=${i}`} className="w-full h-full object-cover" alt="" />
                        </div>
                        <div className="space-y-1">
                           <p className="text-xs font-bold text-primary uppercase tracking-widest italic">{i === 1 ? 'Destination Guide' : 'Travel Tips'}</p>
                           <p className="text-sm font-bold line-clamp-2 leading-tight group-hover:underline underline-offset-4">{i === 1 ? 'Panduan Lengkap Mengunjungi Danau Toba' : '10 Kuliner Wajib di Medan'}</p>
                        </div>
                     </div>
                   ))}
                </div>
              </div>

              <div className="p-8 bg-primary rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
                <CardHeader className="p-0 mb-4 space-y-2">
                   <CardDescription className="text-xs font-bold uppercase tracking-widest text-white/70 italic px-2">Newsletter</CardDescription>
                   <CardTitle className="text-2xl font-black italic tracking-tight px-2 leading-none">Dapatkan Update Tiap Minggu!</CardTitle>
                </CardHeader>
                <div className="space-y-4">
                   <Input placeholder="Email Anda" className="h-12 bg-white/20 border-white/30 placeholder:text-white/50 text-white rounded-2xl" />
                   <Button variant="secondary" className="w-full h-12 rounded-2xl font-bold shadow-lg shadow-black/10">Langganan Gratis</Button>
                </div>
              </div>
           </aside>

           {/* Main Feed */}
           <div className="lg:col-span-3 space-y-12">
              <div className="relative group">
                <Search className="absolute left-4 top-4 h-6 w-6 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input 
                   placeholder="Cari topik atau artikel..." 
                   className="h-16 pl-14 bg-white border-2 border-transparent focus-visible:border-primary/20 rounded-[2rem] shadow-xl text-lg font-medium tracking-tight mb-8"
                   value={search}
                   onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   {[1, 2, 3, 4].map(i => (
                     <div key={i} className="h-[400px] bg-white rounded-[2.5rem] animate-pulse" />
                   ))}
                </div>
              ) : filtered.length === 0 ? (
                <div className="py-24 text-center bg-white rounded-[3rem] border border-dashed flex flex-col items-center">
                   <Compass className="w-16 h-16 text-muted-foreground opacity-20 mb-4" />
                   <h3 className="text-2xl font-bold italic tracking-tighter">Hasil Pencarian Kosong</h3>
                   <p className="text-muted-foreground mt-2 italic">Coba gunakan kata kunci lain seperti 'Toba' atau 'Medan'.</p>
                   <Button variant="link" className="mt-4 rounded-xl" onClick={() => setSearch('')}>Lihat Artikel Terbaru</Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   {filtered.map((article, idx) => (
                     <motion.div
                       key={article.id}
                       initial={{ opacity: 0, y: 20 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ delay: idx * 0.1 }}
                       className="group bg-white rounded-[3rem] overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative"
                     >
                        <div className="h-[280px] overflow-hidden relative p-4">
                           <img 
                              src={article.cover_image || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb'} 
                              alt={article.title}
                              className="w-full h-full object-cover rounded-[2rem] transition-transform duration-1000 group-hover:scale-105"
                           />
                           <div className="absolute top-8 left-8">
                             <Badge className="bg-primary text-white border-2 border-white/20 px-4 py-1 font-bold italic shadow-xl">
                                {article.category || 'Travel Guide'}
                             </Badge>
                           </div>
                        </div>
                        <CardHeader className="px-8 pb-4 pt-2">
                           <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em] italic text-muted-foreground mb-3">
                              <span className="flex items-center gap-1.5"><User className="w-3 h-3" /> {article.author || 'Tim Penulis'}</span>
                              <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {new Date(article.created_at).toLocaleDateString('id-ID')}</span>
                           </div>
                           <CardTitle className="text-2xl md:text-3xl font-black italic group-hover:text-primary transition-colors leading-tight mb-2 tracking-tight">
                              {article.title}
                           </CardTitle>
                           <CardDescription className="text-sm font-medium line-clamp-3 leading-relaxed text-muted-foreground/80 italic">
                             {article.excerpt || 'Pelajari lebih dalam tentang pesona Danau Toba dan temukan kejutan di setiap perjalanan Anda.'}
                           </CardDescription>
                        </CardHeader>
                        <CardContent className="px-8 pb-10">
                           <Button variant="outline" className="h-12 w-full rounded-2xl border-2 font-bold gap-2 text-primary hover:bg-primary hover:text-white hover:border-primary transition-all duration-300">
                             Baca Selengkapnya <ChevronRight className="w-5 h-5" />
                           </Button>
                        </CardContent>
                     </motion.div>
                   ))}
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}
