import { Sparkles, ArrowRight, Users, Globe, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from './ui/button';

export function MissionStatement() {
  return (
    <section className="py-20 px-6 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-cyan-50 to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900" />
      
      {/* Geometric Patterns */}
      <div className="absolute inset-0 opacity-30 dark:opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 border-2 border-sky-300 dark:border-sky-500 rounded-full" />
        <div className="absolute top-40 right-20 w-24 h-24 border-2 border-cyan-300 dark:border-cyan-500 rounded-full" />
        <div className="absolute bottom-20 left-1/4 w-40 h-40 border-2 border-blue-300 dark:border-blue-500 rounded-full" />
      </div>

      {/* Gradient Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-sky-400/20 to-cyan-400/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="relative max-w-[1400px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          {/* Main Card */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-2xl rounded-[32px] shadow-2xl border border-white/50 dark:border-slate-700/50 overflow-hidden">
            <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 items-center">
              {/* Left Side - Illustration */}
              <div className="relative p-12 lg:p-16">
                <motion.div
                  animate={{
                    y: [0, -20, 0],
                    rotate: [0, 5, 0]
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="relative"
                >
                  {/* Central Icon */}
                  <div className="relative w-48 h-48 mx-auto">
                    {/* Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-sky-400 to-cyan-400 rounded-full blur-3xl opacity-50" />
                    
                    {/* Main Circle */}
                    <div className="relative w-full h-full bg-gradient-to-br from-sky-500 to-cyan-500 rounded-full flex items-center justify-center shadow-2xl">
                      <Sparkles className="w-24 h-24 text-white" />
                    </div>

                    {/* Orbiting Elements */}
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0"
                    >
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
                        <Globe className="w-6 h-6 text-white" />
                      </div>
                    </motion.div>

                    <motion.div
                      animate={{ rotate: -360 }}
                      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0"
                    >
                      <div className="absolute top-1/2 -right-4 -translate-y-1/2 w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                        <Zap className="w-5 h-5 text-white" />
                      </div>
                    </motion.div>

                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0"
                    >
                      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mt-12">
                  <div className="text-center p-4 bg-gradient-to-br from-sky-50 to-cyan-50 dark:from-sky-950/30 dark:to-cyan-950/30 rounded-2xl">
                    <p className="text-[32px] bg-gradient-to-r from-sky-600 to-cyan-600 dark:from-sky-400 dark:to-cyan-400 bg-clip-text text-transparent">
                      Many
                    </p>
                    <p className="text-[13px] text-slate-600 dark:text-slate-400">Active Users</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-2xl">
                    <p className="text-[32px] bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                      High
                    </p>
                    <p className="text-[13px] text-slate-600 dark:text-slate-400">Accuracy</p>
                  </div>
                </div>
              </div>

              {/* Right Side - Content */}
              <div className="p-12 lg:p-16 lg:pr-20">
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-500/10 to-cyan-500/10 dark:from-sky-500/20 dark:to-cyan-500/20 rounded-full border border-sky-500/30 dark:border-sky-500/30 mb-6">
                    <Sparkles className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                    <span className="text-[14px] text-sky-700 dark:text-sky-400">Our Mission</span>
                  </div>

                  <h2 className="text-[36px] mb-6 bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent leading-tight">
                    SahiBin - Revolutionizing Waste Management
                  </h2>

                  <p className="text-[18px] text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                    Empowering individuals and communities worldwide to make{' '}
                    <span className="text-sky-600 dark:text-sky-400">informed decisions</span>{' '}
                    about waste disposal, promoting{' '}
                    <span className="text-emerald-600 dark:text-emerald-400">sustainability</span>, 
                    and creating a cleaner future through the power of{' '}
                    <span className="text-purple-600 dark:text-purple-400">artificial intelligence</span>{' '}
                    and community collaboration.
                  </p>

                  {/* Feature Points */}
                  <div className="space-y-4 mb-8">
                    {[
                      { icon: Zap, text: 'Instant AI-powered waste identification' },
                      { icon: Globe, text: 'Contributing to global sustainability goals' },
                      { icon: Users, text: 'Join Other eco-conscious users' }
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className="flex items-center gap-3"
                      >
                        <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                          <item.icon className="w-5 h-5 text-white" />
                        </div>
                        <p className="text-slate-700 dark:text-slate-300">{item.text}</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* CTA Buttons */}
<div className="flex flex-wrap gap-4">
  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
    <Button
      className="h-[56px] px-8 bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 text-white rounded-[14px] shadow-xl shadow-sky-500/30 group"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      Start Detecting
      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
    </Button>
  </motion.div>

  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
    <Button
      variant="outline"
      className="h-[56px] px-8 border-2 border-slate-300 dark:border-slate-600 hover:border-sky-500 dark:hover:border-sky-500 rounded-[14px]"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      Learn More
    </Button>
  </motion.div>
</div>

                </motion.div>
              </div>
            </div>
          </div>

          {/* Bottom Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
            className="flex justify-center mt-8"
          >
            <div className="px-6 py-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-full border border-white/50 dark:border-slate-700/50 shadow-lg">
              <p className="text-[15px] bg-gradient-to-r from-sky-600 to-cyan-600 dark:from-sky-400 dark:to-cyan-400 bg-clip-text text-transparent">
                Making Sustainability Accessible • One Detection at a Time
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
