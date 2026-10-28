import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Send, Trash2, HelpCircle } from 'lucide-react';
import { possessCommand } from '../services/api';
import { playKeySound, playSoundFx } from '../services/sound';

const QUICK_COMMANDS = [
  'git push --force origin main',
  'rm -rf /node_modules',
  'kill -9 1',
  'curl http://netherworld.internal/soul',
  'npm audit fix --force',
  'select * from mortal_memories where alive=false',
  'python -c "import afterlife"',
];

export default function TerminalScreen({
  currentPersona,
  onSwitchTab,
  onSwitchPersona,
  onSetTheme,
}) {
  const [history, setHistory] = useState([
    {
      type: 'system',
      text: '*** GHOST_TERMINAL.AI v1.0.0 INITIALIZED ***\nA presence has manifested in the local memory space.\nType any shell command, or enter "help" for a list of invocations.',
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);
  const [cmdHistory, setCmdHistory] = useState([]);
  const [historyIdx, setHistoryIdx] = useState(-1);

  const feedRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [history, loading]);

  const handleKeyDown = (e) => {
    playKeySound();

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length > 0) {
        const nextIdx = historyIdx + 1 < cmdHistory.length ? historyIdx + 1 : historyIdx;
        setHistoryIdx(nextIdx);
        setInputVal(cmdHistory[cmdHistory.length - 1 - nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx > 0) {
        const nextIdx = historyIdx - 1;
        setHistoryIdx(nextIdx);
        setInputVal(cmdHistory[cmdHistory.length - 1 - nextIdx]);
      } else if (historyIdx === 0) {
        setHistoryIdx(-1);
        setInputVal('');
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      executeCommand(inputVal);
    }
  };

  const executeCommand = async (cmd) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    setInputVal('');
    setHistoryIdx(-1);
    setCmdHistory((prev) => [...prev, trimmed]);

    // Handle internal shell navigation commands
    const lower = trimmed.toLowerCase();
    if (lower === 'clear' || lower === 'cls') {
      setHistory([]);
      return;
    }

    if (lower === 'help' || lower === '?') {
      setHistory((prev) => [
        ...prev,
        { type: 'user', cmd: trimmed },
        {
          type: 'help',
          text: `AVAILABLE INVOCATIONS:
  <any command>       Execute any shell command to witness the ghost's reaction
  exorcise            Open the code exorcism altar to cleanse broken stack traces
  ouija               Open the digital Ouija board to question the spirits
  summon <spirit>     Summon a different entity: spectre, daemon, lovelace, void
  theme <color>       Set phosphor hue: green, amber, blood, violet
  clear               Wipe the terminal screen of lingering ectoplasm`,
        },
      ]);
      return;
    }

    if (lower.startsWith('summon ')) {
      const target = lower.replace('summon ', '').trim();
      onSwitchPersona(target);
      setHistory((prev) => [
        ...prev,
        { type: 'user', cmd: trimmed },
        { type: 'system', text: `[RITUAL] The terminal air turns cold. Persona switched to: ${target}` },
      ]);
      playSoundFx('bell');
      return;
    }

    if (lower === 'exorcise') {
      onSwitchTab('exorcise');
      return;
    }

    if (lower === 'ouija') {
      onSwitchTab('ouija');
      return;
    }

    if (lower.startsWith('theme ')) {
      const color = lower.replace('theme ', '').trim();
      onSetTheme(color);
      setHistory((prev) => [
        ...prev,
        { type: 'user', cmd: trimmed },
        { type: 'system', text: `[DISPLAY] Phosphor color recalibrated to: ${color}` },
      ]);
      return;
    }

    // Call Ghost API to possess command
    setHistory((prev) => [...prev, { type: 'user', cmd: trimmed }]);
    setLoading(true);

    try {
      const resp = await possessCommand(trimmed, currentPersona.id);
      playSoundFx(resp.sound_fx || 'whisper');
      setHistory((prev) => [
        ...prev,
        {
          type: 'ghost',
          ghostName: resp.ghost_name,
          whisper: resp.whisper,
          asciiArt: resp.ascii_art,
          eerieCode: resp.eerie_code,
        },
      ]);
    } catch (err) {
      playSoundFx('glitch');
      setHistory((prev) => [
        ...prev,
        {
          type: 'error',
          text: `[STATIC DISTURBANCE] ${err.message}`,
        },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  return (
    <div className="terminal-window">
      {/* Titlebar */}
      <div className="terminal-titlebar">
        <div className="window-dots">
          <span className="dot red" />
          <span className="dot yellow" />
          <span className="dot green" />
        </div>
        <div>tty0 :: {currentPersona.name} [POSSESSED]</div>
        <button
          onClick={() => setHistory([])}
          className="btn-ctrl"
          style={{ padding: '2px 8px', fontSize: '0.7rem' }}
          title="Clear screen"
        >
          <Trash2 size={12} /> Clear
        </button>
      </div>

      {/* Main Terminal Output Feed */}
      <div className="terminal-feed" ref={feedRef}>
        {history.map((entry, idx) => {
          if (entry.type === 'system') {
            return (
              <div key={idx} style={{ opacity: 0.8, whiteSpace: 'pre-line' }}>
                {entry.text}
              </div>
            );
          }
          if (entry.type === 'help') {
            return (
              <div
                key={idx}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  padding: '10px 14px',
                  borderRadius: 4,
                  whiteSpace: 'pre-wrap',
                  lineHeight: 1.4,
                }}
              >
                {entry.text}
              </div>
            );
          }
          if (entry.type === 'user') {
            return (
              <div key={idx} className="term-cmd">
                <span className="prompt-symbol">ghost@machine:~$</span>
                <span>{entry.cmd}</span>
              </div>
            );
          }
          if (entry.type === 'ghost') {
            return (
              <div key={idx} className="term-ghost-response">
                <div className="ghost-header">
                  <span>{entry.ghostName} whispers</span>
                  <span>[{entry.eerieCode}]</span>
                </div>
                <div className="ghost-whisper">{entry.whisper}</div>
                {entry.asciiArt && <div className="ghost-ascii">{entry.asciiArt}</div>}
              </div>
            );
          }
          if (entry.type === 'error') {
            return (
              <div key={idx} style={{ color: '#ff5f56', fontStyle: 'italic' }}>
                {entry.text}
              </div>
            );
          }
          return null;
        })}

        {loading && (
          <div style={{ fontStyle: 'italic', opacity: 0.7 }}>
            [The veil shivers... {currentPersona.name} is listening...]
          </div>
        )}
      </div>

      {/* Quick Prompt Suggestions */}
      <div className="quick-prompts">
        <span style={{ fontSize: '0.7rem', opacity: 0.6, alignSelf: 'center' }}>Try:</span>
        {QUICK_COMMANDS.map((cmd, i) => (
          <button
            key={i}
            className="prompt-pill"
            onClick={() => executeCommand(cmd)}
          >
            {cmd}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="terminal-input-bar">
        <span className="prompt-symbol">ghost@machine:~$</span>
        <input
          ref={inputRef}
          type="text"
          className="terminal-input"
          placeholder="Type a shell command or 'help'..."
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
        />
        <button
          className="btn-ctrl"
          onClick={() => executeCommand(inputVal)}
          disabled={loading || !inputVal.trim()}
        >
          <Send size={14} />
        </button>
      </div>
    </div>
  );
}
