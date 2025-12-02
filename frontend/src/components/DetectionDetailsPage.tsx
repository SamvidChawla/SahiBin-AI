import { Camera, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { wasteCategories } from '../utils/wasteCategories';

interface DetectionResult {
  itemName: string;
  confidence: number;
  isRecyclable: boolean;
  wasteType: string;
  category: string;
  image: string;
  co2Impact: number;
  energyImpact: number;
  waterImpact?: number;
  disposalInstructions?: string[];
  disposalBin?: string;
  environmentalTip?: string;
  warnings?: string[];
  preparationTime?: string;
  collectionSchedule?: string;
}

interface DetectionDetailsPageProps {
  result: DetectionResult;
  onTryAgain: () => void;
  onTabChange: (tab: string) => void; 
}

export function DetectionDetailsPage({ result, onTryAgain , onTabChange }: DetectionDetailsPageProps) {
  const categoryData = wasteCategories[result.wasteType];
  
  if (!categoryData) {
    return <div>Category not found</div>;
  }

  return (
    <div className="py-8 px-6">
      <div className="max-w-[1400px] mx-auto">
        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Left Column - Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-slate-800 rounded-[24px] shadow-lg p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <Camera className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <h2 className="text-slate-900 dark:text-white">📷 Analyzed Image</h2>
            </div>

            <div className="relative">
              <img
                src={result.image}
                alt="Detected waste item"
                className="w-full h-auto rounded-[16px] border-2 border-slate-200 dark:border-slate-700"
              />
              
              {/* Confidence Badge */}
              <div
                className="absolute top-4 right-4 px-5 py-2.5 rounded-full shadow-xl"
                style={{ backgroundColor: categoryData.color }}
              >
                <span className="text-white text-[18px]">
                  {result.confidence}%
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Detection Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-slate-800 rounded-[24px] shadow-lg p-10 border-l-4"
            style={{ borderLeftColor: categoryData.color }}
          >
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-[32px]"
                style={{ backgroundColor: categoryData.lightBg }}
              >
                {categoryData.icon}
              </div>
              <h2
                className="text-[32px]"
                style={{ color: categoryData.color }}
              >
                {categoryData.name.toUpperCase()} Detected
              </h2>
            </div>

            {/* Information Grid */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-[12px] uppercase tracking-wide text-gray-500 dark:text-slate-400 mb-2">
                  CATEGORY
                </p>
                <p
                  className="text-[20px]"
                  style={{ color: categoryData.color }}
                >
                  {categoryData.name} Products
                </p>
              </div>

              <div>
                <p className="text-[12px] uppercase tracking-wide text-gray-500 dark:text-slate-400 mb-2">
                  RECYCLABLE
                </p>
                <div className="flex items-center gap-2">
                  {categoryData.isRecyclable ? (
                    <>
                      <span className="text-[20px] text-emerald-600 dark:text-emerald-400">
                        ✓ Yes
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-[20px] text-red-600 dark:text-red-400">
                        ✗ No
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Disposal Bin */}
            <div className="mb-6">
              <p className="text-[12px] uppercase tracking-wide text-gray-500 dark:text-slate-400 mb-2">
                DISPOSAL BIN
              </p>
              <p className="text-[18px] text-gray-800 dark:text-white">
                {categoryData.disposalBin}
              </p>
            </div>

            {/* Environmental Tip */}
            <div className="bg-blue-50 dark:bg-blue-950/30 rounded-[12px] p-5 border-l-4 border-blue-500">
              <p className="text-[12px] uppercase tracking-wide text-blue-700 dark:text-blue-400 mb-2">
                💡 ENVIRONMENTAL TIP
              </p>
              <p className="text-gray-800 dark:text-slate-300 leading-relaxed">
                {categoryData.environmentalTip}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Disposal Instructions Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-slate-800 rounded-[24px] shadow-lg p-10"
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="text-[24px]">📋</span>
            <h3 className="text-[24px] text-slate-900 dark:text-white">
              Disposal Instructions
            </h3>
          </div>

          <div className="bg-green-50 dark:bg-green-950/30 rounded-[16px] p-8 border-2 border-green-200 dark:border-green-800">
            <ol className="list-decimal list-inside space-y-3">
              {categoryData.disposalInstructions.map((instruction, index) => (
                <li key={index} className="text-gray-800 dark:text-slate-200 leading-relaxed pl-2">
                  {instruction}
                </li>
              ))}
            </ol>
          </div>

          {categoryData.warnings && categoryData.warnings.length > 0 && (
            <div className="mt-6 bg-red-50 dark:bg-red-950/30 rounded-[12px] p-5 border-l-4 border-red-500">
              <p className="text-[12px] uppercase tracking-wide text-red-800 dark:text-red-400 mb-3">
                ⚠️ IMPORTANT WARNINGS
              </p>
              <div className="space-y-2">
                {categoryData.warnings.map((warning, index) => (
                  <p key={index} className="text-[14px] text-red-800 dark:text-red-300">
                    {warning}
                  </p>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Environmental Impact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-slate-800 rounded-[24px] shadow-lg p-10"
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="text-[24px]">🌍</span>
            <h3 className="text-[24px] text-slate-900 dark:text-white">
              Environmental Impact
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {/* CO2 Saved */}
            <div className="bg-green-100 dark:bg-green-900/30 rounded-[16px] p-6 text-center">
              <div className="text-[40px] mb-2">🌱</div>
              <div className="text-[32px] text-green-900 dark:text-green-400 mb-1">
                {categoryData.co2Impact} kg
              </div>
              <div className="text-[14px] text-green-700 dark:text-green-500">
                CO₂ Saved
              </div>
            </div>

            {/* Energy Saved */}
            <div className="bg-yellow-100 dark:bg-yellow-900/30 rounded-[16px] p-6 text-center">
              <div className="text-[40px] mb-2">⚡</div>
              <div className="text-[32px] text-yellow-900 dark:text-yellow-400 mb-1">
                {categoryData.energyImpact} kWh
              </div>
              <div className="text-[14px] text-yellow-700 dark:text-yellow-600">
                Energy Saved
              </div>
            </div>

            {/* Water Saved */}
            <div className="bg-blue-100 dark:bg-blue-900/30 rounded-[16px] p-6 text-center">
              <div className="text-[40px] mb-2">💧</div>
              <div className="text-[32px] text-blue-900 dark:text-blue-400 mb-1">
                {categoryData.waterImpact} L
              </div>
              <div className="text-[14px] text-blue-700 dark:text-blue-500">
                Water Saved
              </div>
            </div>

            {/* Trees Saved */}
            <div className="bg-green-100 dark:bg-green-900/30 rounded-[16px] p-6 text-center">
              <div className="text-[40px] mb-2">🌲</div>
              <div className="text-[32px] text-green-900 dark:text-green-400 mb-1">
                {(categoryData.co2Impact * 0.017).toFixed(3)}
              </div>
              <div className="text-[14px] text-green-700 dark:text-green-600">
                Trees Saved
              </div>
            </div>
          </div>
        </motion.div>

        {/* Detection Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-slate-800 rounded-[20px] shadow-lg p-8"
        >
          <h3 className="text-[24px] text-slate-900 dark:text-white mb-6">
            📊 Detection Summary
          </h3>

          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Categories Detected */}
            <div>
              <h4 className="text-slate-900 dark:text-white mb-3">
                Categories Detected:
              </h4>
              <p className="text-[15px] text-slate-600 dark:text-slate-400">
                • {categoryData.name}: 1 item
              </p>
            </div>

            {/* Confidence Statistics */}
            <div>
              <h4 className="text-slate-900 dark:text-white mb-3">
                Confidence Statistics:
              </h4>
              <div className="text-[15px] text-slate-600 dark:text-slate-400 space-y-1">
                <p>• Average: {result.confidence}%</p>
                <p>• Highest: {result.confidence}%</p>
                <p>• Lowest: {result.confidence}%</p>
              </div>
            </div>

            {/* Recyclability */}
            <div>
              <h4 className="text-slate-900 dark:text-white mb-3">
                Recyclability:
              </h4>
              <div className="text-[15px] space-y-1">
                <p className="text-emerald-600 dark:text-emerald-400">
                  • Recyclable: {categoryData.isRecyclable ? 1 : 0} items
                </p>
                <p className="text-red-600 dark:text-red-400">
                  • Non-recyclable: {categoryData.isRecyclable ? 0 : 1} items
                </p>
                <p className="text-slate-900 dark:text-white">
                  • Rate: {categoryData.isRecyclable ? '100' : '0'}%
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-6">
            <Button
              onClick={onTryAgain}
              variant="outline"
              className="h-[56px] px-10 border-2 border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-[12px]"
            >
              🔄 Scan Another Item
            </Button>
            <Button
              onClick={() => onTabChange("centers")}
              className="h-[56px] px-10 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-[12px] shadow-lg"
            >
              📍 Find Collection Centers
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
