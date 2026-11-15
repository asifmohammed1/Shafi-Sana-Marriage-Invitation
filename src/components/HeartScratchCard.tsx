import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface HeartScratchCardProps {
  weekday: string;
  day: string;
  monthYear: string;
}

export const HeartScratchCard: React.FC<HeartScratchCardProps> = ({
  weekday,
  day,
  monthYear,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [scratchPct, setScratchPct] = useState(0);

  const width = 260;
  const height = 260;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Metallic gold foil surface
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#b38b40');
    grad.addColorStop(0.28, '#dfc07c');
    grad.addColorStop(0.55, '#c5a059');
    grad.addColorStop(0.8, '#e3c785');
    grad.addColorStop(1, '#9f7a34');

    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Subtle foil grain speckles
    for (let i = 0; i < 420; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      ctx.fillStyle =
        i % 2 === 0 ? 'rgba(255, 248, 225, 0.25)' : 'rgba(92, 74, 42, 0.16)';
      ctx.fillRect(x, y, 1.5, 1.5);
    }

    // Center hint typography on gold foil
    ctx.fillStyle = '#F9F0E0';
    ctx.textAlign = 'center';
    ctx.font = '600 11px Cinzel, Georgia, serif';
    ctx.fillText('SCRATCH TO', width / 2, height / 2 - 6);
    ctx.fillText('REVEAL DATE', width / 2, height / 2 + 12);
  }, []);

  const checkRevealProgress = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || revealed) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, width, height).data;
    let cleared = 0;
    let total = 0;
    for (let i = 3; i < imageData.length; i += 16) {
      total++;
      if (imageData[i] === 0) cleared++;
    }
    const pct = total > 0 ? Math.round((cleared / total) * 100) : 0;
    setScratchPct(pct);
    if (pct >= 42) {
      setRevealed(true);
    }
  }, [revealed]);

  const scratchAt = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * width;
    const y = ((clientY - rect.top) / rect.height) * height;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 34;

    if (lastPosRef.current) {
      ctx.beginPath();
      ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(x, y, 17, 0, Math.PI * 2);
      ctx.fill();
    }

    lastPosRef.current = { x, y };
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (revealed) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    isDrawingRef.current = true;
    lastPosRef.current = null;
    scratchAt(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || revealed) return;
    scratchAt(e.clientX, e.clientY);
  };

  const handlePointerUp = () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    lastPosRef.current = null;
    checkRevealProgress();
  };

  return (
    <div className="flex flex-col items-center">
      {/* Shared SVG Clip Path for Heart Shape */}
      <svg width="0" height="0" className="absolute pointer-events-none" aria-hidden="true">
        <defs>
          <clipPath id="heart-clip" clipPathUnits="objectBoundingBox">
            <path d="M0.5,0.92 C0.5,0.92 0.05,0.6 0.05,0.3 C0.05,0.1 0.35,0.05 0.5,0.25 C0.65,0.05 0.95,0.1 0.95,0.3 C0.95,0.6 0.5,0.92 0.5,0.92 Z" />
          </clipPath>
        </defs>
      </svg>

      <div
        className="relative w-[260px] h-[260px] select-none"
        style={{
          clipPath: 'url(#heart-clip)',
          WebkitClipPath: 'url(#heart-clip)',
        }}
      >
        {/* Revealed Nikah Date Content */}
        <div
          className="absolute inset-0 bg-[#F9F0E0] flex flex-col justify-center items-center text-center px-6"
          aria-live="polite"
        >
          <span className="gld-script text-2xl md:text-3xl leading-none capitalize text-[#806b43]">
            {weekday}
          </span>
          <span className="gld-cinzel text-5xl md:text-6xl font-bold leading-none text-[#806b43] my-1 tabular-nums">
            {day}
          </span>
          <span className="gld-script text-xl md:text-2xl leading-none capitalize text-[#806b43]">
            {monthYear}
          </span>
        </div>

        {/* Sweeping Metallic Foil Shine */}
        {!revealed && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="scratch-shine" />
          </div>
        )}

        {/* Scratchable Canvas */}
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className={`absolute inset-0 w-full h-full touch-none cursor-pointer transition-opacity duration-500 ${
            revealed ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        />

        {/* Heart Gold Border Overlay */}
        <svg
          viewBox="0 0 1 1"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full pointer-events-none z-30"
          aria-hidden="true"
        >
          <path
            d="M0.5,0.92 C0.5,0.92 0.05,0.6 0.05,0.3 C0.05,0.1 0.35,0.05 0.5,0.25 C0.65,0.05 0.95,0.1 0.95,0.3 C0.95,0.6 0.5,0.92 0.5,0.92 Z"
            fill="none"
            stroke="#c5a059"
            strokeWidth="4"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>

      {/* Accessible Reveal / Reset Control */}
      <div className="mt-4 flex flex-col items-center gap-1.5">
        {revealed ? (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-1.5 text-xs gld-cinzel tracking-[0.16em] uppercase text-[#806b43]"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Save the Date</span>
          </motion.div>
        ) : (
          <button
            type="button"
            onClick={() => setRevealed(true)}
            className="text-[11px] gld-cinzel uppercase tracking-[0.18em] text-[#806b43]/75 hover:text-[#806b43] underline underline-offset-4 cursor-pointer py-1 px-2"
          >
            {scratchPct > 0 ? `Keep scratching (${scratchPct}%) or tap to reveal` : 'Scratch heart or tap to reveal'}
          </button>
        )}
      </div>
    </div>
  );
};
