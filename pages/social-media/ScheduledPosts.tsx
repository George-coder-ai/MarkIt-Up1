
import React from 'react';

const ScheduledPosts: React.FC = () => {
    const posts = [
        { title: 'Winter Collection Teaser', time: 'Tomorrow, 09:00 AM', status: 'Scheduled' },
        { title: 'Handmade Mug Spotlight', time: 'Oct 30, 06:30 PM', status: 'Draft' },
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="space-y-1">
                <h3 className="text-xl font-black text-white tracking-tight">Scheduled Content</h3>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Manage your future social presence</p>
            </div>

            <div className="space-y-4">
                {posts.map((post, i) => (
                    <div key={i} className="p-5 bg-white/5 rounded-2xl border border-white/5 flex justify-between items-center group hover:border-[#00e5ff]/30 transition-all">
                        <div>
                            <h4 className="font-bold text-sm text-white">{post.title}</h4>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest">{post.time}</span>
                                <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-md ${post.status === 'Scheduled' ? 'bg-[#00e5ff]/10 text-[#00e5ff]' : 'bg-gray-500/10 text-gray-500'}`}>
                                    {post.status}
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button className="w-8 h-8 flex items-center justify-center bg-white/5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all">✏️</button>
                            <button className="w-8 h-8 flex items-center justify-center bg-white/5 rounded-xl text-red-500/50 hover:text-red-500 hover:bg-red-500/10 transition-all">🗑️</button>
                        </div>
                    </div>
                ))}
            </div>

            {posts.length === 0 && (
                <div className="py-20 text-center text-gray-600 text-sm italic">No posts scheduled yet.</div>
            )}
        </div>
    );
};

export default ScheduledPosts;
