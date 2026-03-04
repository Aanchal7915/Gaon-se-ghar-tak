
import React, { useState, useEffect } from 'react';
import apiClient from '../services/apiClient';
import { FaMapMarkerAlt, FaBoxes, FaSearch, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const FranchiseStockManagement = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedLocations, setExpandedLocations] = useState({});

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await apiClient.get('/products');
            setProducts(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch products:', error);
            setLoading(false);
        }
    };

    // Organize products by location
    const getLocationsData = () => {
        const locations = {};

        products.forEach(product => {
            if (product.pincodePricing && product.pincodePricing.length > 0) {
                product.pincodePricing.forEach(pricing => {
                    const locKey = pricing.location || pricing.pincode || 'Unknown Location';
                    if (!locations[locKey]) {
                        locations[locKey] = {
                            name: locKey,
                            pincodes: new Set(),
                            products: []
                        };
                    }
                    locations[locKey].pincodes.add(pricing.pincode);
                    locations[locKey].products.push({
                        ...product,
                        localPrice: pricing.price,
                        localOriginalPrice: pricing.originalPrice,
                        localStock: pricing.inventory,
                        pincode: pricing.pincode,
                        localSize: pricing.size
                    });
                });
            } else {
                // If no pincode pricing, maybe it's general stock?
                const locKey = 'General Inventory';
                if (!locations[locKey]) {
                    locations[locKey] = {
                        name: locKey,
                        pincodes: new Set(['Global']),
                        products: []
                    };
                }
                locations[locKey].products.push({
                    ...product,
                    localPrice: product.variants?.[0]?.price || 'N/A',
                    localOriginalPrice: product.variants?.[0]?.originalPrice || null,
                    localStock: product.variants?.reduce((acc, v) => acc + (v.countInStock || 0), 0) || 0,
                    pincode: 'Global',
                    localSize: product.variants?.[0]?.size || 'N/A'
                });
            }
        });

        return Object.values(locations).sort((a, b) => a.name.localeCompare(b.name));
    };

    const toggleLocation = (locName) => {
        setExpandedLocations(prev => ({
            ...prev,
            [locName]: !prev[locName]
        }));
    };

    if (loading) return <div className="p-8 text-center bg-white rounded-lg shadow">Loading inventory data...</div>;

    const locationsData = getLocationsData();
    const filteredLocations = locationsData.filter(loc =>
        loc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loc.products.some(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="p-4 md:p-8 bg-gray-50/50 min-h-screen animate-fade-in">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
                    <div>
                        <h1 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                            <span className="p-2 bg-red-100 rounded-xl text-red-500"><FaMapMarkerAlt size={18} /></span>
                            Franchise Inventory
                        </h1>
                        <p className="text-[10px] md:text-xs font-bold text-gray-400 mt-2 uppercase tracking-widest">Monitor product availability across delivery points</p>
                    </div>
                    <div className="relative flex-grow md:max-w-md">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 text-xs" />
                        <input
                            type="text"
                            placeholder="Search location or product..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-100 rounded-[1.25rem] text-xs font-bold focus:ring-4 focus:ring-red-500/5 outline-none transition-all shadow-sm placeholder:text-gray-300"
                        />
                    </div>
                </div>

                <div className="grid gap-6">
                    {filteredLocations.length > 0 ? filteredLocations.map((loc) => (
                        <div key={loc.name} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div
                                onClick={() => toggleLocation(loc.name)}
                                className="p-4 md:p-5 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                                        <FaMapMarkerAlt />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-800 font-sans tracking-tight">{loc.name}</h2>
                                        <p className="text-[11px] text-gray-400 font-normal font-sans tracking-wider uppercase">
                                            PINCODES: {Array.from(loc.pincodes).join(', ')}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="hidden sm:block text-right">
                                        <div className="text-xs text-gray-400 uppercase font-bold tracking-wider">Total Products</div>
                                        <div className="text-lg font-bold text-gray-700">{loc.products.length}</div>
                                    </div>
                                    <div className="w-px h-8 bg-gray-200 hidden sm:block"></div>
                                    <div className="bg-gray-100 p-2 rounded-full text-gray-500">
                                        {expandedLocations[loc.name] ? <FaChevronUp /> : <FaChevronDown />}
                                    </div>
                                </div>
                            </div>

                            {expandedLocations[loc.name] && (
                                <div className="border-t border-gray-100 bg-white">
                                    {/* Desktop View Table */}
                                    <div className="hidden md:block overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead className="bg-gray-50/50 text-gray-400 text-[9px] uppercase font-black tracking-widest">
                                                <tr>
                                                    <th className="px-6 py-4">Product</th>
                                                    <th className="px-6 py-4">Pincode</th>
                                                    <th className="px-6 py-4">Size</th>
                                                    <th className="px-6 py-4 text-center">Stock Status</th>
                                                    <th className="px-6 py-4 text-right">Price</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50">
                                                {loc.products.map((prod, idx) => (
                                                    <tr key={`${loc.name}-${prod._id}-${idx}`} className="hover:bg-gray-50/30 transition-colors">
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <img
                                                                    src={prod.images?.[0]}
                                                                    alt={prod.name}
                                                                    className="w-10 h-10 object-cover rounded-lg border border-gray-100"
                                                                />
                                                                <div>
                                                                    <div className="text-[10px] font-black text-gray-900 leading-tight uppercase">{prod.name}</div>
                                                                    <div className="text-[8px] text-gray-400 uppercase font-black tracking-tighter mt-0.5">{prod.brand} | {prod.category?.name}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className="text-[9px] font-black font-sans bg-gray-50 text-gray-500 px-2 py-1 rounded-lg border border-gray-100 uppercase tracking-widest">
                                                                {prod.pincode}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className="text-[10px] font-black text-gray-600 font-sans">{prod.localSize}</span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex flex-col items-center">
                                                                <div className={`text-[10px] font-black uppercase tracking-widest ${prod.localStock > 10 ? 'text-green-500' : prod.localStock > 0 ? 'text-orange-500' : 'text-red-500'}`}>
                                                                    {prod.localStock <= 0 ? 'Out of Stock' : `${prod.localStock} LEFT`}
                                                                </div>
                                                                <div className="w-16 h-1 bg-gray-100 rounded-full mt-1.5 overflow-hidden">
                                                                    <div className={`h-full rounded-full ${prod.localStock > 10 ? 'bg-green-500 w-full' : prod.localStock > 0 ? 'bg-orange-500 w-1/2' : 'bg-red-500 w-0'}`}></div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <div className="flex flex-col items-end">
                                                                <div className="text-[10px] font-black text-gray-900">₹{prod.localPrice}</div>
                                                                {prod.localOriginalPrice && (
                                                                    <div className="text-[8px] text-gray-300 line-through font-bold">₹{prod.localOriginalPrice}</div>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Mobile View Cards */}
                                    <div className="md:hidden divide-y divide-gray-50">
                                        {loc.products.map((prod, idx) => (
                                            <div key={`${loc.name}-${prod._id}-${idx}`} className="p-4 space-y-4">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={prod.images?.[0]}
                                                        alt=""
                                                        className="w-12 h-12 object-cover rounded-xl border border-gray-100"
                                                    />
                                                    <div className="min-w-0">
                                                        <p className="text-[10px] font-black text-gray-900 leading-tight uppercase truncate">{prod.name}</p>
                                                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-0.5">{prod.brand} | {prod.localSize}</p>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="bg-gray-50 p-2 rounded-xl border border-gray-100">
                                                        <p className="text-[7px] font-black text-gray-300 uppercase tracking-widest mb-1">Stock</p>
                                                        <p className={`text-[9px] font-black uppercase tracking-tight ${prod.localStock > 10 ? 'text-green-600' : prod.localStock > 0 ? 'text-orange-600' : 'text-red-600'}`}>
                                                            {prod.localStock <= 0 ? 'Out of Stock' : `${prod.localStock} Units`}
                                                        </p>
                                                    </div>
                                                    <div className="bg-gray-50 p-2 rounded-xl border border-gray-100 text-right">
                                                        <p className="text-[7px] font-black text-gray-300 uppercase tracking-widest mb-1">Price</p>
                                                        <p className="text-[9px] font-black text-gray-900">₹{prod.localPrice}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {loc.products.length === 0 && (
                                        <div className="py-12 text-center text-gray-300 italic text-[10px] font-black uppercase tracking-widest border-t border-gray-50">
                                            No products assigned to this location
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )) : (
                        <div className="bg-white p-20 text-center rounded-[2.5rem] border-2 border-dashed border-gray-100">
                            <div className="inline-block p-6 bg-gray-50 rounded-full text-gray-200 mb-4 animate-pulse">
                                <FaBoxes size={40} />
                            </div>
                            <h3 className="text-xl font-black text-gray-600 tracking-tight">Search Result Empty</h3>
                            <p className="text-xs font-bold text-gray-300 uppercase tracking-widest mt-2">Try searching different location or product keyword</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FranchiseStockManagement;
