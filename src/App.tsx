import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  BedDouble,
  Bus,
  ChevronDown,
  Gift,
  MapPin,
  Shirt,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { INVITATION_DATA, getCalendarParts } from './data/invitationData';
import { useAmbientAudio } from './components/AmbientAudio';
import { EnvelopeUnboxing } from './components/EnvelopeUnboxing';
import { HeartScratchCard } from './components/HeartScratchCard';
import { WeddingTimeline } from './components/WeddingTimeline';
import { RsvpSection } from './components/RsvpSection';

function SectionBlock({
  children,
  className = '',
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={`relative flex flex-col items-center bg-[#F9F0E0] text-[#806b43] w-full py-10 md:py-12 overflow-hidden ${className}`}
    >
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 md:px-8">{children}</div>
    </section>
  );
}

export default function App() {
  const data = INVITATION_DATA;
  const [isOpened, setIsOpened] = useState(false);

  const { audioRef, isMuted, startMusic, playMusic, toggleMusic } = useAmbientAudio({
    musicUrl: data.musicUrl,
    useMusic: true,
    isOpen: isOpened,
  });

  const calendarParts = getCalendarParts(data.eventDate);
  const firstPerson = data.swapNames ? data.brideName : data.groomName;
  const secondPerson = data.swapNames ? data.groomName : data.brideName;

  const firstFormalName = data.swapNames ? data.brideFormalName : data.groomFormalName;
  const firstGuardian = data.swapNames ? data.brideGuardianText : data.groomGuardianText;
  const firstParents = data.swapNames ? data.brideParents : data.groomParents;

  const secondFormalName = data.swapNames ? data.groomFormalName : data.brideFormalName;
  const secondGuardian = data.swapNames ? data.groomGuardianText : data.brideGuardianText;
  const secondParents = data.swapNames ? data.groomParents : data.brideParents;

  const maxNameLen = Math.max(data.brideName.length, data.groomName.length);
  const heroNameSize =
    maxNameLen > 15
      ? 'text-[24px] md:text-[30px]'
      : maxNameLen > 10
      ? 'text-[30px] md:text-[38px]'
      : 'text-[38px] md:text-[46px]';
  const heroAmpSize =
    maxNameLen > 15
      ? 'text-[16px] md:text-[20px]'
      : maxNameLen > 10
      ? 'text-[20px] md:text-[24px]'
      : 'text-[24px] md:text-[30px]';

  return (
    <div
      style={{ colorScheme: 'only light' }}
      className={`min-h-screen bg-[#F9F0E0] text-[#806b43] selection:bg-[#806b43] selection:text-[#F9F0E0] overflow-x-hidden ${
        !isOpened ? 'h-screen overflow-hidden' : ''
      }`}
    >
      <audio
        ref={audioRef}
        src={data.musicUrl}
        loop
        playsInline
        preload="auto"
      />

      {/* Envelope Unboxing */}
      <AnimatePresence>
        {!isOpened && (
          <EnvelopeUnboxing
            brideName={data.brideName}
            groomName={data.groomName}
            swapNames={data.swapNames}
            envelopeVideoUrl={data.assets.envelopeVideo}
            onStart={startMusic}
            onComplete={() => {
              setIsOpened(true);
              playMusic();
            }}
          />
        )}
      </AnimatePresence>

      {/* Main Invitation Container */}
      {isOpened && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="w-full max-w-[480px] mx-auto relative min-h-screen shadow-2xl bg-[#F9F0E0]"
        >
          {/* Floating Audio Toggle */}
          <button
            type="button"
            onClick={toggleMusic}
            aria-label={isMuted ? 'Unmute background music' : 'Mute background music'}
            className="fixed top-6 right-6 z-[999] w-12 h-12 bg-[#F9F0E0]/80 backdrop-blur-md border border-[#806b43]/30 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-all cursor-pointer"
          >
            {isMuted ? (
              <VolumeX className="h-5 w-5 text-[#806b43]" />
            ) : (
              <Volume2 className="h-5 w-5 text-[#806b43]" />
            )}
          </button>

          {/* 1. Hero Section */}
          <section
            id="nikah-invitation-main"
            style={{ colorScheme: 'only light' }}
            className="relative z-50 w-full aspect-[9/16] flex flex-col items-center justify-start pt-24 bg-[#F9F0E0]"
          >
            <video
              src={data.assets.heroVideo}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="absolute inset-0 w-full h-full object-cover z-0"
            />

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.5 }}
              className="relative z-20 flex flex-col items-center justify-center px-6 text-center text-[#806b43] mt-[90px] w-full"
            >
              <div className="flex flex-col items-center mb-6">
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                  className="whitespace-pre-line gld-cinzel text-[9px] md:text-[10px] tracking-[0.2em] uppercase text-[#806b43] mb-1 leading-relaxed max-w-[160px] md:max-w-[180px] font-bold"
                >
                  {data.inviteTitle}
                </motion.p>

                <div className="flex flex-col items-center mt-3 relative w-full gap-2 md:gap-3">
                  <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.5, delay: 1.4 }}
                    className={`gld-script ${heroNameSize} leading-none drop-shadow-sm max-w-[90vw] text-center`}
                  >
                    {firstPerson}
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.5, delay: 1.7 }}
                    className={`gld-script ${heroAmpSize} opacity-80 leading-none`}
                  >
                    &amp;
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.5, delay: 2 }}
                    className={`gld-script ${heroNameSize} leading-none drop-shadow-sm max-w-[90vw] text-center`}
                  >
                    {secondPerson}
                  </motion.span>
                </div>
              </div>
            </motion.div>

            <div className="absolute -bottom-6 w-full h-28 md:h-[20%] bg-gradient-to-t from-[#F9F0E0] via-[#F9F0E0]/80 to-transparent z-10 pointer-events-none" />

            <motion.div
              className="absolute -bottom-[3%] -left-[8%] w-[48%] z-50 pointer-events-none"
              animate={{ rotate: [-2, 2, -2], scale: [1, 1.03, 1] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              style={{ transformOrigin: 'bottom right' }}
            >
              <img
                src={data.assets.flowerCorner3}
                alt="flower"
                className="w-full h-auto object-contain"
              />
            </motion.div>
            <motion.div
              className="absolute -bottom-[3%] -right-[8%] w-[48%] z-50 pointer-events-none"
              animate={{ rotate: [2, -2, 2], scale: [1, 1.03, 1] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              style={{ transformOrigin: 'bottom left' }}
            >
              <img
                src={data.assets.flowerCorner3}
                alt="flower"
                className="w-full h-auto object-contain scale-x-[-1]"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5 }}
              className="absolute bottom-8 flex flex-col items-center gap-1 z-20 text-[#806b43] drop-shadow-[0_1px_3px_rgba(249,240,224,0.9)]"
            >
              <span className="gld-script text-xl tracking-wide opacity-90 font-bold">
                Scroll down
              </span>
              <motion.div
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <ChevronDown className="w-5 h-5 opacity-90" strokeWidth={2} />
              </motion.div>
            </motion.div>
          </section>

          {/* 2. Quranic Welcome Message Card */}
          <SectionBlock>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="w-full max-w-[95%] mx-auto relative mt-12 mb-8"
            >
              <div className="w-full rounded-[24px] border-[2px] border-[#806b43]/50 relative z-10 shadow-sm bg-[#F9F0E0] py-6 px-4 flex items-center justify-center">
                <p
                  dir="rtl"
                  lang="ar"
                  className="font-arabic text-[22px] md:text-[26px] text-[#806b43] leading-relaxed text-center"
                >
                  {data.welcomeMessageArabic}
                </p>
              </div>
              <img
                src={data.assets.cardBorder}
                alt="border top"
                className="absolute -top-[28px] left-1/2 -translate-x-1/2 w-[50%] h-auto object-contain z-20 pointer-events-none"
              />
              <img
                src={data.assets.cardBorder}
                alt="border bottom"
                className="absolute -bottom-[28px] left-1/2 -translate-x-1/2 w-[50%] h-auto object-contain z-20 pointer-events-none rotate-180"
              />
            </motion.div>
          </SectionBlock>

          {/* 3. Couple Welcome Image */}
          <SectionBlock>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="w-full max-w-md mx-auto relative z-10 flex flex-col items-center"
            >
              <div className="w-full max-w-[85%] aspect-[4/5] rounded-[24px] border-[4px] border-[#806b43]/60 overflow-hidden relative shadow-md bg-[#F9F0E0]">
                <img
                  src={data.assets.welcomeImage}
                  alt="Welcome"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </SectionBlock>

          {/* 4. Formal Golden Arch Invitation Card */}
          <section className="relative flex flex-col items-center bg-[#F9F0E0] text-[#806b43] w-full py-10 md:py-12 overflow-hidden">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative w-full mx-auto flex flex-col items-center justify-center"
            >
              <img
                src={data.assets.archFrame}
                alt="arch"
                className="w-full h-auto object-contain z-0 pointer-events-none block"
              />
              <motion.div
                className="absolute bottom-0 -left-[15%] w-[48%] z-30 pointer-events-none"
                animate={{ rotate: [-2, 2, -2], scale: [1, 1.03, 1] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                style={{ transformOrigin: 'bottom right' }}
              >
                <img
                  src={data.assets.flowerCorner2}
                  alt="flower"
                  className="w-full h-auto object-contain -rotate-90"
                />
              </motion.div>
              <motion.div
                className="absolute bottom-0 -right-[15%] w-[48%] z-30 pointer-events-none"
                animate={{ rotate: [2, -2, 2], scale: [1, 1.03, 1] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                style={{ transformOrigin: 'bottom left' }}
              >
                <img
                  src={data.assets.flowerCorner2}
                  alt="flower"
                  className="w-full h-auto object-contain scale-x-[-1] rotate-90"
                />
              </motion.div>

              <div className="absolute inset-x-0 top-[20%] sm:top-[20.5%] bottom-[4%] z-20 flex flex-col items-center justify-start w-full text-center px-4">
                <div className="flex flex-col items-center justify-start w-full max-w-[72%] sm:max-w-[68%]">
                  <img
                    src={data.assets.bismillah}
                    alt="Bismillah"
                    className="w-[110px] sm:w-[125px] md:w-[135px] h-auto object-contain mb-2 sm:mb-2.5 opacity-90"
                  />

                  <div className="flex flex-col items-center w-full max-w-[220px] sm:max-w-[240px] mx-auto mb-1.5 sm:mb-2">
                    <p className="whitespace-pre-line gld-cinzel text-[8.5px] sm:text-[9.5px] tracking-[0.2em] uppercase text-[#806b43] mb-1 leading-relaxed font-bold">
                      {data.inviteTitle}
                    </p>
                  </div>

                  <h3 className="gld-script text-[32px] sm:text-[36px] md:text-[40px] text-[#806b43] mt-1 sm:mt-2 mb-0 leading-tight drop-shadow-sm">
                    {firstFormalName}
                  </h3>
                  <img
                    src={data.assets.divider}
                    alt="divider"
                    className="w-[45px] h-auto object-contain opacity-70 mb-1.5 mt-0.5"
                  />
                  <p className="gld-cinzel text-[8px] sm:text-[8.5px] uppercase tracking-[0.2em] text-[#806b43] mb-0.5">
                    {firstGuardian}
                  </p>
                  <p className="gld-cinzel text-[8.5px] sm:text-[9.5px] uppercase tracking-[0.15em] text-[#806b43] mb-2 font-bold">
                    {firstParents}
                  </p>

                  <p className="gld-script text-[22px] sm:text-[25px] text-[#806b43] mb-1 opacity-90 drop-shadow-sm">
                    With
                  </p>

                  <h3 className="gld-script text-[32px] sm:text-[36px] md:text-[40px] text-[#806b43] mb-0 leading-tight drop-shadow-sm">
                    {secondFormalName}
                  </h3>
                  <img
                    src={data.assets.divider}
                    alt="divider"
                    className="w-[45px] h-auto object-contain opacity-70 mb-1.5 mt-0.5"
                  />
                  <p className="gld-cinzel text-[8px] sm:text-[8.5px] uppercase tracking-[0.2em] text-[#806b43] mb-0.5">
                    {secondGuardian}
                  </p>
                  <p className="gld-cinzel text-[8.5px] sm:text-[9.5px] uppercase tracking-[0.15em] text-[#806b43] mb-3 font-bold">
                    {secondParents}
                  </p>

                  <p className="gld-script text-[22px] sm:text-[25px] text-[#806b43] mb-1 opacity-90 drop-shadow-sm">
                    Dear Friends and Family
                  </p>
                  <p className="font-sans text-[10.5px] sm:text-[11.5px] text-[#806b43] leading-relaxed max-w-[95%] opacity-90 whitespace-pre-line">
                    {data.inviteParagraph}
                  </p>
                </div>
              </div>
            </motion.div>
          </section>

          {/* 5. Interactive Heart Scratch-Off Reveal */}
          <SectionBlock>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center"
            >
              <h2 className="gld-script text-[40px] md:text-[46px] text-center text-[#806b43] mb-1">
                {data.revealTitle}
              </h2>
              <div className="flex justify-center mb-3 w-full">
                <img
                  src={data.assets.divider}
                  alt="divider"
                  className="h-[20px] md:h-[25px] object-contain opacity-90 drop-shadow-sm"
                />
              </div>
              <HeartScratchCard
                weekday={calendarParts.weekday}
                day={calendarParts.day}
                monthYear={calendarParts.monthYear}
              />
            </motion.div>
          </SectionBlock>

          {/* 6. Wedding Events */}
          <SectionBlock>
            <WeddingTimeline
              items={data.programTimeline}
              dividerSrc={data.assets.divider}
              roseSrc={data.assets.whiteRose}
            />
          </SectionBlock>

          {/* 8. Primary Venue (Nikah: Laxmi Bavani Gardens) */}
          <SectionBlock>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="w-full flex flex-col items-center text-center"
            >
              <h2 className="gld-script text-[40px] md:text-[46px] text-center text-[#806b43] mb-1">
                {data.primaryMapTitle}
              </h2>
              <div className="flex justify-center mb-8 w-full">
                <img
                  src={data.assets.divider}
                  alt="divider"
                  className="h-[20px] md:h-[25px] object-contain opacity-90 drop-shadow-sm"
                />
              </div>

              <div className="mb-8 flex flex-col items-center">
                <h3 className="gld-cinzel font-bold text-2xl md:text-3xl tracking-widest text-[#806b43] mb-1">
                  {data.venueName}
                </h3>
                <p className="gld-cinzel text-xs uppercase tracking-[0.2em] text-[#806b43]/75 mb-2">
                  {data.venueAddress}
                </p>
                <p className="font-sans text-xs md:text-sm text-[#806b43]/80 tracking-wide">
                  Sunday, 03 Jan 2027 · {data.eventTime}
                </p>
              </div>

              <div className="w-full max-w-[90%] md:max-w-md relative mb-12">
                <div className="w-full aspect-[4/3] rounded-[24px] border-[2px] border-[#806b43]/50 overflow-hidden relative z-10 shadow-sm bg-[#F9F0E0]">
                  <iframe
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(
                      data.venueCoords
                    )}&ll=${encodeURIComponent(data.venueCoords)}&t=k&z=18&ie=UTF8&output=embed`}
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    title="Nikah Venue Satellite Map Preview"
                    className="w-full h-full"
                  />
                </div>
                <img
                  src={data.assets.cardBorder}
                  alt="border top"
                  className="absolute -top-[34px] left-1/2 -translate-x-1/2 w-[55%] h-auto object-contain z-20 pointer-events-none"
                />
                <img
                  src={data.assets.cardBorder}
                  alt="border bottom"
                  className="absolute -bottom-[34px] left-1/2 -translate-x-1/2 w-[55%] h-auto object-contain z-20 pointer-events-none rotate-180"
                />
              </div>

              <a
                href={data.googleMapLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-3 w-full max-w-[250px] py-4 border border-[#806b43] text-[#F9F0E0] bg-[#806b43] hover:bg-transparent hover:text-[#806b43] transition-colors gld-cinzel text-[13px] uppercase tracking-widest shadow-md"
              >
                <MapPin className="w-4 h-4" />
                <span>View Map</span>
              </a>
            </motion.div>
          </SectionBlock>

          {/* 9. Secondary Venue (Valima: Taj Convention) */}
          {data.useSecondaryMap && (
            <SectionBlock>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="w-full flex flex-col items-center text-center"
              >
                <h2 className="gld-script text-[40px] md:text-[46px] text-center text-[#806b43] mb-1">
                  {data.secondaryMapTitle}
                </h2>
                <div className="flex justify-center mb-8 w-full">
                  <img
                    src={data.assets.divider}
                    alt="divider"
                    className="h-[20px] md:h-[25px] object-contain opacity-90 drop-shadow-sm"
                  />
                </div>

                <div className="mb-8 flex flex-col items-center">
                  <h3 className="gld-cinzel font-bold text-2xl md:text-3xl tracking-widest text-[#806b43] mb-1">
                    {data.secondaryMapVenueName}
                  </h3>
                  <p className="gld-cinzel text-xs uppercase tracking-[0.2em] text-[#806b43]/75 mb-2">
                    {data.secondaryMapAddress}
                  </p>
                  <p className="font-sans text-xs md:text-sm text-[#806b43]/80 tracking-wide">
                    Monday, 04 Jan 2027 · {data.secondaryEventTime}
                  </p>
                </div>

                <div className="w-full max-w-[90%] md:max-w-md relative mb-12">
                  <div className="w-full aspect-[4/3] rounded-[24px] border-[2px] border-[#806b43]/50 overflow-hidden relative z-10 shadow-sm bg-[#F9F0E0]">
                    <iframe
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(
                        data.secondaryVenueCoords
                      )}&ll=${encodeURIComponent(data.secondaryVenueCoords)}&t=k&z=18&ie=UTF8&output=embed`}
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      title="Valima Venue Satellite Map Preview"
                      className="w-full h-full"
                    />
                  </div>
                  <img
                    src={data.assets.cardBorder}
                    alt="border top"
                    className="absolute -top-[34px] left-1/2 -translate-x-1/2 w-[55%] h-auto object-contain z-20 pointer-events-none"
                  />
                  <img
                    src={data.assets.cardBorder}
                    alt="border bottom"
                    className="absolute -bottom-[34px] left-1/2 -translate-x-1/2 w-[55%] h-auto object-contain z-20 pointer-events-none rotate-180"
                  />
                </div>

                <a
                  href={data.secondaryMapLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-3 w-full max-w-[250px] py-4 border border-[#806b43] text-[#F9F0E0] bg-[#806b43] hover:bg-transparent hover:text-[#806b43] transition-colors gld-cinzel text-[13px] uppercase tracking-widest shadow-md"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Get Directions</span>
                </a>
              </motion.div>
            </SectionBlock>
          )}

          {/* 10. Guest Logistics */}
          <SectionBlock>
            <div className="w-full max-w-2xl mx-auto space-y-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center"
              >
                <Shirt className="w-8 h-8 mb-4 text-[#806b43] opacity-80" />
                <h3 className="gld-cinzel font-bold text-xl uppercase tracking-widest mb-3">
                  Attire
                </h3>
                <p className="font-sans text-sm opacity-80 max-w-[250px] leading-relaxed whitespace-pre-line">
                  {data.dressCode}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center"
              >
                <Bus className="w-8 h-8 mb-4 text-[#806b43] opacity-80" />
                <h3 className="gld-cinzel font-bold text-xl uppercase tracking-widest mb-3">
                  Transportation
                </h3>
                <p className="font-sans text-sm opacity-80 max-w-[250px] leading-relaxed whitespace-pre-line">
                  {data.transportation}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center"
              >
                <BedDouble className="w-8 h-8 mb-4 text-[#806b43] opacity-80" />
                <h3 className="gld-cinzel font-bold text-xl uppercase tracking-widest mb-3">
                  Accommodation
                </h3>
                <p className="font-sans text-sm opacity-80 max-w-[250px] leading-relaxed whitespace-pre-line">
                  {data.accommodation}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center"
              >
                <Gift className="w-8 h-8 mb-4 text-[#806b43] opacity-80" />
                <h3 className="gld-cinzel font-bold text-xl uppercase tracking-widest mb-3">
                  Blessings
                </h3>
                <p className="font-sans text-sm opacity-80 max-w-[250px] leading-relaxed whitespace-pre-line">
                  {data.giftMessage}
                </p>
              </motion.div>
            </div>
          </SectionBlock>

          {/* 11. Smart RSVP */}
          <SectionBlock className="!pb-32">
            <RsvpSection
              mainEventTitle={data.eventType}
              mainEventDate={data.eventDate}
              mainEventTime={data.eventTime}
              mainEventVenue={data.venueName}
              secondaryEventTitle={data.secondaryMapTitle}
              secondaryEventDate={data.secondaryEventDate}
              secondaryEventTime={data.secondaryEventTime}
              secondaryEventVenue={data.secondaryMapVenueName}
              preWeddingEvents={data.preWeddingEvents}
              initialCount={data.initialRsvpCount}
            />
          </SectionBlock>

          {/* 12. Closing & Footer */}
          <SectionBlock className="!py-24 !pb-32 !overflow-visible">
            <div className="flex flex-col items-center text-center w-full max-w-md mx-auto relative z-10">
              <p className="gld-cinzel text-xs tracking-widest uppercase opacity-80 mb-12 text-center max-w-[280px] leading-relaxed text-[#806b43] whitespace-pre-line">
                {data.closingMessage}
              </p>

              <div className="space-y-1 w-full mx-auto">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="flex flex-col items-center justify-center gld-script text-4xl md:text-5xl capitalize text-[#806b43]"
                >
                  <span>{firstPerson}</span>
                  <span className="text-2xl opacity-80 my-0 gld-cinzel">&amp;</span>
                  <span>{secondPerson}</span>
                </motion.div>
                <span className="font-sans text-[8px] uppercase tracking-[0.3em] text-[#806b43]/60 font-black block mt-4">
                  Bound In Pair • {calendarParts.year}
                </span>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="pt-14 flex flex-col items-center gap-4 relative z-10 w-full"
              >
                <div className="h-px w-12 bg-[#806b43]/30" />
                <p className="gld-script text-2xl sm:text-3xl text-[#806b43]/90">
                  {data.footerLoveNote}
                </p>
              </motion.div>
            </div>

            <motion.div
              className="absolute bottom-6 -left-[8%] w-[48%] z-50 pointer-events-none"
              animate={{ rotate: [-2, 2, -2], scale: [1, 1.03, 1] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              style={{ transformOrigin: 'bottom right' }}
            >
              <img
                src={data.assets.flowerCorner3}
                alt="flower"
                className="w-full h-auto object-contain"
              />
            </motion.div>
            <motion.div
              className="absolute bottom-6 -right-[8%] w-[48%] z-50 pointer-events-none"
              animate={{ rotate: [2, -2, 2], scale: [1, 1.03, 1] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              style={{ transformOrigin: 'bottom left' }}
            >
              <img
                src={data.assets.flowerCorner3}
                alt="flower"
                className="w-full h-auto object-contain scale-x-[-1]"
              />
            </motion.div>
          </SectionBlock>
        </motion.div>
      )}
    </div>
  );
}
