import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  Trash2, Search, Star, MessageSquare, Check, X, User
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function ReviewsAdmin() {
  const [search, setSearch] = useState('');

  const { data: reviews, isLoading } = useQuery({
    queryKey: ['admin-reviews'],
    queryFn: () => base44.entities.Review.list({ limit: 50, populate: ['package'] })
  });

  const filtered = reviews?.data?.filter(r => 
    r.comment.toLowerCase().includes(search.toLowerCase()) || 
    r.customer_name?.toLowerCase().includes(search.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Review & Testimoni</h2>
          <p className="text-muted-foreground">Kelola ulasan dari pelanggan Anda</p>
        </div>
      </div>

      <div className="p-4 bg-card border rounded-xl shadow-sm">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Cari komentar atau pelanggan..." 
            className="pl-9 bg-muted/20"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="border rounded-xl bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Pelanggan</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Komentar</TableHead>
              <TableHead>Paket Terkait</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [1, 2, 3].map(i => (
                <TableRow key={i}>
                  <TableCell colSpan={6} className="h-12 animate-pulse bg-muted/10" />
                </TableRow>
              ))
             ) : filtered.length === 0 ? (
              <TableRow>
                 <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                   Belum ada ulasan dari pelanggan.
                 </TableCell>
              </TableRow>
            ) : filtered.map((review) => (
              <TableRow key={review.id} className="hover:bg-muted/10 transition-colors">
                <TableCell>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <div className="text-sm font-medium">{review.customer_name || 'Anonymous'}</div>
                  </div>
                </TableCell>
                <TableCell>
                   <div className="flex items-center gap-1 text-amber-500">
                     <Star className="w-4 h-4 fill-current" />
                     <span className="font-bold">{review.rating}</span>
                   </div>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                   <div className="flex items-start gap-2 max-w-[300px]">
                     <MessageSquare className="w-4 h-4 mt-0.5 shrink-0" />
                     <span className="line-clamp-2 italic">"{review.comment}"</span>
                   </div>
                </TableCell>
                <TableCell className="text-sm font-medium">{review.package?.name || 'UMUM'}</TableCell>
                <TableCell>
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none shadow-none font-medium capitalize">
                    Published
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-1">
                  <Button variant="ghost" size="icon" className="text-green-600">
                     <Check className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-destructive">
                    <X className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
