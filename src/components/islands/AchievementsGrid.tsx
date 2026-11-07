import { useState } from 'react';
import { Icon, MotionRoot, Pic, Reveal, openAchievement } from './shared';
import { Lightbox, type LightboxText } from './Lightbox';
import type { AchievementL, PImg } from '~/lib/content';

/** Only rendered when there are 3+ achievements (see HomePage.astro). Newest first. */
function Inner({ items, eyebrow, title, t, g }: { items: AchievementL[]; eyebrow: string; title: string; t: { certificate: string; viewCertificate: string; verified: string; details: string }; g: LightboxText }) {
  const [box, setBox] = useState<PImg | null>(null);
  return (
    <section id="achievements" className="section" aria-labelledby="ach-h">
      <div className="container-x">
        <Reveal><p className="eyebrow">{eyebrow}</p><h2 id="ach-h" className="h2">{title}</h2></Reveal>
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((a, i) => (
            <Reveal as="li" key={a.id} delay={(i % 3) * 0.07} className="card flex flex-col overflow-hidden">
              {a.certificate && (
                <button type="button" onClick={() => setBox({ ...a.certificate!, alt: `${t.certificate}: ${a.title}` })} aria-label={t.viewCertificate} className="aspect-[4/3] w-full cursor-zoom-in overflow-hidden bg-paper-2">
                  <Pic img={a.certificate} alt={`${t.certificate}: ${a.title}`} sizes="(min-width:1024px) 400px, 90vw" />
                </button>
              )}
              <div className="flex flex-1 flex-col gap-3 p-5">
                <p className="flex items-center gap-2 text-sm"><span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider">{a.typeLabel}</span><span className="text-muted">{a.year}</span></p>
                <h3 className="font-display text-xl font-bold leading-snug">{a.title}</h3>
                <p className="text-sm text-ink-2">{a.issuer}</p>
                <button type="button" onClick={() => openAchievement(a.id)} aria-haspopup="dialog" className="btn btn-ghost mt-auto !min-h-11 self-start !px-4 text-sm"><Icon name="check" className="h-4 w-4" />{t.details}</button>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
      <Lightbox images={box ? [box] : []} index={box ? 0 : null} onIndex={() => {}} onClose={() => setBox(null)} t={g} />
    </section>
  );
}
export default function AchievementsGrid(p: Parameters<typeof Inner>[0]) { return <MotionRoot><Inner {...p} /></MotionRoot>; }
