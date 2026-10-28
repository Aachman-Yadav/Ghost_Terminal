import React, { useState, useEffect } from 'react';
import { Terminal as TermIcon, Flame, Eye } from 'lucide-react';
import Header from './components/Header';
import TerminalScreen from './components/TerminalScreen';
import ExorciseModal from './components/ExorciseModal';
import OuijaBoard from './components/OuijaBoard';
import PersonaSelector from './components/PersonaSelector';
import Footer from './components/Footer';
import { checkHealth, listPersonas } from './services/api';
import { isSoundEnabled, toggleSound, playSoundFx } from './services/sound';

const DEFAULT_PERSONAS = [
  {
    id: 'spectre',
    name: 'The Segfault Spectre',
    title: 'Tortured Shade of Dangling Pointers',
    description: 'A programmer spirit cursed by an infinite recursive descent in 1989. Melodramatic and gothic.',
    icon: '👻',
  },
  {
    id: 'daemon',
    name: 'The Deprecated SysDaemon',
    title: 'Ancient Unix Process PID #13',
    description: 'A stubborn legacy background process that refused to terminate on SIGKILL. Sarcastic.',
    icon: '💀',
  },
  {
    id: 'lovelace',
    name: "Ada's Ghost",
    title: 'Spirit of the First Algorithm',
    description: 'The ethereal presence of Lady Ada Lovelace. Poetic and Victorian.',
    icon: '🕯️',
  },
  {
    id: 'void',
    name: 'The 0x00000000 Void Entity',
    title: 'Eldritch Horror of Null Memory',
    description: 'The nameless entity lurking at memory address 0. Whispers cosmic dread.',
    icon: '👁️',
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('terminal');
  const [theme, setTheme] = useState(() => localStorage.getItem('ghost_theme') || 'green');
  const [scanlines, setScanlines] = useState(() => localStorage.getItem('ghost_scanlines') !== 'false');
  const [soundOn, setSoundOn] = useState(() => isSoundEnabled());
  const [personaModalOpen, setPersonaModalOpen] = useState(false);
  const [personas, setPersonas] = useState(DEFAULT_PERSONAS);
  const [currentPersona, setCurrentPersona] = useState(DEFAULT_PERSONAS[0]);
  const [ollamaStatus, setOllamaStatus] = useState({ online: false, model: 'llama3.2' });

  // Apply theme class to document body
  useEffect(() => {
    document.body.className = `theme-${theme} ${scanlines ? 'scanlines' : ''}`;
    localStorage.setItem('ghost_theme', theme);
    localStorage.setItem('ghost_scanlines', scanlines);
  }, [theme, scanlines]);

  // Poll health and list personas
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const health = await checkHealth();
        setOllamaStatus({
          online: health.ollama_reachable,
          model: health.model_configured || 'llama3.2',
        });
        if (health.available_personas?.length) {
          setPersonas(health.available_personas);
        }
      } catch (err) {
        setOllamaStatus({ online: false, model: 'Offline Demo' });
      }
    };

    fetchStatus();
    const timer = setInterval(fetchStatus, 30000);
    return () => clearInterval(timer);
  }, []);

  const handleCycleTheme = () => {
    const themes = ['green', 'amber', 'blood', 'violet'];
    const nextIdx = (themes.indexOf(theme) + 1) % themes.length;
    setTheme(themes[nextIdx]);
    playSoundFx('bell');
  };

  const handleSetTheme = (newTheme) => {
    if (['green', 'amber', 'blood', 'violet'].includes(newTheme)) {
      setTheme(newTheme);
      playSoundFx('bell');
    }
  };

  const handleToggleSound = () => {
    const newState = toggleSound();
    setSoundOn(newState);
  };

  const handleSwitchPersona = (personaId) => {
    const found = personas.find((p) => p.id === personaId);
    if (found) {
      setCurrentPersona(found);
      playSoundFx('bell');
    }
  };

  return (
    <div className="ghost-app">
      <Header
        currentPersona={currentPersona}
        onOpenPersonaModal={() => setPersonaModalOpen(true)}
        theme={theme}
        onCycleTheme={handleCycleTheme}
        scanlines={scanlines}
        onToggleScanlines={() => setScanlines((prev) => !prev)}
        soundEnabled={soundOn}
        onToggleSound={handleToggleSound}
        ollamaStatus={ollamaStatus}
      />

      {/* Navigation Tabs */}
      <nav className="nav-tabs">
        <button
          className={`tab-btn ${activeTab === 'terminal' ? 'active' : ''}`}
          onClick={() => setActiveTab('terminal')}
        >
          <TermIcon size={16} />
          <span>Haunted Shell</span>
        </button>
        <button
          className={`tab-btn ${activeTab === 'exorcise' ? 'active' : ''}`}
          onClick={() => setActiveTab('exorcise')}
        >
          <Flame size={16} />
          <span>Exorcism Altar</span>
        </button>
        <button
          className={`tab-btn ${activeTab === 'ouija' ? 'active' : ''}`}
          onClick={() => setActiveTab('ouija')}
        >
          <Eye size={16} />
          <span>Digital Ouija</span>
        </button>
      </nav>

      {/* Main Tab Content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {activeTab === 'terminal' && (
          <TerminalScreen
            currentPersona={currentPersona}
            onSwitchTab={setActiveTab}
            onSwitchPersona={handleSwitchPersona}
            onSetTheme={handleSetTheme}
          />
        )}
        {activeTab === 'exorcise' && (
          <ExorciseModal currentPersona={currentPersona} />
        )}
        {activeTab === 'ouija' && (
          <OuijaBoard currentPersona={currentPersona} />
        )}
      </main>

      <Footer />

      <PersonaSelector
        isOpen={personaModalOpen}
        onClose={() => setPersonaModalOpen(false)}
        personas={personas}
        currentPersona={currentPersona}
        onSelectPersona={(p) => {
          setCurrentPersona(p);
          playSoundFx('bell');
        }}
      />
    </div>
  );
}
