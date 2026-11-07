import { AnimatePresence, m, useScroll, useSpring } from 'motion/react';
import { useRef, useState } from 'react';
import { Icon, MotionRoot, Pic, Reveal, openAchievement, type IconName } from './shared';
import { Lightbox, type LightboxText } from './Lightbox';
import { Tabs } from './Tabs';
import type { PImg, TimelineItem } from '~/lib/content';

interface Props {
  items: TimelineItem[]; eyebrow: string; title: string; subtitle: string;
  t: {
    filterLabel: string; filters: Record<string, string>; types: Record<string, string>; topic: string; audience: string;
    visit: string; openDetails: string; speakingTitle: string; speakingHint: string; placeholder: string; photos: string;
  };
  g: LightboxText & { open: string };
}

const ICON: Record<TimelineItem['type'], IconName> = { work: 'work', organization: 'org', committee: 'committee', speaking: 'speaking', achievement: 'trophy' };
const ACCENT: Record<TimelineItem['type'], string> = { work: '#2563eb', organization: '#7c3aed', committee: '#0f766e', speaking: '#d97706', achievement: '#ff5a2b' };

function Entry({ e, i, t, openPhotos }: { e: TimelineItem; i: number; t: Props['t']; openPhotos: (imgs: PImg[], n: number) => void }) {
  const left = i % 2 === 0;
  const color = ACCENT[e.type];
  return (
    <m.li layout="position" initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '0px 0px -10% 0px' }} exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.55 }} className="relative grid grid-cols-[2.5rem_1fr] gap-x-3 md:grid-cols-[1fr_3rem_1fr] md:gap-x-6">
      <span className="absolute left-0 top-6 z-10 grid h-10 w-10 place-items-center rounded-full border border-line bg-card text-ink shadow-[var(--shadow-card)] md:static md:col-start-2 md:row-start-1 md:mx-auto md:mt-6"
        ><Icon name={ICON[e.type]} className="h-5 w-5" /></span>
      <div className={`col-start-2 min-w-0 md:row-start-1 ${left ? 'md:col-start-1 md:text-right' : 'md:col-start-3'}`}>
        <article className="card overflow-hidden">
          {e.images[0] && (
            <button type="button" onClick={() => openPhotos(e.images, 0)} className="relative block aspect-[16/9] w-full cursor-zoom-in overflow-hidden bg-paper-2">
              <span className="sr-only">{t.photos}: {e.role}</span>
              <Pic img={e.images[0]} alt="" sizes="(min-width:768px) 40vw, 90vw" pos={e.images[0].focus ?? '50% 30%'} />
              {e.images.length > 1 && <span aria-hidden="true" className="absolute bottom-2 right-2 rounded-full bg-ink/85 px-2.5 py-0.5 text-xs font-semibold text-paper">+{e.images.length - 1}</span>}
            </button>
          )}
          <div className={`flex flex-col gap-2 p-5 ${left ? 'md:items-end' : ''}`}>
            <p className="flex flex-wrap items-center gap-2 text-sm font-semibold" style={{ justifyContent: left ? undefined : undefined }}>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-ink-2"><span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />{t.types[e.type]}</span>
              <span className="text-muted tabular-nums">{e.range}</span>
              {e.placeholder && <span className="rounded-full bg-ink px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-widest text-paper">{t.placeholder}</span>}
            </p>
            <h3 className="font-display text-2xl font-semibold leading-tight">{e.role}</h3>
            <p className="font-medium text-ink-2">{e.org}</p>
            {e.topic && <p className="text-sm"><span className="font-semibold text-muted">{t.topic}: </span>{e.topic}</p>}
            {e.audience && <p className="text-sm"><span className="font-semibold text-muted">{t.audience}: </span>{e.audience}</p>}
            <p className="text-ink-2">{e.description}</p>
            <div className="mt-1 flex flex-wrap gap-2">
              {e.achievementId && (
                <button type="button" onClick={() => openAchievement(e.achievementId!)} aria-haspopup="dialog" className="btn btn-accent !min-h-11 !px-4 text-sm">
                  <Icon name="check" className="h-4 w-4" />{t.openDetails}
                </button>
              )}
              {e.link && <a href={e.link} target="_blank" rel="noopener noreferrer" className="btn btn-ghost !min-h-11 !px-4 text-sm">{t.visit}<Icon name="external" className="h-4 w-4" /><span className="sr-only"> (new tab)</span></a>}
            </div>
          </div>
        </article>
      </div>
    </m.li>
  );
}

/** Draggable horizontal slider of speaking engagements (vertical page scroll stays native: x-only drag). */
function SpeakingSlider({ items, t, openPhotos }: { items: TimelineItem[]; t: Props['t']; openPhotos: (imgs: PImg[], n: number) => void }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(0);
  const track = useRef<HTMLUListElement>(null);
  const measure = () => { if (wrap.current && track.current) setW(Math.max(0, track.current.scrollWidth - wrap.current.clientWidth)); };
  return (
    <div className="mt-24">
      <h3 className="font-display text-3xl font-bold">{t.speakingTitle}</h3>
      <p className="mt-1 text-sm text-muted">{t.speakingHint}</p>
      <div ref={wrap} className="-mx-[var(--spacing-gutter)] mt-6 overflow-hidden px-[var(--spacing-gutter)]" onPointerEnter={measure}>
        <m.ul ref={track} className="flex w-max cursor-grab touch-pan-y gap-4 active:cursor-grabbing" drag="x" dragConstraints={{ left: -w, right: 0 }} dragElastic={0.12} onViewportEnter={measure}>
          {items.map((e) => (
            <li key={e.id} className="card w-[17rem] shrink-0 overflow-hidden sm:w-[22rem]">
              <button type="button" onClick={() => openPhotos(e.images, 0)} className="block aspect-[4/3] w-full overflow-hidden bg-paper-2">
                <span className="sr-only">{t.photos}: {e.topic ?? e.role}</span>
                {e.images[0] && <Pic img={e.images[0]} alt="" sizes="22rem" pos={e.images[0].focus ?? '50% 30%'} />}
              </button>
              <div className="p-5"><p className="text-sm text-muted">{e.range}</p><h4 className="mt-1 font-display text-xl font-bold leading-snug">{e.topic ?? e.role}</h4><p className="mt-1 text-sm text-ink-2">{e.org}</p></div>
            </li>
          ))}
        </m.ul>
      </div>
    </div>
  );
}

function Inner({ items, eyebrow, title, subtitle, t, g }: Props) {
  const types = ['all', 'work', 'organization', 'committee', 'speaking', 'achievement'].filter((x) => x === 'all' || items.some((i) => i.type === x));
  const [f, setF] = useState('all');
  const [box, setBox] = useState<{ imgs: PImg[]; n: number } | null>(null);
  const list = items.filter((i) => f === 'all' || i.type === f);
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.6', 'end 0.6'] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const speaking = items.filter((i) => i.type === 'speaking' && i.images.length);

  return (
    <section id="experience" className="section" aria-labelledby="exp-h">
      <div className="container-x">
        <Reveal><p className="eyebrow">{eyebrow}</p><h2 id="exp-h" className="h2">{title}</h2><p className="lead mt-4">{subtitle}</p></Reveal>
        <div className="mt-8 max-w-full overflow-x-auto pb-1">
          <Tabs value={f} onChange={setF} label={t.filterLabel} panelId="exp-panel" tabs={types.map((id) => ({ id, label: t.filters[id] }))} />
        </div>

        <div id="exp-panel" role="tabpanel" className="relative mt-12">
          <div aria-hidden="true" className="absolute bottom-0 left-5 top-0 w-0.5 -translate-x-1/2 bg-line md:left-1/2">
            <m.div className="h-full w-full origin-top bg-accent" style={{ scaleY }} />
          </div>
          <ol ref={ref} className="relative flex flex-col gap-8 md:gap-12">
            <AnimatePresence mode="popLayout" initial={false}>
              {list.map((e, i) => <Entry key={e.id} e={e} i={i} t={t} openPhotos={(imgs, n) => setBox({ imgs, n })} />)}
            </AnimatePresence>
          </ol>
        </div>

        {speaking.length >= 3 && <SpeakingSlider items={speaking} t={t} openPhotos={(imgs, n) => setBox({ imgs, n })} />}
      </div>
      <Lightbox images={box?.imgs ?? []} index={box ? box.n : null} onIndex={(n) => setBox((b) => (b ? { ...b, n } : b))} onClose={() => setBox(null)} t={g} />
    </section>
  );
}
export default function Experience(p: Props) { return <MotionRoot><Inner {...p} /></MotionRoot>; }
