
import React from 'react';
import HeroSection from '../components/HeroSection';
import CategorySection from '../components/CategorySection';
import VisitInStoreSection from '../components/VisitInStoreSection';
import TestimonialSlider from '../components/TestimonialSlider';

const HomePage = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <HeroSection />
            <CategorySection />
            <VisitInStoreSection />
            <TestimonialSlider />
        </div>
    );
};

export default HomePage;
