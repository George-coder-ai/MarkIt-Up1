
import React, { useState, useRef, useMemo } from 'react';
import { UserProfile, DashboardTab, Order, ReturnItem, ScheduledPost, ProductPerformance } from '../types';
import { generateProductDescription, performPriceAnalysis } from '../services/geminiService';
import { useProductContent } from '../context/ProductContentContext';

// Import New Flow Components
import UploadMediaSection from '../components/UploadMediaSection';
import RecordNativeDescription from '../components/RecordNativeDescription';
import TranslatedDescription from '../components/TranslatedDescription';
import ProductDetailsForm from '../components/ProductDetailsForm';

// Import Social Media Pages
import ConnectAccounts from '../pages/social-media/ConnectAccounts';
import CreatePost from '../pages/social-media/CreatePost';
import ScheduledPosts from '../pages/social-media/ScheduledPosts';
import Analytics from '../pages/social-media/Analytics';
import MessagesLeads from '../pages/social-media/MessagesLeads';

interface Props {
  user: UserProfile | null;
  language: string;
  onLogout: () => void;
}

// Mock Data
const initialMockOrders: Order[] = [
  { id: 'ORD001', productName: 'Blue Ceramic Mug', quantity: 2, buyerAddress: '123 Tech Lane, Bangalore, KA', platform: 'Amazon', status: 'Shipped', timestamp: '2023-10-27 10:30' },
  { id: 'ORD002', productName: 'Silk Scarf', quantity: 1, buyerAddress: '456 Rose Gdns, Mumbai, MH', platform: 'Myntra', status: 'Processing', timestamp: '2023-10-27 11:15' },
  { id: 'ORD003', productName: 'Handmade Soap', quantity: 5, buyerAddress: '789 Ocean Dr, Goa', platform: 'Etsy', status: 'Delivered', timestamp: '2023-10-26 14:00' },
];

const initialMockPerformance: (ProductPerformance & { inStock: boolean })[] = [
  { productName: 'Blue Ceramic Mug', sales: 124, reviews: 45, rating: 4.8, returns: 2, cancellations: 1, inStock: true },
  { productName: 'Handmade Soap', sales: 89, reviews: 20, rating: 4.5, returns: 0, cancellations: 3, inStock: true },
  { productName: 'Silk Scarf', sales: 45, reviews: 12, rating: 4.2, returns: 5, cancellations: 2, inStock: false },
];

const mockReturns: ReturnItem[] = [
  { id: 'RET001', orderId: 'ORD005', productName: 'Cotton T-Shirt', reason: 'Wrong Size', status: 'Approved' },
];

const mockScheduled: ScheduledPost[] = [
  { id: 'SCH001', productName: 'Winter Candle Collection', platform: 'Flipkart', scheduledTime: '2023-11-01 09:00' },
];

const platforms = [
  { id: 'amazon', name: 'Amazon', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Amazon_icon.svg/512px-Amazon_icon.svg.png' },
  { id: 'flipkart', name: 'Flipkart', logo: 'https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/flipkart-icon.png' },
  { id: 'myntra', name: 'Myntra', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Myntra_Logo.png' },
  { id: 'meesho', name: 'Meesho', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Meesho_Logo_Full.png/512px-Meesho_Logo_Full.png' },
  { id: 'ajio', name: 'Ajio', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Ajio_Logo.svg/512px-Ajio_Logo.svg.png' },
  { id: 'etsy', name: 'Etsy', logo: 'https://cdn-icons-png.flaticon.com/512/825/825528.png' },
];

const Dashboard: React.FC<Props> = ({ user, language, onLogout }) => {
  const [activeModule, setActiveModule] = useState<'ecommerce' | 'social'>('ecommerce');
  const [activeTab, setActiveTab] = useState<DashboardTab>('publish');
  const [isPlatformModalOpen, setIsPlatformModalOpen] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterByProduct, setFilterByProduct] = useState<string | null>(null);
  const [inventory, setInventory] = useState(initialMockPerformance);

  const { productContent, updateProductContent, saveCurrentProduct } = useProductContent();

  const filteredOrders = useMemo(() => {
    if (!filterByProduct) return initialMockOrders;
    return initialMockOrders.filter(o => o.productName === filterByProduct);
  }, [filterByProduct]);

  const toggleStock = (productName: string) => {
    setInventory(prev => prev.map(item =>
      item.productName === productName ? { ...item, inStock: !item.inStock } : item
    ));
  };

  const onFullAnalysis = async () => {
    if (!productContent.productDetails.name || !productContent.productDetails.price) {
      return alert("Product Name and Price are required for analysis.");
    }
    setLoading(true);
    try {
      const [desc, priceAnalysis] = await Promise.all([
        generateProductDescription(productContent.translatedText || productContent.productDetails.name, productContent.media, language),
        performPriceAnalysis(productContent.productDetails.name, productContent.productDetails.category || "Retail", productContent.productDetails.price)
      ]);
      updateProductContent({ translatedText: desc });
      // We could store price analysis in context too if needed
    } finally { setLoading(false); }
  };

  const handleConfirmPublish = () => {
    if (selectedPlatforms.length === 0) {
      alert("Please select at least one platform.");
      return;
    }
    saveCurrentProduct();
    alert(`Successfully published product on: ${selectedPlatforms.join(', ')}`);
    setIsPlatformModalOpen(false);
  };

  const renderPublish = () => (
    <div className="space-y-8 pb-20 animate-in fade-in duration-500">
      <div className="space-y-1">
        <h3 className="text-xl font-black text-white tracking-tight">Create & Publish</h3>
        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Create once, use everywhere</p>
      </div>

      <UploadMediaSection />

      <RecordNativeDescription />

      <TranslatedDescription />

      <ProductDetailsForm />

      <div className="space-y-4 pt-4 border-t border-white/5">
        <div className="flex gap-4">
          <button
            onClick={onFullAnalysis}
            disabled={loading || !productContent.productDetails.name}
            className="flex-1 py-4 bg-white/5 border border-[#00e5ff]/20 text-[#00e5ff] text-xs font-bold rounded-2xl hover:bg-[#00e5ff]/10 transition-all disabled:opacity-50"
          >
            {loading ? 'Analyzing...' : 'AI Market Check'}
          </button>
          <button
            onClick={() => { saveCurrentProduct(); alert("Content Saved for Social Media reuse!"); }}
            className="flex-1 py-4 bg-white/5 border border-[#7c4dff]/20 text-[#7c4dff] text-xs font-bold rounded-2xl hover:bg-[#7c4dff]/10 transition-all"
          >
            Save Content
          </button>
        </div>

        <button
          onClick={() => setIsPlatformModalOpen(true)}
          disabled={!productContent.productDetails.name}
          className="w-full py-5 bg-gradient-to-r from-[#7c4dff] to-[#00e5ff] rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-[#7c4dff]/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
        >
          Proceed to Marketplace
        </button>
      </div>

      {/* Platform Selection Modal */}
      {isPlatformModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsPlatformModalOpen(false)}></div>
          <div className="relative glass-card w-full max-w-sm rounded-[2.5rem] p-8 border border-white/10 animate-in zoom-in-90 duration-300 shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-white leading-tight">Post to<br />Channels</h3>
              <button onClick={() => setIsPlatformModalOpen(false)} className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors">&times;</button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-10">
              {platforms.map(p => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPlatforms(prev => prev.includes(p.id) ? prev.filter(x => x !== p.id) : [...prev, p.id])}
                  className={`relative p-5 rounded-[2rem] border transition-all flex flex-col items-center gap-3 group ${selectedPlatforms.includes(p.id) ? 'border-[#00e5ff] bg-[#00e5ff]/5' : 'border-white/5 bg-white/5 hover:bg-white/10'}`}
                >
                  <img src={p.logo} alt={p.name} className={`w-12 h-12 object-contain transition-all ${selectedPlatforms.includes(p.id) ? 'scale-110' : 'grayscale group-hover:grayscale-0'}`} />
                  <span className={`text-[10px] font-black uppercase tracking-widest ${selectedPlatforms.includes(p.id) ? 'text-[#00e5ff]' : 'text-gray-500'}`}>{p.name}</span>
                </button>
              ))}
            </div>

            <button
              onClick={handleConfirmPublish}
              className="w-full py-5 bg-[#00e5ff] text-black font-black rounded-2xl hover:bg-white transition-all uppercase tracking-widest text-sm"
            >
              Confirm Publishing
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderProducts = () => (
    <div className="space-y-4 pb-20 animate-in fade-in duration-500">
      <h3 className="text-lg font-bold">Your Active Inventory</h3>
      <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Manage stock across all platforms</p>
      {inventory.map((item, i) => (
        <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/10 flex flex-col gap-3 group hover:border-[#7c4dff]/30 transition-all">
          <div className="flex justify-between items-center">
            <div
              className="flex-1 cursor-pointer"
              onClick={() => {
                setFilterByProduct(item.productName);
                setActiveTab('orders');
              }}
            >
              <p className="font-bold text-sm group-hover:text-[#00e5ff] transition-colors">{item.productName}</p>
              <p className="text-[10px] text-gray-500">Sales: {item.sales} | Rating: {item.rating}★</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-[9px] font-bold uppercase ${item.inStock ? 'text-green-400' : 'text-red-400'}`}>
                {item.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
              <button
                onClick={(e) => { e.stopPropagation(); toggleStock(item.productName); }}
                className={`w-10 h-5 rounded-full relative transition-all ${item.inStock ? 'bg-green-500/30' : 'bg-red-500/30'}`}
              >
                <div className={`absolute top-1 w-3 h-3 rounded-full bg-white shadow-sm transition-all ${item.inStock ? 'right-1' : 'left-1'}`}></div>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-4 pb-20 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold">{filterByProduct ? `Orders for: ${filterByProduct}` : 'Recent Orders'}</h3>
        {filterByProduct && (
          <button onClick={() => setFilterByProduct(null)} className="text-[10px] text-[#00e5ff] font-bold">Show All</button>
        )}
      </div>

      <div className="space-y-3">
        {filteredOrders.map(o => (
          <div key={o.id} className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-2">
            <div className="flex justify-between text-[10px]">
              <span className="text-[#00e5ff] font-black">{o.id}</span>
              <span className="text-gray-500">{o.timestamp}</span>
            </div>
            <h4 className="font-bold text-sm">{o.productName}</h4>
            <div className="flex justify-between items-center mt-2">
              <span className="text-[9px] px-2 py-1 bg-white/5 rounded-lg border border-white/5 text-gray-400 uppercase tracking-widest">{o.platform}</span>
              <span className="text-[10px] font-black text-[#7c4dff] uppercase tracking-wider">{o.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPerformance = () => (
    <div className="space-y-6 pb-20 animate-in fade-in duration-500">
      <h3 className="text-lg font-bold">Business Analytics</h3>
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
          <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Total Sales</p>
          <p className="text-2xl font-black text-[#00e5ff]">{inventory.reduce((acc, curr) => acc + curr.sales, 0)}</p>
        </div>
        <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
          <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Avg Rating</p>
          <p className="text-2xl font-black text-yellow-400">4.5★</p>
        </div>
      </div>
      {/* ... other analytics ... */}
    </div>
  );

  const renderSocial = () => {
    switch (activeTab) {
      case 'publish': return <CreatePost />;
      case 'products': return <ScheduledPosts />;
      case 'orders': return <Analytics />;
      case 'performance': return <MessagesLeads />;
      case 'profile': return <ConnectAccounts />;
      default: return <CreatePost />;
    }
  };

  const renderProfile = () => (
    <div className="space-y-6 pb-20 animate-in fade-in duration-500">
      <div className="flex items-center gap-5 p-6 bg-white/5 rounded-[2rem] border border-white/5">
        <img src={`https://ui-avatars.com/api/?name=${user?.name || 'George'}&background=7c4dff&color=fff`} className="w-16 h-16 rounded-full border-2 border-[#00e5ff]" />
        <div>
          <h3 className="font-black text-xl text-white">{user?.name || 'George'}</h3>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{user?.shopName || "George's Artisan Hub"}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button onClick={() => setActiveTab('performance')} className="p-6 bg-white/5 rounded-[2rem] border border-white/5 flex flex-col items-center gap-2 hover:bg-white/10 transition-all">
          <span className="text-2xl">📈</span>
          <span className="text-[10px] font-black uppercase text-white tracking-widest">Analytics</span>
        </button>
        <button onClick={onLogout} className="p-6 bg-red-500/5 rounded-[2rem] border border-red-500/10 flex flex-col items-center gap-2 hover:bg-red-500/10 transition-all">
          <span className="text-2xl">🚪</span>
          <span className="text-[10px] font-black uppercase text-red-500 tracking-widest">Sign Out</span>
        </button>
      </div>
    </div>
  );

  const renderContent = () => {
    if (activeModule === 'social') return renderSocial();
    switch (activeTab) {
      case 'publish': return renderPublish();
      case 'products': return renderProducts();
      case 'orders': return renderOrders();
      case 'profile': return renderProfile();
      case 'performance': return renderPerformance();
      default: return renderPublish();
    }
  };

  return (
    <div className="glass-card p-6 rounded-[2.5rem] w-full max-h-[95vh] flex flex-col overflow-hidden relative border-white/5 min-h-[600px]">
      {/* Top Header & Module Switcher */}
      <div className="flex justify-between items-center mb-8 px-2">
        <div className="flex flex-col gap-1">
          <div className="flex bg-white/5 p-1 rounded-xl w-fit">
            <button
              onClick={() => { setActiveModule('ecommerce'); setActiveTab('publish'); }}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeModule === 'ecommerce' ? 'bg-[#7c4dff] text-white' : 'text-gray-500'}`}
            >
              Ecommerce
            </button>
            <button
              onClick={() => { setActiveModule('social'); setActiveTab('publish'); }}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeModule === 'social' ? 'bg-[#00e5ff] text-black' : 'text-gray-500'}`}
            >
              Social
            </button>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tighter mt-1">
            {activeModule === 'ecommerce' ? 'E-Commerce' : 'Social Media'}
          </h2>
        </div>
        <button className="w-12 h-12 rounded-full border-2 border-white/10 overflow-hidden shadow-lg shadow-[#00e5ff]/10">
          <img src={`https://ui-avatars.com/api/?name=${user?.name || 'George'}&background=7c4dff&color=fff`} alt="Profile" />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-2">
        {renderContent()}
      </div>

      {/* Dynamic Bottom Navigation */}
      <div className="mt-4 px-2 pb-2">
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 flex justify-around items-center p-3 rounded-[2rem]">
          {activeModule === 'ecommerce' ? (
            // Ecommerce Nav
            [
              { id: 'publish', icon: '✨', label: 'Publish' },
              { id: 'products', icon: '📦', label: 'Products' },
              { id: 'orders', icon: '🚚', label: 'Orders' },
              { id: 'profile', icon: '👤', label: 'Profile' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as DashboardTab)}
                className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition-all ${activeTab === tab.id ? 'text-[#00e5ff] scale-105' : 'text-gray-500 opacity-60'}`}
              >
                <span className="text-xl">{tab.icon}</span>
                <span className="text-[8px] font-black uppercase tracking-widest">{tab.label}</span>
              </button>
            ))
          ) : (
            // Social Media Nav
            [
              { id: 'publish', icon: '📤', label: 'Post' },
              { id: 'products', icon: '🕙', label: 'Schedule' },
              { id: 'orders', icon: '📊', label: 'Stats' },
              { id: 'performance', icon: '📩', label: 'Inbox' },
              { id: 'profile', icon: '🔗', label: 'Connect' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as DashboardTab)}
                className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition-all ${activeTab === tab.id ? 'text-[#7c4dff] scale-105' : 'text-gray-500 opacity-60'}`}
              >
                <span className="text-xl">{tab.icon}</span>
                <span className="text-[8px] font-black uppercase tracking-widest">{tab.label}</span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
