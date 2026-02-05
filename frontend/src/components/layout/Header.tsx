import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Plus, LayoutDashboard, Menu, X } from 'lucide-react';

interface HeaderProps {
  onMenuToggle?: () => void;
  isMobileMenuOpen?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle, isMobileMenuOpen }) => {
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/add-risk', label: 'Add Risk', icon: Plus },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-gradient-to-r from-blue-800 to-blue-700 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">GRC Dashboard</h1>
              <p className="text-xs text-blue-200 hidden sm:block">Risk Assessment & Heatmap</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg font-medium
                    transition-all duration-200
                    ${isActive(link.path)
                      ? 'bg-white/20 text-white'
                      : 'text-blue-100 hover:bg-white/10 hover:text-white'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={onMenuToggle}
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <nav className="md:hidden border-t border-white/10 animate-fade-in">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={onMenuToggle}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg font-medium
                    transition-all duration-200
                    ${isActive(link.path)
                      ? 'bg-white/20 text-white'
                      : 'text-blue-100 hover:bg-white/10 hover:text-white'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  {link.label}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
