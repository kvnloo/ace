import React from 'react';

type AceExperience = {
  reducedMotion: boolean;
};

const AceExperienceContext = React.createContext<AceExperience>({ reducedMotion: false });

const setRootVar = (name: string, value: string) => {
  document.documentElement.style.setProperty(name, value);
};

export const AceExperienceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reducedMotion, setReducedMotion] = React.useState(false);

  React.useEffect(() => {
    const connection = (navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
    }).connection;
    const deviceMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
    const effectiveType = connection?.effectiveType;
    const lowPower =
      Boolean(connection?.saveData) ||
      effectiveType === 'slow-2g' ||
      effectiveType === '2g' ||
      (typeof navigator.hardwareConcurrency === 'number' && navigator.hardwareConcurrency <= 2) ||
      (typeof deviceMemory === 'number' && deviceMemory <= 2);

    document.documentElement.dataset.aceQuality = lowPower ? 'lite' : 'full';

    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => {
      setReducedMotion(media.matches);
      document.documentElement.dataset.aceMotion = media.matches ? 'reduced' : 'full';
    };
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);

  React.useEffect(() => {
    const root = document.documentElement;
    let lastY = window.scrollY;
    let raf = 0;
    let idleTimer = 0;

    const publish = () => {
      raf = 0;
      const y = window.scrollY;
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, y / max));
      const heroLoopProgress = Math.min(1, Math.max(0, y / Math.max(window.innerHeight * 1.05, 1)));

      setRootVar('--ace-scroll', progress.toFixed(5));
      setRootVar('--ace-loop-progress', `${(heroLoopProgress * 100).toFixed(2)}%`);
      setRootVar('--ace-scroll-px', `${Math.min(progress * 72, 72).toFixed(2)}px`);
      root.dataset.aceDirection = y < lastY ? 'up' : 'down';
      root.dataset.aceScrolling = 'true';
      lastY = y;

      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => {
        root.dataset.aceScrolling = 'false';
      }, 120);
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(publish);
    };

    publish();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });

    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (raf) cancelAnimationFrame(raf);
      window.clearTimeout(idleTimer);
      root.dataset.aceScrolling = 'false';
    };
  }, []);

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
