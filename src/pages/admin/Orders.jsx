import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  Check, X, Eye, Search, Filter, 
  MapPin, ShoppingCart, User, Calendar 
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import { formatPrice } from '@/components/shared/PriceFormatter';
import { Badge } from "@/components/ui/badge";
import { toast } from '@/hooks/use-toast';

export default function OrdersAdmin() {
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['admin-bookings'],
    queryFn: () => base44.entities.Booking.list({
      limit: 100,
      populate: ['package', 'user']
    }),
    refetchInterval: 5000 // Real-time poll every 5s
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => base44.entities.Booking.update(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
      toast({ description: "Status pesanan berhasil diperbarui." });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Booking.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
      toast({ description: "Pesanan dihapus dari sistem." });
    }
  });

  const filtered = bookings?.data?.filter(b => 
    b.id.toLowerCase().includes(search.toLowerCase()) || 
    b.package?.name?.toLowerCase().includes(search.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Daftar Pesanan</h2>
          <p className="text-muted-foreground">Monitor semua pemesanan paket dan rental</p>
        </div>
      </div>

      <div className="p-4 bg-card border rounded-xl shadow-sm flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Cari Order ID atau Paket..." 
            className="pl-9 bg-muted/20"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="w-4 h-4" /> Filter Status
          </Button>
        </div>
      </div>

      <div className="border rounded-xl bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Pelanggan</TableHead>
              <TableHead>Paket/Produk</TableHead>
              <TableHead>Tanggal Trip</TableHead>
              <TableHead>Harga</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [1, 2, 3].map(i => (
                <TableRow key={i}>
                  <TableCell colSpan={7} className="h-12 animate-pulse bg-muted/10" />
                </TableRow>
              ))
             ) : filtered.length === 0 ? (
              <TableRow>
                 <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                   Tidak ada pesanan masuk.
                 </TableCell>
              </TableRow>
            ) : filtered.map((order) => (
              <TableRow key={order.id} className="hover:bg-muted/10 transition-colors">
                <TableCell className="font-mono text-xs text-muted-foreground">ORD-{order.id.slice(0, 8)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-bold leading-none">{order.customer_name || 'Anonymous'}</div>
                      {(order.phone || order.email) && (
                        <div className="text-[10px] font-medium text-muted-foreground mt-1.5 flex flex-col">
                          {order.phone && <span>{order.phone}</span>}
                          {order.email && <span>{order.email}</span>}
                        </div>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-semibold text-sm">{order.package?.name || 'Paket Misterius'}</div>
                  <div className="text-xs text-muted-foreground capitalize flex items-center gap-1">
                    <ShoppingCart className="w-3 h-3" /> Booking Baru
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground flex flex-col">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(order.trip_date || Date.now()).toLocaleDateString('id-ID')}</span>
                </TableCell>
                <TableCell className="font-bold">{formatPrice(order.total_price)}</TableCell>
                <TableCell>
                  <Badge className={`
                    border-none shadow-none font-medium capitalize
                    ${order.status === 'confirmed' ? 'bg-green-100 text-green-700 hover:bg-green-100' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-700 hover:bg-red-100' :
                      'bg-amber-100 text-amber-700 hover:bg-amber-100'}
                  `}>
                    {order.status === 'confirmed' ? 'Dikonfirmasi' : 
                     order.status === 'cancelled' ? 'Dibatalkan' : 'Menunggu'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-1">
                  {order.status !== 'confirmed' && (
                    <Button 
                      variant="ghost" 
                      onClick={() => updateStatusMutation.mutate({ id: order.id, status: 'confirmed' })}
                      size="icon" 
                      className="text-green-600 hover:text-green-700 hover:bg-green-50"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                  {order.status === 'pending' && (
                    <Button 
                      variant="ghost" 
                      onClick={() => updateStatusMutation.mutate({ id: order.id, status: 'cancelled' })}
                      size="icon" 
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    onClick={() => {
                        if(confirm('Hapus histori pesanan ini secara permanen?')) {
                            deleteMutation.mutate(order.id);
                        }
                    }}
                    size="icon" 
                    className="text-muted-foreground hover:text-red-600 hover:bg-red-50"
                    title="Hapus"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between pb-12 pt-4">
        <p className="text-sm text-muted-foreground">
          Menampilkan <strong>{filtered.length}</strong> pesanan
        </p>
        <div className="flex gap-1">
          <Button variant="outline" size="sm" disabled>1</Button>
          <Button variant="outline" size="sm" disabled>2</Button>
        </div>
      </div>
    </div>
  );
}
