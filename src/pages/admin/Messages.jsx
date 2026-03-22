import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  Trash2, Search, Mail, Eye, Check, Clock, Globe, Phone
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function MessagesAdmin() {
  const [search, setSearch] = useState('');

  const { data: messages, isLoading } = useQuery({
    queryKey: ['admin-messages'],
    queryFn: () => base44.entities.ContactMessage.list({ limit: 50 })
  });

  const filtered = messages?.data?.filter(m => 
    m.subject.toLowerCase().includes(search.toLowerCase()) || 
    m.name.toLowerCase().includes(search.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Pesan Masuk</h2>
          <p className="text-muted-foreground">Kelola komunikasi dengan calon pelanggan</p>
        </div>
      </div>

      <div className="p-4 bg-card border rounded-xl shadow-sm">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Cari pesan atau nama pengirim..." 
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
              <TableHead>Pengirim</TableHead>
              <TableHead>Subjek & Pesan</TableHead>
              <TableHead>Channel</TableHead>
              <TableHead>Waktu</TableHead>
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
                   Kotak masuk pesan masih kosong.
                 </TableCell>
              </TableRow>
            ) : filtered.map((msg) => (
              <TableRow key={msg.id} className="hover:bg-muted/10 transition-colors">
                <TableCell>
                  <div className="flex flex-col">
                    <div className="text-sm font-bold flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-primary" /> {msg.name}</div>
                    <div className="text-xs text-muted-foreground font-mono">{msg.email}</div>
                  </div>
                </TableCell>
                <TableCell>
                   <div className="text-sm font-semibold">{msg.subject || 'No Subject'}</div>
                   <div className="text-xs text-muted-foreground italic truncate max-w-[250px]">{msg.message}</div>
                </TableCell>
                <TableCell>
                   <div className="flex items-center gap-2">
                     {msg.channel === 'whatsapp' ? <Phone className="w-3.5 h-3.5 text-green-500" /> : <Globe className="w-3.5 h-3.5 text-blue-500" />}
                     <span className="text-xs font-medium capitalize">{msg.channel || 'Website'}</span>
                   </div>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  <span className="flex items-center gap-1 font-medium"><Clock className="w-3.5 h-3.5" /> {new Date(msg.created_at).toLocaleTimeString('id-ID')}</span>
                </TableCell>
                <TableCell>
                  <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none shadow-none font-medium capitalize">
                    Unread
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-1">
                  <Button variant="ghost" size="icon">
                     <Check className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                     <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-destructive">
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
