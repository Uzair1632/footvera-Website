import React, { useEffect } from 'react';
import { HeroSlider } from '../components/HeroSlider';
import { DropShowcase } from '../components/DropShowcase';
import { CategoryBento } from '../components/CategoryBento';
import { FlashDeals } from '../components/FlashDeals';
import { ProductTabs } from '../components/ProductTabs';
import { FeaturedBanners } from '../components/FeaturedBanners';
import { TestimonialsSection } from '../components/TestimonialsSection';
import { ShoeGramSection } from '../components/ShoeGramSection';

export const HomePage: React.FC = () => {
  useEffect(() => {
    document.title = 'Footvera | Stylish & Comfortable Shoes for Every Step';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Shop Footvera for stylish, comfortable, and quality footwear designed for every step. Discover shoes that combine modern style, comfort, and everyday wear.'
      );
    }
  }, []);

  return (
    <div id="home-page" className="w-full">
      {/* 1. Dynamic Hero Carousel Slider with 3D Tilt Preview */}
      <HeroSlider />

      {/* 2. Exclusive Marquee Release Drop with 3D Mouse Tilt */}
      <DropShowcase />

      {/* 3. Visual Category Bento Grid */}
      <CategoryBento />

      {/* 4. Flash Deals with Live Countdown */}
      <FlashDeals />

      {/* 5. Tabbed Product Showcase with Quick-Size Selector */}
      <ProductTabs />

      {/* 6. Split Editorial Banners */}
      <FeaturedBanners />

      {/* 7. Customer Testimonials */}
      <TestimonialsSection />

      {/* 8. Instagram Community Shoe-Gram */}
      <ShoeGramSection />
    </div>
  );
};
