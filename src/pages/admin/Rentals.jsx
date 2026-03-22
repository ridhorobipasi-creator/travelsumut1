import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  Plus, Edit, Trash2, Search, Car, Users, Fuel
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import { formatPrice } from '@/components/shared/PriceFormatter';
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function RentalsAdmin() {
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', price_per_day: '', seats: '', transmission: 'Automatic' });

  const queryClient = useQueryClient();

  const { data: rentals, isLoading } = useQuery({
    queryKey: ['admin-rentals'],
    queryFn: () => base44.entities.Rental.list({ limit: 50 })
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Rental.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-rentals'] });
      toast({ title: "Terhapus", description: "Armada berhasil dihapus." });
    }
  });

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      const payload = { ...data, price_per_day: Number(data.price_per_day), seats: Number(data.seats) };
      if (editingId) {
        return base44.entities.Rental.update(editingId, payload);
      }
      return base44.entities.Rental.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-rentals'] });
      setIsDialogOpen(false);
      toast({ title: "Berhasil", description: editingId ? "Data diperbarui." : "Data armada baru ditambahkan." });
    }
  });

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({ name: item.name, price_per_day: item.price_per_day || '', seats: item.seats || '', transmission: item.transmission || 'Automatic' });
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingId(null);
    setFormData({ name: '', price_per_day: '', seats: '', transmission: 'Automatic' });
    setIsDialogOpen(true);
  };

  const filtered = rentals?.data?.filter(r => 
    r.name.toLowerCase().includes(search.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Manajemen Rental</h2>
          <p className="text-muted-foreground">Kelola armada kendaraan yang tersedia</p>
        </div>
        <Button className="shrink-0 flex items-center gap-2" onClick={handleCreate}>
          <Plus className="w-4 h-4" /> Tambah Kendaraan
        </Button>
      </div>

      <div className="p-4 bg-card border rounded-xl shadow-sm">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Cari kendaraan..." 
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
              <TableHead className="w-[80px]">Foto</TableHead>
              <TableHead>Kendaraan</TableHead>
              <TableHead>Kapasitas</TableHead>
              <TableHead>Harga / Hari</TableHead>
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
                   Belum ada kendaraan terdaftar.
                 </TableCell>
              </TableRow>
            ) : filtered.map((item) => (
              <TableRow key={item.id} className="hover:bg-muted/10 transition-colors">
                <TableCell>
                  <img 
                    src={item.image || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2'} 
                    alt="" 
                    className="w-12 h-12 object-cover rounded-lg shadow-sm"
                  />
                </TableCell>
                <TableCell>
                  <div className="font-semibold text-sm flex items-center gap-2">
                    <Car className="w-4 h-4 text-primary" /> {item.name}
                  </div>
                  <div className="text-xs text-muted-foreground capitalize flex items-center gap-1">
                    <Fuel className="w-3 h-3" /> {item.transmission || 'Manual'}
                  </div>
                </TableCell>
                <TableCell className="text-sm">
                   <span className="flex items-center gap-1 font-medium"><Users className="w-4 h-4" /> {item.seats || 7} Kursi</span>
                </TableCell>
                <TableCell className="font-bold text-primary">{formatPrice(item.price_per_day)}</TableCell>
                <TableCell>
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none shadow-none font-medium">
                    Tersedia
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-1">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => {
                        if(confirm('Hapus armada ini?')) {
                            deleteMutation.mutate(item.id);
                        }
                    }} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Armada' : 'Tambah Armada Baru'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nama / Merk Mobil</Label>
              <Input 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder="Misal: Toyota Innova Reborn"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                 <Label>Harga Sewa / Hari</Label>
                 <Input 
                   type="number"
                   value={formData.price_per_day}
                   onChange={e => setFormData({...formData, price_per_day: e.target.value})}
                   placeholder="650000"
                 />
               </div>
               <div className="space-y-2">
                 <Label>Kapasitas (Kursi)</Label>
                 <Input 
                   type="number"
                   value={formData.seats}
                   onChange={e => setFormData({...formData, seats: e.target.value})}
                   placeholder="7"
                 />
               </div>
            </div>
            <div className="space-y-2">
              <Label>Transmisi</Label>
              <Input 
                value={formData.transmission}
                onChange={e => setFormData({...formData, transmission: e.target.value})}
                placeholder="Automatic / Manual"
              />
            </div>
          </div>
          <Button 
            className="w-full" 
            disabled={saveMutation.isPending}
            onClick={() => saveMutation.mutate(formData)}
          >
            {saveMutation.isPending ? 'Menyimpan...' : 'Simpan Kendaraan'}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
