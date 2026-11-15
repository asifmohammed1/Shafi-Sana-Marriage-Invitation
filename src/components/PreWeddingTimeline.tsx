import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Info, MapPin } from 'lucide-react';
import { formatDisplayDate, type PreWeddingEvent } from '../data/invitationData';
import { PreWeddingEventIcon } from './OrnamentalSvg';

interface PreWeddingTimelineProps {
  title: string;
  events: PreWeddingEvent[];
  dividerSrc: string;
  roseSrc: string;
}

export const PreWeddingTimeline: React.FC<PreWeddingTimelineProps> = ({
  title,
  events,
  dividerSrc,
  roseSrc,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start center', 'end center'],
  });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  if (!events || events.length === 0) return null;

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center w-full max-w-[500px] mx-auto mb-12"
    >
      <h2 className="gld-script text-[40px] md:text-[46px] text-center text-[#806b43] mb-1">
        {title}
      </h2>
      <div className="flex justify-center mb-12 w-full">
        <img
          src={dividerSrc}
          alt="divider"
          className="h-[20px] md:h-[25px] object-contain opacity-90 drop-shadow-sm"
        />
      </div>

      <div className="relative w-full flex flex-col pt-6 pb-12">
        <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-[#806b43]/20 -translate-x-1/2 z-0" />
        <motion.div
          className="absolute top-0 left-1/2 w-[1px] bg-[#806b43] -translate-x-1/2 z-0"
          style={{ height: lineHeight }}
        />

        {/* Top diamond crown */}
        <div className="absolute -top-3 left-1/2 flex flex-col gap-1.5 items-center -translate-x-1/2 z-10">
          <div className="w-1.5 h-1.5 rotate-45 bg-[#806b43]" />
          <div className="w-1 h-1 rotate-45 bg-[#806b43]/70" />
        </div>

        {events.map((ev, idx) => (
          <div
            key={`${ev.title}-${idx}`}
            className="relative flex w-full items-center justify-between min-h-[120px] mb-8 z-10"
          >
            {/* Center Diamond Node */}
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center bg-[#F9F0E0] p-1 z-10">
              <div className="w-2.5 h-2.5 rotate-45 border border-[#806b43] bg-[#F9F0E0]" />
            </div>

            {/* Left Side: Time & Date */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-20% 0px -20% 0px' }}
              transition={{ duration: 0.8 }}
              className="w-1/2 flex flex-col items-end pr-4 md:pr-6 text-right"
            >
              <div className="gld-script text-[22px] md:text-[26px] text-[#806b43] whitespace-nowrap">
                {ev.time.toLowerCase()}
              </div>
              {ev.date && (
                <div className="font-sans text-[13px] md:text-[14px] text-[#806b43]/90 tabular-nums">
                  {formatDisplayDate(ev.date)}
                </div>
              )}
            </motion.div>

            {/* Right Side: Icon, Event Title, Venue, Message */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-20% 0px -20% 0px' }}
              transition={{ duration: 0.8 }}
              className="w-1/2 flex flex-col items-start pl-4 md:pl-6 text-left"
            >
              <PreWeddingEventIcon title={ev.title} />
              <h4 className="font-sans text-[16px] md:text-[17px] font-semibold text-[#806b43] tracking-wide leading-tight mb-2">
                {ev.title}
              </h4>
              {ev.venue && (
                <div className="flex items-start justify-start gap-2 text-[#806b43]/90 font-sans text-[12px] md:text-[13px]">
                  <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                  <span className="text-left">{ev.venue}</span>
                </div>
              )}
              {ev.message && (
                <div className="flex items-start justify-start gap-2 text-[#806b43]/80 font-sans text-[12px] italic mt-1.5">
                  <Info className="h-3 w-3 shrink-0 mt-0.5" />
                  <p className="text-left">"{ev.message}"</p>
                </div>
              )}
            </motion.div>
          </div>
        ))}

        {/* Scroll-linked traveling white rose */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 z-20 flex items-center justify-center p-1 bg-transparent"
          style={{ top: lineHeight, y: '-50%' }}
        >
          <img
            src={roseSrc}
            alt="decoration"
            className="w-[32px] h-[32px] object-contain opacity-100 drop-shadow-md"
          />
        </motion.div>

        {/* Bottom diamond end */}
        <div className="absolute -bottom-6 left-1/2 flex flex-col gap-1.5 items-center -translate-x-1/2 z-10 bg-[#F9F0E0] py-2">
          <div className="w-1 h-1 rotate-45 bg-[#806b43]/70" />
          <div className="w-1.5 h-1.5 rotate-45 bg-[#806b43]" />
          <div className="w-1 h-1 rotate-45 bg-[#806b43]/70" />
        </div>
      </div>
    </div>
  );
};
