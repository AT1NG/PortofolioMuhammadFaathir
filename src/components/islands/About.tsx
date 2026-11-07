import type { ReactNode } from 'react';
import { Icon, MotionRoot, Pic, Placeholder, Reveal, openAchievement, type IconName } from './shared';
import type { Img } from '~/lib/content';

interface Props {
  eyebrow: string; title: string; intro: string; photo: Img | null; photoAlt: string; name: string;
  tiles: { university: string; chair: string; focus: string; location: string; grant?: { id: string; text: string } };
  labels: Record<string, string>;
}

function Intro({ text }: { text: string }) {
  return <p className="font-display font-semibold leading-[1.12] tracking-tight" style={{ fontSize: 'clamp(1.5rem, 0.9rem + 3vw, 3.25rem)' }}>{text}</p>;
}

function Tile({ icon, label, children, className = '', i }: { icon: IconName; label: string; children: ReactNode; className?: string; i: number }) {
  return (
    <Reveal delay={i * 0.06} className={`card flex flex-col justify-between gap-6 p-6 ${className}`}>
      <span className="tile-label flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-muted"><Icon name={icon} className="h-4 w-4" />{label}</span>
      <div className="font-display text-xl font-medium leading-snug sm:text-2xl">{children}</div>
    </Reveal>
  );
}

function Inner(p: Props) {
  return (
    <section id="about" className="section" aria-labelledby="about-h">
      <div className="container-x">
        <p className="eyebrow">{p.eyebrow}</p>
        <h2 id="about-h" className="sr-only">{p.title}</h2>
        <div className="mt-6 max-w-4xl"><Reveal><Intro text={p.intro} /></Reveal></div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-[repeat(2,minmax(13rem,auto))]">
          <Reveal className="card relative overflow-hidden lg:row-span-2" style={{ minHeight: '22rem' }}>
            <div className="absolute inset-0">{p.photo ? <Pic img={p.photo} alt={p.photoAlt} sizes="(min-width:1024px) 25vw, 90vw" pos="50% 20%" /> : <Placeholder label={p.name} />}</div>
          </Reveal>
          <Tile i={1} icon="org" label={p.labels.university} className="lg:col-span-2">{p.tiles.university}</Tile>
          <Tile i={2} icon="committee" label={p.labels.chair} className="bg-ink text-paper [&_.tile-label]:text-paper/60">{p.tiles.chair}</Tile>
          <Tile i={3} icon="work" label={p.labels.focus}>{p.tiles.focus}</Tile>
          {p.tiles.grant ? (
            <Reveal delay={0.24} className="card flex flex-col justify-between gap-6 p-6">
              <span className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-muted"><Icon name="trophy" className="h-4 w-4" />{p.labels.grant}</span>
              <button type="button" onClick={() => openAchievement(p.tiles.grant!.id)} aria-haspopup="dialog" className="min-h-11 text-left font-display text-xl font-bold leading-snug underline decoration-accent decoration-2 underline-offset-4 sm:text-2xl">{p.tiles.grant.text}</button>
            </Reveal>
          ) : null}
          <Tile i={5} icon="pin" label={p.labels.location} className="bg-paper-2 sm:col-span-2 lg:col-span-1">{p.tiles.location}</Tile>
        </div>
      </div>
    </section>
  );
}
export default function About(p: Props) { return <MotionRoot><Inner {...p} /></MotionRoot>; }
