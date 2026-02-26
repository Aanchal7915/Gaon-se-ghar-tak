import React, { useState, useEffect } from 'react';
import apiClient from '../services/apiClient';
import ProductCard from './ProductCard';

const UpcomingSection = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUpcoming = async () => {
            try {
                const response = await apiClient.get('/products/upcoming');
                setProducts(response.data);
            } catch (error) {
                console.error('Failed to fetch upcoming products:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchUpcoming();
    }, []);

    if (loading || products.length === 0) return null;

    return (
        <section className="pt-2 pb-8 bg-yellow-50 border-t border-yellow-100 mt-4">
            <div className="container mx-auto px-4">
                <div className="flex flex-col mb-4">
                    <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
                        Coming Soon
                    </h2>
                    <div className="h-1.5 w-20 bg-yellow-400 rounded-full"></div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-4">
                    {products.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default UpcomingSection;
