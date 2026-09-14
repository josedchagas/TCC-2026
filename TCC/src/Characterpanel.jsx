import "./CharacterPanel.css";

/**
 * Painel lateral do personagem.
 *
 * Props:
 * - avatarUrl: string
 * - xp: { current: number, max: number }
 * - hp: { current: number, max: number }        // max define quantos "corações" aparecem
 * - energy: { current: number, max: number }     // max define quantos "pingos" aparecem
 * - money: number
 * - inventory: Array<{ id, icon, qty }>          // até 8 slots
 * - equipment: Array<{ id, slot, icon }>          // slot: 'helmet' | 'weapon' | 'chest' | 'pants' | 'shield' | 'boots' | 'ring'
 * - statusOpen: boolean                           // vem do App — se o StatusModal está aberto
 * - onToggleStatus: () => void                    // avisa o App pra abrir/fechar o StatusModal
 */
export default function CharacterPanel({
  avatarUrl,
  xp = { current: 40, max: 100 },
  hp = { current: 4, max: 5 },
  energy = { current: 5, max: 5 },
  money = 0,
  inventory = [],
  equipment = [],
  statusOpen = false,
  onToggleStatus,
}) {
  const inventorySlots = Array.from({ length: 8 }, (_, i) => inventory[i] ?? null);

  const equipmentLayout = [
    null, "helmet", null,
    "weapon", "chest", "shield",
    null, "pants", null,
    "ring", "boots", "ring",
  ];

  const equipmentBySlot = {};
  equipment.forEach((e) => {
    if (!equipmentBySlot[e.slot]) equipmentBySlot[e.slot] = [];
    equipmentBySlot[e.slot].push(e);
  });
  const usedCount = {};

  return (
    <aside className="char-panel">
      {/* Avatar */}
      <div className="char-panel__avatar-block">
        <div className="char-panel__avatar">
          {avatarUrl ? (
            <img src={avatarUrl} alt="Avatar do personagem" className="char-panel__avatar-img" />
          ) : (
            <div className="char-panel__avatar-empty">sem avatar</div>
          )}
        </div>

        {/* XP */}
        <div className="char-panel__xp-wrap">
          <div className="char-panel__xp-track">
            <div
              className="char-panel__xp-fill"
              style={{ width: `${Math.min(100, (xp.current / xp.max) * 100)}%` }}
            />
          </div>
          <p className="char-panel__xp-label">
            {xp.current} / {xp.max} XP
          </p>
        </div>

        <button onClick={onToggleStatus} className="char-panel__status-btn">
          {statusOpen ? "Fechar status" : "Ver status"}
        </button>
      </div>

      {/* Vida */}
      <StatRow label="Vida">
        {Array.from({ length: hp.max }, (_, i) => (
          <Heart key={i} filled={i < hp.current} />
        ))}
      </StatRow>

      {/* Energia */}
      <StatRow label="Energia">
        {Array.from({ length: energy.max }, (_, i) => (
          <Drop key={i} filled={i < energy.current} />
        ))}
      </StatRow>

      {/* Inventário */}
      <div>
        <h3 className="char-panel__section-title">Inventário</h3>
        <div className="char-panel__grid">
          {inventorySlots.map((item, i) => (
            <Slot key={i} item={item} />
          ))}
        </div>
      </div>

      {/* Equipamentos */}
      <div>
        <h3 className="char-panel__section-title">Equipamentos</h3>
        <div className="char-panel__grid char-panel__grid--equipment">
          {equipmentLayout.map((slotType, i) => {
            if (!slotType) return <div key={i} />;
            usedCount[slotType] = (usedCount[slotType] ?? 0);
            const item = equipmentBySlot[slotType]?.[usedCount[slotType]];
            usedCount[slotType] += 1;
            return <Slot key={i} item={item} placeholderLabel={slotType} />;
          })}
        </div>
      </div>

      {/* Dinheiro */}
      <div className="char-panel__money">
        <span className="char-panel__money-label">Moedas</span>
        <span className="char-panel__money-value">{money}</span>
      </div>
    </aside>
  );
}

function StatRow({ label, children }) {
  return (
    <div className="stat-row">
      <h3 className="stat-row__label">{label}</h3>
      <div className="stat-row__icons">{children}</div>
    </div>
  );
}

function Slot({ item, placeholderLabel }) {
  return (
    <div className="slot" title={item?.id ?? placeholderLabel ?? ""}>
      {item?.icon && <img src={item.icon} alt={item.id} className="slot__icon" />}
      {item?.qty > 1 && <span className="slot__qty">{item.qty}</span>}
      {!item && placeholderLabel && (
        <span className="slot__placeholder">
          {placeholderLabel === "helmet" && "elmo"}
          {placeholderLabel === "weapon" && "arma"}
          {placeholderLabel === "chest" && "peito"}
          {placeholderLabel === "pants" && "calça"}
          {placeholderLabel === "shield" && "escudo"}
          {placeholderLabel === "boots" && "botas"}
          {placeholderLabel === "ring" && "anel"}
        </span>
      )}
    </div>
  );
}

function Heart({ filled }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" className={filled ? "icon-heart--filled" : "icon-heart--empty"}>
      <path d="M12 21s-6.7-4.35-9.3-8.2C.8 9.9 1.6 6.3 4.7 5.1c2-.8 4.1 0 5.3 1.7C11.2 5.1 13.3 4.3 15.3 5.1c3.1 1.2 3.9 4.8 2 7.7C18.7 16.65 12 21 12 21z" />
    </svg>
  );
}

function Drop({ filled }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" className={filled ? "icon-drop--filled" : "icon-drop--empty"}>
      <path d="M12 2s6 7.5 6 12a6 6 0 1 1-12 0c0-4.5 6-12 6-12z" />
    </svg>
  );
}