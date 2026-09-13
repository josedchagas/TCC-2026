import "./Statusmodal.css";

const STAT_LABELS = {
  forca: "Força",
  destreza: "Destreza",
  inteligencia: "Inteligência",
  resistencia: "Resistência",
  agilidade: "Agilidade",
};

const STAT_MAX = 20;

/**
 * Modal centralizado com os atributos do personagem.
 * Props:
 * - open: boolean
 * - onClose: () => void
 * - stats: { forca, destreza, inteligencia, resistencia, agilidade } (0-20)
 */
export default function StatusModal({ open, onClose, stats = {} }) {
  if (!open) return null;

  return (
    <div className="status-modal-overlay" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="status-modal">
        <div className="status-modal__header">
          <h2 className="status-modal__title">Status</h2>
          <button onClick={onClose} aria-label="Fechar" className="status-modal__close">
            ×
          </button>
        </div>

        <div className="status-modal__list">
          {Object.entries(STAT_LABELS).map(([key, label]) => {
            const value = stats[key] ?? 0;
            return (
              <div key={key}>
                <div className="status-modal__row-head">
                  <span>{label}</span>
                  <span className="status-modal__row-value">{value}</span>
                </div>
                <div className="status-modal__bar-track">
                  <div
                    className="status-modal__bar-fill"
                    style={{ width: `${Math.min(100, (value / STAT_MAX) * 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}