
import React from 'react';

const ConnectAccounts: React.FC = () => {
    const socials = [
        { name: 'Instagram', icon: '📸', color: 'from-[#f09433] to-[#bc1888]' },
        { name: 'Facebook', icon: '👤', color: 'from-[#1877f2] to-[#0d56b3]' },
        { name: 'WhatsApp', icon: '💬', color: 'from-[#25d366] to-[#128c7e]' },
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="space-y-1">
                <h3 className="text-xl font-black text-white tracking-tight">Connect Accounts</h3>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Link your social handles to start posting</p>
            </div>

            <div className="grid gap-4">
                {socials.map((social, i) => (
                    <div key={i} className="p-6 bg-white/5 rounded-[2rem] border border-white/5 flex items-center justify-between group hover:bg-white/10 transition-all">
                        <div className="flex items-center gap-4">
                            <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${social.color} flex items-center justify-center text-2xl shadow-lg`}>
                                {social.icon}
                            </div>
                            <div>
                                <h4 className="font-bold text-white">{social.name}</h4>
                                <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Not Connected</p>
                            </div>
                        </div>
                        <button className="px-6 py-2 bg-white/10 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-[#00e5ff] hover:text-black transition-all">
                            Connect
                        </button>
                    </div>
                ))}
            </div>

            <div className="p-6 bg-[#7c4dff]/10 rounded-[2rem] border border-[#7c4dff]/20">
                <p className="text-xs text-gray-400 leading-relaxed font-medium">
                    Connecting your accounts allows MarkitUp to automatically cross-post your products and
                    track real-time analytics across all platforms.
                </p>
            </div>
        </div>
    );
};

export default ConnectAccounts;
