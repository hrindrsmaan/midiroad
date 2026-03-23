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
    <div className="w-full max-w-md mx-auto mt-12 mb-8">
      <div className="bg-white border-4 border-black p-6 rounded-[2rem] shadow-[8px_8px_0_0_#000] relative overflow-hidden group">
        
        {/* Animated Background Pulse (only when playing) */}
        {isPlaying && (
          <div className="absolute inset-0 bg-[#ff90e8]/5 animate-pulse pointer-events-none"></div>
        )}

        <div className="flex items-center gap-6 relative z-10">
          {/* Play/Pause Button */}
          <button
            onClick={togglePlay}
            className="w-16 h-16 rounded-full bg-[#ff90e8] border-4 border-black flex items-center justify-center shadow-[4px_4px_0_0_#000] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#000] active:translate-y-0 active:shadow-[2px_2px_0_0_#000] transition-all flex-shrink-0 group/btn"
          >
            {isPlaying ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="black" stroke="black" strokeWidth="2"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="black" stroke="black" strokeWidth="2" className="ml-1"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            )}
          </button>

          <div className="flex-1 text-left">
            <h4 className="text-[13px] font-black uppercase tracking-[0.2em] text-black/40 mb-1">
              {isPlaying ? "Now Playing" : "A Message for Producers"}
            </h4>
            <h3 className="text-xl font-black text-black tracking-tight leading-tight mb-3">
              Quick Message from <span className="text-[#ff90e8]">MidiRoad</span>
            </h3>
            
            {/* Progress Bar Container */}
            <div 
              className="h-4 w-full bg-[#f4f4f0] border-2 border-black rounded-full overflow-hidden cursor-pointer relative"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const clickedProgress = x / rect.width;
                if (audioRef.current) {
                  audioRef.current.currentTime = clickedProgress * audioRef.current.duration;
                }
              }}
            >
              <div 
                className="h-full bg-black transition-all duration-100 ease-linear rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Hidden Audio Element */}
        <audio
          ref={audioRef}
          src="/audio/demo.mp3" /* Instructions: Add demo.mp3 to public/audio/ folder */
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
        />

        {/* Bottom Label */}
        <div className="mt-4 pt-4 border-t-2 border-black/10 flex justify-end items-center px-1">
           <span className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-[#ff90e8]">
             <span className="w-1.5 h-1.5 rounded-full bg-[#ff90e8] animate-ping"></span>
             LIVE HQ PREVIEW
           </span>
        </div>
      </div>
      
      <p className="mt-4 text-[12px] font-bold text-black/50 uppercase tracking-widest text-center">
        Note: Actual kit includes 500+ individual files
      </p>
    </div>
  );
}
