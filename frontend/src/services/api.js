/**
 * GhostTerminal AI - API Client
 * Interfaces with FastAPI backend for command possession, exorcism, and Ouija divination.
 */

const BASE_URL = import.meta.env.VITE_BACKEND_URL || '';

export async function checkHealth() {
  const resp = await fetch(`${BASE_URL}/health`, {
    headers: { Accept: 'application/json' },
  });
  if (!resp.ok) throw new Error(`Health check failed: HTTP ${resp.status}`);
  return resp.json();
}

export async function listPersonas() {
  const resp = await fetch(`${BASE_URL}/api/personas`, {
    headers: { Accept: 'application/json' },
  });
  if (!resp.ok) throw new Error(`Personas list failed: HTTP ${resp.status}`);
  return resp.json();
}

export async function possessCommand(command, persona = 'spectre') {
  const resp = await fetch(`${BASE_URL}/api/possess`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ command, persona }),
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.detail || `Command possession failed: HTTP ${resp.status}`);
  }
  return resp.json();
}

export async function exorciseCode(code_or_error, language = 'python', persona = 'spectre') {
  const resp = await fetch(`${BASE_URL}/api/exorcise`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ code_or_error, language, persona }),
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.detail || `Exorcism failed: HTTP ${resp.status}`);
  }
  return resp.json();
}

export async function askOuija(question, persona = 'spectre') {
  const resp = await fetch(`${BASE_URL}/api/ouija`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ question, persona }),
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.detail || `Ouija prophecy failed: HTTP ${resp.status}`);
  }
  return resp.json();
}
