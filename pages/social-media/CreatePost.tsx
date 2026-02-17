
import React, { useState } from 'react';
import { useProductContent } from '../../context/ProductContentContext';

const CreatePost: React.FC = () => {
    const { productContent, savedProducts } = useProductContent();
    const [caption, setCaption] = useState('');
    const [selectedProductIndex, setSelectedProductIndex] = useState<number | null>(null);

    // Use current product if it has data, otherwise allow choosing from saved
    const activeProduct = selectedProductIndex !== null ? savedProducts[selectedProductIndex] : productContent;
    const hasContent = activeProduct && (activeProduct.media.length > 0 || activeProduct.productDetails.name);

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-20">
            <div className="space-y-1">
                <h3 className="text-xl font-black text-white tracking-tight">Create Social Post</h3>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Convert your products into viral content</p>
            </div>

            {!hasContent ? (
                <div className="p-10 border-2 border-dashed border-white/10 rounded-[2.5rem] text-center space-y-4">
                    <p className="text-sm text-gray-500 italic">No product content found. Complete the "Publish Product" flow first.</p>
                    <button className="px-8 py-3 bg-[#7c4dff] text-white rounded-full font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all">Go to Publish</button>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Media Preview */}
                    <div className="relative aspect-square w-full rounded-[2rem] overflow-hidden border border-white/10 glass-card">
                        {activeProduct.media.length > 0 ? (
                            <img src={activeProduct.media[0]} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-600 italic">No Media preview</div>
                        )}
                        <div className="absolute bottom-4 left-4 right-4 p-4 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10">
                            <h4 className="font-bold text-white text-sm">{activeProduct.productDetails.name || 'Untitled Product'}</h4>
                            <p className="text-[10px] text-[#00e5ff] font-black uppercase tracking-widest">₹{activeProduct.productDetails.price || '0'}</p>
                        </div>
                    </div>

                    {/* Caption Input */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-bold uppercase text-gray-500 tracking-widest ml-1">Caption / AI Suggestion</label>
                        <textarea
                            value={caption || activeProduct.translatedText}
                            onChange={(e) => setCaption(e.target.value)}
                            placeholder="What do you want to say about this product?"
                            className="w-full p-4 bg-white/5 rounded-2xl border border-white/10 text-sm outline-none focus:border-[#7c4dff] text-white h-24"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button className="py-4 bg-white/5 border border-white/10 rounded-2xl font-black text-[10px] uppercase tracking-widest text-gray-400 hover:bg-white/10 transition-all">
                            Save Draft
                        </button>
                        <button className="py-4 bg-gradient-to-r from-[#7c4dff] to-[#00e5ff] rounded-2xl font-black text-[10px] uppercase tracking-widest text-white shadow-lg shadow-[#7c4dff]/20 hover:scale-[1.02] active:scale-95 transition-all">
                            Post Now
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreatePost;
