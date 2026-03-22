import React from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

const placeholderImages = [
  'https://media.base44.com/images/public/69bf30b9d53fc5e28bedc065/59e5b557e_generated_51d803f5.png',
  'https://media.base44.com/images/public/69bf30b9d53fc5e28bedc065/7abb6072b_generated_8f156e1c.png',
  'https://media.base44.com/images/public/69bf30b9d53fc5e28bedc065/ac29dba32_generated_91596f3e.png',
  'https://media.base44.com/images/public/69bf30b9d53fc5e28bedc065/552c73b5b_generated_77d2c723.png',
];

export default function FeaturedDestinations() {
  const { data: destinations = [] } = useQuery({
    queryKey: ['featured-destinations'],
    queryFn: () => base44.entities.Region.filter({ type: 'destination', featured: true }, '-created_date', 4),
  });

  const displayItems = destinations.length > 0 ? destinations : [];

  return (
    <section className="py-20 bg-secondary/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-sm font-medium text-primary uppercase tracking-wider">Destinasi Unggulan</span>
          <h2 className="text-3xl font-bold mt-2">Destinasi Terbaik Sumatera Utara</h2>
          <p className="text-muted-foreground mt-3 max-w-md mx-auto">
            Dari Danau Toba hingga hutan Leuser — jelajahi keajaiban alam dan budaya Sumatera Utara
          </p>
        </div>

        {displayItems.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {displayItems.map((dest, i) => (
              <motion.div
                key={dest.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Link to={`/packages?destination=${dest.id}`} className="group block">
                  <div className={`relative rounded-2xl overflow-hidden ${i === 0 ? 'row-span-2 h-80' : 'h-52'}`}>
                    <img
                      src={dest.image_url || placeholderImages[i % 4]}
                      alt={dest.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white font-semibold text-lg">{dest.name}</h3>
                      <div className="flex items-center gap-1 text-white/70 text-sm mt-1">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{dest.description || 'Indonesia'}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p>Belum ada destinasi unggulan. Tambahkan melalui Admin Dashboard.</p>
          </div>
        )}
      </div>
    </section>
  );
}
