import { AnimatePresence, m, useMotionValue, useSpring, useTransform } from 'motion/react';
import { useRef, useState } from 'react';
import { Icon, MotionRoot, Pic, Placeholder, Reveal, fmt, openAchievement, useFinePointer, useReduced } from './shared';
import { Tabs } from './Tabs';
import { spring } from '~/lib/motion';
import type { ProjectCardData } from '~/lib/content';

interface Props {
  cards: ProjectCardData[]; base: string; eyebrow: string; title: string; subtitle: string;
  t: { filterLabel: string; filters: Record<string, string>; featured: string; more: string; view: string; fundedBy: string; empty: string; placeholder: string };
}

/** Card with image zoom + subtle pointer tilt (max 4°, fine pointer only, never with reduced motion). */
function Card({ c, base, t, big, featuredLast = false }: { c: ProjectCardData; base: string; t: Props['t']; big: boolean; featuredLast?: boolean }) {
  const fine = useFinePointer(); const reduced = useReduced();
  const tilt = fine && !reduced;
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0), py = useMotionValue(0);
  const rx = useSpring(useTransform(py, [-0.5, 0.5], [4, -4]), spring.tilt);
  const ry = useSpring(useTransform(px, [-0.5, 0.5], [-4, 4]), spring.tilt);
  const move = (e: React.PointerEvent) => {
    if (!tilt || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5); py.set((e.clientY - r.top) / r.height - 0.5);
  };
  const leave = () => { px.set(0); py.set(0); };

  return (
    <m.li layout="position" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.4 }}
      className={big && featuredLast ? 'md:col-span-2' : ''} style={{ perspective: 1000 }}>
      <m.div ref={ref} onPointerMove={move} onPointerLeave={leave} style={tilt ? { rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' } : undefined}
        className="card group relative flex h-full flex-col overflow-hidden transition-shadow hover:shadow-[var(--shadow-lift)]">
        <div className={`relative overflow-hidden bg-paper-2 ${'aspect-[16/10]'}`}>
          <div className="h-full w-full transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.04] motion-reduce:transition-none">
            {c.cover ? <Pic img={c.cover} alt="" sizes={big ? '(min-width:1024px) 640px, 100vw' : '(min-width:1024px) 400px, (min-width:640px) 50vw, 100vw'} /> : <Placeholder label={c.title} color={c.brandColor} />}
          </div>
          <span className="absolute left-3 top-3 rounded-full bg-paper/90 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-widest backdrop-blur">{c.category}</span>
        </div>
        <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="font-display text-2xl font-semibold sm:text-3xl">{c.title}</h3>
            <span className="text-sm tabular-nums text-muted">{c.year}</span>
          </div>
          <p className="text-ink-2">{c.description}</p>
          <ul className="mt-auto flex flex-wrap gap-1.5 pt-2" aria-label="Tech">{c.tech.slice(0, 5).map((s) => <li key={s} className="chip !min-h-7 !text-xs">{s}</li>)}</ul>
          <a href={`${base}${c.slug}/`} className="absolute inset-0 z-10 rounded-[inherit]" aria-label={`${t.view}: ${c.title}`}><span className="sr-only">{t.view}</span></a>
        </div>
        {(c.funded || c.placeholder) && (
          <div className="absolute right-3 top-3 z-20 flex flex-col items-end gap-1.5">
            {c.funded && (
              <button type="button" onClick={() => openAchievement(c.funded!.id)} aria-haspopup="dialog"
                className="tap inline-flex items-center gap-1.5 rounded-full border border-ink/20 bg-paper/95 px-3 text-xs font-semibold backdrop-blur">
                <Icon name="trophy" className="h-3.5 w-3.5" />{fmt(t.fundedBy, { year: c.funded.year })}<Icon name="check" className="h-3.5 w-3.5" />
              </button>
            )}
            {c.placeholder && <span className="rounded-full bg-ink px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-widest text-paper">{t.placeholder}</span>}
          </div>
        )}
      </m.div>
    </m.li>
  );
}

function Inner({ cards, base, eyebrow, title, subtitle, t }: Props) {
  const cats = ['all', ...Array.from(new Set(cards.map((c) => c.category)))];
  const [cat, setCat] = useState('all');
  const list = cards.filter((c) => cat === 'all' || c.category === cat);
  const featured = list.filter((c) => c.featured);
  const rest = list.filter((c) => !c.featured);
  return (
    <section id="projects" className="section" aria-labelledby="projects-h">
      <div className="container-x">
        <Reveal><p className="eyebrow">{eyebrow}</p>
          <h2 id="projects-h" className="h2">{title}</h2>
          <p className="lead mt-4">{subtitle}</p></Reveal>
        <div className="mt-8 overflow-x-auto pb-1">
          <Tabs value={cat} onChange={setCat} label={t.filterLabel} panelId="projects-panel" tabs={cats.map((id) => ({ id, label: t.filters[id] ?? id }))} />
        </div>
        <div id="projects-panel" role="tabpanel" aria-live="polite" className="mt-8">
          {list.length === 0 && <p className="text-muted">{t.empty}</p>}
          {featured.length > 0 && (
            <>
              <h3 className="sr-only">{t.featured}</h3>
              <ul className="grid gap-5 md:grid-cols-2">
                <AnimatePresence mode="popLayout" initial={false}>
                  {featured.map((c, i) => <Card key={c.slug} c={c} base={base} t={t} big featuredLast={i === featured.length - 1 && featured.length % 2 === 1} />)}
                </AnimatePresence>
              </ul>
            </>
          )}
          {rest.length > 0 && (
            <>
              <h3 className="mb-5 mt-14 font-display text-xl font-bold text-ink-2">{t.more}</h3>
              <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence mode="popLayout" initial={false}>
                  {rest.map((c) => <Card key={c.slug} c={c} base={base} t={t} big={false} />)}
                </AnimatePresence>
              </ul>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
export default function Projects(p: Props) { return <MotionRoot><Inner {...p} /></MotionRoot>; }
