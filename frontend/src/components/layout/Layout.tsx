import React, { useState } from 'react';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header
        onMenuToggle={toggleMobileMenu}
        isMobileMenuOpen={isMobileMenuOpen}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {children}
      </main>
      <footer className="border-t border-slate-200 bg-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-slate-500">
            GRC Risk Assessment Dashboard © {new Date().getFullYear()} | Built with React & Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
