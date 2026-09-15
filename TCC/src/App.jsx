import { useState } from "react";
import Menu from "./Menu";
import CharacterPanel from "./Characterpanel";
import StatusModal from "./Statusmodal";
import BattleModal from "./Battlemodal";
import StoryPanel from "./Storypanel";
import "./App.css";

export default function App() {
  const [screen, setScreen] = useState("menu"); // "menu" | "game"
  const [statusOpen, setStatusOpen] = useState(false);
  const [battleOpen, setBattleOpen] = useState(false);

  // Enquanto estiver na tela de menu, mostra só o Menu e para aqui.
  if (screen === "menu") {
    return (
      <Menu
        title="A Vila Esquecida"
        subtitle="Uma jornada por terras abandonadas"
        onPlay={() => setScreen("game")}
        onSelectCharacter={() => {
          // por enquanto só um placeholder — depois liga na tela de seleção de personagem
          console.log("abrir seleção de personagem");
        }}
      />
    );
  }

  // Daqui pra baixo é exatamente o App que você já tinha.
  return (
    <div className="app-shell">
      <div className="app-stage">
        <CharacterPanel
          xp={{ current: 40, max: 100 }}
          hp={{ current: 4, max: 5 }}
          energy={{ current: 5, max: 5 }}
          money={128}
          inventory={[]}
          equipment={[]}
          statusOpen={statusOpen}
          onToggleStatus={() => setStatusOpen((v) => !v)}
        />

        <StoryPanel
          chapterLabel="Capítulo 1 — A Vila Esquecida"
          progress={{ current: 3, max: 12 }}
          storyText={
            <p>
              Você chega à entrada da vila abandonada. O vento carrega um cheiro de
              fumaça antiga, e ao longe, algo se move entre as ruínas.
            </p>
          }
          actions={[
            { id: "explore", label: "Explorar a vila", onClick: () => {} },
            { id: "fight", label: "Investigar o movimento", onClick: () => setBattleOpen(true) },
          ]}
        />
      </div>

      <StatusModal
        open={statusOpen}
        onClose={() => setStatusOpen(false)}
        stats={{ forca: 8, destreza: 12, inteligencia: 6, resistencia: 10, agilidade: 9 }}
        availablePoints={3}
      />

      <BattleModal
        open={battleOpen}
        onClose={() => setBattleOpen(false)}
        enemyName="Lobo das Sombras"
        playerHp={{ current: 80, max: 100 }}
        enemyHp={{ current: 45, max: 100 }}
        drops={[]}
      />
    </div>
  );
}