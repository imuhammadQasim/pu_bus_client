import React, { useState, useEffect } from 'react';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500);
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

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
          <div
            className="absolute bottom-[5px] left-0 w-[200%] h-[3px] animate-[roadMove_3s_linear_infinite]"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, #fbbf24 50%, transparent 100%)',
            }}
          />

          {/* Bus */}
          <div className="absolute bottom-5 animate-[busDrive_6s_linear_infinite]" style={{ left: '-120px' }}>
            <div className="w-24 h-12 bg-amber-400 rounded-lg relative">
              {/* Windows */}
              <div className="absolute top-2 left-2 right-2 h-5 bg-[#1e3a8a] rounded" />
              {/* Front Wheel */}
              <div className="absolute bottom-[-6px] left-4 w-4 h-4 bg-[#1e3a8a] rounded-full animate-[wheelRotate_1s_linear_infinite]" />
              {/* Rear Wheel */}
              <div className="absolute bottom-[-6px] right-4 w-4 h-4 bg-[#1e3a8a] rounded-full animate-[wheelRotate_1s_linear_infinite]" />
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center animate-[fadeInOut_2s_ease-out_0.5s_forwards] opacity-0">
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
