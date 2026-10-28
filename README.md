# GhostTerminal AI 👻

> **The Haunted Developer Terminal & Digital Cockpit**  
> Built for the **Hacktoberfest Open-Source AI Challenge: Week 4 (October 26–31, 2026)**  
> **Theme**: *Ghost in the Machine* (Halloween & Día de los Muertos)

[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg)](https://opensource.org/licenses/MIT)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18+-61DAFB.svg?logo=react&logoColor=black)](https://react.dev)
[![Ollama](https://img.shields.io/badge/Ollama-Local_Inference-white.svg?logo=ollama&logoColor=black)](https://ollama.com)
[![Tests: 12 Passed](https://img.shields.io/badge/Tests-12%20Passed-brightgreen.svg)]()

---

## 🔮 Overview

**GhostTerminal AI** is an eerie, atmospheric developer terminal and cockpit where an autonomous open-weight AI spirit inhabits your console.

Whether running risky shell commands, debugging fatal crashes, or seeking technical prophecies, GhostTerminal AI bridges the living developer and the digital afterlife:
* **The Possessed Shell**: Type shell commands (`git push --force`, `rm -rf /`, `kill -9 1`) and receive chilling commentary, ASCII graveyards, and eerie audio whispers.
* **The Exorcism Altar**: Paste bugged code or stack traces. The spirit diagnoses the demonic bug with occult lore and provides cleansed, functional, bug-free code.
* **The Digital Ouija Board**: An interactive virtual Ouija board where an animated planchette divines prophecies about deployment fates and midnight merges.
* **Historical Spirit Personas**: Channel the *Segfault Spectre* 👻, *The Deprecated SysDaemon* 💀, *Ada's Ghost* 🕯️, or *The 0x00000000 Void Entity* 👁️.
* **CRT Phosphor Engine & Synthesizer**: Vintage scanlines, multiple CRT colorways, and a Web Audio API procedural synthesizer that generates eerie sounds with zero external audio assets.

---

## ✨ Features

- 🧠 **100% Local Open-Weight AI**: Powered by Meta's **Llama 3.2 (3B)** or Google's **Gemma 2 (2B)** via Ollama.
- 🕯️ **Offline & Dark Mode Ready**: Runs completely without internet in dark rooms, air-gapped workstations, or cabins.
- 🛡️ **Zero Cloud Telemetry**: Cursed code snippets and private tracebacks never leave your machine.
- 🔊 **Procedural Web Audio Synthesizer**: Generates whispers, bells, and static clicks using browser audio nodes without downloading `.mp3` files.
- 🎨 **Multiple CRT Phosphor Themes**: Ghost Green, Amber Relic, Blood Crimson, and Spectral Violet.
- 🧪 **Comprehensive Test Suite**: 12 automated unit and integration tests passing in Pytest.

---

## 🚀 Quickstart

### Prerequisites
* **Python 3.11+**
* **Node.js 18+** & **npm**
* **Ollama** installed from [ollama.com](https://ollama.com)

---

### Step 1: Start the Local AI Model (Ollama)
```bash
ollama pull llama3.2
ollama serve
```
*(Also supports `gemma2:2b`, `phi3.5`, and `mistral`)*

---

### Step 2: Start the Backend (FastAPI)
```bash
cd backend
python -m venv venv

# Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# Linux / macOS:
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
python -m app.main
```
*API running at `http://127.0.0.1:8000` (Interactive docs at `http://127.0.0.1:8000/docs`).*

---

### Step 3: Start the Frontend (React + Vite)
```bash
cd ../frontend
npm install
npm run dev
```
*Application running at **`http://localhost:5173`**.*

*(Or run the full stack with Docker Compose: `docker-compose up --build`)*

---

## 🧪 Testing & Verification

Run the backend test suite:
```bash
cd backend
python -m pytest tests/ -v
```
**Result**: `12 passed, 0 failures`

Run the frontend build:
```bash
cd frontend
npm run build
```
**Result**: `✓ built in ~340ms`

---

## 📖 API Documentation

* `POST /api/possess`: Send shell command, receive spooky commentary, sound effects, and ASCII art.
* `POST /api/exorcise`: Submit cursed code / tracebacks, receive supernatural diagnosis and cleansed code.
* `POST /api/ouija`: Submit questions to the spirits, receive cryptic prophecies and omen severity levels.
* `GET /api/personas`: List available spirits and lore.
* `GET /api/health`: Health status and Ollama reachability.

---

## 📄 License

This project is open-source under the [MIT License](LICENSE).
