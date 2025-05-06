
import React, { useEffect } from 'react';
import Dashboard from '../components/Dashboard';
import { useTheme } from '../hooks/useTheme';

const Index = () => {
  const { theme } = useTheme();

  // Apply theme class to document on initial load
  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, [theme]);
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Campus GPA Tracker</h1>
      <Dashboard />
    </div>
  );
};

export default Index;
