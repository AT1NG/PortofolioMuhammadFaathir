import { m } from 'motion/react';
import { useId, useRef } from 'react';
import { spring } from '~/lib/motion';

/** Accessible tab list (roving tabindex, arrow/Home/End keys) with a sliding pill (layoutId). */
export function Tabs<T extends string>({ tabs, value, onChange, label, panelId }: {
  tabs: { id: T; label: string }[]; value: T; onChange: (v: T) => void; label: string; panelId: string;
}) {
  const uid = useId();
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});
  const onKey = (e: React.KeyboardEvent, i: number) => {
    let n = -1;
    if (e.key === 'ArrowRight') n = (i + 1) % tabs.length;
    else if (e.key === 'ArrowLeft') n = (i - 1 + tabs.length) % tabs.length;
    else if (e.key === 'Home') n = 0;
    else if (e.key === 'End') n = tabs.length - 1;
    if (n < 0) return;
    e.preventDefault(); onChange(tabs[n].id); refs.current[tabs[n].id]?.focus();
  };
  return (
    <div role="tablist" aria-label={label} className="tablist">
      {tabs.map((t, i) => (
        <button key={t.id} ref={(el) => { refs.current[t.id] = el; }} role="tab" type="button" id={`${uid}-${t.id}`} aria-selected={value === t.id} aria-controls={panelId}
          tabIndex={value === t.id ? 0 : -1} className="tab" onClick={() => onChange(t.id)} onKeyDown={(e) => onKey(e, i)}>
          {value === t.id && <m.span layoutId={`pill-${uid}`} className="tab-pill" transition={spring.pill} />}
          {t.label}
        </button>
      ))}
    </div>
  );
}
