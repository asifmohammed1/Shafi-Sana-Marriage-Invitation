import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { getTimelineImage, type TimelineItem } from '../data/invitationData';

interface WeddingTimelineProps {
  items: TimelineItem[];
  dividerSrc: string;
  roseSrc: string;
}

export const WeddingTimeline: React.FC<WeddingTimelineProps> = ({
  items,
  dividerSrc,
  roseSrc,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start center', 'end center'],
  });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center w-full max-w-[400px] mx-auto mb-12"
    >
      <h2 className="gld-script text-[40px] md:text-[46px] text-center text-[#806b43] mb-1">
        Wedding Timeline
      </h2>
      <div className="flex justify-center mb-12 w-full">
        <img
          src={dividerSrc}
          alt="divider"
          className="h-[20px] md:h-[25px] object-contain opacity-90 drop-shadow-sm"
        />
      </div>

      <div className="relative w-full flex flex-col pt-6 pb-12">
        {/* Background vertical line */}
        <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-[#806b43]/20 -translate-x-1/2 z-0" />

        {/* Scroll-animated vertical line */}
        <motion.div
          className="absolute top-0 left-1/2 w-[1px] bg-[#806b43] -translate-x-1/2 z-0"
          style={{ height: lineHeight }}
        />

        {/* Top diamonds */}
        <div className="absolute -top-3 left-1/2 flex flex-col gap-1.5 items-center -translate-x-1/2 z-10">
          <div className="w-1.5 h-1.5 rotate-45 bg-[#806b43]" />
          <div className="w-1 h-1 rotate-45 bg-[#806b43]/70" />
        </div>

        {items.map((item, idx) => {
          const isEven = idx % 2 === 0;
          const imgSrc = getTimelineImage(item.event);

          return (
            <div
              key={`${item.time}-${item.event}`}
              className="relative flex w-full items-center justify-between min-h-[120px] mb-6 z-10"
            >
              {/* Center Diamond */}
              <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center bg-[#F9F0E0] p-1 z-10">
                <div className="w-2.5 h-2.5 rotate-45 border border-[#806b43] bg-[#F9F0E0]" />
              </div>

              {/* Left Half */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-20% 0px -20% 0px' }}
                transition={{ duration: 0.8 }}
                className="w-1/2 flex flex-col items-center pr-2 md:pr-4 text-center"
              >
                {isEven ? (
                  <img
                    src={imgSrc}
                    alt={item.event}
                    className="w-[140px] h-[140px] md:w-[160px] md:h-[160px] object-contain opacity-90 drop-shadow-sm mix-blend-multiply"
                  />
                ) : (
                  <>
                    <div className="gld-script text-[22px] md:text-[26px] text-[#806b43] whitespace-nowrap">
                      {item.time.toLowerCase()}
                    </div>
                    <div className="font-sans text-[16px] md:text-[17px] font-semibold text-[#806b43] tracking-wide -mt-1">
                      {item.event}
                    </div>
                  </>
                )}
              </motion.div>

              {/* Right Half */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-20% 0px -20% 0px' }}
                transition={{ duration: 0.8 }}
                className="w-1/2 flex flex-col items-center pl-2 md:pl-4 text-center"
              >
                {isEven ? (
                  <>
                    <div className="gld-script text-[22px] md:text-[26px] text-[#806b43] whitespace-nowrap">
                      {item.time.toLowerCase()}
                    </div>
                    <div className="font-sans text-[16px] md:text-[17px] font-semibold text-[#806b43] tracking-wide -mt-1">
                      {item.event}
                    </div>
                  </>
                ) : (
                  <img
                    src={imgSrc}
                    alt={item.event}
                    className="w-[140px] h-[140px] md:w-[160px] md:h-[160px] object-contain opacity-90 drop-shadow-sm mix-blend-multiply"
                  />
                )}
              </motion.div>
            </div>
          );
        })}

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

        {/* Bottom diamonds */}
        <div className="absolute -bottom-6 left-1/2 flex flex-col gap-1.5 items-center -translate-x-1/2 z-10 bg-[#F9F0E0] py-2">
          <div className="w-1 h-1 rotate-45 bg-[#806b43]/70" />
          <div className="w-1.5 h-1.5 rotate-45 bg-[#806b43]" />
          <div className="w-1 h-1 rotate-45 bg-[#806b43]/70" />
        </div>
      </div>
    </div>
  );
};
