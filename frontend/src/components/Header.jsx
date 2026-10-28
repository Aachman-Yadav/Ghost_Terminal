import React from 'react';
import { Ghost, Volume2, VolumeX, Tv, Palette, Cpu, Sparkles } from 'lucide-react';

export default function Header({
  currentPersona,
  onOpenPersonaModal,
  theme,
  onCycleTheme,
  scanlines,
  onToggleScanlines,
  soundEnabled,
  onToggleSound,
  ollamaStatus,
}) {
  const themeLabels = {
    green: 'Ghost Green',
    amber: 'Amber Relic',
    blood: 'Blood Crimson',
    violet: 'Spectral Violet',
  };

  return (
    <header className="terminal-header">
      <div className="brand">
        <Ghost size={26} />
        <div>
          <h1>GHOST_TERMINAL.AI</h1>
          <div className="subtitle">
            HACKTOBERFEST 2026: GHOST IN THE MACHINE // LOCAL OPEN-WEIGHT AI
          </div>
        </div>
      </div>

      <div className="header-controls">
        {/* Current Spirit Persona */}
        <button
          className="btn-ctrl"
          onClick={onOpenPersonaModal}
          title="Change possessing spirit"
        >
          <span>{currentPersona.icon}</span>
          <span>{currentPersona.name}</span>
        </button>

        {/* Theme Color Cycle */}
        <button
          className="btn-ctrl"
          onClick={onCycleTheme}
          title={`Switch colorway (Current: ${themeLabels[theme] || theme})`}
        >
          <Palette size={14} />
          <span>{themeLabels[theme] || 'Theme'}</span>
        </button>

        {/* CRT Scanline Toggle */}
        <button
          className="btn-ctrl"
          onClick={onToggleScanlines}
          title="Toggle CRT Scanline effects"
        >
          <Tv size={14} />
          <span>CRT: {scanlines ? 'ON' : 'OFF'}</span>
        </button>

        {/* Web Audio Toggle */}
        <button
          className="btn-ctrl"
          onClick={onToggleSound}
          title="Toggle synthesized eerie sound FX"
        >
          {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
          <span>Audio: {soundEnabled ? 'ON' : 'MUTED'}</span>
        </button>

        {/* Ollama Health Status */}
        <div
          className="btn-ctrl"
          style={{
            borderColor: ollamaStatus.online ? 'var(--phosphor)' : '#ff5f56',
            color: ollamaStatus.online ? 'var(--phosphor)' : '#ff5f56',
          }}
          title={
            ollamaStatus.online
              ? `Connected to Ollama (${ollamaStatus.model})`
              : 'Ollama is offline (Demo fallback active)'
          }
        >
          <Cpu size={14} />
          <span>{ollamaStatus.online ? ollamaStatus.model : 'Offline Demo'}</span>
        </div>
      </div>
    </header>
  );
}
