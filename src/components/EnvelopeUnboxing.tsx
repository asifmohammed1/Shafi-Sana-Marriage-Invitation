import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface EnvelopeUnboxingProps {
  brideName: string;
  groomName: string;
  swapNames: boolean;
  envelopeVideoUrl: string;
  onStart: () => void;
  onComplete: () => void;
}

type UnboxState = 'back' | 'opening' | 'revealed';

export const EnvelopeUnboxing: React.FC<EnvelopeUnboxingProps> = ({
  brideName,
  groomName,
  swapNames,
  envelopeVideoUrl,
  onStart,
  onComplete,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const completedRef = useRef(false);
  const [unboxState, setUnboxState] = useState<UnboxState>('back');

  const groomInitial = groomName?.charAt(0).toUpperCase() || 'O';
  const brideInitial = brideName?.charAt(0).toUpperCase() || 'A';

  const finishUnbox = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.muted = true;
    }
    setUnboxState('revealed');
    onComplete();
  };

  useEffect(() => {
    if (unboxState === 'opening' && videoRef.current) {
      videoRef.current.play().catch(() => {
        // Fallback if browser blocks unmuted video playback
        if (videoRef.current) {
          videoRef.current.muted = true;
          videoRef.current.play().catch(() => {
            window.setTimeout(finishUnbox, 800);
          });
        }
      });
    }
  }, [unboxState]);

  const handleUnbox = () => {
    if (unboxState !== 'back') return;
    onStart();
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(50);
    }
    setUnboxState('opening');
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#F9F0E0]"
    >
      <div
        onClick={unboxState === 'back' ? handleUnbox : undefined}
        className="relative w-full max-w-[430px] mx-auto h-full overflow-hidden shadow-2xl bg-[#F9F0E0] select-none"
      >
        {/* Envelope Opening Video */}
        <div className="absolute inset-0 w-full h-full z-10 bg-[#F9F0E0]">
          <video
            id="unbox-video"
            ref={videoRef}
            className="w-full h-full object-cover pointer-events-none"
            src={`${envelopeVideoUrl}#t=0.001`}
            playsInline
            muted
            preload="auto"
            onTimeUpdate={() => {
              const v = videoRef.current;
              if (!v || completedRef.current) return;
              if (v.duration > 0 && v.currentTime >= v.duration - 0.25) {
                finishUnbox();
              }
            }}
            onEnded={finishUnbox}
          />
        </div>

        {/* "Tap to open" prompt */}
        <AnimatePresence>
          {unboxState === 'back' && (
            <motion.div
              key="thumb-overlay"
              className="absolute inset-0 z-30 cursor-pointer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.5 } }}
            >
              <motion.div
                className="absolute z-40 inset-x-0 flex flex-col items-center gap-[7px]"
                style={{ top: '35%' }}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
              >
                <motion.span
                  className="gld-cinzel text-[11px] uppercase whitespace-nowrap"
                  style={{ color: 'rgba(140,100,60,0.85)', letterSpacing: '0.26em' }}
                  animate={{ opacity: [0.45, 1, 0.45] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                >
                  Tap to open
                </motion.span>
                <motion.div
                  style={{
                    width: 10,
                    height: 10,
                    borderRight: '1.5px solid rgba(140,100,60,0.65)',
                    borderTop: '1.5px solid rgba(140,100,60,0.65)',
                    rotate: '135deg',
                  }}
                  animate={{ y: [0, 5, 0], opacity: [0.55, 1, 0.55] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Embossed Initials on Golden Wax Seal */}
        <AnimatePresence>
          {(unboxState === 'back' || unboxState === 'opening') && (
            <div
              key="initials-container"
              className="absolute z-50 inset-x-0 flex justify-center pointer-events-none select-none"
              style={{ top: '52.5%', transform: 'translateY(-50%)' }}
            >
              <motion.div
                className="relative inline-flex items-center justify-center"
                style={{
                  fontSize: 'clamp(26px, 7vw, 38px)',
                  willChange: 'transform, opacity',
                }}
                initial={{ scale: 1, opacity: 1 }}
                animate={
                  unboxState === 'opening'
                    ? { scale: 3.5, opacity: 0 }
                    : { scale: 1, opacity: 1 }
                }
                transition={{ duration: 2.8, delay: 3.3, ease: [0.4, 0, 0.2, 1] }}
              >
                <span
                  className="gld-cinzel font-normal absolute inset-0 flex items-center justify-center z-0 -translate-y-[2%] pointer-events-none"
                  style={{ fontSize: '1.8em', color: '#8B6914', opacity: 0.5 }}
                >
                  &amp;
                </span>
                <span
                  className="gld-cinzel font-bold inline-flex items-center justify-center relative z-10"
                  style={{
                    color: '#8B6914',
                    textShadow:
                      '1px 1px 0px rgba(255, 255, 255, 0.6), -1px -1px 0px rgba(90, 60, 10, 0.7), 0px 4px 6px rgba(218, 165, 32, 0.5)',
                  }}
                >
                  <span className="inline-block">
                    {swapNames ? brideInitial : groomInitial}
                  </span>
                  <span className="inline-block mx-3" />
                  <span className="inline-block">
                    {swapNames ? groomInitial : brideInitial}
                  </span>
                </span>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Skip Button during video playback */}
        {unboxState === 'opening' && (
          <motion.button
            type="button"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            onClick={(e) => {
              e.stopPropagation();
              finishUnbox();
            }}
            className="absolute top-6 right-6 md:top-8 md:right-8 z-[100] px-4 py-2 bg-white/10 hover:bg-white/25 active:bg-white/30 backdrop-blur-md border border-white/30 rounded-full text-white text-xs md:text-sm font-medium tracking-[0.2em] uppercase transition-all hover:scale-105 active:scale-95 cursor-pointer pointer-events-auto select-none shadow-lg"
          >
            Skip
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};
