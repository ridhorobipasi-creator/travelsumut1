import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Compass, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CTASection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden bg-primary p-10 sm:p-16 text-center"
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white translate-x-1/3 -translate-y-1/3" />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white -translate-x-1/3 translate-y-1/3" />
          </div>
          <div className="relative z-10">
            <Compass className="w-12 h-12 text-primary-foreground/80 mx-auto mb-6" />
            <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">
              Punya Rencana Perjalanan Sendiri?
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-8 max-w-lg mx-auto">
              Buat custom trip sesuai keinginan Anda. Tim kami siap membantu merencanakan perjalanan impian.
            </p>
            <Link to="/custom-trip">
              <Button size="lg" variant="secondary" className="rounded-xl shadow-lg">
                Buat Custom Trip <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
