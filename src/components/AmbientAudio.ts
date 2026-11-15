import { useCallback, useEffect, useRef, useState } from 'react';

interface UseTemplateAudioOptions {
  musicUrl: string;
  useMusic?: boolean;
  isOpen: boolean;
}

/**
 * Mirrors Graphikly's useTemplateAudio hook: primes the <audio> element on the
 * user's envelope-tap gesture, plays on envelope reveal, and supports instant
 * mute/unmute toggling.
 */
export function useAmbientAudio({
  useMusic = true,
  isOpen,
}: UseTemplateAudioOptions) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const userPausedRef = useRef(false);
  const primedRef = useRef(false);

  const primeAudio = useCallback(() => {
    if (!useMusic || primedRef.current) return;
    const el = audioRef.current;
    if (!el) return;

    el.muted = true;
    const playPromise = el.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          primedRef.current = true;
          el.pause();
          el.currentTime = 0;
          el.muted = false;
        })
        .catch(() => {
          el.muted = false;
        });
    }
  }, [useMusic]);

  const playMusic = useCallback(() => {
    if (!useMusic) return;
    const el = audioRef.current;
    if (!el) return;
    userPausedRef.current = false;
    el.muted = false;
    el.volume = 0.85;
    window.setTimeout(() => {
      el.play()
        .then(() => setIsMuted(false))
        .catch(() => undefined);
    }, 150);
  }, [useMusic]);

  const pauseMusic = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    userPausedRef.current = true;
    el.pause();
    setIsMuted(true);
  }, []);

  const toggleMusic = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) {
      playMusic();
    } else {
      pauseMusic();
    }
  }, [playMusic, pauseMusic]);

  const startMusic = useCallback(() => {
    primeAudio();
  }, [primeAudio]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onPlay = () => setIsMuted(false);
    const onPause = () => {
      if (userPausedRef.current) setIsMuted(true);
    };
    el.addEventListener('play', onPlay);
    el.addEventListener('pause', onPause);
    return () => {
      el.removeEventListener('play', onPlay);
      el.removeEventListener('pause', onPause);
    };
  }, []);

  // Ensure music starts/resumes on first interaction once opened if not explicitly paused
  useEffect(() => {
    if (!isOpen || !useMusic) return;
    const tryResume = () => {
      const el = audioRef.current;
      if (el && el.paused && !userPausedRef.current) {
        el.muted = false;
        el.play()
          .then(() => setIsMuted(false))
          .catch(() => undefined);
      }
    };
    window.addEventListener('touchstart', tryResume, { passive: true });
    window.addEventListener('click', tryResume, { passive: true });
    return () => {
      window.removeEventListener('touchstart', tryResume);
      window.removeEventListener('click', tryResume);
    };
  }, [isOpen, useMusic]);

  return {
    audioRef,
    isMuted,
    startMusic,
    playMusic,
    pauseMusic,
    toggleMusic,
  };
}
