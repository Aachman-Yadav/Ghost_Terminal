import React, { useState } from 'react';
import { Flame, Check, Copy, AlertTriangle, Sparkles } from 'lucide-react';
import { exorciseCode } from '../services/api';
import { playSoundFx } from '../services/sound';

const PRESET_CURSES = [
  {
    name: 'Zero Division Spectre',
    lang: 'python',
    code: `def calculate_mortality_rate(deaths, population):\n    # Crashes when population == 0!\n    rate = (deaths / population) * 1000\n    return f"Rate: {rate} per mille"`,
  },
  {
    name: 'Infinite Recursive Ghost',
    lang: 'javascript',
    code: `function summonAncestors(count) {\n  console.log("Calling spirit: " + count);\n  // Missing base case!\n  return summonAncestors(count + 1);\n}`,
  },
  {
    name: 'C Cursed Pointer',
    lang: 'c',
    code: `void access_forbidden_memory() {\n    int *ptr = NULL;\n    // Dereferencing NULL!\n    printf("%d", *ptr);\n}`,
  },
];

export default function ExorciseModal({ currentPersona }) {
  const [code, setCode] = useState(PRESET_CURSES[0].code);
  const [lang, setLang] = useState('python');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);

  const handleExorcise = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setError(null);
    playSoundFx('bell');

    try {
      const resp = await exorciseCode(code, lang, currentPersona.id);
      setResult(resp);
      playSoundFx('whisper');
    } catch (err) {
      setError(err.message);
      playSoundFx('screech');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!result?.cleansed_code) return;
    navigator.clipboard.writeText(result.cleansed_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="altar-container">
      {/* Left Column: Altar Input */}
      <div className="altar-card">
        <div className="altar-title">
          <Flame size={20} color="#ff3366" />
          <span>The Exorcism Altar</span>
        </div>
        <p style={{ fontSize: '0.8rem', opacity: 0.8 }}>
          Place your cursed code or crash traceback upon the altar. {currentPersona.name} will diagnose the demonic bug and cleanse it with working code.
        </p>

        {/* Presets */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', opacity: 0.7, alignSelf: 'center' }}>Samples:</span>
          {PRESET_CURSES.map((preset, i) => (
            <button
              key={i}
              className="btn-ctrl"
              style={{ fontSize: '0.75rem', padding: '3px 8px' }}
              onClick={() => {
                setCode(preset.code);
                setLang(preset.lang);
              }}
            >
              {preset.name}
            </button>
          ))}
        </div>

        <textarea
          className="code-textarea"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Paste cursed code or stack trace here..."
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="btn-ctrl"
            style={{ padding: '8px 12px' }}
          >
            <option value="python">Python</option>
            <option value="javascript">JavaScript / TypeScript</option>
            <option value="c">C / C++</option>
            <option value="rust">Rust</option>
            <option value="go">Go</option>
            <option value="sql">SQL</option>
          </select>

          <button
            className="btn-spooky"
            onClick={handleExorcise}
            disabled={loading || !code.trim()}
          >
            <Flame size={16} />
            <span>{loading ? 'Cleansing Code...' : 'Perform Exorcism'}</span>
          </button>
        </div>

        {error && (
          <div style={{ color: '#ff5f56', fontSize: '0.85rem' }}>
            [Exorcism Interrupted] {error}
          </div>
        )}
      </div>

      {/* Right Column: Cleaned Code Output */}
      <div className="altar-card">
        <div className="altar-title">
          <Sparkles size={20} />
          <span>Cleansed Artifact</span>
        </div>

        {result ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
            {/* Diagnosis */}
            <div style={{ padding: 10, background: 'rgba(255, 51, 102, 0.1)', borderLeft: '3px solid #ff3366', borderRadius: 4 }}>
              <div style={{ fontSize: '0.75rem', color: '#ff3366', fontWeight: 700, textTransform: 'uppercase' }}>
                Curse Diagnosis
              </div>
              <div style={{ fontSize: '0.9rem', marginTop: 4 }}>{result.curse_diagnosis}</div>
            </div>

            {/* Clean Code */}
            <div style={{ position: 'relative' }}>
              <button
                className="btn-ctrl"
                onClick={copyToClipboard}
                style={{ position: 'absolute', top: 8, right: 8, zIndex: 2, background: 'rgba(0,0,0,0.6)' }}
              >
                {copied ? <Check size={14} color="#00ff66" /> : <Copy size={14} />}
                <span>{copied ? 'Copied!' : 'Copy Code'}</span>
              </button>
              <textarea
                className="code-textarea"
                style={{ height: 180, border: '1px solid var(--phosphor)' }}
                readOnly
                value={result.cleansed_code}
              />
            </div>

            {/* Technical Explanation */}
            <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>
              <strong>The Fix:</strong> {result.explanation}
            </div>

            {/* Parting Blessing */}
            <div style={{ fontSize: '0.8rem', fontStyle: 'italic', opacity: 0.7, borderTop: '1px solid var(--border-dim)', paddingTop: 8 }}>
              🕯️ "{result.spirit_blessing}" — {currentPersona.name}
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', opacity: 0.5, textAlign: 'center', fontStyle: 'italic' }}>
            Present your troubled code to the altar on the left to receive the spirit's cleansing.
          </div>
        )}
      </div>
    </div>
  );
}
