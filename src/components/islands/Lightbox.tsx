import { AnimatePresence, m } from 'motion/react';
import { useCallback, useEffect } from 'react';
import { Icon, Pic, fmt, useDialog, useScrollLock } from './shared';
import { overlay } from '~/lib/motion';
import type { PImg } from '~/lib/content';

export interface LightboxText { prev: string; next: string; close: string; counter: string }

/** Fullscreen viewer. `layoutPrefix` enables a shared-element (layoutId) transition from the matching thumbnail. */
export function Lightbox({ images, index, onIndex, onClose, t, layoutPrefix }: {
  images: PImg[]; index: number | null; onIndex: (i: number) => void; onClose: () => void; t: LightboxText; layoutPrefix?: string;
}) {
  const open = index !== null;
  useScrollLock(open);
  const ref = useDialog<HTMLDivElement>(open, onClose);
  const go = useCallback((d: number) => { if (index !== null) onIndex((index + d + images.length) % images.length); }, [index, images.length, onIndex]);

  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => { if (e.key === 'ArrowRight') go(1); if (e.key === 'ArrowLeft') go(-1); };
    window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k);
  }, [open, go]);

  const img = index !== null ? images[index] : null;
  return (
    <AnimatePresence>
      {img && index !== null && (
        <m.div ref={ref} role="dialog" aria-modal="true" aria-label={img.alt} tabIndex={-1} className="fixed inset-0 z-[120] flex flex-col bg-ink/95"
          variants={overlay} initial="hidden" animate="show" exit="exit" onClick={onClose}
          style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
          <div className="flex items-center justify-between p-4 text-paper" onClick={(e) => e.stopPropagation()}>
            <span aria-live="polite" className="text-sm font-medium tabular-nums">{fmt(t.counter, { n: index + 1, total: images.length })}</span>
            <button type="button" data-autofocus onClick={onClose} aria-label={t.close} className="tap grid place-items-center rounded-full border border-paper/30"><Icon name="x" /></button>
          </div>
          <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 sm:px-16">
            <m.div key={index} layoutId={layoutPrefix ? `${layoutPrefix}-${index}` : undefined} className="max-h-full max-w-full overflow-hidden rounded-xl"
              style={{ aspectRatio: `${img.w} / ${img.h}`, maxHeight: '100%', maxWidth: '100%' }}
              onClick={(e) => e.stopPropagation()} drag={images.length > 1 ? 'x' : false} dragDirectionLock dragSnapToOrigin dragElastic={0.3}
              onDragEnd={(_, i) => { if (Math.abs(i.offset.x) > 70) go(i.offset.x < 0 ? 1 : -1); }}>
              <Pic img={img} alt={img.alt} sizes="100vw" className="!object-contain" />
            </m.div>
            {images.length > 1 && (
              <>
                <button type="button" onClick={(e) => { e.stopPropagation(); go(-1); }} aria-label={t.prev} className="tap absolute left-2 grid place-items-center rounded-full bg-paper/90 text-ink sm:left-4"><Icon name="left" /></button>
                <button type="button" onClick={(e) => { e.stopPropagation(); go(1); }} aria-label={t.next} className="tap absolute right-2 grid place-items-center rounded-full bg-paper/90 text-ink sm:right-4"><Icon name="right" /></button>
              </>
            )}
          </div>
          <p className="p-4 text-center text-sm text-paper/80">{img.alt}</p>
        </m.div>
      )}
    </AnimatePresence>
  );
}
