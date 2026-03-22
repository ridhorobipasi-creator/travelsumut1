import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { MapPin, Plus, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const otherRegions = [
  { name: 'Aceh', icon: '🌿', desc: 'Kopi Gayo, Pantai Lampuuk, Danau Laut Tawar' },
  { name: 'Sumatera Barat', icon: '🏔️', desc: 'Jam Gadang, Danau Singkarak, Ngarai Sianok' },
  { name: 'Riau & Kepulauan', icon: '🏝️', desc: 'Pulau Bintan, Batam, Pelalawan' },
  { name: 'Sumatera Selatan', icon: '🦁', desc: 'Palembang, Danau Ranau, Gunung Dempo' },
];

export default function ExpandRegionBanner() {
  return (
    <section className="py-16 bg-primary/5 border-y border-primary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="max-w-md"
          >
            <span className="inline-flex items-center gap-2 text-sm font-medium text-primary mb-2">
              <Plus className="w-4 h-4" /> Mau ekspansi ke wilayah lain?
            </span>
            <h2 className="text-2xl font-bold mb-3">Tambahkan Destinasi Baru ke Platform</h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              Platform ini saat ini fokus di <strong>Sumatera Utara</strong>. Anda bisa dengan mudah 
              menambahkan provinsi, kota, dan destinasi baru lainnya melalui Admin Dashboard — 
              cukup dalam beberapa klik.
            </p>
            <p className="text-xs text-muted-foreground">Hubungi tim kami untuk menambahkan wilayah baru ke platform.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-3 w-full lg:w-auto lg:min-w-[420px]"
          >
            {otherRegions.map((region) => (
              <div
                key={region.name}
                className="flex items-start gap-3 bg-white rounded-xl p-4 border border-border shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-default"
              >
                <span className="text-2xl">{region.icon}</span>
                <div>
                  <div className="font-semibold text-sm">{region.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5 leading-snug">{region.desc}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
