import { CheckCircle, Info, AlertTriangle, MapPin, Bell, FileText, Recycle, Calculator } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { wasteCategories } from '../utils/wasteCategories';

interface DisposalGuideTabPageProps {
  wasteType: string;
  onNavigateTab: (tabId: string) => void; // e.g., 'centers', 'detection'
  onScrollToSection?: (sectionId: string) => void;
}

export function DisposalGuideTabPage({ wasteType , onNavigateTab, onScrollToSection }: DisposalGuideTabPageProps) {
  const categoryData = wasteCategories[wasteType];
  
  if (!categoryData) {
    return <div>Category not found</div>;
  }

  return (
    <div className="py-8 px-6">
      <div className="max-w-[1400px] mx-auto space-y-6">
        {/* Top Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[16px] p-8"
          style={{ backgroundColor: categoryData.lightBg }}
        >
          <div className="grid md:grid-cols-3 gap-6">
            {/* Column 1 */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: categoryData.color }}
                >
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <h2
                  className="text-[24px]"
                  style={{ color: categoryData.color }}
                >
                  {categoryData.name} - {categoryData.isRecyclable ? 'Recyclable' : 'Non-Recyclable'}
                </h2>
              </div>
            </div>

            {/* Column 2 */}
            <div>
              <p className="text-[12px] uppercase tracking-wide text-slate-600 mb-1">
                Disposal Bin
              </p>
              <p className="text-slate-900 mb-3">
                {categoryData.disposalBin}
              </p>
              <p className="text-[12px] uppercase tracking-wide text-slate-600 mb-1">
                Preparation Time
              </p>
              <p className="text-slate-900">
                {categoryData.preparationTime}
              </p>
            </div>

            {/* Column 3 */}
            <div>
              <p className="text-[12px] uppercase tracking-wide text-slate-600 mb-1">
                Collection Schedule
              </p>
              <p className="text-slate-900">
                {categoryData.collectionSchedule}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Step-by-Step Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-slate-800 rounded-[20px] shadow-lg p-8"
        >
          <h3 className="text-[24px] text-slate-900 dark:text-white mb-8 flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-emerald-500" />
            Step-by-Step Disposal Instructions
          </h3>

          <div className="space-y-6">
            {categoryData.disposalInstructions.map((instruction, index) => (
              <div key={index} className="flex items-start gap-4">
                {/* Step Number */}
                <div
                  className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white"
                  style={{ backgroundColor: categoryData.color }}
                >
                  <span className="font-bold">{index + 1}</span>
                </div>
                
                {/* Step Text */}
                <div className="flex-1 pt-2">
                  <p className="text-slate-700 dark:text-slate-300">
                    {instruction}
                  </p>
                </div>

                {/* Connecting Line */}
                {index < categoryData.disposalInstructions.length - 1 && (
                  <div
                    className="absolute left-[36px] mt-10 w-0.5 h-6 opacity-30"
                    style={{ backgroundColor: categoryData.color }}
                  />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Environmental Tip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-500/30 rounded-[12px] p-6"
        >
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-emerald-900 dark:text-emerald-300 mb-2">
                Environmental Tip
              </h4>
              <p className="text-emerald-800 dark:text-emerald-200">
                {categoryData.environmentalTip}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Warnings */}
        {categoryData.warnings && categoryData.warnings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-500/30 rounded-[12px] p-6"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-red-900 dark:text-red-300 mb-3">
                  Important Warnings
                </h4>
                <div className="space-y-2">
                  {categoryData.warnings.map((warning, index) => (
                    <p key={index} className="text-red-800 dark:text-red-200">
                      {warning}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[16px] p-6 hover:shadow-lg transition-all cursor-pointer group"
            onClick={() => onNavigateTab('centers')}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-sky-100 dark:bg-sky-950/30 rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-sky-600 dark:text-sky-400" />
                </div>
                <div>
                  <h4 className="text-slate-900 dark:text-white">
                    Find Collection Centers
                  </h4>
                  <p className="text-[14px] text-slate-600 dark:text-slate-400">
                    Locate nearby disposal facilities
                  </p>
                </div>
              </div>
              <span className="text-sky-600 dark:text-sky-400 group-hover:translate-x-1 transition-transform">
                →
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[16px] p-6 hover:shadow-lg transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-950/30 rounded-xl flex items-center justify-center">
                  <Bell className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h4 className="text-slate-900 dark:text-white">
                    Set Reminder
                  </h4>
                  <p className="text-[14px] text-slate-600 dark:text-slate-400">
                    Coming Soon
                  </p>
                </div>
              </div>
              <span className="text-amber-600 dark:text-amber-400 group-hover:translate-x-1 transition-transform">
                →
              </span>
            </div>
          </motion.div>
        </div>

        {/* Additional Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-slate-800 rounded-[20px] shadow-lg p-8"
        >
          <h3 className="text-[20px] text-slate-900 dark:text-white mb-6">
            Additional Resources
          </h3>

          <div className="space-y-3">
            <a
              onClick={() => onScrollToSection?.('dashboard-section')}
              className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors group"
            >
              <FileText className="w-5 h-5 text-sky-600 dark:text-sky-400" />
              <span className="text-slate-700 dark:text-slate-300 flex-1">
                Local Waste Management Guidelines
              </span>
              <span className="text-slate-400 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                →
              </span>
            </a>

            <a
              onClick={() => onNavigateTab('centers')}
              className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors group"
            >
              <Recycle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-slate-700 dark:text-slate-300 flex-1">
                Recycling Centers Near You
              </span>
              <span className="text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                →
              </span>
            </a>

            <a
              onClick={() => onNavigateTab('detection')}
              className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors group"
            >
              <Calculator className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span className="text-slate-700 dark:text-slate-300 flex-1">
                Environmental Impact Calculator
              </span>
              <span className="text-slate-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                →
              </span>
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
