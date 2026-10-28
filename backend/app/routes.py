"""
GhostTerminal AI - API Routes
Handlers for health, shell command possession, code exorcism, and digital Ouija.
"""
from __future__ import annotations

import logging
from fastapi import APIRouter, Depends, HTTPException, Request, status

from app.config import Settings, get_settings
from app.ghost_engine import PERSONAS, GhostEngine
from app.schemas import (
    ExorciseRequest,
    ExorciseResponse,
    GhostCommandRequest,
    GhostCommandResponse,
    HealthResponse,
    OuijaRequest,
    OuijaResponse,
    PersonaInfo,
)

logger = logging.getLogger(__name__)

router = APIRouter()


def get_ghost_engine(request: Request) -> GhostEngine:
    return request.app.state.ghost_engine


def get_cfg(settings: Settings = Depends(get_settings)) -> Settings:
    return settings


# ---------------------------------------------------------------------------
# Health & Status
# ---------------------------------------------------------------------------

@router.get("/health", response_model=HealthResponse, tags=["System"])
@router.get("/api/health", response_model=HealthResponse, tags=["System"])
async def health(
    engine: GhostEngine = Depends(get_ghost_engine),
    settings: Settings = Depends(get_cfg),
) -> HealthResponse:
    ollama_reachable = await engine.health_check()
    return HealthResponse(
        status="ok",
        ollama_reachable=ollama_reachable,
        ollama_url=settings.ollama_base_url,
        model_configured=settings.ollama_model,
        demo_mode=settings.demo_mode,
        available_personas=list(PERSONAS.values()),
    )


@router.get("/api/personas", response_model=list[PersonaInfo], tags=["Personas"])
async def list_personas() -> list[PersonaInfo]:
    return list(PERSONAS.values())


# ---------------------------------------------------------------------------
# Shell Command Possession
# ---------------------------------------------------------------------------

@router.post("/api/possess", response_model=GhostCommandResponse, tags=["Ghost Shell"])
async def possess_command(
    body: GhostCommandRequest,
    engine: GhostEngine = Depends(get_ghost_engine),
) -> GhostCommandResponse:
    try:
        return await engine.possess_command(body.command, body.persona)
    except Exception as exc:
        logger.exception("Error possessing command: %s", str(exc))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"The spirit failed to channel: {str(exc)}",
        )


# ---------------------------------------------------------------------------
# Code & Error Exorcism
# ---------------------------------------------------------------------------

@router.post("/api/exorcise", response_model=ExorciseResponse, tags=["Exorcism"])
async def exorcise_code(
    body: ExorciseRequest,
    engine: GhostEngine = Depends(get_ghost_engine),
) -> ExorciseResponse:
    try:
        return await engine.exorcise_code(body.code_or_error, body.language, body.persona)
    except Exception as exc:
        logger.exception("Error during code exorcism: %s", str(exc))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Exorcism failed: {str(exc)}",
        )


# ---------------------------------------------------------------------------
# Digital Ouija Board
# ---------------------------------------------------------------------------

@router.post("/api/ouija", response_model=OuijaResponse, tags=["Ouija"])
async def ask_ouija(
    body: OuijaRequest,
    engine: GhostEngine = Depends(get_ghost_engine),
) -> OuijaResponse:
    try:
        return await engine.ask_ouija(body.question, body.persona)
    except Exception as exc:
        logger.exception("Error asking Ouija: %s", str(exc))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"The Ouija planchette was disturbed: {str(exc)}",
        )
