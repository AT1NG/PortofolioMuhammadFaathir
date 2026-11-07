import { LazyMotion, MotionConfig, m, useInView } from 'motion/react';
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { ease, viewport } from '~/lib/motion';
import type { Img } from '~/lib/images';

/* ─────────────── Motion root: tiny bundle (LazyMotion) + global reduced-motion ─────────────── */
const loadFeatures = () => import('./features').then((r) => r.default);
export function MotionRoot({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={loadFeatures} strict>{children}</LazyMotion>
    </MotionConfig>
  );
}

/* ─────────────── Reveal: scroll-in. SSR HTML is visible without JS (noscript/CSS override in Layout) ─────────────── */
export function Reveal({ children, delay = 0, y = 24, className, as = 'div', style }: {
  children: ReactNode; delay?: number; y?: number; className?: string; as?: 'div' | 'li' | 'section' | 'article' | 'p'; style?: CSSProperties;
}) {
  const C = m[as] as typeof m.div;
  return (
    <C className={className} style={style} initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }} viewport={viewport}
      transition={{ duration: 0.65, ease: ease.out, delay }}>
      {children}
    </C>
  );
}

/* ─────────────── Pic: <picture> with AVIF/WebP + generated placeholder ─────────────── */
export function Pic({ img, alt, sizes = '100vw', eager = false, className = '', style, pos }: {
  img: Img; alt: string; sizes?: string; eager?: boolean; className?: string; style?: CSSProperties; pos?: string;
}) {
  return (
    <picture className="block h-full w-full">
      <source type="image/avif" srcSet={img.avif} sizes={sizes} />
      <source type="image/webp" srcSet={img.webp} sizes={sizes} />
      <img src={img.src} alt={alt} width={img.w} height={img.h} loading={eager ? 'eager' : 'lazy'} decoding="async"
        fetchPriority={eager ? 'high' : undefined} className={`h-full w-full object-cover ${className}`} style={{ objectPosition: pos, ...style }} draggable={false} />
    </picture>
  );
}

const initialsOf = (s: string) => s.replace(/[^\p{L}\p{N} ]/gu, '').split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase() || '·';
export function Placeholder({ label, color = '#e8400f', className = '' }: { label: string; color?: string; className?: string }) {
  return (
    <div className={`ph ${className}`} role="img" aria-label={label}
      style={{ background: `radial-gradient(120% 90% at 20% 10%, ${color}ff 0%, ${color}cc 45%, #121212 160%)`, fontSize: 'clamp(2rem, 9cqw, 5rem)', containerType: 'inline-size' }}>
      <span aria-hidden="true">{initialsOf(label)}</span>
    </div>
  );
}

/* ─────────────── hooks ─────────────── */
export function useFinePointer() {
  const [fine, setFine] = useState(false);
  useEffect(() => {
    const q = window.matchMedia('(hover: hover) and (pointer: fine)');
    const set = () => setFine(q.matches); set(); q.addEventListener('change', set);
    return () => q.removeEventListener('change', set);
  }, []);
  return fine;
}
export function useReduced() {
  const [r, setR] = useState(false);
  useEffect(() => {
    const q = window.matchMedia('(prefers-reduced-motion: reduce)');
    const set = () => setR(q.matches); set(); q.addEventListener('change', set);
    return () => q.removeEventListener('change', set);
  }, []);
  return r;
}

type LenisLike = { stop(): void; start(): void };
const lenis = () => (window as unknown as { __lenis?: LenisLike }).__lenis;

let locks = 0;
export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    locks++;
    const sbw = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.overflow = 'hidden';
    if (sbw > 0) document.body.style.paddingRight = `${sbw}px`;
    lenis()?.stop();
    return () => {
      locks--;
      if (locks <= 0) { document.documentElement.style.overflow = ''; document.body.style.paddingRight = ''; lenis()?.start(); }
    };
  }, [active]);
}

const FOCUSABLE = 'a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])';
/** Focus trap + Esc to close + restore focus. Attach the returned ref to the dialog element. */
export function useDialog<T extends HTMLElement>(open: boolean, onClose: () => void) {
  const ref = useRef<T>(null);
  const close = useRef(onClose); close.current = onClose;
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const el = ref.current;
    const first = el?.querySelector<HTMLElement>('[data-autofocus]') ?? el?.querySelector<HTMLElement>(FOCUSABLE);
    (first ?? el)?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.stopPropagation(); close.current(); return; }
      if (e.key !== 'Tab' || !el) return;
      const f = [...el.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((n) => n.offsetParent !== null || n === document.activeElement);
      if (!f.length) { e.preventDefault(); return; }
      const a = f[0], z = f[f.length - 1];
      if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
      else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
    };
    document.addEventListener('keydown', onKey, true);
    return () => { document.removeEventListener('keydown', onKey, true); prev?.focus?.({ preventScroll: true }); };
  }, [open]);
  return ref;
}

/** Opens the achievement modal rendered once by <ModalHost/> in the layout. */
export const openAchievement = (id: string) => window.dispatchEvent(new CustomEvent('open-achievement', { detail: { id } }));

export const fmt = (s: string, vars: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''));

export { useInView };

/* ─────────────── icons (inline, 24px grid, currentColor) ─────────────── */
const P = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;
export type IconName = 'arrow' | 'external' | 'check' | 'instagram' | 'website' | 'pdf' | 'link' | 'mail' | 'whatsapp' | 'linkedin' | 'github' | 'copy' | 'x' | 'left' | 'right' | 'up' | 'work' | 'org' | 'committee' | 'speaking' | 'trophy' | 'menu' | 'play' | 'expand' | 'store' | 'pin';
export function Icon({ name, className = 'h-5 w-5' }: { name: IconName; className?: string }) {
  const s = { className, viewBox: '0 0 24 24', 'aria-hidden': true, focusable: false } as const;
  switch (name) {
    case 'arrow': return <svg {...s} {...P}><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
    case 'external': return <svg {...s} {...P}><path d="M7 17 17 7M8 7h9v9" /></svg>;
    case 'check': return <svg {...s} {...P} strokeWidth={2.4}><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>;
    case 'instagram': return <svg {...s} {...P}><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.2" cy="6.8" r=".6" fill="currentColor" /></svg>;
    case 'website': return <svg {...s} {...P}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18" /></svg>;
    case 'pdf': return <svg {...s} {...P}><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5M9 14h6M9 17h4" /></svg>;
    case 'link': return <svg {...s} {...P}><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" /></svg>;
    case 'mail': return <svg {...s} {...P}><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m4 7 8 6 8-6" /></svg>;
    case 'whatsapp': return <svg {...s} {...P}><path d="M4 20l1.2-4.1A8 8 0 1 1 8.2 18.9z" /><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.3-2-1-.8.7c-.9-.4-1.7-1.200-2.100-2.100l.7-.8-1-2z" /></svg>;
    case 'linkedin': return <svg {...s} {...P}><rect x="3.5" y="3.5" width="17" height="17" rx="3" /><path d="M8 10.500V16M8 7.700v.1M12 16v-3.200a2 2 0 0 1 4 0V16M12 10.500V16" /></svg>;
    case 'github': return <svg {...s} {...P}><path d="M9 19c-4 1.200-4-2-6-2.500m12 4.500v-3a2.600 2.600 0 0 0-.7-2c3-.3 6.200-1.500 6.200-6.800a5.300 5.300 0 0 0-1.400-3.700 5 5 0 0 0-.1-3.700s-1.200-.4-3.800 1.400a13 13 0 0 0-7 0C6.600 2.700 5.400 3.100 5.400 3.100a5 5 0 0 0-.1 3.700A5.300 5.300 0 0 0 3.900 10.500c0 5.300 3.200 6.500 6.200 6.800a2.600 2.600 0 0 0-.7 2v3" /></svg>;
    case 'copy': return <svg {...s} {...P}><rect x="9" y="9" width="11" height="11" rx="2.500" /><path d="M5 15V6.500A2.500 2.500 0 0 1 7.500 4H15" /></svg>;
    case 'x': return <svg {...s} {...P}><path d="M6 6l12 12M18 6 6 18" /></svg>;
    case 'left': return <svg {...s} {...P}><path d="m15 5-7 7 7 7" /></svg>;
    case 'right': return <svg {...s} {...P}><path d="m9 5 7 7-7 7" /></svg>;
    case 'up': return <svg {...s} {...P}><path d="M12 19V5M6 11l6-6 6 6" /></svg>;
    case 'work': return <svg {...s} {...P}><rect x="3" y="7" width="18" height="13" rx="2.500" /><path d="M9 7V5.500A1.500 1.500 0 0 1 10.500 4h3A1.500 1.500 0 0 1 15 5.500V7M3 13h18" /></svg>;
    case 'org': return <svg {...s} {...P}><circle cx="9" cy="8" r="3" /><path d="M3.500 19a5.500 5.500 0 0 1 11 0M16 5.500a3 3 0 0 1 0 5M17.500 14.500A5.500 5.500 0 0 1 21 19" /></svg>;
    case 'committee': return <svg {...s} {...P}><path d="M5 21V4M5 5h11l-2 3.500L16 12H5" /></svg>;
    case 'speaking': return <svg {...s} {...P}><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5.500 11a6.500 6.500 0 0 0 13 0M12 17.500V21M8.500 21h7" /></svg>;
    case 'trophy': return <svg {...s} {...P}><path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H4.500v1.500A3.500 3.500 0 0 0 8 11M16 6h3.500v1.500A3.500 3.500 0 0 1 16 11M12 13v4M8.500 20h7M10 17h4" /></svg>;
    case 'menu': return <svg {...s} {...P}><path d="M4 8h16M4 16h16" /></svg>;
    case 'play': return <svg {...s} {...P}><circle cx="12" cy="12" r="9" /><path d="m10 8.500 5 3.500-5 3.500z" fill="currentColor" /></svg>;
    case 'expand': return <svg {...s} {...P}><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" /></svg>;
    case 'store': return <svg {...s} {...P}><path d="M5 4.500 19 12 5 19.500z" /></svg>;
    case 'pin': return <svg {...s} {...P}><path d="M12 21s7-5.500 7-11a7 7 0 0 0-14 0c0 5.500 7 11 7 11z" /><circle cx="12" cy="10" r="2.500" /></svg>;
  }
}
