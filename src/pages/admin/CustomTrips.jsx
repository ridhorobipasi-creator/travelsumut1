import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  Eye, Check, X, Search, User, MapPin, Calendar, Clock
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function CustomTripsAdmin() {
  const [search, setSearch] = useState('');

  const { data: requests, isLoading } = useQuery({
    queryKey: ['admin-custom-trips'],
    queryFn: () => base44.entities.CustomTrip.list({ limit: 50 })
  });

  const filtered = requests?.data?.filter(r => 
    r.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
    r.destination?.toLowerCase().includes(search.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Permintaan Custom Trip</h2>
          <p className="text-muted-foreground">Kelola permintaan perjalanan khusus dari pelanggan</p>
        </div>
      </div>

      <div className="p-4 bg-card border rounded-xl shadow-sm">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Cari nama atau destinasi..." 
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
              <TableHead>Destinasi</TableHead>
              <TableHead>Durasi & Peserta</TableHead>
              <TableHead>Tanggal</TableHead>
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
                   Belum ada permintaan masuk.
                 </TableCell>
              </TableRow>
            ) : filtered.map((req) => (
              <TableRow key={req.id} className="hover:bg-muted/10 transition-colors">
                <TableCell>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <div className="text-sm font-medium">{req.customer_name || 'Anonymous'}</div>
                  </div>
                  <div className="text-xs text-muted-foreground font-mono">{req.phone || '-'}</div>
                </TableCell>
                <TableCell>
                   <div className="text-sm font-semibold flex items-center gap-1">
                     <MapPin className="w-3 h-3 text-primary" /> {req.destination || 'Unset'}
                   </div>
                   <div className="text-xs text-muted-foreground truncate max-w-[200px]">{req.requirements || 'No special requirements.'}</div>
                </TableCell>
                <TableCell className="text-xs">
                   <div className="flex items-center gap-1 font-medium italic"><Clock className="w-3 h-3" /> {req.duration_days || 0} Hari</div>
                   <div className="text-muted-foreground flex items-center gap-1 font-bold">{req.pax || 0} Orang</div>
                </TableCell>
                <TableCell className="text-sm">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-muted-foreground" /> {new Date(req.travel_date || Date.now()).toLocaleDateString('id-ID')}</span>
                </TableCell>
                <TableCell>
                  <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none shadow-none font-medium capitalize">
                    Pending Review
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-1">
                  <Button variant="ghost" size="icon" className="text-green-600">
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Eye className="h-4 w-4" />
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
