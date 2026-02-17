
import React, { useState } from 'react';
import { authService } from '../services/authService';

interface Props {
  onComplete: () => void;
  onBack: () => void;
}

const Signup: React.FC<Props> = ({ onComplete, onBack }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name || !email || !password) {
      setError('Please fill in all required fields');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await authService.signup({ name, email, password });
      onComplete();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card p-8 rounded-3xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar">
      <button onClick={onBack} className="text-sm text-gray-400 mb-4 hover:text-white flex items-center">
        ← Back
      </button>
      <h2 className="text-2xl font-bold mb-6 text-[#00e5ff]">Create Seller Profile</h2>
      {error && <div className="p-3 mb-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm font-medium">{error}</div>}
      <div className="space-y-3">
        <div>
          <label className="text-xs text-gray-400 ml-1">Full Name *</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 bg-white/10 rounded-lg border border-white/10 text-white outline-none focus:border-[#7c4dff]"
            placeholder="John Doe"
          />
        </div>
        <div>
          <label className="text-xs text-gray-400 ml-1">Email *</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 bg-white/10 rounded-lg border border-white/10 text-white outline-none focus:border-[#7c4dff]"
            placeholder="john@example.com"
          />
        </div>
        <div>
          <label className="text-xs text-gray-400 ml-1">Password *</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 bg-white/10 rounded-lg border border-white/10 text-white outline-none focus:border-[#7c4dff]"
            placeholder="••••••••"
          />
        </div>
        <div>
          <label className="text-xs text-gray-400 ml-1">Brand Logo</label>
          <input type="file" className="w-full p-2 bg-white/10 rounded-lg border border-white/10 text-xs text-white" />
        </div>
        <div>
          <label className="text-xs text-gray-400 ml-1">Shop Name</label>
          <input className="w-full p-3 bg-white/10 rounded-lg border border-white/10 text-white" placeholder="Eco Crafts" />
        </div>
        <div>
          <label className="text-xs text-gray-400 ml-1">Category</label>
          <select className="w-full p-3 bg-white/10 rounded-lg border border-white/10 text-white">
            <option>Handcrafts</option>
            <option>Electronics</option>
            <option>Fashion</option>
            <option>Organic Foods</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-400 ml-1">Address</label>
          <textarea className="w-full p-3 bg-white/10 rounded-lg border border-white/10 resize-none h-20 text-white" placeholder="Shop Address..." />
        </div>
        <div>
          <label className="text-xs text-gray-400 ml-1">Udyam Aadhaar ID (Optional)</label>
          <input className="w-full p-3 bg-white/10 rounded-lg border border-white/10 text-white" placeholder="UDYAM-XX-00-0000000" />
        </div>
        <button
          onClick={handleSignup}
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-[#7c4dff] to-[#00e5ff] rounded-xl font-bold mt-4 text-white disabled:opacity-50"
        >
          {loading ? 'Creating Profile...' : 'Register & Start Selling'}
        </button>
      </div>
      <div className="mt-6 p-4 bg-[#7c4dff]/10 rounded-xl text-center">
        <p className="text-xs text-gray-300">Need help setting up?</p>
        <a href="#" className="text-xs text-[#00e5ff] hover:underline">Watch YouTube Tutorial Guide</a>
      </div>
    </div>
  );
};

export default Signup;
