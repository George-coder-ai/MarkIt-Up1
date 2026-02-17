
import React from 'react';
import { useProductContent } from '../context/ProductContentContext';

const TranslatedDescription: React.FC = () => {
    const { productContent, updateProductContent } = useProductContent();

    return (
        <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-300">Translated Description (English Output)</label>
            <div className="relative glass-card rounded-2xl border border-white/10 overflow-hidden">
                <textarea
                    value={productContent.translatedText}
                    onChange={(e) => updateProductContent({ translatedText: e.target.value })}
                    placeholder="Translated English description will appear here..."
                    className="w-full p-4 bg-transparent h-32 text-sm outline-none text-white transition-all placeholder:text-gray-600 custom-scrollbar"
                />
                <div className="absolute top-2 right-2 flex gap-1">
                    <div className="px-2 py-0.5 bg-[#00e5ff]/10 border border-[#00e5ff]/20 rounded-md">
                        <span className="text-[8px] font-bold text-[#00e5ff] uppercase">AI Powered</span>
                    </div>
                </div>
            </div>
            <p className="text-[10px] text-gray-500 italic px-1">
                This field will automatically sync with your voice recording once processed.
            </p>
        </div>
    );
};

export default TranslatedDescription;
