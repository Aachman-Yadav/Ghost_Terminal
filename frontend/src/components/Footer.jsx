import React from 'react';
import { GitBranch, Shield, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="terminal-footer">
      <div>
        <strong>GhostTerminal AI</strong> — Built for{' '}
        <a
          href="https://dev.to/challenges/hacktoberfest-week4-2026-10-26"
          target="_blank"
          rel="noopener noreferrer"
        >
          Hacktoberfest 2026 Week 4 (Ghost in the Machine)
        </a>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Shield size={12} color="var(--phosphor)" /> 100% Local Open-Weight Inference
        </span>
        <a
          href="https://github.com/Aachman-Yadav/GhostTerminal_AI"
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'flex', alignItems: 'center', gap: 4 }}
        >
          <GitBranch size={12} /> GitHub Repository
        </a>
      </div>
    </footer>
  );
}
