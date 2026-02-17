
import React from 'react';
import { useProductContent } from '../context/ProductContentContext';

const ProductDetailsForm: React.FC = () => {
    const { productContent, updateProductContent } = useProductContent();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        updateProductContent({
            productDetails: {
                ...productContent.productDetails,
                [name]: value
            }
        });
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-gray-500 tracking-widest ml-1">Product Name</label>
                    <input
                        type="text"
                        name="name"
                        value={productContent.productDetails.name}
                        onChange={handleInputChange}
                        placeholder="e.g. Silk Scarf"
                        className="w-full p-3 bg-white/5 rounded-xl border border-white/10 text-white text-sm outline-none focus:border-[#7c4dff] transition-all"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-gray-500 tracking-widest ml-1">Category</label>
                    <select
                        name="category"
                        value={productContent.productDetails.category}
                        onChange={handleInputChange}
                        className="w-full p-3 bg-white/5 rounded-xl border border-white/10 text-white text-sm outline-none focus:border-[#7c4dff] transition-all appearance-none"
                    >
                        <option value="" disabled className="bg-[#050508]">Select Category</option>
                        <option value="Fashion" className="bg-[#050508]">Fashion</option>
                        <option value="Home Decor" className="bg-[#050508]">Home Decor</option>
                        <option value="Electronics" className="bg-[#050508]">Electronics</option>
                        <option value="Handmade" className="bg-[#050508]">Handmade</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-gray-500 tracking-widest ml-1">Price (₹)</label>
                    <input
                        type="number"
                        name="price"
                        value={productContent.productDetails.price}
                        onChange={handleInputChange}
                        placeholder="0.00"
                        className="w-full p-3 bg-white/5 rounded-xl border border-white/10 text-white text-sm outline-none focus:border-[#00e5ff] transition-all"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-gray-500 tracking-widest ml-1">Quantity</label>
                    <input
                        type="number"
                        name="quantity"
                        value={productContent.productDetails.quantity}
                        onChange={handleInputChange}
                        placeholder="1"
                        className="w-full p-3 bg-white/5 rounded-xl border border-white/10 text-white text-sm outline-none focus:border-[#00e5ff] transition-all"
                    />
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsForm;
