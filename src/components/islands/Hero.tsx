import { AnimatePresence, m, useScroll, useTransform } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { Icon, MotionRoot, Pic, Placeholder, openAchievement, useFinePointer, useReduced } from './shared';
import { ease } from '~/lib/motion';
import type { AchievementL, Img } from '~/lib/content';

interface Props {
  name: string; shortName: string; roles: string[]; portrait: Img | null; portraitAlt: string;
  headline: string[]; hi: string; prefix: string; intro: string;
  cta: { projects: string; contact: string };
  badges: Pick<AchievementL, 'id' | 'badge'>[]; badgesLabel: string; scroll: string;
  hrefs: { projects: string; contact: string };
}

/** Rolling letters on hover (CSS-driven, per-letter stagger). Touch gets the press/scale state from .btn:active. */
export function RollLabel({ text }: { text: string }) {
  return (
    <span className="roll relative inline-block overflow-hidden align-middle leading-[1.3]" aria-hidden="true">
      <span className="block">{[...text].map((c, i) => <span key={i} className="roll-in inline-block" style={{ transitionDelay: `${i * 14}ms`, whiteSpace: 'pre' }}>{c}</span>)}</span>
      <span className="absolute inset-0 block">{[...text].map((c, i) => <span key={i} className="roll-out inline-block" style={{ transitionDelay: `${i * 14}ms`, whiteSpace: 'pre' }}>{c}</span>)}</span>
    </span>
  );
}

function RollingRole({ roles }: { roles: string[] }) {
  const [i, setI] = useState(0);
  const reduced = useReduced();
  useEffect(() => {
    if (reduced || roles.length < 2) return;
    const id = setInterval(() => setI((v) => (v + 1) % roles.length), 2400);
    return () => clearInterval(id);
  }, [reduced, roles.length]);
  return (
    <span className="relative inline-flex h-[1.25em] overflow-hidden align-bottom font-display font-semibold text-ink" style={{ minWidth: '9ch' }}>
      <AnimatePresence mode="popLayout" initial={false}>
        <m.span key={i} className="block whitespace-nowrap" initial={{ y: '110%' }} animate={{ y: 0 }} exit={{ y: '-110%' }} transition={{ duration: 0.55, ease: ease.out }}>
          {roles[i]}
        </m.span>
      </AnimatePresence>
    </span>
  );
}

function Inner(p: Props) {
  const ref = useRef<HTMLElement>(null);
  const fine = useFinePointer();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -90]);

  return (
    <section ref={ref} id="top" className="relative isolate overflow-hidden" style={{ minHeight: '100dvh', paddingTop: 'calc(6.5rem + env(safe-area-inset-top))' }}>
      {/* background grid + shapes (parallax on desktop only) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 opacity-60"
        style={{ backgroundImage: 'linear-gradient(var(--color-line) 1px, transparent 1px), linear-gradient(90deg, var(--color-line) 1px, transparent 1px)', backgroundSize: '64px 64px', maskImage: 'radial-gradient(70% 70% at 50% 40%, #000, transparent)', WebkitMaskImage: 'radial-gradient(70% 70% at 50% 40%, #000, transparent)' }} />
      <m.div aria-hidden="true" style={fine ? { y: y1 } : undefined} className="pointer-events-none absolute -right-24 top-24 -z-10 h-[26rem] w-[26rem] rounded-full bg-accent/15 blur-3xl sm:h-[34rem] sm:w-[34rem]" />
      <m.div aria-hidden="true" style={fine ? { y: y2 } : undefined} className="pointer-events-none absolute -left-20 bottom-10 -z-10 h-64 w-64 rounded-[40%] bg-ink/5" />

      <div className="container-x grid items-center gap-10 pb-16 lg:grid-cols-[1.35fr_1fr] lg:gap-6" style={{ minHeight: 'calc(100dvh - 6.5rem)' }}>
        <div className="min-w-0">
          <p className="fade-in eyebrow">{p.hi}</p>
          <h1 className="mt-6 font-display font-semibold" style={{ fontSize: 'clamp(2.1rem, 0.6rem + 7.2vw, 7.25rem)', lineHeight: 0.96, letterSpacing: '-0.045em' }}>
            <span className="sr-only">{p.headline.join(' ')}</span>
            <span aria-hidden="true">
              {p.headline.map((l, i) => <span key={i} className="mask-line"><span style={{ ['--i' as string]: i }}>{l}</span></span>)}
            </span>
          </h1>
          <p className="fade-in mt-7 text-[length:var(--text-lead)] leading-snug text-ink-2" style={{ ['--d' as string]: '450ms' }}>
            <RollingRole roles={p.roles} />
          </p>
          <p className="fade-in mt-4 max-w-[52ch] text-ink-2" style={{ ['--d' as string]: '550ms' }}>{p.intro}</p>

          <div className="fade-in mt-8 flex flex-wrap gap-3" style={{ ['--d' as string]: '650ms' }}>
            <a href={p.hrefs.projects} className="btn btn-solid"><RollLabel text={p.cta.projects} /><span className="sr-only">{p.cta.projects}</span><Icon name="arrow" /></a>
            <a href={p.hrefs.contact} className="btn btn-ghost"><RollLabel text={p.cta.contact} /><span className="sr-only">{p.cta.contact}</span></a>
          </div>

          {p.badges.length > 0 && (
            <ul aria-label={p.badgesLabel} className="fade-in mt-8 flex flex-wrap gap-2" style={{ ['--d' as string]: '750ms' }}>
              {p.badges.map((b) => (
                <li key={b.id}>
                  <button type="button" onClick={() => openAchievement(b.id)} aria-haspopup="dialog"
                    className="tap inline-flex items-center gap-2 rounded-full border border-line bg-card px-4 text-sm font-medium shadow-[var(--shadow-card)] transition-transform active:scale-95">
                    <Icon name="trophy" className="h-4 w-4" />{b.badge}<Icon name="check" className="h-4 w-4 text-[#1a7f37]" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="relative mx-auto w-full max-w-[26rem] lg:max-w-none">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] rounded-tl-[38%] bg-paper-2 shadow-[var(--shadow-lift)] ring-1 ring-ink/10">
            {p.portrait ? <Pic img={p.portrait} alt={p.portraitAlt} eager sizes="(min-width:1024px) 40vw, 90vw" pos="50% 25%" /> : <Placeholder label={p.name} />}
          </div>
        </div>
      </div>
      <a href="#about" className="fade-in absolute bottom-5 left-1/2 hidden -translate-x-1/2 items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted sm:flex" style={{ ['--d' as string]: '1s' }}>
        {p.scroll}<Icon name="arrow" className="h-4 w-4 rotate-90" />
      </a>
    </section>
  );
}

export default function Hero(p: Props) { return <MotionRoot><Inner {...p} /></MotionRoot>; }
