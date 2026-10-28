"""
GhostTerminal AI - Pydantic Data Contracts & Schemas
"""
from __future__ import annotations

import uuid
from datetime import datetime
from typing import Any, Literal
from pydantic import BaseModel, Field


class PersonaInfo(BaseModel):
    id: str
    name: str
    title: str
    description: str
    mood: str
    icon: str


class GhostCommandRequest(BaseModel):
    command: str = Field(..., min_length=1, max_length=1000, description="The shell command or input typed by user")
    persona: str = Field(default="spectre", description="The possessing spirit persona")
    client_state: dict[str, Any] = Field(default_factory=dict, description="Optional terminal state or history")


class GhostCommandResponse(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    command: str
    ghost_name: str
    whisper: str
    ascii_art: str = ""
    sound_fx: str = "whisper"
    eerie_code: str = "0xDEADBEEF"
    executed_locally: bool = True
    processed_at: str = Field(default_factory=lambda: datetime.now().isoformat())


class ExorciseRequest(BaseModel):
    code_or_error: str = Field(..., min_length=3, max_length=8000, description="The cursed code snippet or crash traceback")
    language: str = Field(default="python", description="Programming language or environment")
    persona: str = Field(default="spectre", description="The ghost persona guiding the exorcism")


class ExorciseResponse(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    curse_diagnosis: str
    cleansed_code: str
    explanation: str
    spirit_blessing: str
    model_used: str
    processed_at: str = Field(default_factory=lambda: datetime.now().isoformat())


class OuijaRequest(BaseModel):
    question: str = Field(..., min_length=2, max_length=500, description="Question asked to the digital spirits")
    persona: str = Field(default="spectre")


class OuijaResponse(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    question: str
    answer: str
    omen_level: Literal["mild", "ominous", "catastrophic"] = "ominous"
    ghost_name: str
    processed_at: str = Field(default_factory=lambda: datetime.now().isoformat())


class HealthResponse(BaseModel):
    status: str
    ollama_reachable: bool
    ollama_url: str
    model_configured: str
    demo_mode: bool
    available_personas: list[PersonaInfo]
