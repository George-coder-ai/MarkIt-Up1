import React, { useState } from 'react';
import { authService } from '../services/authService';

interface Props {
  onLogin: (user: any) => void;
  onSignup: () => void;
  onBack: () => void;
}

const Login: React.FC<Props> = ({ onLogin, onSignup, onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const data = await authService.login({ email, password });
      onLogin(data.user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card p-8 rounded-3xl w-full">
      <button onClick={onBack} className="text-sm text-gray-400 mb-4 hover:text-white flex items-center">
        ← Back
      </button>
      <h2 className="text-3xl font-bold mb-8 text-[#00e5ff]">Seller Login</h2>
      {error && <div className="p-3 mb-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm font-medium">{error}</div>}
      <div className="space-y-4">
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-4 bg-white/10 rounded-xl border border-white/10 focus:border-[#7c4dff] outline-none text-white"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-4 bg-white/10 rounded-xl border border-white/10 focus:border-[#7c4dff] outline-none text-white"
        />
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-[#7c4dff] to-[#00e5ff] rounded-xl font-bold mt-4 text-white disabled:opacity-50"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </div>
      <div className="mt-8 text-center">
        <p className="text-gray-400 mb-2">Don't have an account?</p>
        <button onClick={onSignup} className="text-[#00e5ff] font-semibold hover:underline">
          Create Seller Account
        </button>
      </div>
    </div>
  );
};

export default Login;
