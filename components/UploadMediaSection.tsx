
import React from 'react';
import { useProductContent } from '../context/ProductContentContext';

const UploadMediaSection: React.FC = () => {
    const { productContent, updateProductContent } = useProductContent();

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []) as File[];
        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                updateProductContent({ media: [...productContent.media, reader.result as string].slice(-5) });
            };
            reader.readAsDataURL(file);
        });
    };

    const removeMedia = (index: number) => {
        updateProductContent({ media: productContent.media.filter((_, i) => i !== index) });
    };

    return (
        <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-300">Upload Media (Images/Video)</label>
            <div className="flex flex-wrap gap-2">
                {productContent.media.map((item, i) => (
                    <div key={i} className="group relative w-24 h-24 rounded-xl overflow-hidden border border-white/20 glass-card">
                        {item.startsWith('data:video') ? (
                            <video src={item} className="w-full h-full object-cover" />
                        ) : (
                            <img src={item} className="w-full h-full object-cover" />
                        )}
                        <button
                            onClick={() => removeMedia(i)}
                            className="absolute top-1 right-1 bg-black/50 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-500 transition-colors"
                        >
                            &times;
                        </button>
                    </div>
                ))}
                {productContent.media.length < 5 && (
                    <label className="w-24 h-24 border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#00e5ff]/50 transition-all hover:bg-white/5 group">
                        <input type="file" hidden multiple accept="image/*,video/*" onChange={handleFileUpload} />
                        <span className="text-2xl text-gray-400 group-hover:text-[#00e5ff] transition-colors">+</span>
                        <span className="text-[10px] text-gray-500 uppercase font-bold mt-1">Add Media</span>
                    </label>
                )}
            </div>
        </div>
    );
};

export default UploadMediaSection;
