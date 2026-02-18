
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import apiClient from '../services/apiClient';

const CategorySection = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await apiClient.get('/categories');
                setCategories(response.data);
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    if (loading) return null;
    if (categories.length === 0) return null;

    return (
        <section className="py-4 md:py-8 bg-white">
            <div className="container mx-auto px-4 md:px-8">
                <div className="flex flex-col mb-3 md:mb-6">
                    <h2 className="text-xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
                        Shop By Category
                    </h2>
                    <div className="h-1.5 w-20 bg-green-600 rounded-full"></div>
                </div>

                <div className="grid grid-cols-4 md:grid-cols-8 gap-2 md:gap-4">
                    {categories.map((category) => (
                        <Link
                            key={category._id}
                            to={`/categories/${category._id}`}
                            className="group relative h-24 md:h-48 overflow-hidden rounded-xl bg-gray-100 shadow-sm hover:shadow-lg transition-all duration-500"
                        >
                            <img
                                src={category.image}
                                alt={category.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                            <div className="absolute bottom-2 left-2 right-2 text-center md:text-left">
                                <h3 className="text-white text-[10px] md:text-xs font-bold leading-tight">
                                    {category.name}
                                </h3>
                                <p className="text-gray-300 text-[8px] md:text-[10px] mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:block">
                                    Browse
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CategorySection;
