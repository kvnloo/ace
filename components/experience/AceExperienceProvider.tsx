import React from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

declare global {
  interface Window {
    __ACE_LENIS__?: Lenis;
  }
}

type AceExperience = {
  reducedMotion: boolean;
};

const AceExperienceContext = React.createContext<AceExperience>({ reducedMotion: false });

const setRootVar = (name: string, value: string) => {
  document.documentElement.style.setProperty(name, value);
};

export const AceExperienceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reducedMotion, setReducedMotion] = React.useState(false);
  const [liteMode, setLiteMode] = React.useState(false);

  React.useEffect(() => {
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    const deviceMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
    const effectiveType = (connection as { effectiveType?: string } | undefined)?.effectiveType;
    const slowNetwork = effectiveType === 'slow-2g' || effectiveType === '2g';
    const lowPower =
      Boolean(connection?.saveData) ||
      slowNetwork ||
      (typeof navigator.hardwareConcurrency === 'number' && navigator.hardwareConcurrency <= 2) ||
      (typeof deviceMemory === 'number' && deviceMemory <= 2);
    document.documentElement.dataset.aceQuality = lowPower ? 'lite' : 'full';
    setLiteMode(lowPower);

    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReducedMotion(media.matches);
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);

  React.useEffect(() => {
    const root = document.documentElement;
    const lenis = new Lenis({
      autoRaf: false,
      lerp: reducedMotion || liteMode ? 1 : 0.12,
      smoothWheel: !reducedMotion && !liteMode,
      syncTouch: !liteMode,
      touchMultiplier: liteMode ? 1 : 1.08,
      respectReducedMotion: true,
    });

    window.__ACE_LENIS__ = lenis;
    root.dataset.aceMotion = reducedMotion ? 'reduced' : 'full';

    let scrollIdleTimer = 0;
    const onScroll = (instance: Lenis) => {
      const progress = Number.isFinite(instance.progress) ? instance.progress : 0;
      setRootVar('--ace-scroll', progress.toFixed(5));
      setRootVar('--ace-scroll-px', `${Math.min(progress * 72, 72).toFixed(2)}px`);
      root.dataset.aceDirection = instance.direction < 0 ? 'up' : 'down';
      root.dataset.aceLoop = String(Math.min(10, Math.max(1, Math.floor(progress * 10) + 1)));
      root.dataset.aceScrolling = 'true';
      window.clearTimeout(scrollIdleTimer);
      scrollIdleTimer = window.setTimeout(() => {
        root.dataset.aceScrolling = 'false';
      }, 120);
    };

    lenis.on('scroll', onScroll);

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onVisibility = () => {
      if (document.hidden) {
        lenis.stop();
        cancelAnimationFrame(raf);
      } else {
        lenis.start();
        raf = requestAnimationFrame(loop);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      window.clearTimeout(scrollIdleTimer);
      document.removeEventListener('visibilitychange', onVisibility);
      cancelAnimationFrame(raf);
      lenis.destroy();
      if (window.__ACE_LENIS__ === lenis) window.__ACE_LENIS__ = undefined;
      root.dataset.aceScrolling = 'false';
    };
  }, [reducedMotion, liteMode]);

  React.useEffect(() => {
    const root = document.documentElement;
    if (reducedMotion) {
      document.querySelectorAll<HTMLElement>('[data-ace-reveal]').forEach((node) => {
        node.dataset.inview = 'true';
      });
      return;
    }

    const observed = new WeakSet<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const element = entry.target as HTMLElement;
          element.dataset.inview = 'true';
          observer.unobserve(element);
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.08 },
    );

    const scan = () => {
      document.querySelectorAll<HTMLElement>('[data-ace-reveal]').forEach((element) => {
        if (observed.has(element)) return;
        observed.add(element);
        observer.observe(element);
      });
    };

    scan();
    const mutation = new MutationObserver(scan);
    mutation.observe(document.body, { childList: true, subtree: true });
    root.dataset.aceReveal = 'enabled';

    return () => {
      mutation.disconnect();
      observer.disconnect();
      delete root.dataset.aceReveal;
    };
  }, [reducedMotion]);

  return (
    <AceExperienceContext.Provider value={{ reducedMotion }}>
      {children}
    </AceExperienceContext.Provider>
  );
};

export const useAceExperience = () => React.useContext(AceExperienceContext);
