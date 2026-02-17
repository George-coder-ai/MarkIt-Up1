
import React from 'react';

const Analytics: React.FC = () => {
    const stats = [
        { label: 'Likes', value: '1,240', trend: '+12%', color: 'text-red-400' },
        { label: 'Views', value: '45.2K', trend: '+24%', color: 'text-blue-400' },
        { label: 'Comments', value: '389', trend: '+5%', color: 'text-green-400' },
        { label: 'Engagement', value: '8.4%', trend: '+2%', color: 'text-[#7c4dff]' },
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="space-y-1">
                <h3 className="text-xl font-black text-white tracking-tight">Posts & Analytics</h3>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Track your viral growth metrics</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, i) => (
                    <div key={i} className="p-5 bg-white/5 rounded-[2rem] border border-white/5 text-center space-y-1">
                        <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">{stat.label}</p>
                        <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
                        <p className="text-[9px] text-green-400 font-bold">{stat.trend} this week</p>
                    </div>
                ))}
            </div>

            <div className="p-6 bg-white/5 rounded-[2rem] border border-white/5 space-y-4">
                <h4 className="text-xs font-bold text-gray-300 uppercase tracking-widest">Platform Breakdown</h4>
                <div className="space-y-4">
                    {[
                        { p: 'Instagram', v: 65, c: 'bg-gradient-to-r from-[#f09433] to-[#bc1888]' },
                        { p: 'Facebook', v: 25, c: 'bg-[#1877f2]' },
                        { p: 'WhatsApp', v: 10, c: 'bg-[#25d366]' },
                    ].map((item, i) => (
                        <div key={i} className="space-y-1.5">
                            <div className="flex justify-between text-[9px] font-black uppercase tracking-tighter">
                                <span className="text-gray-500">{item.p}</span>
                                <span className="text-white">{item.v}%</span>
                            </div>
                            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                <div className={`h-full ${item.c}`} style={{ width: `${item.v}%` }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Analytics;
