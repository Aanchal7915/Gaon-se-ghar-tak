
import React from 'react';
import HeroSection from '../components/HeroSection';
import FeaturedProductsSection from '../components/FeaturedProductsSection';
import BestsellerProductsSection from '../components/BestsellerProductsSection';
import NewReleaseProductsSection from '../components/NewReleaseProductsSection';
import VisitInStoreSection from '../components/VisitInStoreSection';
import TestimonialSlider from '../components/TestimonialSlider';

const HomePage = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <HeroSection />
            <FeaturedProductsSection />
            <BestsellerProductsSection />
            <NewReleaseProductsSection />
            <VisitInStoreSection />
            <TestimonialSlider />
        </div>
    );
};

export default HomePage;
