"use client";

import { useState, useRef, useEffect } from "react";

export function AudioDemo() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      setProgress((current / duration) * 100);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(0);
  };

  return (
    <div className="w-full max-w-[280px] mx-auto mt-2 mb-2">
      <div className="bg-white border-2 border-black p-1.5 rounded-lg shadow-[2px_2px_0_0_#000] relative overflow-hidden group">
        
        {/* Animated Background Pulse */}
        {isPlaying && (
          <div className="absolute inset-0 bg-[#ff90e8]/10 animate-pulse pointer-events-none"></div>
        )}

        <div className="flex items-center gap-4 relative z-10">
          {/* Play/Pause Button */}
          <button
            onClick={togglePlay}
            className="w-8 h-8 rounded-full bg-[#ff90e8] border-2 border-black flex items-center justify-center shadow-[1px_1px_0_0_#000] hover:-translate-y-0.5 transition-all flex-shrink-0"
          >
            {isPlaying ? (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="black" stroke="black" strokeWidth="2"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="black" stroke="black" strokeWidth="2" className="ml-0.5"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            )}
          </button>

          <div className="flex-1">
            <div className="flex justify-between items-center mb-1.5">
              <h3 className="text-[12px] font-black text-black tracking-tight leading-none">
                Message from <span className="text-[#ff90e8]">MidiRoad</span>
              </h3>
              <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-[#ff90e8]">
                <span className="w-1 h-1 rounded-full bg-[#ff90e8] animate-ping"></span>
                LIVE
              </span>
            </div>
            
            {/* Minimal Progress Bar */}
            <div 
              className="h-2 w-full bg-[#f4f4f0] border-2 border-black rounded-full overflow-hidden cursor-pointer relative"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                if (audioRef.current) audioRef.current.currentTime = (x / rect.width) * audioRef.current.duration;
              }}
            >
              <div 
                className="h-full bg-black transition-all duration-100 ease-linear"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        <audio
          ref={audioRef}
          src="/audio/demo.mp3"
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
        />
      </div>
    </div>
  );
}
