import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  Plus, Edit, Trash2, Search, Filter, 
  MoreHorizontal, ChevronRight, Package 
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import { formatPrice } from '@/components/shared/PriceFormatter';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function PackagesAdmin() {
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', price: '', excerpt: '', status: 'published' });
  
  const queryClient = useQueryClient();

  const { data: packages, isLoading } = useQuery({
    queryKey: ['admin-packages'],
    queryFn: () => base44.entities.Package.list({
      limit: 50,
      populate: ['region']
    })
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Package.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-packages'] });
      toast({ title: "Terhapus", description: "Paket berhasil dihapus secara permanen." });
    },
    onError: () => {
      toast({ variant: "destructive", title: "Gagal Menghapus", description: "Pastikan Anda memiliki izin." });
    }
  });

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      // Mocking region linkage for local test
      const payload = { ...data, price: Number(data.price), region: { name: 'Sumatera Utara' } };
      if (editingId) {
        return base44.entities.Package.update(editingId, payload);
      }
      return base44.entities.Package.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-packages'] });
      setIsDialogOpen(false);
      setFormData({ name: '', price: '', excerpt: '', status: 'published' });
      toast({ title: "Berhasil", description: editingId ? "Data diperbarui." : "Data paket ditambahkan." });
    }
  });

  const handleEdit = (pkg) => {
    setEditingId(pkg.id);
    setFormData({ name: pkg.name, price: pkg.price || '', excerpt: pkg.excerpt || '', status: pkg.status || 'published' });
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingId(null);
    setFormData({ name: '', price: '', excerpt: '', status: 'published' });
    setIsDialogOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm('Apakah Anda yakin ingin menghapus paket ini?')) {
      deleteMutation.mutate(id);
    }
  };

  const filtered = packages?.data?.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Manajemen Paket Wisata</h2>
          <p className="text-muted-foreground">Kelola penawaran paket petualangan Anda</p>
        </div>
        <Button className="shrink-0 flex items-center gap-2" onClick={handleCreate}>
          <Plus className="w-4 h-4" /> Tambah Paket Baru
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between p-4 bg-card border rounded-xl shadow-sm">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Cari paket..." 
            className="pl-9 bg-muted/20"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto">
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="w-4 h-4" /> Filter Status
          </Button>
        </div>
      </div>

      <div className="border rounded-xl bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[80px]">Foto</TableHead>
              <TableHead>Nama Paket</TableHead>
              <TableHead>Wilayah</TableHead>
              <TableHead>Durasi</TableHead>
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
                   Tidak ada data ditemukan.
                 </TableCell>
              </TableRow>
            ) : filtered.map((pkg) => (
              <TableRow key={pkg.id} className="hover:bg-muted/10 transition-colors">
                <TableCell>
                  <img 
                    src={pkg.images?.[0] || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5997'} 
                    alt="" 
                    className="w-12 h-12 object-cover rounded-lg shadow-sm"
                  />
                </TableCell>
                <TableCell>
                  <div className="font-semibold text-sm">{pkg.name}</div>
                  <div className="text-xs text-muted-foreground line-clamp-1">{pkg.excerpt}</div>
                </TableCell>
                <TableCell>
                   <Badge variant="outline" className="font-normal capitalize flex items-center gap-1 w-fit">
                     <ChevronRight className="w-3 h-3" /> {pkg.region?.name || 'Unset'}
                   </Badge>
                </TableCell>
                <TableCell className="text-sm font-medium">3 Hari / 2 Malam</TableCell>
                <TableCell className="font-bold text-primary">{formatPrice(pkg.price)}</TableCell>
                <TableCell>
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none shadow-none font-medium">
                    Published
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem 
                        className="flex items-center gap-2"
                        onClick={() => handleEdit(pkg)}
                      >
                        <Edit className="w-4 h-4" /> Edit Detail
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="flex items-center gap-2 text-destructive focus:text-destructive"
                        onClick={() => handleDelete(pkg.id)}
                      >
                        <Trash2 className="w-4 h-4" /> Hapus Paket
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between pt-4 pb-12">
        <p className="text-sm text-muted-foreground">
          Menampilkan <strong>{filtered.length}</strong> dari <strong>{packages?.data?.length || 0}</strong> paket
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>Sebelumnya</Button>
          <Button variant="outline" size="sm" disabled>Berikutnya</Button>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Paket Wisata' : 'Tambah Paket Baru'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nama Paket</Label>
              <Input 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder="Misal: Trip Danau Toba"
              />
            </div>
            <div className="space-y-2">
              <Label>Harga (Rp)</Label>
              <Input 
                type="number"
                value={formData.price}
                onChange={e => setFormData({...formData, price: e.target.value})}
                placeholder="Misal: 1500000"
              />
            </div>
            <div className="space-y-2">
              <Label>Deskripsi Singkat</Label>
              <Input 
                value={formData.excerpt}
                onChange={e => setFormData({...formData, excerpt: e.target.value})}
                placeholder="Rangkuman paket..."
              />
            </div>
          </div>
          <Button 
            className="w-full" 
            disabled={saveMutation.isPending}
            onClick={() => saveMutation.mutate(formData)}
          >
            {saveMutation.isPending ? 'Menyimpan...' : 'Simpan Paket'}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
