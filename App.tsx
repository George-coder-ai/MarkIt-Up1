
import React, { useState, useEffect } from 'react';
import { AppScreen, UserProfile } from './types';
import Splash from './screens/Splash';
import LanguageSelect from './screens/LanguageSelect';
import Login from './screens/Login';
import Signup from './screens/Signup';
import Dashboard from './screens/Dashboard';
import { authService } from './services/authService';

import { ProductContentProvider } from './context/ProductContentContext';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(AppScreen.SPLASH);
  const [language, setLanguage] = useState<string>('English');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await authService.getCurrentUser();
        if (userData) {
          setUser(userData);
          setCurrentScreen(AppScreen.DASHBOARD);
        }
      } catch (err) {
        console.error('Auth verification failed', err);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (currentScreen === AppScreen.SPLASH && !user && !loading) {
      const timer = setTimeout(() => {
        setCurrentScreen(AppScreen.LANGUAGE);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentScreen, user, loading]);

  const navigate = (screen: AppScreen) => setCurrentScreen(screen);

  const renderScreen = () => {
    switch (currentScreen) {
      case AppScreen.SPLASH:
        return <Splash />;
      case AppScreen.LANGUAGE:
        return <LanguageSelect
          selectedLanguage={language}
          setLanguage={setLanguage}
          onContinue={() => navigate(AppScreen.LOGIN)}
        />;
      case AppScreen.LOGIN:
        return <Login
          onLogin={(userData) => { setUser(userData); navigate(AppScreen.DASHBOARD); }}
          onSignup={() => navigate(AppScreen.SIGNUP)}
          onBack={() => navigate(AppScreen.LANGUAGE)}
        />;
      case AppScreen.SIGNUP:
        return <Signup
          onComplete={() => navigate(AppScreen.LOGIN)}
          onBack={() => navigate(AppScreen.LOGIN)}
        />;
      case AppScreen.DASHBOARD:
        return <Dashboard
          user={user}
          language={language}
          onLogout={() => {
            authService.logout();
            setUser(null);
            navigate(AppScreen.LOGIN);
          }}
        />;
      default:
        return <Splash />;
    }
  };

  return (
    <ProductContentProvider>
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {renderScreen()}
        </div>
      </div>
    </ProductContentProvider>
  );
};

export default App;
