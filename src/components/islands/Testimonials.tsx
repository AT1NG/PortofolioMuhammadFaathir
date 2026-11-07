import { AnimatePresence, m } from 'motion/react';
import { useEffect, useState } from 'react';
import { Icon, MotionRoot, Pic, Reveal, fmt, useReduced } from './shared';

interface Item { quote: string; name: string; role: string; org: string; photo: import('~/lib/content').Img | null }

/** Calm auto-advancing slider: pauses on hover/focus, swipeable, dots + arrows. Not rendered when the data array is empty. */
function Inner({ items, eyebrow, title, t }: { items: Item[]; eyebrow: string; title: string; t: { prev: string; next: string; goTo: string } }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useReduced();
  const go = (d: number) => setI((v) => (v + d + items.length) % items.length);
  useEffect(() => {
    if (paused || reduced || items.length < 2) return;
    const id = setInterval(() => setI((v) => (v + 1) % items.length), 6500);
    return () => clearInterval(id);
  }, [paused, reduced, items.length]);
  const it = items[i];
  return (
    <section id="testimonials" className="section" aria-labelledby="tes-h" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
      <div className="container-x">
        <Reveal><p className="eyebrow">{eyebrow}</p><h2 id="tes-h" className="h2">{title}</h2></Reveal>
        <div className="mt-10 grid min-h-[16rem] items-center" role="group" aria-roledescription="carousel" aria-live={paused ? 'polite' : 'off'}>
          <AnimatePresence mode="wait" initial={false}>
            <m.figure key={i} className="touch-pan-y" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.45 }}
              drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.2} onDragEnd={(_, d) => { if (d.offset.x < -60) go(1); else if (d.offset.x > 60) go(-1); }}>
              <blockquote className="max-w-4xl font-display text-2xl font-semibold leading-snug sm:text-4xl">“{it.quote}”</blockquote>
              <figcaption className="mt-6 flex items-center gap-4">
                {it.photo && <span className="h-14 w-14 overflow-hidden rounded-full"><Pic img={it.photo} alt="" sizes="56px" /></span>}
                <span><span className="block font-semibold">{it.name}</span><span className="text-sm text-muted">{it.role}, {it.org}</span></span>
              </figcaption>
            </m.figure>
          </AnimatePresence>
        </div>
        {items.length > 1 && (
          <div className="mt-8 flex items-center gap-3">
            <button type="button" onClick={() => go(-1)} aria-label={t.prev} className="tap grid place-items-center rounded-full border-2 border-ink"><Icon name="left" /></button>
            <button type="button" onClick={() => go(1)} aria-label={t.next} className="tap grid place-items-center rounded-full border-2 border-ink"><Icon name="right" /></button>
            <div className="ml-2 flex">{items.map((_, n) => <button key={n} type="button" onClick={() => setI(n)} aria-label={fmt(t.goTo, { n: n + 1 })} aria-current={n === i} className="grid h-11 w-6 place-items-center"><span className={`h-2 rounded-full transition-all ${n === i ? 'w-5 bg-ink' : 'w-2 bg-ink/30'}`} /></button>)}</div>
          </div>
        )}
      </div>
    </section>
  );
}
export default function Testimonials(p: Parameters<typeof Inner>[0]) { return <MotionRoot><Inner {...p} /></MotionRoot>; }
