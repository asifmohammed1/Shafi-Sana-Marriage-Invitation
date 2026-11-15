import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Check, ChevronDown, ChevronUp, Heart, MapPin, Users } from 'lucide-react';
import { INVITATION_DATA, formatDisplayDate, type PreWeddingEvent } from '../data/invitationData';

interface RsvpRecord {
  id: string;
  name: string;
  adultsCount: number;
  childrenCount: number;
  attendance: 'joyfully accept' | 'regretfully decline';
  attendingEvents: string[];
  notes: string;
  submittedAt: string;
}

interface RsvpSectionProps {
  mainEventTitle: string;
  mainEventDate: string;
  mainEventTime: string;
  mainEventVenue: string;
  secondaryEventTitle?: string;
  secondaryEventVenue?: string;
  preWeddingEvents: PreWeddingEvent[];
  initialCount: number;
}

const STORAGE_KEY = 'eternal_duas_shafi_sana_rsvps_v1';

export const RsvpSection: React.FC<RsvpSectionProps> = ({
  mainEventTitle,
  mainEventDate,
  mainEventTime,
  mainEventVenue,
  secondaryEventTitle,
  secondaryEventVenue,
  preWeddingEvents,
  initialCount,
}) => {
  const [name, setName] = useState('');
  const [adultsCount, setAdultsCount] = useState(1);
  const [childrenCount, setChildrenCount] = useState(0);
  const [attendingEvents, setAttendingEvents] = useState<string[]>([mainEventTitle]);
  const [attendance, setAttendance] = useState<'joyfully accept' | 'regretfully decline'>(
    'joyfully accept'
  );
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedRecord, setSubmittedRecord] = useState<RsvpRecord | null>(null);
  const [savedRsvps, setSavedRsvps] = useState<RsvpRecord[]>([]);
  const [showGuestList, setShowGuestList] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as RsvpRecord[];
        if (Array.isArray(parsed)) setSavedRsvps(parsed);
      }
    } catch {
      // Ignore storage error
    }
  }, []);

  const allEvents = useMemo(() => {
    const list = [
      {
        title: mainEventTitle,
        date: mainEventDate,
        time: mainEventTime,
        venue: mainEventVenue,
      },
      ...(secondaryEventTitle
        ? [
            {
              title: secondaryEventTitle,
              date: '',
              time: '',
              venue: secondaryEventVenue || '',
            },
          ]
        : []),
      ...preWeddingEvents.map((e) => ({
        title: e.title,
        date: e.date,
        time: e.time,
        venue: e.venue,
      })),
    ];

    return list.sort((a, b) => {
      if (!a.date || !b.date) return 0;
      const ta = new Date(`${a.date}T12:00:00`).getTime();
      const tb = new Date(`${b.date}T12:00:00`).getTime();
      return ta - tb;
    });
  }, [
    mainEventTitle,
    mainEventDate,
    mainEventTime,
    mainEventVenue,
    secondaryEventTitle,
    secondaryEventVenue,
    preWeddingEvents,
  ]);

  const toggleEvent = (title: string) => {
    const exists = attendingEvents.includes(title);
    const updated = exists
      ? attendingEvents.filter((t) => t !== title)
      : [...attendingEvents, title];
    setAttendingEvents(updated);
    setAttendance(updated.length > 0 ? 'joyfully accept' : 'regretfully decline');
  };

  const handleDeclineToggle = (checked: boolean) => {
    if (checked) {
      setAttendance('regretfully decline');
      setAttendingEvents([]);
    } else {
      setAttendance('joyfully accept');
      setAttendingEvents([mainEventTitle]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSubmitting(true);
    window.setTimeout(() => {
      const record: RsvpRecord = {
        id: `${Date.now()}`,
        name: name.trim(),
        adultsCount: attendance === 'regretfully decline' ? 0 : adultsCount,
        childrenCount: attendance === 'regretfully decline' ? 0 : childrenCount,
        attendance,
        attendingEvents: attendance === 'regretfully decline' ? [] : attendingEvents,
        notes: notes.trim(),
        submittedAt: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
      };

      const updatedList = [record, ...savedRsvps];
      setSavedRsvps(updatedList);
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
      } catch {
        // Ignore storage error
      }

      setSubmittedRecord(record);
      setSubmitting(false);
    }, 550);
  };

  const resetForm = () => {
    setSubmittedRecord(null);
    setName('');
    setAdultsCount(1);
    setChildrenCount(0);
    setAttendingEvents([mainEventTitle]);
    setAttendance('joyfully accept');
    setNotes('');
  };

  return (
    <div className="w-full max-w-md mx-auto relative z-10 flex flex-col items-center">
      <h2 className="gld-script text-[40px] md:text-[46px] text-center text-[#806b43] mb-1">
        RSVP
      </h2>
      <div className="flex justify-center mb-8 w-full">
        <img
          src={INVITATION_DATA.assets.divider}
          alt="divider"
          className="h-[20px] md:h-[25px] object-contain opacity-90 drop-shadow-sm"
        />
      </div>
      <p className="text-xs text-[#806b43]/75 mb-6 text-center">
        Kindly confirm your attendance · {initialCount + savedRsvps.length} guests responded
      </p>

      {submittedRecord ? (
        <motion.div
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="py-10 px-6 rounded-2xl border border-[#806b43]/30 bg-[#F9F0E0] shadow-sm w-full flex flex-col items-center text-center"
        >
          <div className="w-12 h-12 rounded-full border border-[#806b43]/30 bg-[#CFAB66]/15 flex items-center justify-center mb-4">
            <Heart className="h-6 w-6 text-[#806b43]" />
          </div>
          <h3 className="gld-cinzel font-bold text-2xl text-[#806b43] mb-2 uppercase tracking-widest">
            JazakAllah Khair!
          </h3>
          <p className="text-sm text-[#806b43]/85 mb-4">
            Thank you, <span className="font-semibold">{submittedRecord.name}</span>. Your response
            has been saved.
          </p>
          <div className="w-full border-t border-[#806b43]/20 pt-4 text-xs text-[#806b43]/80 space-y-1.5">
            <p className="gld-cinzel uppercase tracking-wider font-semibold">
              {submittedRecord.attendance === 'joyfully accept'
                ? `Joyfully Accepting · ${submittedRecord.adultsCount} Adult(s)${
                    submittedRecord.childrenCount > 0
                      ? `, ${submittedRecord.childrenCount} Child(ren)`
                      : ''
                  }`
                : 'Regretfully Unable to Attend'}
            </p>
            {submittedRecord.attendingEvents.length > 0 && (
              <p className="leading-relaxed">
                Events: {submittedRecord.attendingEvents.join(' · ')}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={resetForm}
            className="mt-6 gld-cinzel text-xs uppercase tracking-[0.2em] border border-[#806b43] text-[#806b43] hover:bg-[#806b43] hover:text-[#F9F0E0] transition-colors py-2.5 px-5 rounded-lg cursor-pointer"
          >
            Submit Another Response
          </button>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 w-full mt-2">
          <div className="space-y-5 w-full">
            <div className="space-y-1 w-full text-left">
              <label
                htmlFor="rsvp-name"
                className="text-[11px] uppercase tracking-widest text-[#806b43] font-semibold opacity-80 pl-1"
              >
                Full Name *
              </label>
              <input
                id="rsvp-name"
                type="text"
                placeholder="Enter your full name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-transparent border-b border-[#806b43]/30 py-2.5 px-2 text-sm text-[#806b43] placeholder-[#806b43]/40 focus:outline-none focus:border-[#806b43]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-1">
              <div className="space-y-1 w-full text-left">
                <label
                  htmlFor="rsvp-adults"
                  className="text-[11px] uppercase tracking-widest text-[#806b43] font-semibold opacity-80 pl-1"
                >
                  Adults
                </label>
                <input
                  id="rsvp-adults"
                  type="number"
                  min={1}
                  max={10}
                  value={adultsCount}
                  onChange={(e) => setAdultsCount(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  className="w-full bg-transparent border-b border-[#806b43]/30 py-2 px-2 text-sm text-[#806b43] focus:outline-none focus:border-[#806b43] text-center tabular-nums"
                />
              </div>

              <div className="space-y-1 w-full text-left">
                <label
                  htmlFor="rsvp-children"
                  className="text-[11px] uppercase tracking-widest text-[#806b43] font-semibold opacity-80 pl-1"
                >
                  Children
                </label>
                <input
                  id="rsvp-children"
                  type="number"
                  min={0}
                  max={10}
                  value={childrenCount}
                  onChange={(e) => setChildrenCount(Math.max(0, parseInt(e.target.value, 10) || 0))}
                  className="w-full bg-transparent border-b border-[#806b43]/30 py-2 px-2 text-sm text-[#806b43] focus:outline-none focus:border-[#806b43] text-center tabular-nums"
                />
              </div>
            </div>
          </div>

          {/* Multi-Event Checkboxes */}
          <div className="space-y-3 pt-4 text-left">
            <p className="text-[11px] uppercase tracking-widest text-[#806b43] font-semibold opacity-85 pl-1">
              Which celebrations will you be joining?
            </p>
            <div className="flex flex-col gap-2.5">
              {allEvents.map((ev) => {
                const checked = attendingEvents.includes(ev.title);
                return (
                  <label
                    key={ev.title}
                    className={`flex items-start gap-3.5 p-3.5 border rounded-xl cursor-pointer transition-all ${
                      checked
                        ? 'border-[#806b43] bg-[#806b43]/8'
                        : 'border-[#806b43]/25 hover:border-[#806b43]/50 hover:bg-[#806b43]/4'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleEvent(ev.title)}
                      className="sr-only"
                    />
                    <span
                      className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                        checked
                          ? 'bg-[#806b43] border-[#806b43] text-[#F9F0E0]'
                          : 'border-[#806b43]/45 bg-transparent'
                      }`}
                    >
                      {checked && <Check className="w-3.5 h-3.5" strokeWidth={2.5} />}
                    </span>
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="text-sm font-bold text-[#806b43]">{ev.title}</span>
                      {(ev.date || ev.time || ev.venue) && (
                        <div className="mt-1 space-y-1 text-[11px] text-[#806b43]/75">
                          {(ev.date || ev.time) && (
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3 h-3 shrink-0" />
                              <span>
                                {ev.date ? formatDisplayDate(ev.date) : ''}
                                {ev.date && ev.time ? ' at ' : ''}
                                {ev.time}
                              </span>
                            </div>
                          )}
                          {ev.venue && (
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-3 h-3 shrink-0" />
                              <span className="truncate">{ev.venue}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </label>
                );
              })}

              {/* Unable to Attend Option */}
              <label
                className={`flex items-start gap-3.5 p-3.5 border rounded-xl cursor-pointer transition-all mt-1 ${
                  attendance === 'regretfully decline'
                    ? 'border-[#806b43] bg-[#806b43]/8'
                    : 'border-[#806b43]/25 hover:border-[#806b43]/50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={attendance === 'regretfully decline'}
                  onChange={(e) => handleDeclineToggle(e.target.checked)}
                  className="sr-only"
                />
                <span
                  className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                    attendance === 'regretfully decline'
                      ? 'bg-[#806b43] border-[#806b43] text-[#F9F0E0]'
                      : 'border-[#806b43]/45 bg-transparent'
                  }`}
                >
                  {attendance === 'regretfully decline' && (
                    <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                  )}
                </span>
                <span className="text-sm font-semibold text-[#806b43]">
                  Thank you! All the very best, unable to attend :)
                </span>
              </label>
            </div>
          </div>

          {/* Warm Wishes / Notes */}
          <div className="space-y-1 w-full text-left">
            <label
              htmlFor="rsvp-notes"
              className="text-[11px] uppercase tracking-widest text-[#806b43] font-semibold opacity-80 pl-1"
            >
              Duas &amp; Warm Wishes (Optional)
            </label>
            <textarea
              id="rsvp-notes"
              rows={2}
              placeholder="Write a prayer or message for Shafi & Sana..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-transparent border-b border-[#806b43]/30 py-2 px-2 text-sm text-[#806b43] placeholder-[#806b43]/40 focus:outline-none focus:border-[#806b43] resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full border border-[#806b43] bg-[#806b43] text-[#F9F0E0] py-4 rounded-xl uppercase tracking-[0.2em] gld-cinzel text-sm hover:bg-transparent hover:text-[#806b43] transition-colors disabled:opacity-60 shadow-md cursor-pointer"
          >
            {submitting ? 'Sending...' : 'Send RSVP'}
          </button>
        </form>
      )}

      {/* Saved Guest Responses Ledger */}
      {savedRsvps.length > 0 && (
        <div className="w-full mt-8 pt-6 border-t border-[#806b43]/20">
          <button
            type="button"
            onClick={() => setShowGuestList((prev) => !prev)}
            className="w-full flex items-center justify-between text-xs gld-cinzel uppercase tracking-[0.16em] text-[#806b43]/85 hover:text-[#806b43] py-2 cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Users className="w-3.5 h-3.5" />
              <span>Your Saved Responses ({savedRsvps.length})</span>
            </span>
            {showGuestList ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          <AnimatePresence>
            {showGuestList && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="space-y-2.5 pt-3">
                  {savedRsvps.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl border border-[#806b43]/20 bg-[#F9F0E0] text-left text-xs text-[#806b43]"
                    >
                      <div className="flex items-center justify-between gap-2 font-semibold">
                        <span>{item.name}</span>
                        <span className="text-[10px] gld-cinzel uppercase tracking-wider opacity-75">
                          {item.attendance === 'joyfully accept'
                            ? `${item.adultsCount + item.childrenCount} Guest(s)`
                            : 'Declined'}
                        </span>
                      </div>
                      {item.attendingEvents.length > 0 && (
                        <p className="text-[11px] opacity-75 mt-1">
                          {item.attendingEvents.join(' · ')}
                        </p>
                      )}
                      {item.notes && (
                        <p className="text-[11px] italic opacity-80 mt-1">“{item.notes}”</p>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
