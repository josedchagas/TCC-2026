import { useState } from "react";
import SaveSlots from "./SaveSlots";
import "./Menu.css";

// Dados de exemplo só pra visualização — troque pelos saves reais depois.
const EXAMPLE_SLOTS = [
  { characterName: "Elyra", chapterLabel: "Capítulo 3 — A Vila Esquecida", lastPlayed: "há 2 dias" },
  { characterName: "Bram", chapterLabel: "Capítulo 1 — A Vila Esquecida", lastPlayed: "há 1 semana" },
  null,
  { characterName: "Sora", chapterLabel: "Capítulo 5 — O Bosque Negro", lastPlayed: "há 3 horas" },
  null,
  null,
  null,
  null,
];

/**
 * Tela inicial do jogo.
 * Props:
 * - title: string                 // nome do jogo
 * - subtitle: string               // frase/tagline abaixo do título (opcional)
 * - onPlay: () => void             // chamado DEPOIS que a transição de saída termina
 * - onSelectCharacter: () => void
 */
export default function Menu({
  title = "Nome do Jogo",
  subtitle,
  onPlay,
  onSelectCharacter,
}) {
  const [isExiting, setIsExiting] = useState(false);
  const [savesOpen, setSavesOpen] = useState(false);

  const handlePlay = () => {
    setIsExiting(true);
    // precisa bater com a duração da transição no Menu.css (.menu--exiting)
    setTimeout(() => {
      onPlay?.();
    }, 400);
  };

  return (
    <div className={`menu ${isExiting ? "menu--exiting" : ""}`}>
      <div className="menu__vignette" />

      <div className="menu__content">
        <h1 className="menu__title">{title}</h1>
        {subtitle && <p className="menu__subtitle">{subtitle}</p>}

        <div className="menu__divider" />

        <div className="menu__buttons">
          <button type="button" className="menu__btn menu__btn--primary" onClick={handlePlay}>
            Jogar
          </button>
          <button
            type="button"
            className="menu__btn menu__btn--secondary"
            onClick={() => setSavesOpen(true)}
          >
            Continuar
          </button>
          <button
            type="button"
            className="menu__btn menu__btn--secondary"
            onClick={onSelectCharacter}
          >
            Seleção de Personagem
          </button>
        </div>
      </div>

      <SaveSlots
        open={savesOpen}
        onClose={() => setSavesOpen(false)}
        slots={EXAMPLE_SLOTS}
        onSelectSlot={(i) => console.log("carregar slot", i)}
      />
    </div>
  );
}