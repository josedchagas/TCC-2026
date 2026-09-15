import { useEffect, useRef, useState } from "react";
import "./SaveSlots.css";

/**
 * Modal com os 8 slots de save (runs salvas automaticamente).
 * Só visual por enquanto — sem lógica de carregar/salvar de verdade.
 *
 * Props:
 * - open: boolean
 * - onClose: () => void
 * - slots: Array<Slot | null>   // até 8 posições; null = slot vazio
 * - onSelectSlot: (index: number) => void
 *
 * Slot = {
 *   characterName: string,
 *   chapterLabel: string,     // ex: "Capítulo 3 — A Vila Esquecida"
 *   lastPlayed: string,       // ex: "há 2 dias"
 * }
 */
export default function SaveSlots({ open, onClose, slots = [], onSelectSlot }) {
  const listRef = useRef(null);
  const [thumb, setThumb] = useState({ height: 100, top: 0 });
  const [scrollable, setScrollable] = useState(false);

  const updateThumb = () => {
    const el = listRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;

    if (scrollHeight <= clientHeight + 1) {
      setScrollable(false);
      return;
    }

    setScrollable(true);
    const thumbHeightPct = (clientHeight / scrollHeight) * 100;
    const maxTop = 100 - thumbHeightPct;
    const scrollPct = scrollTop / (scrollHeight - clientHeight);
    setThumb({ height: thumbHeightPct, top: scrollPct * maxTop });
  };

  useEffect(() => {
    if (open) updateThumb();
  }, [open, slots]);

  if (!open) return null;

  const allSlots = Array.from({ length: 8 }, (_, i) => slots[i] ?? null);

  return (
    <div className="save-slots-overlay" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="save-slots">
        <div className="save-slots__header">
          <h2 className="save-slots__title">Continuar</h2>
          <button onClick={onClose} aria-label="Fechar" className="save-slots__close">
            ×
          </button>
        </div>

        <div className="save-slots__scroll-wrap">
          <div className="save-slots__grid" ref={listRef} onScroll={updateThumb}>
            {allSlots.map((slot, i) =>
              slot ? (
                <div key={i} className="save-slot save-slot--filled">
                  <button
                    type="button"
                    className="save-slot__delete"
                    aria-label={`Excluir save do slot ${i + 1}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    ×
                  </button>
                  <button
                    type="button"
                    className="save-slot__body"
                    onClick={() => onSelectSlot?.(i)}
                  >
                    <span className="save-slot__index">Slot {i + 1}</span>
                    <span className="save-slot__character">{slot.characterName}</span>
                    <span className="save-slot__chapter">{slot.chapterLabel}</span>
                    <span className="save-slot__time">{slot.lastPlayed}</span>
                  </button>
                </div>
              ) : (
                <div key={i} className="save-slot save-slot--empty">
                  <span className="save-slot__index">Slot {i + 1}</span>
                  <span className="save-slot__empty-label">Vazio</span>
                </div>
              )
            )}
          </div>

          {scrollable && (
            <div className="save-slots__scrollbar-track">
              <div
                className="save-slots__scrollbar-thumb"
                style={{ height: `${thumb.height}%`, top: `${thumb.top}%` }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}