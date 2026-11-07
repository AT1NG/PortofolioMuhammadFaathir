import { AnimatePresence, m } from 'motion/react';
import { useEffect, useState } from 'react';
import { Icon, MotionRoot, Pic, fmt, useDialog, useScrollLock, type IconName } from './shared';
import { Lightbox } from './Lightbox';
import { dialog, overlay } from '~/lib/motion';
import type { AchievementL, Proof } from '~/lib/content';

interface T { verified: string; view: string; role: string; issuer: string; year: string; gallery: string; close: string; dialogLabel: string; viewPhoto: string; domain: string; platforms: Record<string, string> }
interface G { label: string; prev: string; next: string; goTo: string; open: string; close: string; counter: string }

/** Proof button: clean link card (no Instagram embed). Used by modal + project page + cards. */
export function ProofButton({ p, t }: { p: Proof; t: T }) {
  const icon = ({ instagram: 'instagram', website: 'website', pdf: 'pdf', other: 'link' } as Record<string, IconName>)[p.platform];
  return (
    <a href={p.url} target="_blank" rel="noopener noreferrer"
      className="group flex min-h-14 items-center gap-3 rounded-2xl border-2 border-ink bg-accent-soft px-4 py-3 text-ink transition-transform active:scale-[0.98]">
      <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ink text-paper">
        <Icon name={icon} className="h-5 w-5" />
        <span className="absolute -bottom-1 -right-1 grid h-4 w-4 place-items-center rounded-full bg-[#1a7f37] text-white ring-2 ring-accent-soft"><Icon name="check" className="h-2.5 w-2.5" /></span>
      </span>
      <span className="min-w-0 flex-1 leading-tight">
        <span className="block text-[0.7rem] font-bold uppercase tracking-widest text-[#14672d]">{t.verified} · {t.platforms[p.platform]}</span>
        <span className="block truncate font-semibold">{p.label}</span>
        <span className="block truncate text-xs text-ink-2">{fmt(t.domain, { domain: p.domain })}<span className="sr-only"> (opens in a new tab)</span></span>
      </span>
      <Icon name="external" className="h-5 w-5 shrink-0" />
    </a>
  );
}

function Detail({ a, t, g, projectBase, onClose }: { a: AchievementL; t: T; g: G; projectBase: string; onClose: () => void }) {
  const [idx, setIdx] = useState<number | null>(null);
  const ref = useDialog<HTMLDivElement>(idx === null, onClose); // lightbox handles its own Esc while open
  useScrollLock(true);
  return (
    <m.div className="fixed inset-0 z-[110] grid place-items-center overflow-y-auto bg-ink/60 p-3 backdrop-blur-sm sm:p-6" variants={overlay} initial="hidden" animate="show" exit="exit" onClick={onClose}
      style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))', paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}>
      <m.div ref={ref} role="dialog" aria-modal="true" aria-labelledby={`ach-${a.id}-t`} tabIndex={-1} variants={dialog}
        className="card relative my-auto w-full max-w-2xl overflow-hidden outline-none" onClick={(e) => e.stopPropagation()}>
        <button type="button" onClick={onClose} aria-label={t.close} data-autofocus className="tap absolute right-3 top-3 z-10 grid place-items-center rounded-full bg-paper/95 shadow"><Icon name="x" /></button>

        {a.gallery.length > 0 && <Slider images={a.gallery} onOpen={setIdx} t={g} openLabel={t.viewPhoto} />}

        <div className="grid gap-5 p-5 sm:p-8">
          <div>
            <p className="eyebrow">{a.typeLabel} · {a.dateLabel}</p>
            <h2 id={`ach-${a.id}-t`} className="mt-3 font-display text-3xl font-bold leading-tight sm:text-4xl">{a.title}</h2>
          </div>
          <dl className="grid gap-4 text-sm sm:grid-cols-2">
            <div><dt className="font-semibold text-muted">{t.issuer}</dt><dd className="mt-0.5 text-base">{a.issuer}</dd></div>
            <div><dt className="font-semibold text-muted">{t.role}</dt><dd className="mt-0.5 text-base">{a.role}</dd></div>
          </dl>
          <p className="text-base text-ink-2">{a.description}</p>
          {a.project && <a href={`${projectBase}${a.project.slug}/`} className="inline-flex items-center gap-2 font-semibold underline">{a.project.title}<Icon name="arrow" className="h-4 w-4" /></a>}
          {a.proof.length > 0 && <div className="grid gap-3">{a.proof.map((p) => <ProofButton key={p.url} p={p} t={t} />)}</div>}
        </div>
      </m.div>
      <Lightbox images={a.gallery} index={idx} onIndex={setIdx} onClose={() => setIdx(null)} t={g} />
    </m.div>
  );
}

/** Swipeable photo strip with snap (vertical page scroll is never blocked: drag is x-only). */
function Slider({ images, onOpen, t, openLabel }: { images: AchievementL['gallery']; onOpen: (i: number) => void; t: G; openLabel: string }) {
  const [i, setI] = useState(0);
  const go = (d: number) => setI((v) => Math.min(images.length - 1, Math.max(0, v + d)));
  return (
    <div className="relative overflow-hidden bg-paper-2" role="group" aria-roledescription="carousel" aria-label={t.label}>
      <m.div className="flex touch-pan-y" animate={{ x: `${-i * 100}%` }} transition={{ type: 'spring', stiffness: 300, damping: 34 }}
        drag={images.length > 1 ? 'x' : false} dragDirectionLock dragConstraints={{ left: 0, right: 0 }} dragElastic={0.25}
        onDragEnd={(_, d) => { if (d.offset.x < -50 || d.velocity.x < -400) go(1); else if (d.offset.x > 50 || d.velocity.x > 400) go(-1); }}>
        {images.map((im, n) => (
          <button key={im.src} type="button" onClick={() => onOpen(n)} aria-label={fmt(openLabel, { n: n + 1, total: images.length })} className="aspect-[16/10] w-full shrink-0 cursor-zoom-in">
            <Pic img={im} alt={im.alt} sizes="(min-width:768px) 672px, 100vw" eager={n === 0} />
          </button>
        ))}
      </m.div>
      {images.length > 1 && (
        <>
          <button type="button" onClick={() => go(-1)} disabled={i === 0} aria-label={t.prev} className="tap absolute left-2 top-1/2 grid -translate-y-1/2 place-items-center rounded-full bg-paper/90 disabled:opacity-40"><Icon name="left" /></button>
          <button type="button" onClick={() => go(1)} disabled={i === images.length - 1} aria-label={t.next} className="tap absolute right-2 top-1/2 grid -translate-y-1/2 place-items-center rounded-full bg-paper/90 disabled:opacity-40"><Icon name="right" /></button>
          <div className="absolute inset-x-0 bottom-2 flex justify-center gap-1">
            {images.map((_, n) => <button key={n} type="button" onClick={() => setI(n)} aria-label={fmt(t.goTo, { n: n + 1 })} aria-current={n === i} className="grid h-6 w-6 place-items-center"><span className={`h-2 rounded-full transition-all ${n === i ? 'w-5 bg-ink' : 'w-2 bg-ink/40'}`} /></button>)}
          </div>
        </>
      )}
    </div>
  );
}

export default function ModalHost({ achievements, t, g, projectBase }: { achievements: AchievementL[]; t: T; g: G; lang: string; projectBase: string }) {
  const [id, setId] = useState<string | null>(null);
  useEffect(() => {
    const h = (e: Event) => setId((e as CustomEvent<{ id: string }>).detail.id);
    window.addEventListener('open-achievement', h); return () => window.removeEventListener('open-achievement', h);
  }, []);
  const a = achievements.find((x) => x.id === id);
  return (
    <MotionRoot>
      <AnimatePresence>{a && <Detail key={a.id} a={a} t={t} g={g} projectBase={projectBase} onClose={() => setId(null)} />}</AnimatePresence>
    </MotionRoot>
  );
}
