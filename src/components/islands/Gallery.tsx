import { m } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { Icon, MotionRoot, Pic, fmt } from './shared';
import { Lightbox } from './Lightbox';
import type { PImg } from '~/lib/content';

interface Props {
  images: PImg[]; title: string; hint: string;
  t: { label: string; prev: string; next: string; goTo: string; open: string; close: string; counter: string };
}

/** Swipeable gallery: Motion drag with snap, arrows, dots, keyboard arrows, lazy images, shared-element lightbox. */
function Inner({ images, title, hint, t }: Props) {
  const [i, setI] = useState(0);
  const [box, setBox] = useState<number | null>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const go = (d: number) => setI((v) => Math.min(images.length - 1, Math.max(0, v + d)));
  const [w, setW] = useState(0);
  useEffect(() => {
    const el = wrap.current; if (!el) return;
    const ro = new ResizeObserver(() => setW(el.clientWidth)); ro.observe(el); return () => ro.disconnect();
  }, []);
  const gap = 16;
  const slideW = Math.min(w * 0.82, 760) || 300;
  return (
    <section aria-roledescription="carousel" aria-label={t.label} className="mt-24">
      <div className="flex items-end justify-between gap-4">
        <div><h2 className="font-display text-3xl font-bold sm:text-5xl">{title}</h2><p className="mt-2 text-sm text-muted">{hint}</p></div>
        <div className="hidden gap-2 sm:flex">
          <button type="button" onClick={() => go(-1)} disabled={i === 0} aria-label={t.prev} className="tap grid place-items-center rounded-full border-2 border-ink disabled:opacity-30"><Icon name="left" /></button>
          <button type="button" onClick={() => go(1)} disabled={i === images.length - 1} aria-label={t.next} className="tap grid place-items-center rounded-full border-2 border-ink disabled:opacity-30"><Icon name="right" /></button>
        </div>
      </div>
      <div ref={wrap} tabIndex={0} className="mt-8 overflow-hidden outline-offset-4"
        onKeyDown={(e) => { if (e.key === 'ArrowRight') { e.preventDefault(); go(1); } if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); } }}>
        <m.ul className="flex touch-pan-y" style={{ gap }} animate={{ x: -i * (slideW + gap) }} transition={{ type: 'spring', stiffness: 260, damping: 32 }}
          drag="x" dragDirectionLock dragConstraints={{ left: 0, right: 0 }} dragElastic={0.2}
          onDragEnd={(_, d) => { if (d.offset.x < -60 || d.velocity.x < -450) go(1); else if (d.offset.x > 60 || d.velocity.x > 450) go(-1); }}>
          {images.map((im, n) => (
            <li key={im.src} className="shrink-0" style={{ width: slideW }} aria-roledescription="slide" aria-label={fmt(t.counter, { n: n + 1, total: images.length })}>
              <button type="button" onClick={() => setBox(n)} aria-label={fmt(t.open, { n: n + 1 })} className="block w-full cursor-zoom-in overflow-hidden rounded-2xl border border-line bg-paper-2">
                <m.div layoutId={`gal-${n}`} className="aspect-[16/10] w-full">
                  <Pic img={im} alt={im.alt} sizes="(min-width:1024px) 760px, 82vw" eager={n < 2} pos="top" className={im.h > im.w ? '!object-contain' : ''} />
                </m.div>
              </button>
            </li>
          ))}
        </m.ul>
      </div>
      <div className="mt-4 flex justify-center">
        {images.map((_, n) => <button key={n} type="button" onClick={() => setI(n)} aria-label={fmt(t.goTo, { n: n + 1 })} aria-current={n === i} className="grid h-11 w-6 place-items-center"><span className={`h-2 rounded-full transition-all ${n === i ? 'w-5 bg-ink' : 'w-2 bg-ink/30'}`} /></button>)}
      </div>
      <Lightbox images={images} index={box} onIndex={setBox} onClose={() => setBox(null)} t={t} layoutPrefix="gal" />
    </section>
  );
}
export default function Gallery(p: Props) { return <MotionRoot><Inner {...p} /></MotionRoot>; }
