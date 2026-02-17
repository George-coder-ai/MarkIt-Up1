
import React from 'react';

const Splash: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <h1 className="text-6xl font-bold logo-glow text-[#00e5ff]">MarkitUp</h1>
      <p className="text-xl text-gray-400 font-light tracking-widest uppercase">Powering Smart Sellers</p>
      <div className="mt-8 flex space-x-2">
        <div className="w-3 h-3 bg-[#7c4dff] rounded-full animate-bounce"></div>
        <div className="w-3 h-3 bg-[#00e5ff] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-3 h-3 bg-[#7c4dff] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      </div>
    </div>
  );
};

export default Splash;
