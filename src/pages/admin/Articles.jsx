import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  Plus, Edit, Trash2, Search, FileText, User, Calendar, Eye
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function ArticlesAdmin() {
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title: '', excerpt: '', category: 'UMUM', author: 'Admin' });

  const queryClient = useQueryClient();

  const { data: articles, isLoading } = useQuery({
    queryKey: ['admin-articles'],
    queryFn: () => base44.entities.Article.list({ limit: 50 })
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Article.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-articles'] });
      toast({ title: "Terhapus", description: "Artikel dihapus dari sistem." });
    }
  });

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      const payload = { ...data, status: 'published' };
      if (editingId) {
        return base44.entities.Article.update(editingId, payload);
      }
      return base44.entities.Article.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-articles'] });
      setIsDialogOpen(false);
      toast({ title: "Berhasil", description: editingId ? "Artikel diperbarui." : "Artikel baru dipublikasikan." });
    }
  });

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({ title: item.title, excerpt: item.excerpt || '', category: item.category || 'UMUM', author: item.author || 'Admin' });
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingId(null);
    setFormData({ title: '', excerpt: '', category: 'UMUM', author: 'Admin' });
    setIsDialogOpen(true);
  };

  const filtered = articles?.data?.filter(a => 
    a.title.toLowerCase().includes(search.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Manajemen Artikel</h2>
          <p className="text-muted-foreground">Kelola konten blog dan berita perjalanan Anda</p>
        </div>
        <Button className="shrink-0 flex items-center gap-2" onClick={handleCreate}>
          <Plus className="w-4 h-4" /> Tulis Artikel Baru
        </Button>
      </div>

      <div className="p-4 bg-card border rounded-xl shadow-sm">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Cari judul artikel..." 
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
              <TableHead>Judul Artikel</TableHead>
              <TableHead>Penulis</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Tanggal</TableHead>
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
                   Tidak ada artikel ditemukan.
                 </TableCell>
              </TableRow>
            ) : filtered.map((article) => (
              <TableRow key={article.id} className="hover:bg-muted/10 transition-colors">
                <TableCell>
                  <img 
                    src={article.cover_image || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5997'} 
                    alt="" 
                    className="w-12 h-12 object-cover rounded-lg shadow-sm"
                  />
                </TableCell>
                <TableCell>
                  <div className="font-semibold text-sm flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" /> {article.title}
                  </div>
                  <div className="text-xs text-muted-foreground line-clamp-1 truncate max-w-[200px]">{article.excerpt || 'No excerpt available.'}</div>
                </TableCell>
                <TableCell>
                   <div className="text-xs font-medium flex items-center gap-1 font-bold"><User className="w-3 h-3 text-muted-foreground" /> {article.author || 'Admin'}</div>
                </TableCell>
                <TableCell>
                   <Badge variant="outline" className="font-normal capitalize">{article.category || 'UMUM'}</Badge>
                </TableCell>
                <TableCell className="text-sm">
                  <span className="flex items-center gap-1 text-xs text-muted-foreground"><Calendar className="w-3 h-3" /> {new Date(article.published_at || article.created_at || Date.now()).toLocaleDateString('id-ID')}</span>
                </TableCell>
                <TableCell>
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none shadow-none font-medium capitalize">
                    {article.status || 'Published'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-1">
                  <Button variant="ghost" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(article)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => {
                      if(confirm('Hapus artikel ini selamanya?')) deleteMutation.mutate(article.id);
                  }}>
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
            <DialogTitle>{editingId ? 'Edit Artikel' : 'Tulis Artikel Baru'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Judul Artikel</Label>
              <Input 
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                placeholder="Misal: Pantai Indah..."
              />
            </div>
            <div className="space-y-2">
              <Label>Kategori</Label>
              <Input 
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
                placeholder="Destinasi / Tips"
              />
            </div>
            <div className="space-y-2">
              <Label>Cuplikan Singkat (Excerpt)</Label>
              <Input 
                value={formData.excerpt}
                onChange={e => setFormData({...formData, excerpt: e.target.value})}
                placeholder="Ringkasan..."
              />
            </div>
            <div className="space-y-2">
              <Label>Penulis</Label>
              <Input 
                value={formData.author}
                onChange={e => setFormData({...formData, author: e.target.value})}
              />
            </div>
          </div>
          <Button 
            className="w-full" 
            disabled={saveMutation.isPending}
            onClick={() => saveMutation.mutate(formData)}
          >
            {saveMutation.isPending ? 'Menyimpan...' : 'Publikasikan'}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
