
import React from 'react';

const MessagesLeads: React.FC = () => {
    const messages = [
        { sender: 'Aisha K.', text: 'Is the Silk Scarf available in blue?', time: '10m ago', unread: true },
        { sender: 'Rahul M.', text: 'Interested in bulk order for the mugs.', time: '1h ago', unread: false },
        { sender: 'Emily Chen', text: 'Loved the handmade soap! Reordering.', time: 'Yesterday', unread: false },
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="space-y-1">
                <h3 className="text-xl font-black text-white tracking-tight">Messages & Leads</h3>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Your direct pipeline to customers</p>
            </div>

            <div className="space-y-3">
                {messages.map((msg, i) => (
                    <div key={i} className={`p-5 rounded-[2rem] border transition-all cursor-pointer flex flex-col gap-1 ${msg.unread ? 'bg-[#7c4dff]/10 border-[#7c4dff]/30 shadow-lg shadow-[#7c4dff]/5' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}>
                        <div className="flex justify-between items-center">
                            <h4 className={`font-bold text-sm ${msg.unread ? 'text-white' : 'text-gray-300'}`}>{msg.sender}</h4>
                            <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest">{msg.time}</span>
                        </div>
                        <p className="text-xs text-gray-400 line-clamp-1 italic">"{msg.text}"</p>
                        {msg.unread && (
                            <div className="flex items-center gap-1 mt-1">
                                <div className="w-1.5 h-1.5 bg-[#00e5ff] rounded-full animate-pulse"></div>
                                <span className="text-[8px] font-black text-[#00e5ff] uppercase tracking-tighter">New Lead</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MessagesLeads;
