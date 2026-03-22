import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  Plus, Edit, Trash2, Search, Map
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

export default function RegionsAdmin() {
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();

  const { data: regions, isLoading } = useQuery({
    queryKey: ['admin-regions'],
    queryFn: () => base44.entities.Region.list({ limit: 50 })
  });

  const filtered = regions?.data?.filter(r => 
    r.name.toLowerCase().includes(search.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Manajemen Wilayah</h2>
          <p className="text-muted-foreground">Kelola destinasi wisata per wilayah/daerah</p>
        </div>
        <Button className="shrink-0 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Tambah Wilayah Baru
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between p-4 bg-card border rounded-xl shadow-sm">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Cari wilayah..." 
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
              <TableHead>Nama Wilayah</TableHead>
              <TableHead>Deskripsi Singkat</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [1, 2, 3].map(i => (
                <TableRow key={i}>
                  <TableCell colSpan={5} className="h-12 animate-pulse bg-muted/10" />
                </TableRow>
              ))
             ) : filtered.length === 0 ? (
              <TableRow>
                 <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                   Belum ada wilayah terdaftar.
                 </TableCell>
              </TableRow>
            ) : filtered.map((region) => (
              <TableRow key={region.id} className="hover:bg-muted/10 transition-colors">
                <TableCell>
                  <img 
                    src={region.cover_image || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5997'} 
                    alt="" 
                    className="w-12 h-12 object-cover rounded-lg shadow-sm"
                  />
                </TableCell>
                <TableCell>
                  <div className="font-semibold text-sm flex items-center gap-2">
                    <Map className="w-4 h-4 text-primary" /> {region.name}
                  </div>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground line-clamp-1 truncate max-w-[300px]">
                  {region.description || 'Tidak ada deskripsi.'}
                </TableCell>
                <TableCell>
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none shadow-none font-medium">
                    Aktif
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-1">
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                    <Trash2 className="h-4 w-4" />
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
