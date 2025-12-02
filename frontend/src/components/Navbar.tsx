import { Moon, Sun, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { motion, useScroll, useTransform } from 'motion/react';

interface NavbarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Navbar({ darkMode, toggleDarkMode, currentPage, onNavigate }: NavbarProps) {
  const { scrollY } = useScroll();
  const navOpacity = useTransform(scrollY, [0, 100], [1, 0.95]);
  const navScale = useTransform(scrollY, [0, 100], [1, 0.98]);

  return (
    <motion.nav 
      style={{ opacity: navOpacity, scale: navScale }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    >
      <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-sky-100/20 dark:border-sky-500/10" />
      
      <div className="relative max-w-[1400px] mx-auto px-6 h-[75px] flex items-center justify-between">
        {/* Logo */}
        <motion.div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => onNavigate('home')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-sky-400 to-cyan-400 rounded-xl blur-lg opacity-60 group-hover:opacity-100 transition-opacity" />
            <div className="relative w-10 h-10 bg-gradient-to-br from-sky-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-[20px] font-bold bg-gradient-to-r from-sky-600 to-cyan-600 dark:from-sky-400 dark:to-cyan-400 bg-clip-text text-transparent">
              Sahibin
            </span>
            <span className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 -mt-1">
              Sahi Bin
            </span>
          </div>
        </motion.div>

       {/* Navigation Links */}
<div className="hidden md:flex items-center gap-2 bg-slate-50/50 dark:bg-slate-800/50 rounded-full p-1.5 backdrop-blur-sm">
  {[
    { label: 'Camera', value: 'home' },
    { label: 'Upload', value: 'home' },
    { label: 'Dashboard', value: 'dashboard' }
  ].map((item) => (
    <motion.button
      key={item.label}
      onClick={() => {
        onNavigate(item.value); // navigate first
        if (item.value === 'home') {
          // small delay to ensure DOM updates
          setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }, 50);
        }
      }}
      className={`px-6 py-2 rounded-full text-[15px] transition-all duration-300 ${
        currentPage === item.value
          ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-lg shadow-sky-500/30'
          : 'text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-white/50 dark:hover:bg-slate-700/50'
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {item.label}
    </motion.button>
  ))}
</div>


        {/* Dark Mode Toggle */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            className="relative w-11 h-11 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 overflow-hidden group"
          >
            <motion.div
              initial={false}
              animate={{ rotate: darkMode ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-amber-500" />
              ) : (
                <Moon className="w-5 h-5 text-sky-600" />
              )}
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-r from-sky-400/20 to-cyan-400/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Button>
        </motion.div>
      </div>
    </motion.nav>
  );
}
