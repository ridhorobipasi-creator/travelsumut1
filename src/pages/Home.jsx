import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import FeaturedDestinations from '@/components/home/FeaturedDestinations';
import FeaturedPackages from '@/components/home/FeaturedPackages';
import CTASection from '@/components/home/CTASection';
import ExpandRegionBanner from '@/components/home/ExpandRegionBanner';

export default function Home() {
  return (
    <div className="flex flex-col gap-20 pb-20">
      <HeroSection />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-24">
        <FeaturedDestinations />
        <FeaturedPackages />
        <ExpandRegionBanner />
      </div>

      <CTASection />
    </div>
  );
}
