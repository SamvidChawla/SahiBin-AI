import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { Dashboard } from './components/Dashboard';
import { MissionStatement } from './components/MissionStatement';
import { Footer } from './components/Footer';
import { CameraModal } from './components/CameraModal';
import { UploadInterface } from './components/UploadInterface';
import { TabNavigation } from './components/TabNavigation';
import { DetectionDetailsPage } from './components/DetectionDetailsPage';
import { DisposalGuideTabPage } from './components/DisposalGuideTabPage';
import { AnalyticsPage } from './components/AnalyticsPage';
import { CollectionCentersPageNew } from './components/CollectionCentersPageNew';
import { EnvironmentalImpactPage } from './components/EnvironmentalImpactPage';

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'results'>('home');
  const [activeTab, setActiveTab] = useState('detection');
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [showUploadInterface, setShowUploadInterface] = useState(false);
  const [detectionResult, setDetectionResult] = useState<any>(null);
  
  const [stats, setStats] = useState({
    itemsDetected: 0,
    recyclable: 0,
    recyclingRate: 0,
    co2Saved: 0,
    energySaved: 0
  });

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handleNavigate = (page: string) => {
    if (page === 'home') {
      setCurrentView('home');
    } else if (page === 'dashboard') {
      setCurrentView('home');
      // Scroll to dashboard section
      setTimeout(() => {
        const dashboardSection = document.getElementById('dashboard-section');
        if (dashboardSection) {
          dashboardSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const handleTakePhoto = () => {
    setShowCameraModal(true);
  };

  const handleUploadImage = () => {
    setShowUploadInterface(true);
  };

  const handleDetection = (result: any) => {
    setDetectionResult(result);
    setCurrentView('results');
    setActiveTab('detection');
    setShowCameraModal(false);
    setShowUploadInterface(false);
    
    // Update stats
    setStats(prev => ({
      itemsDetected: prev.itemsDetected + 1,
      recyclable: result.isRecyclable ? prev.recyclable + 1 : prev.recyclable,
      recyclingRate: Math.round(((result.isRecyclable ? prev.recyclable + 1 : prev.recyclable) / (prev.itemsDetected + 1)) * 100),
      co2Saved: prev.co2Saved + (result.co2Impact || 0),
      energySaved: prev.energySaved + (result.energyImpact || 0)
    }));
  };

  const handleTryAgain = () => {
    setCurrentView('home');
    setDetectionResult(null);
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-100 dark:bg-slate-900 transition-colors duration-300">
        <Navbar 
          darkMode={darkMode} 
          toggleDarkMode={toggleDarkMode}
          currentPage={currentView}
          onNavigate={handleNavigate}
        />
        
        {currentView === 'home' && (
          <>
            <HeroSection 
              onTakePhoto={handleTakePhoto}
              onUploadImage={handleUploadImage}
            />
            <div id="dashboard-section">
              <Dashboard stats={stats} />
            </div>
            <MissionStatement />
          </>
        )}

        {currentView === 'results' && detectionResult && (
          <div className="pt-[75px]">
            <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
            
            <div className="pb-20">
              {activeTab === 'detection' && (
                <DetectionDetailsPage 
                  result={detectionResult}
                  onTryAgain={handleTryAgain}
                  onTabChange={setActiveTab}
                />
              )}
              
              {activeTab === 'disposal' && (
                <DisposalGuideTabPage 
                wasteType={detectionResult.wasteType}
                onNavigateTab={setActiveTab} // switches tabs
                onScrollToSection={(sectionId) => {
                  const el = document.getElementById(sectionId);
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}/>
              )}
              
              {activeTab === 'analytics' && (
                <AnalyticsPage />
              )}
              
              {activeTab === 'centers' && (
                <CollectionCentersPageNew />
              )}
              
              {activeTab === 'impact' && (
                <EnvironmentalImpactPage />
              )}
            </div>
          </div>
        )}

        <Footer />

        {showCameraModal && (
          <CameraModal 
            onClose={() => setShowCameraModal(false)}
            onCapture={handleDetection}
          />
        )}

        {showUploadInterface && (
          <UploadInterface 
            onClose={() => setShowUploadInterface(false)}
            onUpload={handleDetection}
          />
        )}
      </div>
    </div>
  );
}
