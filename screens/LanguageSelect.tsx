
import React from 'react';

interface Props {
  selectedLanguage: string;
  setLanguage: (lang: string) => void;
  onContinue: () => void;
}

const languages = [
  'English', 'Hindi', 'Telugu', 'Tamil', 'Kannada', 'Malayalam', 
  'Marathi', 'Gujarati', 'Bengali', 'Punjabi', 'Odia', 'Urdu'
];

const LanguageSelect: React.FC<Props> = ({ selectedLanguage, setLanguage, onContinue }) => {
  return (
    <div className="glass-card p-8 rounded-3xl w-full">
      <h2 className="text-2xl font-bold mb-6 text-center text-[#00e5ff]">Choose Language</h2>
      <div className="grid grid-cols-2 gap-3 mb-8">
        {languages.map((lang) => (
          <button
            key={lang}
            onClick={() => setLanguage(lang)}
            className={`p-3 rounded-xl border transition-all duration-200 ${
              selectedLanguage === lang 
              ? 'bg-[#7c4dff] border-[#7c4dff] text-white' 
              : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
            }`}
          >
            {lang}
          </button>
        ))}
      </div>
      <button 
        onClick={onContinue}
        className="w-full py-4 bg-gradient-to-r from-[#7c4dff] to-[#00e5ff] rounded-xl font-bold text-lg hover:shadow-[0_0_20px_rgba(124,77,255,0.4)] transition-all"
      >
        Continue
      </button>
    </div>
  );
};

export default LanguageSelect;
