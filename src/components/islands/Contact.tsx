import { AnimatePresence, m } from 'motion/react';
import { useRef, useState } from 'react';
import { Icon, MotionRoot, Reveal, type IconName } from './shared';

interface Props {
  eyebrow: string; title: string; subtitle: string; email: string;
  links: { key: string; label: string; value: string; href: string; icon: IconName }[];
  t: { copy: string; copied: string; copyFailed: string };
}

function Inner({ eyebrow, title, subtitle, email, links, t }: Props) {
  const [msg, setMsg] = useState('');
  const timer = useRef<number>(0);
  const toast = (s: string) => { setMsg(s); window.clearTimeout(timer.current); timer.current = window.setTimeout(() => setMsg(''), 2600); };
  const copy = async () => {
    try { await navigator.clipboard.writeText(email); toast(t.copied); }
    catch {
      try { const ta = document.createElement('textarea'); ta.value = email; ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select(); const ok = document.execCommand('copy'); ta.remove(); toast(ok ? t.copied : t.copyFailed); }
      catch { toast(t.copyFailed); }
    }
  };
  return (
    <section id="contact" className="section" aria-labelledby="contact-h">
      <div className="container-x">
        <Reveal><p className="eyebrow">{eyebrow}</p>
          <h2 id="contact-h" className="mt-4 font-display font-semibold" style={{ fontSize: 'clamp(2.4rem, 0.8rem + 8vw, 8rem)', lineHeight: 0.95 }}>{title}</h2>
          <p className="lead mt-6">{subtitle}</p></Reveal>
        <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {links.map((l, i) => (
            <Reveal as="li" key={l.key} delay={i * 0.05}>
              <a href={l.href} {...(l.key === 'email' ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
                className="card group flex min-h-24 items-center gap-4 p-5 no-underline transition-[transform,box-shadow] duration-300 active:scale-[0.98] hover:shadow-[var(--shadow-lift)]">
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-ink text-paper transition-colors duration-300 group-hover:bg-accent group-hover:text-ink"><Icon name={l.icon} className="h-7 w-7" /></span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-xl font-semibold tracking-tight">{l.label}</span>
                  <span className="block truncate text-sm text-muted">{l.value}</span>
                </span>
                <Icon name={l.key === 'email' ? 'arrow' : 'external'} className="h-5 w-5 shrink-0 text-muted transition-transform duration-300 group-hover:translate-x-0.5" />
                {l.key !== 'email' && <span className="sr-only"> (new tab)</span>}
              </a>
            </Reveal>
          ))}
        </ul>
        <button type="button" onClick={copy} className="btn btn-accent mt-8"><Icon name="copy" className="h-5 w-5" />{t.copy}</button>
      </div>
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[130] flex justify-center px-4" style={{ paddingBottom: 'calc(1.25rem + env(safe-area-inset-bottom))' }} role="status" aria-live="polite">
        <AnimatePresence>
          {msg && <m.p key={msg} initial={{ opacity: 0, y: 24, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12 }} className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-paper shadow-xl">{msg}</m.p>}
        </AnimatePresence>
      </div>
    </section>
  );
}
export default function Contact(p: Props) { return <MotionRoot><Inner {...p} /></MotionRoot>; }
