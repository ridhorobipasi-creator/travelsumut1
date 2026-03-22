import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, Package, ShoppingCart, DollarSign, 
  MapPin, Star 
} from 'lucide-react';
import {
  Bar, BarChart, ResponsiveContainer, XAxis, YAxis 
} from "recharts";

import { formatPrice } from '@/components/shared/PriceFormatter';

export default function AdminDashboard() {
  const { data: bookings, isLoading: loadingBookings } = useQuery({
    queryKey: ['admin-stats-bookings'],
    queryFn: () => base44.entities.Booking.list({ limit: 1000 }),
    refetchInterval: 5000 
  });

  const { data: reviews } = useQuery({
    queryKey: ['admin-stats-reviews'],
    queryFn: () => base44.entities.Review.list({ limit: 1000 }),
    refetchInterval: 10000
  });

  // Calculate Real Stats
  const totalRevenue = bookings?.data?.reduce((sum, b) => sum + (Number(b.total_price) || Number(b.price) || 0), 0) || 0;
  const activeOrders = bookings?.data?.length || 0;
  const totalReviews = reviews?.data?.length || 0;
  const avgRating = totalReviews > 0 
    ? (reviews.data.reduce((sum, r) => sum + (r.rating || 0), 0) / totalReviews).toFixed(1) 
    : "0.0";

  const dynamicStats = [
    { label: 'Total Pendapatan', value: formatPrice(totalRevenue), icon: DollarSign, color: 'text-green-600', trend: 'Real-time' },
    { label: 'Pesanan Aktif', value: activeOrders.toString(), icon: ShoppingCart, color: 'text-blue-600', trend: 'Live' },
    { label: 'Ulasan Masuk', value: totalReviews.toString(), icon: Star, color: 'text-amber-600', trend: 'Live' },
    { label: 'Rating Rata-rata', value: `${avgRating}/5`, icon: Users, color: 'text-purple-600', trend: 'Feedback' },
  ];

  const salesPerMonth = { Jan: 0, Feb: 0, Mar: 0, Apr: 0, Mei: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Okt: 0, Nov: 0, Des: 0 };
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Des"];
  
  if (bookings?.data) {
    bookings.data.forEach(b => {
      // Use trip_date or created_at
      const dateString = b.trip_date || b.created_at || new Date().toISOString();
      const monthIndex = new Date(dateString).getMonth();
      const monthName = monthNames[monthIndex];
      const price = Number(b.total_price) || Number(b.price) || 0;
      if (salesPerMonth[monthName] !== undefined) {
         salesPerMonth[monthName] += price;
      }
    });
  }

  const graphData = monthNames.slice(0, 6).map(m => ({ 
     name: m, 
     total: salesPerMonth[m] 
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Ringkasan Dashboard</h2>
          <p className="text-muted-foreground">Analisis performa bisnis Anda secara real-time</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {dynamicStats.map((stat) => (
          <Card key={stat.label} className="overflow-hidden border-none shadow-md bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{stat.label}</CardTitle>
              <div className={`p-2 rounded-xl bg-muted/30 ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black italic tracking-tighter text-primary">{stat.value}</div>
              <p className="text-[10px] font-bold mt-1 inline-flex items-center gap-1 uppercase tracking-widest text-green-600">
                <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                {stat.trend}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-black italic tracking-tight uppercase">Statistik Penjualan</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={graphData}>
                <XAxis
                  dataKey="name"
                  stroke="#888888"
                  fontSize={10}
                  fontWeight="bold"
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={10}
                  fontWeight="bold"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `Rp${(value/1000000).toFixed(0)}Jt`}
                />
                <Bar
                  dataKey="total"
                  fill="currentColor"
                  radius={[8, 8, 0, 0]}
                  className="fill-primary"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-3 border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-black italic tracking-tight uppercase">Aktivitas Terkini</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {loadingBookings ? (
                 <p className="text-center py-8 animate-pulse text-muted-foreground font-bold">Sinkronisasi data...</p>
              ) : bookings?.data?.length === 0 ? (
                <div className="text-center py-12 space-y-2">
                   <div className="w-12 h-12 rounded-full bg-muted mx-auto flex items-center justify-center">
                     <ShoppingCart className="w-6 h-6 text-muted-foreground opacity-30" />
                   </div>
                   <p className="text-sm font-bold text-muted-foreground italic">Belum ada aktivitas baru.</p>
                </div>
              ) : bookings?.data?.slice(0, 5).map((booking, i) => (
                <div key={booking.id} className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-[1rem] bg-muted/40 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <MapPin className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-bold leading-none tracking-tight">{booking.package?.name || 'Paket Wisata'}</p>
                    <p className="text-[10px] text-muted-foreground font-medium italic">Baru saja oleh {booking.user?.name || 'Pelanggan'}</p>
                  </div>
                  <div className="text-sm font-black text-green-600 italic">+{formatPrice(booking.total_price || booking.price)}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
