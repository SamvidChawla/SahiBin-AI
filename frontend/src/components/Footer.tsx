import { Zap, Target, BarChart3, Users, Github, Twitter, Linkedin, Mail, ArrowUp, Heart } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { motion } from 'motion/react';

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative mt-20 overflow-hidden">
      {/* Wave Separator */}
      <div className="absolute top-0 left-0 right-0 h-20 -translate-y-full">
        <svg
          className="absolute bottom-0 w-full h-20 text-slate-900 dark:text-slate-950"
          preserveAspectRatio="none"
          viewBox="0 0 1200 120"
          fill="currentColor"
        >
          <path d="M0,0 C150,100 350,0 600,50 C850,100 1050,0 1200,50 L1200,120 L0,120 Z" />
        </svg>
      </div>

      <div className="relative bg-slate-900 dark:bg-slate-950 text-white py-16">
        <div className="max-w-[1400px] mx-auto px-6">
          {/* Powered By Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-[12px] uppercase tracking-wider text-slate-400 mb-4">
              Powered by
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { name: 'YOLO Object Detection', gradient: 'from-sky-500 to-cyan-500' },
                { name: 'Enhanced with Gemini AI', gradient: 'from-purple-500 to-pink-500' },
                { name: 'Built with React', gradient: 'from-blue-500 to-indigo-500' }
              ].map((tech, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="group"
                >
                  <Badge
                    className={`bg-gradient-to-r ${tech.gradient} text-white px-4 py-2 text-[13px] shadow-lg border-0 cursor-pointer relative overflow-hidden`}
                  >
                    <span className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
                    <span className="relative">{tech.name}</span>
                  </Badge>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent mb-12" />

          {/* Features Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {[
              {
                icon: Zap,
                title: 'Real-time Detection',
                description: 'Instant AI-powered identification',
                color: 'from-amber-500 to-orange-500'
              },
              {
                icon: Target,
                title: 'Smart Disposal',
                description: 'Personalized instructions',
                color: 'from-sky-500 to-cyan-500'
              },
              {
                icon: BarChart3,
                title: 'Impact Tracking',
                description: 'Monitor your contribution',
                color: 'from-emerald-500 to-teal-500'
              },
              {
                icon: Users,
                title: 'Community',
                description: 'Join the movement',
                color: 'from-purple-500 to-pink-500'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center group cursor-pointer"
              >
                <div className={`w-14 h-14 mx-auto mb-4 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h4 className="text-white mb-2 group-hover:text-sky-400 transition-colors">
                  {feature.title}
                </h4>
                <p className="text-[14px] text-slate-400 group-hover:text-slate-300 transition-colors">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent mb-12" />

          {/* Bottom Section */}
          <div className="grid md:grid-cols-3 gap-8 items-center">
            {/* Left - Copyright */}
            <div className="text-center md:text-left">
              <p className="text-slate-400 text-[14px]">
                © 2025 SahiBin
              </p>
              <p className="text-slate-500 text-[13px] mt-1">
                Revolutionizing Waste Management through AI
              </p>
            </div>

            {/* Center - Mission Badge */}
            <div className="text-center">
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-500/20 to-cyan-500/20 border border-sky-500/30 rounded-full"
              >
                <Heart className="w-4 h-4 text-sky-400 fill-sky-400" />
                <span className="text-[14px] bg-gradient-to-r from-sky-400 to-cyan-400 bg-clip-text text-transparent">
                  Made with love for the Planet
                </span>
              </motion.div>
            </div>

            {/* Right - Links & Social */}
            <div className="text-center md:text-right">
              <div className="flex justify-center md:justify-end gap-2 mb-3">
                {[
                  
                  { icon: Github, href: 'https://github.com/Aradhays07/SahiBin-AI' }
                ].map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 bg-slate-800 hover:bg-gradient-to-br hover:from-sky-500 hover:to-cyan-500 rounded-xl flex items-center justify-center transition-all duration-300 group"
                  >
                    <social.icon className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                  </motion.a>
                ))}
              </div>
              <div className="text-[13px] text-slate-400 md:text-right break-words">
  This is a personal project. Frontend hosted on Netlify, backend on Render. 
  This is for demonstration purposes only. Refer to each service's policies.
</div>

            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <motion.button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-br from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 rounded-full shadow-2xl shadow-sky-500/30 flex items-center justify-center z-40 group"
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <ArrowUp className="w-6 h-6 text-white group-hover:-translate-y-1 transition-transform" />
      </motion.button>
    </footer>
  );
}
