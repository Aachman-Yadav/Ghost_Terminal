import React, { useState } from 'react';
import { Eye, HelpCircle, Sparkles, Send } from 'lucide-react';
import { askOuija } from '../services/api';
import { playSoundFx } from '../services/sound';

const SAMPLE_QUESTIONS = [
  'Will our pull request be merged without conflicts?',
  'Is there a memory leak lurking in production?',
  'What happens to discarded bits after execution?',
  'Does the CPU dream when the lid is closed?',
];

export default function OuijaBoard({ currentPersona }) {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [planchettePos, setPlanchettePos] = useState({ x: 0, y: 0 });

  const handleAsk = async (qText) => {
    const q = (qText || question).trim();
    if (!q) return;

    setLoading(true);
    setResult(null);
    playSoundFx('bell');

    // Jiggle the planchette across the board
    const interval = setInterval(() => {
      setPlanchettePos({
        x: (Math.random() - 0.5) * 60,
        y: (Math.random() - 0.5) * 40,
      });
    }, 150);

    try {
      const resp = await askOuija(q, currentPersona.id);
      setResult(resp);
      playSoundFx('whisper');
    } catch (err) {
      playSoundFx('screech');
    } finally {
      clearInterval(interval);
      setPlanchettePos({ x: 0, y: 0 });
      setLoading(false);
    }
  };

  const omenColors = {
    mild: '#00ff66',
    ominous: '#ffbd2e',
    catastrophic: '#ff3366',
  };

  return (
    <div style={{ maxWidth: 850, margin: '0 auto', width: '100%' }}>
      <div className="ouija-board">
        <div className="ouija-header">✦ DIGITAL OUIJA ✦</div>

        {/* YES / NO */}
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 40px', fontSize: '1.2rem', fontWeight: 700, color: '#e2b714' }}>
          <span>YES</span>
          <span>NO</span>
        </div>

        {/* Alphabet Arc */}
        <div className="ouija-arc">
          A B C D E F G H I J K L M<br />
          N O P Q R S T U V W X Y Z
        </div>

        {/* Numbers Arc */}
        <div style={{ letterSpacing: 8, fontSize: '1rem', color: '#a0aec0', margin: '10px 0' }}>
          1 2 3 4 5 6 7 8 9 0
        </div>

        {/* The Animated Planchette */}
        <div>
          <div
            className="ouija-planchette"
            style={{
              transform: `translate(${planchettePos.x}px, ${planchettePos.y}px)`,
            }}
          >
            <Eye size={24} color="#e2b714" />
            <div style={{ fontSize: '0.7rem', color: '#e2b714', marginTop: 4 }}>
              {loading ? 'COMMUNING...' : 'PLAN CHETTE'}
            </div>
          </div>
        </div>

        <div style={{ fontSize: '0.9rem', color: '#e2b714', letterSpacing: 4 }}>
          GOODBYE
        </div>
      </div>

      {/* Input & Question Controls */}
      <div style={{ marginTop: 20, background: 'var(--bg-surface)', padding: 18, borderRadius: 8, border: '1px solid var(--border-dim)' }}>
        <div style={{ display: 'flex', gap: 10 }}>
          <input
            type="text"
            className="terminal-input"
            style={{ background: 'var(--bg-terminal)', padding: '10px 14px', borderRadius: 4, border: '1px solid var(--border-dim)' }}
            placeholder={`Ask ${currentPersona.name} a question...`}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
          />
          <button
            className="btn-spooky"
            onClick={() => handleAsk()}
            disabled={loading || !question.trim()}
          >
            <Send size={16} />
            <span>Consult</span>
          </button>
        </div>

        {/* Sample Questions */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 12 }}>
          <span style={{ fontSize: '0.75rem', opacity: 0.7, alignSelf: 'center' }}>Invocations:</span>
          {SAMPLE_QUESTIONS.map((sq, i) => (
            <button
              key={i}
              className="prompt-pill"
              onClick={() => {
                setQuestion(sq);
                handleAsk(sq);
              }}
            >
              {sq}
            </button>
          ))}
        </div>

        {/* Spirit Revelation Output */}
        {result && (
          <div
            style={{
              marginTop: 18,
              padding: 16,
              background: 'var(--phosphor-bg)',
              borderLeft: `4px solid ${omenColors[result.omen_level] || 'var(--phosphor)'}`,
              borderRadius: '0 6px 6px 0',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: 6 }}>
              <span>{result.ghost_name} answers</span>
              <span style={{ color: omenColors[result.omen_level], fontWeight: 700, textTransform: 'uppercase' }}>
                Omen: {result.omen_level}
              </span>
            </div>
            <div style={{ fontSize: '1.05rem', fontStyle: 'italic', lineHeight: 1.5 }}>
              "{result.answer}"
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
