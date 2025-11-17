import { useEffect, useRef, useState } from 'react';
import { X, Camera, RotateCcw, Zap, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'motion/react';
import { detectWasteType, getCompleteDetectionResult } from '../utils/wasteDetection';
import { detectWaste } from '../utils/api';

interface CameraModalProps {
  onClose: () => void;
  onCapture: (result: any) => void;
}

export function CameraModal({ onClose, onCapture }: CameraModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>('');
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
    
  }, []);

  const startCamera = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError('Camera not available on this device. Please use the upload option instead.');
        return;
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setError('');
    } catch (err: any) {
      console.error('Camera error:', err);
      
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError('Camera access denied. Please allow camera permissions in your browser settings and reload the page.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setError('No camera found on this device. Please use the upload option instead.');
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        setError('Camera is already in use by another application. Please close other apps and try again.');
      } else if (err.name === 'OverconstrainedError') {
        try {
          const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
          setStream(mediaStream);
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
          }
          setError('');
        } catch (retryErr) {
          setError('Unable to access camera. Please use the upload option instead.');
        }
      } else {
        setError('Unable to access camera. Please use the upload option instead.');
      }
    }
  };

  const dataURLtoFile = async (dataUrl: string, filename = `capture_${Date.now()}.jpg`) => {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return new File([blob], filename, { type: blob.type || 'image/jpeg' });
};

  const capturePhoto = () => {
    setIsCapturing(true);
    setCountdown(3);
    
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev === 1) {
          clearInterval(countdownInterval);
          performCapture();
          return null;
        }
        return prev! - 1;
      });
    }, 1000);
  };

  const performCapture = async () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg');
        
        try {
          // Use AI detection to identify waste type
          const detection = await detectWasteType(imageData);
          
          // Get complete result with all category information
          const completeResult = getCompleteDetectionResult(
            detection.wasteType,
            detection.confidence,
            detection.itemName,
            imageData
          );
                // --- START: optional backend detection (keeps original `completeResult`) ---
      setIsLoading(true);
      try {
        // convert the captured base64 image to File for backend upload
        const file = await dataURLtoFile(imageData);

        // call your FastAPI endpoint
        const backendRes = await detectWaste(file);

        // if backend returned a meaningful response, merge/overwrite sensible fields
        if (backendRes && backendRes.success !== false) {
          completeResult.wasteType = backendRes.waste_type || backendRes.wasteType || completeResult.wasteType;
          completeResult.confidence = backendRes.confidence ?? completeResult.confidence;
          completeResult.itemName = backendRes.item_name || backendRes.itemName || completeResult.itemName;
          completeResult.recyclable = backendRes.recyclable ?? completeResult.recyclable;
          completeResult.instructions = backendRes.instructions ?? completeResult.instructions;
          completeResult.backendRaw = backendRes;  // optional debug info
        }
      } catch (err) {
        console.warn("Backend detection failed or unreachable:", err);
      } finally {
        setIsLoading(false);
      }
      // --- END: optional backend detection ---
          
          onCapture(completeResult);
          if (stream) {
            stream.getTracks().forEach(track => track.stop());
          }
        } catch (error) {
          setError('Failed to detect waste type. Please try again.');
          setIsCapturing(false);
        }
      }
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/95 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="relative w-full max-w-[1000px] bg-slate-800 rounded-[24px] overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative bg-gradient-to-r from-sky-600 to-cyan-600 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Camera className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white">Smart Detection Camera</h3>
                <p className="text-[13px] text-sky-100">Position item in frame</p>
              </div>
            </div>
            
            <Button
              onClick={onClose}
              variant="ghost"
              size="icon"
              className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Camera Preview */}
          <div className="relative bg-black" style={{ aspectRatio: '16/9' }}>
            {error ? (
              <div className="absolute inset-0 flex items-center justify-center text-white text-center p-8">
                <div className="max-w-md">
                  <div className="w-20 h-20 mx-auto mb-6 bg-red-500/20 rounded-full flex items-center justify-center">
                    <Camera className="w-10 h-10 opacity-50" />
                  </div>
                  <p className="text-[18px] mb-6">{error}</p>
                  {error.includes('denied') && (
                    <div className="text-[14px] text-slate-300 space-y-2 bg-slate-800/50 rounded-2xl p-6">
                      <p className="text-sky-400 mb-3">To enable camera access:</p>
                      <ol className="text-left list-decimal list-inside space-y-2">
                        <li>Click the camera icon in your browser's address bar</li>
                        <li>Select "Allow" for camera permissions</li>
                        <li>Reload the page</li>
                      </ol>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                
                {/* Frame Guides */}
                <div className="absolute inset-0 pointer-events-none">
                  {/* Corner Brackets */}
                  <div className="absolute top-8 left-8 w-16 h-16 border-t-4 border-l-4 border-sky-400 rounded-tl-2xl" />
                  <div className="absolute top-8 right-8 w-16 h-16 border-t-4 border-r-4 border-sky-400 rounded-tr-2xl" />
                  <div className="absolute bottom-8 left-8 w-16 h-16 border-b-4 border-l-4 border-sky-400 rounded-bl-2xl" />
                  <div className="absolute bottom-8 right-8 w-16 h-16 border-b-4 border-r-4 border-sky-400 rounded-br-2xl" />
                  
                  {/* Center Guide */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="w-64 h-64 border-2 border-dashed border-sky-400/50 rounded-2xl" />
                  </div>
                  
                  {/* AI Ready Indicator */}
                  {!isCapturing && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-emerald-500/90 backdrop-blur-sm rounded-full"
                    >
                      <Zap className="w-4 h-4 text-white animate-pulse" />
                      <span className="text-[14px] text-white">AI Ready</span>
                    </motion.div>
                  )}
                </div>

                {/* Countdown Overlay */}
                <AnimatePresence>
                  {countdown !== null && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.5 }}
                      className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                    >
                      <motion.div
                        key={countdown}
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 180 }}
                        className="w-32 h-32 bg-gradient-to-br from-sky-500 to-cyan-500 rounded-full flex items-center justify-center shadow-2xl"
                      >
                        <span className="text-[64px] text-white">{countdown}</span>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
            <canvas ref={canvasRef} className="hidden" />
          </div>

          {/* Controls */}
          {!error && (
            <div className="p-6 bg-slate-800 flex justify-center gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={capturePhoto}
                  disabled={isCapturing}
                  className="h-[64px] px-12 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white rounded-[16px] shadow-xl shadow-sky-500/30 relative overflow-hidden group"
                >
                  <span className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
                  <Camera className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform" />
                  <span className="relative text-[18px]">
                    {isCapturing ? 'Capturing...' : 'Take Photo'}
                  </span>
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="h-[64px] px-8 border-2 border-slate-600 hover:border-slate-500 text-slate-300 hover:text-white rounded-[16px]"
                >
                  Cancel
                </Button>
              </motion.div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
