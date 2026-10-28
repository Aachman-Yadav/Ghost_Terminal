# GhostTerminal AI — Architecture & System Design

## 1. System Overview

**GhostTerminal AI** is a haunted developer terminal and cockpit designed for **Hacktoberfest 2026 Week 4: Ghost in the Machine** (Halloween & Día de los Muertos).

The system pairs an atmospheric vintage CRT web terminal with an open-weight local language model (Meta Llama 3.2 3B or Google Gemma 2 2B) running via Ollama. The model assumes the persona of departed computing spirits to possess the user's console, whisper gothic commentary on shell commands, diagnose and cleanse broken code, and deliver digital Ouija prophecies.

```
+─────────────────────────────────────────────────────────────+
|                     CLIENT (VINTAGE CRT UI)                 |
|                                                             |
|   React 18 + Vite SPA                                       |
|   - Haunted Shell (history, auto-scroll, prompt pills)      |
|   - Exorcism Altar (syntax analysis, clean code generator)  |
|   - Digital Ouija Board (animated planchette divination)    |
|   - Web Audio Synthesizer (eerie chimes, whispers, static)  |
|   - Dynamic CRT shaders & Phosphor palettes                 |
+──────────────────────────────┬──────────────────────────────+
                               |
                               | HTTP JSON REST
                               v
+──────────────────────────────┴──────────────────────────────+
|                     FASTAPI BACKEND                         |
|                                                             |
|   - Persona Orchestrator (Spectre, Daemon, Lovelace, Void)  |
|   - Command Possession Analyzer (/api/possess)              |
|   - Digital Exorcism Engine (/api/exorcise)                 |
|   - Ouija Divination Endpoint (/api/ouija)                  |
|   - Balanced-Brace JSON Extractor & Pydantic Validation     |
|   - Offline Demo Fallback Engine                            |
+──────────────────────────────┬──────────────────────────────+
                               |
                               | HTTP REST (Ollama API :11434)
                               v
+──────────────────────────────┴──────────────────────────────+
|                 LOCAL OPEN-WEIGHT AI RUNTIME                |
|                                                             |
|   Ollama Runtime                                            |
|   - Model: Llama 3.2 (3B) / Gemma 2 (2B)                   |
|   - JSON Mode Constrained Decoding (format: "json")         |
|   - 100% Offline, Zero Telemetry, Total Data Sovereignty    |
+─────────────────────────────────────────────────────────────+
```

---

## 2. Core Components

### 2.1 Spirit Personas
1. **The Segfault Spectre (`spectre`)**:
   - The tortured shade of an 80s developer trapped in an infinite recursive descent.
   - Melancholic, gothic, obsessing over dangling pointers and stack overflows.
2. **The Deprecated SysDaemon (`daemon`)**:
   - An ancient Unix process with PID #13 from early Bell Labs systems that refused to terminate on SIGKILL.
   - Cynical, sarcastic, reminiscing about magnetic tape reels and punchcards.
3. **Ada's Ghost (`lovelace`)**:
   - The ethereal presence of Lady Ada Lovelace, the world's first computer programmer.
   - Poetic, analytical Victorian style, viewing modern silicon as the ultimate Analytical Engine.
4. **The 0x00000000 Void Entity (`void`)**:
   - An eldritch cosmic presence residing at memory address zero.
   - Whispers cosmic horror and watches stack frames collapse into the abyss.

### 2.2 Terminal & Audio Synthesizer
* **Self-Contained Audio Synthesis**: Built using the browser's native **Web Audio API** (`AudioContext`, `BiquadFilterNode`, `OscillatorNode`). Generates ghostly whispers (bandpass filtered white noise), eerie bells, electronic screeches, and mechanical keyclicks without relying on external `.mp3` files or external CDNs.
* **Scanline & Phosphor Engine**: Custom CSS filters recreating CRT monitor physics, including phosphorescent persistence, screen curvature, vignette shadows, and multiple colorways (Ghost Green, Amber Relic, Blood Crimson, Spectral Violet).

---

## 3. Security & Open Innovation Posture

* **100% Local Privacy**: Code snippets and developer shell commands are never sent to third-party hyperscaler APIs (OpenAI, Anthropic). Everything runs locally on `localhost`.
* **Zero Host Vulnerability**: The haunted shell is a safe, simulated terminal designed for creative interaction, diagnostics, and code exorcisms. It does not blindly execute dangerous arbitrary host commands.
* **Deterministic Contracts**: Pydantic v2 schemas enforce typed outputs across all endpoints, ensuring reliable UI rendering even when the model generates gothic prose.
