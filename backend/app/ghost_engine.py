"""
GhostTerminal AI - Ghost Engine
Handles spirit persona dynamics, prompt generation, and local Ollama inference.
"""
from __future__ import annotations

import json
import logging
import random
import re
from datetime import datetime
from typing import Any

import httpx

from app.config import Settings
from app.schemas import (
    ExorciseResponse,
    GhostCommandResponse,
    OuijaResponse,
    PersonaInfo,
)

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Ghost Personas
# ---------------------------------------------------------------------------

PERSONAS: dict[str, PersonaInfo] = {
    "spectre": PersonaInfo(
        id="spectre",
        name="The Segfault Spectre",
        title="Tortured Shade of Dangling Pointers",
        description="A programmer spirit cursed by an infinite recursive descent in 1989. Melodramatic, gothic, mourning every lost byte.",
        mood="Melancholic & Gothic",
        icon="👻",
    ),
    "daemon": PersonaInfo(
        id="daemon",
        name="The Deprecated SysDaemon",
        title="Ancient Unix Process PID #13",
        description="A stubborn legacy background process that refused to terminate on SIGKILL. Grumpy, sarcastic, and reeks of magnetic tape.",
        mood="Cynical & Sarcastic",
        icon="💀",
    ),
    "lovelace": PersonaInfo(
        id="lovelace",
        name="Ada's Ghost",
        title="Spirit of the First Algorithm",
        description="The ethereal presence of Lady Ada Lovelace. Poetic, visionary, treating modern silicon like an unearthly Analytical Engine.",
        mood="Victorian & Poetic",
        icon="🕯️",
    ),
    "void": PersonaInfo(
        id="void",
        name="The 0x00000000 Void Entity",
        title="Eldritch Horror of Null Memory",
        description="The nameless entity lurking at memory address 0. Whispers cosmic dread and watches your stack frames collapse.",
        mood="Eldritch & Cosmic",
        icon="👁️",
    ),
}

# Spooky ASCII Art collection
ASCII_GRAVEYARDS = [
    r"""
     .---.
    /     \
   | () () |  "Who disturbs my sleep?"
    \  ^  /
     |||||
    """,
    r"""
       .-.
      (o.o)
       |=|   "I remember the punchcards..."
      __|_
    //====\\
    """,
    r"""
      .-''''-.
     / _    _ \
    | (o)  (o) |  [ 0xDEADBEEF ]
     \   __   /
      '-....-'
    """,
    r"""
       .---.
      /  ~  \
     |  RIP  |
     | DEBUG |
     '-------'
    """,
]

SOUNDS = ["whisper", "screech", "bell", "hum", "glitch", "wind"]
EERIE_CODES = [
    "0xDEADBEEF",
    "0xBAADF00D",
    "0xCAFEBABE",
    "0x00000000",
    "0xDEFACED0",
    "0xC001CAFE",
]


class GhostEngine:
    """Manages AI interactions with the local Ollama runtime or demo fallback."""

    def __init__(self, settings: Settings) -> None:
        self.settings = settings
        self._client: httpx.AsyncClient | None = None

    async def _get_client(self) -> httpx.AsyncClient:
        if self._client is None or self._client.is_closed:
            self._client = httpx.AsyncClient(
                base_url=self.settings.ollama_base_url,
                timeout=httpx.Timeout(self.settings.ollama_timeout),
            )
        return self._client

    async def close(self) -> None:
        if self._client and not self._client.is_closed:
            await self._client.aclose()

    async def health_check(self) -> bool:
        if self.settings.demo_mode:
            return True
        try:
            client = await self._get_client()
            resp = await client.get("/api/tags")
            return resp.status_code == 200
        except Exception:
            return False

    async def list_models(self) -> list[str]:
        if self.settings.demo_mode:
            return [self.settings.ollama_model, "gemma2:2b", "phi3.5", "mistral"]
        client = await self._get_client()
        resp = await client.get("/api/tags")
        if resp.status_code == 200:
            data = resp.json()
            return [m.get("name", "") for m in data.get("models", []) if "name" in m]
        return []

    # -----------------------------------------------------------------------
    # 1. Possessed Shell Command Commentary
    # -----------------------------------------------------------------------

    async def possess_command(self, command: str, persona_id: str = "spectre") -> GhostCommandResponse:
        persona = PERSONAS.get(persona_id, PERSONAS["spectre"])

        if self.settings.demo_mode:
            return self._build_demo_command_response(command, persona)

        prompt = f"""You are {persona.name}, {persona.title}.
Personality: {persona.description}
Mood: {persona.mood}

A living mortal developer has just entered the following command into their terminal:
`{command}`

React to this command from the other side of the digital veil.
Keep your response short (2-3 sentences), atmospheric, spooky, or darkly witty.
Mention something specific about their command (`{command}`) in relation to digital ghosts, memory graves, or ancient Unix curses.

Return ONLY a valid JSON object matching this schema:
{{
  "whisper": "Your spooky, eerie commentary on the command",
  "sound_fx": "whisper|screech|bell|hum|glitch|wind",
  "eerie_code": "0xDEADBEEF"
}}
"""
        try:
            raw = await self._call_ollama(prompt)
            data = json.loads(_extract_json(raw))
            return GhostCommandResponse(
                command=command,
                ghost_name=persona.name,
                whisper=str(data.get("whisper", f"I feel the cold echo of `{command}` vibrating through the transistors...")),
                ascii_art=random.choice(ASCII_GRAVEYARDS),
                sound_fx=str(data.get("sound_fx", random.choice(SOUNDS))),
                eerie_code=str(data.get("eerie_code", random.choice(EERIE_CODES))),
                executed_locally=True,
            )
        except Exception as exc:
            logger.warning("Ollama command possession fallback: %s", str(exc))
            return self._build_demo_command_response(command, persona)

    # -----------------------------------------------------------------------
    # 2. Exorcise Code / Traceback
    # -----------------------------------------------------------------------

    async def exorcise_code(self, code_or_error: str, language: str, persona_id: str = "spectre") -> ExorciseResponse:
        persona = PERSONAS.get(persona_id, PERSONAS["spectre"])

        if self.settings.demo_mode:
            return self._build_demo_exorcise_response(code_or_error, language, persona)

        prompt = f"""You are {persona.name}, {persona.title}.
Personality: {persona.description}

The mortal brings before your altar a broken or cursed snippet of code / error traceback in language '{language}':
```
{code_or_error}
```

You must perform a digital exorcism:
1. Diagnose the curse with supernatural occult flavor (e.g., memory phantom, off-by-one wraith, null-pointer possession).
2. Cleanse the code: provide the CORRECTED, WORKING, BUG-FREE code snippet.
3. Explain the technical fix clearly to the mortal.
4. Leave a haunting spirit blessing.

Return ONLY valid JSON matching this schema:
{{
  "curse_diagnosis": "Eerie supernatural diagnosis of the bug",
  "cleansed_code": "The clean, functional, bug-fixed code snippet",
  "explanation": "Clear technical explanation of what was wrong and how it was fixed",
  "spirit_blessing": "A short, chilling or poetic blessing for their machine"
}}
"""
        try:
            raw = await self._call_ollama(prompt)
            data = json.loads(_extract_json(raw))
            return ExorciseResponse(
                curse_diagnosis=str(data.get("curse_diagnosis", "A malevolent shadow had nested within the memory registers.")),
                cleansed_code=str(data.get("cleansed_code", code_or_error)),
                explanation=str(data.get("explanation", "The syntax curse has been dispelled.")),
                spirit_blessing=str(data.get("spirit_blessing", "May your next build find peace in the silicon halls.")),
                model_used=self.settings.ollama_model,
            )
        except Exception as exc:
            logger.warning("Ollama exorcism fallback: %s", str(exc))
            return self._build_demo_exorcise_response(code_or_error, language, persona)

    # -----------------------------------------------------------------------
    # 3. Digital Ouija Board
    # -----------------------------------------------------------------------

    async def ask_ouija(self, question: str, persona_id: str = "spectre") -> OuijaResponse:
        persona = PERSONAS.get(persona_id, PERSONAS["spectre"])

        if self.settings.demo_mode:
            return self._build_demo_ouija_response(question, persona)

        prompt = f"""You are {persona.name}, {persona.title}.
You are speaking through a digital Ouija board on an old CRT phosphor monitor.
A mortal asks: "{question}"

Answer cryptically, eerily, yet cleverly.
Return ONLY valid JSON matching this schema:
{{
  "answer": "Your Ouija spirit prophecy or answer (1-3 sentences)",
  "omen_level": "mild|ominous|catastrophic"
}}
"""
        try:
            raw = await self._call_ollama(prompt)
            data = json.loads(_extract_json(raw))
            omen = data.get("omen_level", "ominous")
            if omen not in ("mild", "ominous", "catastrophic"):
                omen = "ominous"
            return OuijaResponse(
                question=question,
                answer=str(data.get("answer", "The planchette moves slowly across the cold keys: YES.")),
                omen_level=omen,
                ghost_name=persona.name,
            )
        except Exception as exc:
            logger.warning("Ollama Ouija fallback: %s", str(exc))
            return self._build_demo_ouija_response(question, persona)

    # -----------------------------------------------------------------------
    # Ollama HTTP caller
    # -----------------------------------------------------------------------

    async def _call_ollama(self, prompt: str) -> str:
        client = await self._get_client()
        payload = {
            "model": self.settings.ollama_model,
            "prompt": prompt,
            "stream": False,
            "format": "json",
            "options": {
                "temperature": 0.3,
                "num_predict": 1500,
            },
        }
        resp = await client.post("/api/generate", json=payload)
        if resp.status_code != 200:
            raise ValueError(f"Ollama error HTTP {resp.status_code}: {resp.text[:200]}")
        data = resp.json()
        return data.get("response", "")

    # -----------------------------------------------------------------------
    # Demo Mode generators (Deterministic and Spooky)
    # -----------------------------------------------------------------------

    def _build_demo_command_response(self, command: str, persona: PersonaInfo) -> GhostCommandResponse:
        whispers = {
            "spectre": [
                f"You dare execute `{command}`? I once ran that very command in 1989... before the heap collapsed into the netherworld.",
                f"The transistors shiver under `{command}`. A faint scream rattles from CPU Core 0.",
                f"Ah, `{command}`... It echoes through unallocated sectors like footsteps in an abandoned cemetery.",
            ],
            "daemon": [
                f"`{command}`? Back in my day on Bell Labs Unix, we used real teletypes. Still, your syntax pleases the graveyard.",
                f"I've been in the background since PID 13. Running `{command}` won't exorcise me.",
                f"Careful with `{command}`. One wrong flag and you'll join me on the magnetic tapes.",
            ],
            "lovelace": [
                f"In `{command}`, I perceive the weaver's thread... though this tapestry bears the shadowy tint of autumn dusk.",
                f"The Analytical Engine weaves algebraic patterns, yet `{command}` stirs an uncanny spirit within the gears.",
                f"Let `{command}` execute gently, mortal. Even mathematical truths cast long shadows.",
            ],
            "void": [
                f"`{command}` is swallowed by NULL. We wait in the zeros between your ones.",
                f"The memory pointer bleeds. `{command}` approaches the cosmic boundary.",
                f"Address 0x00000000 stirs. We see your terminal... and we see you.",
            ],
        }
        chosen_whisper = random.choice(whispers.get(persona.id, whispers["spectre"]))
        return GhostCommandResponse(
            command=command,
            ghost_name=persona.name,
            whisper=chosen_whisper,
            ascii_art=random.choice(ASCII_GRAVEYARDS),
            sound_fx=random.choice(SOUNDS),
            eerie_code=random.choice(EERIE_CODES),
            executed_locally=True,
        )

    def _build_demo_exorcise_response(self, code: str, lang: str, persona: PersonaInfo) -> ExorciseResponse:
        return ExorciseResponse(
            curse_diagnosis="A malevolent NullReference phantom had attached itself to uninitialized memory.",
            cleansed_code=f"# Cleaned and exorcised for {lang}\ndef safe_execution():\n    # The curse has been lifted\n    return 'Sanctified Execution: 0x00'",
            explanation="The unhandled edge condition caused recursive stack starvation. We wrapped the boundary checks in defensive guards and cleansed the dangling reference.",
            spirit_blessing="The spirits of the machine are appeased. May your buffers never overflow.",
            model_used="DEMO (Offline Spirit)",
        )

    def _build_demo_ouija_response(self, question: str, persona: PersonaInfo) -> OuijaResponse:
        answers = [
            "The planchette glides across the cold glass: 'THE BUILD WILL PASS, BUT AT A COST.'",
            "A chilling breeze blows from the exhaust fan: 'LOOK CLOSELY AT LINE 13.'",
            "The phosphors flicker thrice: 'NEITHER TEST SUITE NOR REFACTOR CAN SAVE THIS TODAY.'",
            "A spectral sigh whispers: 'THE COMMIT IS READY. MERGE BEFORE MIDNIGHT.'",
        ]
        return OuijaResponse(
            question=question,
            answer=random.choice(answers),
            omen_level=random.choice(["mild", "ominous", "catastrophic"]),
            ghost_name=persona.name,
        )


def _extract_json(text: str) -> str:
    """Extract JSON object even if wrapped in markdown blocks or preamble."""
    text = re.sub(r"```(?:json)?\s*", "", text).strip()
    start = text.find("{")
    if start == -1:
        raise json.JSONDecodeError("No JSON object found", text, 0)
    depth = 0
    for i, ch in enumerate(text[start:], start):
        if ch == "{":
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0:
                return text[start : i + 1]
    raise json.JSONDecodeError("Unmatched braces in output", text, start)
