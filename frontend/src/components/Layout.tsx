import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Upload,
  FileText,
  User,
  Award,
  Menu,
  X,
  Bell,
  LogOut,
  Brain,
  BookOpen,
  Settings,
} from 'lucide-react';

interface LayoutProps {
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ onLogout }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navItems = [
    { path: '/', icon: Home, label: '首頁' },
    { path: '/upload', icon: Upload, label: '上傳論文' },
    { path: '/my-papers', icon: FileText, label: '我的論文' },
    { path: '/ai-insights', icon: Brain, label: 'AI洞察' },
    { path: '/career', icon: Award, label: '職涯歷程' },
    { path: '/resources', icon: BookOpen, label: '研究資源' },
    { path: '/admin', icon: Settings, label: '審核管理' },
    { path: '/profile', icon: User, label: '個人資料' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="liquid-glass sticky top-0 z-50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <motion.div
                className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #6366f1, #ec4899)',
                }}
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Award className="w-6 h-6 text-white" strokeWidth={1.5} />
              </motion.div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-slate-800">論文獎勵系統</h1>
                <p className="text-xs text-slate-500">Paper Incentive System</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="relative"
                >
                  <motion.div
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${isActive(item.path)
                      ? 'text-white'
                      : 'text-slate-600 hover:text-primary-600'
                      }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isActive(item.path) && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute inset-0 rounded-xl"
                        style={{
                          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                          boxShadow: '0 4px 20px rgba(99, 102, 241, 0.4)',
                        }}
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    <item.icon className="w-4 h-4 relative z-10" strokeWidth={1.5} />
                    <span className="text-sm font-medium relative z-10">{item.label}</span>
                  </motion.div>
                </Link>
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-2">
              {/* Notification Bell */}
              <motion.button
                className="relative p-2 rounded-xl transition-colors"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                }}
                whileHover={{
                  scale: 1.05,
                  background: 'rgba(255, 255, 255, 0.2)',
                }}
                whileTap={{ scale: 0.95 }}
              >
                <Bell className="w-5 h-5 text-slate-600" strokeWidth={1.5} />
                <motion.span
                  className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.button>

              {/* Logout Button */}
              <motion.button
                onClick={onLogout}
                className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl text-slate-600 transition-colors"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                }}
                whileHover={{
                  scale: 1.02,
                  background: 'rgba(239, 68, 68, 0.15)',
                  color: '#dc2626',
                }}
                whileTap={{ scale: 0.98 }}
              >
                <LogOut className="w-4 h-4" strokeWidth={1.5} />
                <span className="text-sm font-medium">登出</span>
              </motion.button>

              {/* Mobile menu button */}
              <motion.button
                className="md:hidden p-2 rounded-xl transition-colors"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                whileHover={{ background: 'rgba(255, 255, 255, 0.2)' }}
                whileTap={{ scale: 0.95 }}
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6 text-slate-600" strokeWidth={1.5} />
                ) : (
                  <Menu className="w-6 h-6 text-slate-600" strokeWidth={1.5} />
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-white/10 overflow-hidden"
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <nav className="px-4 py-3 space-y-1">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${isActive(item.path)
                        ? 'text-white shadow-lg'
                        : 'text-slate-600 hover:bg-white/20'
                        }`}
                      style={isActive(item.path) ? {
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                      } : {}}
                    >
                      <item.icon className="w-5 h-5" strokeWidth={1.5} />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </motion.div>
                ))}

                {/* Mobile Logout */}
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navItems.length * 0.05 }}
                  onClick={onLogout}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50/50 transition-all duration-300 w-full"
                >
                  <LogOut className="w-5 h-5" strokeWidth={1.5} />
                  <span className="font-medium">登出</span>
                </motion.button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="liquid-glass mt-auto border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-300">
              © 2026 奇美醫療財團法人奇美醫院 教學部
            </p>
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <Link
                to="/help"
                className="hover:text-primary-600 transition-colors"
              >
                使用說明
              </Link>
              <Link
                to="/contact"
                className="hover:text-primary-600 transition-colors"
              >
                聯絡我們
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
