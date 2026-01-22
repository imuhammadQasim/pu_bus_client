import React, { useState, useEffect, useRef } from 'react';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [showText, setShowText] = useState(false);
  const hasCompleted = useRef(false);

  useEffect(() => {
    // Show text after a brief delay
    const textTimer = setTimeout(() => setShowText(true), 500);
    
    const timer = setTimeout(() => {
      if (!hasCompleted.current) {
        hasCompleted.current = true;
        setIsVisible(false);
        setTimeout(onComplete, 500);
      }
    }, 3500);

    return () => {
      clearTimeout(timer);
      clearTimeout(textTimer);
    };
  }, []); // Empty dependency array - only run once

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center transition-opacity duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      style={{
        background: 'linear-gradient(135deg, #013f82 0%, #1e3a8a 100%)',
      }}
    >
      <div className="flex flex-col items-center gap-8">
        {/* Logo */}
        <div className="w-20 h-20 bg-white rounded-xl p-2 shadow-lg animate-pulse">
          <img
            src="https://pu.edu.pk/temp1/img/logo.png"
            alt="University of the Punjab Logo"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Bus Animation */}
        <div className="w-[70vw] max-w-lg h-20 bg-[#013f82] relative overflow-hidden rounded-xl">
          {/* Road */}
          <div className="absolute bottom-[5px] left-0 w-[200%] h-[3px]">
            <div className="w-full h-full bg-gradient-to-r from-transparent via-amber-400 to-transparent animate-[roadMove_2s_linear_infinite]" />
          </div>

          {/* Bus */}
          <div className="absolute bottom-5 animate-[busDrive_4s_linear_infinite]" style={{ left: '-120px' }}>
            <div className="w-24 h-12 bg-amber-400 rounded-lg relative shadow-lg">
              {/* Bus Body */}
              <div className="absolute inset-0 bg-gradient-to-b from-amber-300 to-amber-500 rounded-lg" />
              {/* Windows */}
              <div className="absolute top-2 left-2 right-2 h-5 bg-[#1e3a8a] rounded flex gap-1 p-0.5">
                <div className="flex-1 bg-sky-200/30 rounded-sm" />
                <div className="flex-1 bg-sky-200/30 rounded-sm" />
                <div className="flex-1 bg-sky-200/30 rounded-sm" />
              </div>
              {/* Front Light */}
              <div className="absolute right-1 top-8 w-2 h-2 bg-yellow-200 rounded-full shadow-[0_0_8px_rgba(255,255,0,0.6)]" />
              {/* Front Wheel */}
              <div className="absolute bottom-[-6px] left-4 w-5 h-5 bg-gray-800 rounded-full border-2 border-gray-600 animate-[wheelRotate_0.5s_linear_infinite]">
                <div className="absolute inset-1 border border-gray-500 rounded-full" />
              </div>
              {/* Rear Wheel */}
              <div className="absolute bottom-[-6px] right-4 w-5 h-5 bg-gray-800 rounded-full border-2 border-gray-600 animate-[wheelRotate_0.5s_linear_infinite]">
                <div className="absolute inset-1 border border-gray-500 rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Loading Bar */}
        <div className="w-[70vw] max-w-lg h-1 bg-[#1e3a8a] rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full animate-[loadingBar_3s_ease-in-out_forwards]" />
        </div>

        {/* Title */}
        <div className={`text-center transition-all duration-700 ${showText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <h1 className="font-poppins text-2xl md:text-4xl font-bold text-white mb-2">
            Punjab University Bus Routes
          </h1>
          <span className="text-lg text-slate-200 font-medium tracking-wide">
            Real-Time GIS Navigation System
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
