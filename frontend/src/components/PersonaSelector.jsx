import React from 'react';
import { X, Check } from 'lucide-react';

export default function PersonaSelector({
  isOpen,
  onClose,
  personas,
  currentPersona,
  onSelectPersona,
}) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(6px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--phosphor-dim)',
          borderRadius: 12,
          maxWidth: 620,
          width: '100%',
          padding: 24,
          boxShadow: '0 10px 40px rgba(0,0,0,0.8)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>✦ Summon Possessing Entity ✦</h2>
          <button className="btn-ctrl" onClick={onClose} style={{ padding: 4 }}>
            <X size={16} />
          </button>
        </div>

        <p style={{ fontSize: '0.85rem', opacity: 0.8, marginBottom: 20 }}>
          Choose which departed soul or digital daemon possesses this terminal session:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {personas.map((p) => {
            const isSelected = p.id === currentPersona.id;
            return (
              <div
                key={p.id}
                onClick={() => {
                  onSelectPersona(p);
                  onClose();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  padding: 14,
                  borderRadius: 8,
                  border: isSelected ? '1px solid var(--phosphor)' : '1px solid var(--border-dim)',
                  background: isSelected ? 'var(--phosphor-bg)' : 'rgba(255, 255, 255, 0.02)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ fontSize: '2rem' }}>{p.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '1rem', color: isSelected ? 'var(--phosphor)' : '#fff' }}>
                    {p.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', opacity: 0.7, marginBottom: 4 }}>
                    {p.title}
                  </div>
                  <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>
                    {p.description}
                  </div>
                </div>
                {isSelected && <Check size={18} color="var(--phosphor)" />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
