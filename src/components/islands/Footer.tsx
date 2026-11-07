import { m, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { Icon, MotionRoot, type IconName } from './shared';

interface Props {
  name: string; rights: string; built: string; backToTop: string; year: number;
  socials: { label: string; href: string; icon: IconName }[]; githubLabel: string;
}

function Inner({ name, rights, built, backToTop, year, socials }: Props) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] });
  const y = useTransform(scrollYProgress, [0, 1], ['45%', '0%']);
  const up = () => {
    const l = (window as unknown as { __lenis?: { scrollTo(n: number): void } }).__lenis;
    if (l) l.scrollTo(0); else window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };
  return (
    <footer ref={ref} className="overflow-hidden border-t border-line bg-ink text-paper" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="container-x pt-14">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <ul className="flex flex-wrap gap-2">
            {socials.map((s) => (
              <li key={s.label}><a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={`${s.label} (new tab)`} className="tap grid place-items-center rounded-full border border-paper/30 px-4 text-sm font-semibold hover:bg-paper hover:text-ink">
                <span className="flex items-center gap-2"><Icon name={s.icon} className="h-4 w-4" />{s.label}</span></a></li>
            ))}
          </ul>
          <button type="button" onClick={up} className="btn !border-paper text-paper active:scale-95"><Icon name="up" />{backToTop}</button>
        </div>
      </div>
      <div className="overflow-hidden" aria-hidden="true">
        <m.p style={{ y }} className="select-none whitespace-nowrap text-center font-display font-semibold leading-[0.85] tracking-tighter text-paper" >
          <span style={{ fontSize: 'clamp(3rem, 15.5vw, 17rem)' }}>{name}</span>
        </m.p>
      </div>
      <div className="container-x flex flex-wrap items-center justify-between gap-2 py-6 text-sm text-paper/70">
        <p>© {year} Muhammad Faathir. {rights}</p>
      </div>
    </footer>
  );
}
export default function Footer(p: Props) { return <MotionRoot><Inner {...p} /></MotionRoot>; }
