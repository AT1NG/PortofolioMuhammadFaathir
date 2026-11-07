import { AnimatePresence, m, useMotionValueEvent, useScroll } from 'motion/react';
import { useEffect, useState } from 'react';
import { MotionRoot, Icon, useDialog, useScrollLock } from './shared';
import { ease, spring } from '~/lib/motion';

interface Props {
  lang: 'en' | 'id'; isHome: boolean; homeHref: string; items: { id: string; label: string }[];
  altHref: string; otherLang: 'en' | 'id'; name: string;
  t: { menuOpen: string; menuClose: string; main: string; language: string; switchTo: string; contact: string };
}

function Inner({ lang, isHome, homeHref, items, altHref, otherLang, name, t }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, 'change', (v) => setScrolled(v > 24));
  useScrollLock(open);
  const panel = useDialog<HTMLDivElement>(open, () => setOpen(false));

  useEffect(() => {
    if (!isHome) return;
    const els = items.map((i) => document.getElementById(i.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver((es) => {
      for (const e of es) if (e.isIntersecting) setActive(e.target.id);
    }, { rootMargin: '-45% 0px -50% 0px' });
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [isHome, items]);

  const href = (id: string) => (isHome ? `#${id}` : `${homeHref}#${id}`);
  const switchLang = () => { try { localStorage.setItem('lang', otherLang); } catch { /* private mode */ } };

  return (
    <header className="fixed inset-x-0 top-0 z-50" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
      <div className={`transition-[background-color,backdrop-filter,box-shadow] duration-300 ${scrolled ? 'bg-paper/75 shadow-[0_1px_0_var(--color-line)] backdrop-blur-xl' : ''}`}>
        <div className="container-x flex items-center justify-between" style={{ height: scrolled ? '3.75rem' : '4.75rem', transition: 'height .3s var(--ease-out)' }}>
          <a href={homeHref} className="tap flex items-center font-display text-xl font-semibold tracking-tight">
            {name}<span className="text-accent">.</span>
          </a>

          <nav aria-label={t.main} className="hidden items-center gap-1 lg:flex">
            {items.map((i) => (
              <a key={i.id} href={href(i.id)} aria-current={active === i.id ? 'true' : undefined}
                className="relative flex min-h-11 items-center rounded-full px-4 text-[0.95rem] font-medium">
                {active === i.id && <m.span layoutId="nav-pill" className="absolute inset-0 -z-10 rounded-full bg-ink/8" style={{ background: 'rgb(18 18 18 / .08)' }} transition={spring.pill} />}
                {i.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a href={altHref} hrefLang={otherLang} lang={otherLang} onClick={switchLang} aria-label={`${otherLang.toUpperCase()}: ${t.switchTo}`}
              className="tap grid place-items-center rounded-full border border-line px-3 text-sm font-bold uppercase tracking-wider">
              {otherLang}
            </a>
            <button type="button" className="tap grid place-items-center rounded-full border border-line lg:hidden" aria-expanded={open} aria-controls="mobile-menu"
              aria-label={open ? t.menuClose : t.menuOpen} onClick={() => setOpen((o) => !o)}>
              <Icon name={open ? 'x' : 'menu'} />
            </button>
            <a href={href('contact')} className="btn btn-solid hidden !min-h-11 !px-5 text-sm lg:inline-flex">{t.contact}</a>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <m.div id="mobile-menu" ref={panel} role="dialog" aria-modal="true" aria-label={t.main} tabIndex={-1}
            className="fixed inset-0 z-[-1] flex flex-col bg-paper lg:hidden"
            style={{ paddingTop: 'calc(5.5rem + env(safe-area-inset-top))', paddingBottom: 'env(safe-area-inset-bottom)', height: '100dvh' }}
            initial={{ clipPath: 'inset(0 0 100% 0)' }} animate={{ clipPath: 'inset(0 0 0% 0)' }} exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.5, ease: ease.inOut }}>
            <m.ul className="container-x flex flex-1 flex-col justify-center gap-1 overflow-y-auto py-6"
              initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: 0.2 } } }}>
              {items.map((i) => (
                <m.li key={i.id} variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: ease.out } } }}>
                  <a href={href(i.id)} onClick={() => setOpen(false)} className="flex min-h-14 items-center justify-between border-b border-line py-2 font-display text-4xl font-bold tracking-tight">
                    {i.label}<Icon name="arrow" className="h-6 w-6 text-accent-ink" />
                  </a>
                </m.li>
              ))}
            </m.ul>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default function Navbar(p: Props) {
  return <MotionRoot><Inner {...p} /></MotionRoot>;
}
