import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';

const SearchResultsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();
    const query = new URLSearchParams(location.search).get('q');

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!query) {
                setLoading(false);
                setProducts([]);
                return;
            }
            try {
                setLoading(true);
                const response = await fetch(`/products/search?keyword=${query}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch search results.');
                }
                const data = await response.json();
                setProducts(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSearchResults();
    }, [query]);

    if (loading) return <LoadingSpinner />;
    if (error) return <div className="text-center py-12 text-red-500">Error: {error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">
                Search Results for "{query}"
            </h1>
            {products.length === 0 ? (
                <p className="text-center text-lg text-gray-600">No products found for your search.</p>
            ) : (
                <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                    {products.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchResultsPage;