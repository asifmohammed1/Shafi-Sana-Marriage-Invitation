export interface PreWeddingEvent {
  title: string;
  date: string;
  time: string;
  venue: string;
  message: string;
}

export interface TimelineItem {
  time: string;
  event: string;
}

export interface InvitationConfig {
  templateSlug: string;
  eventType: string;
  groomName: string;
  groomGuardianText: string;
  groomParents: string;
  brideName: string;
  brideGuardianText: string;
  brideParents: string;
  swapNames: boolean;
  eventDate: string;
  eventTime: string;
  venueName: string;
  venueAddress: string;
  primaryMapTitle: string;
  googleMapLink: string;
  inviteTitle: string;
  inviteParagraph: string;
  welcomeMessageArabic: string;
  countdownTitle: string;
  revealTitle: string;
  preWeddingTitle: string;
  preWeddingEvents: PreWeddingEvent[];
  programTimeline: TimelineItem[];
  dressCode: string;
  transportation: string;
  accommodation: string;
  giftMessage: string;
  closingMessage: string;
  initialRsvpCount: number;
  musicUrl: string;
  assets: {
    envelopeVideo: string;
    heroVideo: string;
    welcomeImage: string;
    bismillah: string;
    archFrame: string;
    divider: string;
    cardBorder: string;
    flowerCorner2: string;
    flowerCorner3: string;
    whiteRose: string;
    logo: string;
  };
}

export const INVITATION_DATA: InvitationConfig = {
  templateSlug: 'eternal-duas-couple',
  eventType: 'Wedding',
  groomName: 'Omar Farooq',
  groomGuardianText: 'Son Of',
  groomParents: 'Mr. Tariq Farooq & Mrs. Zainab Farooq',
  brideName: 'Aisha Khan',
  brideGuardianText: 'Daughter Of',
  brideParents: 'Mr. Salman Khan & Mrs. Fatima Khan',
  swapNames: true,
  eventDate: '2027-01-15',
  eventTime: '06:00 PM',
  venueName: 'The Grand Pavilion',
  venueAddress: 'Al Barsha District, Dubai, UAE',
  primaryMapTitle: 'The Venue',
  googleMapLink: 'https://maps.google.com',
  inviteTitle: 'YOU ARE INVITED TO THE NIKKAH CEREMONY OF',
  inviteParagraph:
    'Together with our families, we joyfully invite you to witness the beginning of our forever.',
  welcomeMessageArabic: 'وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا',
  countdownTitle: 'Counting down to our Nikah',
  revealTitle: 'The Nikah Date',
  preWeddingTitle: 'Pre-Wedding Events',
  preWeddingEvents: [
    {
      title: 'Engagement Ring Ceremony',
      date: '2026-11-15',
      time: '05:00 PM',
      venue: 'The Grand Pavilion',
      message: 'Exchange of rings and blessings.',
    },
    {
      title: 'Mehndi Ceremony',
      date: '2026-12-15',
      time: '04:00 PM',
      venue: 'Family Residence',
      message: 'Ladies are requested to wear traditional attire.',
    },
    {
      title: 'Haldi & Ubtan',
      date: '2026-12-15',
      time: '06:00 PM',
      venue: 'Family Residence',
      message: 'A traditional haldi ceremony.',
    },
    {
      title: 'Sangeet Night',
      date: '2026-12-15',
      time: '08:00 PM',
      venue: 'The Royal Ballroom',
      message: 'Join us for a night of music and dance.',
    },
  ],
  programTimeline: [
    { time: '04:30 PM', event: 'Welcome Drink' },
    { time: '05:00 PM', event: 'Photo Shoot' },
    { time: '05:30 PM', event: 'Baraat Procession' },
    { time: '06:30 PM', event: 'Nikah Ceremony' },
    { time: '07:30 PM', event: 'Dua & Blessings' },
    { time: '08:00 PM', event: 'Wedding Feast' },
    { time: '10:00 PM', event: 'Rukhsati' },
  ],
  dressCode:
    'Formal / Traditional attire is encouraged. Ladies are invited to wear pastels or earth tones.',
  transportation:
    'Complimentary shuttle services will be provided from the hotel to the venue every 30 minutes.',
  accommodation:
    'A block of rooms has been reserved for our guests. Please mention our names for a special rate.',
  giftMessage:
    'Your duas and presence are the greatest gifts. Should you wish to honor us, a contribution to our new home would be cherished.',
  closingMessage: 'JazakAllah Khair — May Allah bless this union.',
  initialRsvpCount: 12,
  musicUrl: '/audio/eternal-duas-song.mp3',
  assets: {
    envelopeVideo: '/unbox-assets/golden-light-envelope/EnvelopeOpeningWithGoldenLight.mp4',
    heroVideo: '/images/invitation/eternal-duas/CoupleHeroStyleBackgroundVideo.mp4',
    welcomeImage: '/images/invitation/eternal-duas/welcome-couple.jpg',
    bismillah: '/images/invitation/eternal-duas/golden-bismillah.webp',
    archFrame: '/images/invitation/eternal-duas/golden-arch-frame.webp',
    divider: '/images/invitation/eternal-duas/golden-divider.webp',
    cardBorder: '/images/invitation/eternal-duas/golden-card-border.webp',
    flowerCorner2: '/images/invitation/eternal-duas/golden-flower-corner-2.webp',
    flowerCorner3: '/images/invitation/eternal-duas/golden-flower-corner-3.webp',
    whiteRose: '/images/invitation/eternal-duas/golden-white-rose.webp',
    logo: '/logo.png',
  },
};

export function formatDisplayDate(dateStr: string): string {
  const parts = dateStr.split('-').map((n) => parseInt(n, 10));
  if (parts.length !== 3 || parts.some(isNaN)) return dateStr;
  const date = new Date(parts[0], parts[1] - 1, parts[2], 12, 0, 0);
  const day = date.getDate().toString().padStart(2, '0');
  const month = date.toLocaleString('en-US', { month: 'short' });
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

export function getCalendarParts(dateStr: string) {
  const parts = dateStr.split('-').map((n) => parseInt(n, 10));
  if (parts.length !== 3 || parts.some(isNaN)) {
    return { weekday: 'Friday', day: '15', monthYear: 'January 2027', year: '2027' };
  }
  const date = new Date(parts[0], parts[1] - 1, parts[2], 12, 0, 0);
  return {
    weekday: date.toLocaleString('en-US', { weekday: 'long' }),
    day: date.getDate().toString().padStart(2, '0'),
    monthYear: `${date.toLocaleString('en-US', { month: 'long' })} ${date.getFullYear()}`,
    year: date.getFullYear().toString(),
  };
}

export function getTimelineImage(eventTitle: string): string {
  const lower = eventTitle.toLowerCase();
  if (
    lower.includes('bachelor') ||
    lower.includes('party') ||
    lower.includes('shower') ||
    lower.includes('welcome') ||
    lower.includes('drink') ||
    lower.includes('mocktail') ||
    lower.includes('cocktail')
  ) {
    return '/images/invitation/eternal-duas/drink.webp';
  }
  if (lower.includes('photo') || lower.includes('shoot') || lower.includes('portrait')) {
    return '/images/invitation/eternal-duas/photo.webp';
  }
  if (
    lower.includes('arrival') ||
    lower.includes('baraat') ||
    lower.includes('entrance') ||
    lower.includes('barat')
  ) {
    return '/images/invitation/eternal-duas/baraat.webp';
  }
  if (
    lower.includes('dinner') ||
    lower.includes('lunch') ||
    lower.includes('buffet') ||
    lower.includes('food') ||
    lower.includes('reception') ||
    lower.includes('feast')
  ) {
    return '/images/invitation/eternal-duas/feast.webp';
  }
  if (
    lower.includes('rukhsati') ||
    lower.includes('bride') ||
    lower.includes('vidai') ||
    lower.includes('bidai') ||
    lower.includes('valima')
  ) {
    return '/images/invitation/eternal-duas/bidai.webp';
  }
  if (lower.includes('nikah') || lower.includes('nikkah')) {
    return '/images/invitation/eternal-duas/nikah.webp';
  }
  if (
    lower.includes('dua') ||
    lower.includes('prayer') ||
    lower.includes('blessing') ||
    lower.includes('ceremony')
  ) {
    return '/images/invitation/eternal-duas/dua-blessings.webp';
  }
  return '/images/invitation/eternal-duas/calendar.webp';
}
