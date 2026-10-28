*This is a submission for the [Hacktoberfest Open-Source AI Challenge Week 4: Ghost in the Machine](https://dev.to/challenges/hacktoberfest-week4-2026-10-26)*

## What I Built

**GhostTerminal AI** is an eerie, atmospheric developer terminal and cockpit where an autonomous open-weight AI spirit possesses your console.

Built in celebration of **Halloween** and **Día de los Muertos**, GhostTerminal AI bridges the living developer and the digital afterlife:
* **The Possessed Shell**: Enter any regular command (`git push --force`, `rm -rf /`, `kill -9 1`) and watch the possessing entity whisper back chilling, darkly witty commentary, complete with graveyard ASCII art and eerie sound effects.
* **The Exorcism Altar**: Paste broken code or crash tracebacks. The spirit diagnoses the demonic bug with occult lore and cleanses it with clean, working, bug-fixed code.
* **The Digital Ouija Board**: An interactive virtual Ouija board where an animated planchette divines prophecies about deployment fates and midnight merges.
* **Departed Spirit Personas**: Switch between 4 distinct historical spirits:
  - 👻 *The Segfault Spectre* — A tortured 80s developer trapped in infinite recursion.
  - 💀 *The Deprecated SysDaemon* — Ancient Unix PID #13 that refused to terminate on SIGKILL.
  - 🕯️ *Ada's Ghost* — The ethereal spirit of Lady Ada Lovelace speaking in Victorian poetic verse.
  - 👁️ *The 0x00000000 Void Entity* — An eldritch cosmic presence residing at memory address 0.
* **Vintage CRT Audio-Visual Engine**: Realistic CRT scanline shaders, selectable phosphor colors (Ghost Green, Amber Relic, Blood Crimson, Spectral Violet), and a Web Audio API synthesizer that produces chimes and ghostly whispers with zero external audio assets.

---

## Demo

Here is GhostTerminal AI in action:

### 1. The Possessed Shell (Haunted Terminal)
![Haunted Terminal](https://raw.githubusercontent.com/Aachman-Yadav/GhostTerminal_AI/main/screenshots/01_terminal_shell.png)

### 2. The Exorcism Altar (Code Cleansing)
![Exorcism Altar](https://raw.githubusercontent.com/Aachman-Yadav/GhostTerminal_AI/main/screenshots/02_exorcism_altar.png)

### 3. The Digital Ouija Board (Plancthette Divination)
![Digital Ouija](https://raw.githubusercontent.com/Aachman-Yadav/GhostTerminal_AI/main/screenshots/03_ouija_board.png)

### 4. Spirit Persona Selector (Summoning Spirits)
![Summoning Personas](https://raw.githubusercontent.com/Aachman-Yadav/GhostTerminal_AI/main/screenshots/04_persona_selector.png)

---

## Code

{% github Aachman-Yadav/GhostTerminal_AI %}

The repository is open-source under the MIT license:  
👉 **[https://github.com/Aachman-Yadav/GhostTerminal_AI](https://github.com/Aachman-Yadav/GhostTerminal_AI)**

---

## How I Built It

GhostTerminal AI is structured into a fast, deterministic local-first architecture:

1. **Frontend (React 18 + Vite)**:
   - Handcrafted CRT monitor scanline shaders and vignette effects.
   - Built-in Web Audio API synthesizer generating procedurally synthesized whispers, bells, and keyboard clicks.
   - Command history navigation with arrow keys and quick-invocation shortcuts.
   - LocalStorage persistence for theme and audio settings.

2. **Backend (FastAPI + Pydantic v2)**:
   - Persona prompt engine providing rich system contexts for historical spirits.
   - Self-healing JSON extractor with balanced-brace parsing.
   - Comprehensive test suite (12 automated pytest tests passing).
   - High-performance async Ollama client (`/api/generate`).

3. **Inference (Ollama - Local Open Weights)**:
   - Powered by Meta's **Llama 3.2 (3B)** and Google's **Gemma 2 (2B)**.
   - Constrained JSON mode decoding with low temperature for deterministic, structured responses.
   - 100% offline with zero cloud telemetry.

---

## Why Does Open Innovation Matter?

Why run an open-weight model locally instead of calling a closed-source cloud API?

1. **Working with the Lights (and Internet) Off**:
   Ghost stories are best told in the dark. Because GhostTerminal AI runs entirely on local open-weight models, it functions without an internet connection in an off-grid cabin, an air-gapped server room, or during network blackouts. A closed API would immediately fail with connection timeouts.
2. **Absolute Privacy of Cursed Code**:
   When developers paste confidential code snippets and proprietary error traces into an exorcism tool, they shouldn't have to worry about third-party cloud telemetry or corporate data harvesting. With local inference, no byte ever leaves your machine.
3. **Creative Freedom & Uninhibited Atmosphere**:
   Closed-source commercial APIs enforce heavy-handed guardrails that sanitize harmless gothic roleplay and spooky humor. Open-weight models empower developers to shape custom, uninhibited persona dynamics freely.
4. **Zero Cloud Subscriptions**:
   A 3-billion-parameter open-weight model runs at 40+ tokens per second on consumer hardware without metered API costs.

---

## The Spirit of It

During Día de los Muertos, we remember those who paved the way. In computing, we often forget the millions of lines of foundational code, the ancient Unix processes, and the pioneering mathematicians like Ada Lovelace who built the substrate we code on today. GhostTerminal AI brings that history to life with genuine reverence, dark humor, and technical delight.

---

## Prize Categories

* **Best Use of Gemma**: GhostTerminal AI natively supports running on Google's ultra-efficient **Gemma 2 (2B)** model via Ollama for lightweight, high-speed ghost inference on budget laptops!
