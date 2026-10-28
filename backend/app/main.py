"""
GhostTerminal AI - FastAPI Application Entry Point
Hacktoberfest 2026 Week 4: Ghost in the Machine
"""
from __future__ import annotations

import logging
import sys
from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import get_settings
from app.ghost_engine import GhostEngine
from app.routes import router

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)],
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    settings = get_settings()
    ghost_engine = GhostEngine(settings)
    app.state.ghost_engine = ghost_engine

    logger.info("👻 GhostTerminal AI backend awakening...")
    logger.info("Ollama Endpoint: %s", settings.ollama_base_url)
    logger.info("Model: %s", settings.ollama_model)
    logger.info("Demo Mode: %s", settings.demo_mode)

    reachable = await ghost_engine.health_check()
    if reachable:
        logger.info("🕯️  The digital veil is thin: Ollama is reachable.")
    else:
        logger.warning("⚠️  Ollama is offline. Ensure `ollama serve` is running or enable DEMO_MODE.")

    yield

    logger.info("GhostTerminal AI backend returning to slumber...")
    await ghost_engine.close()


settings = get_settings()

app = FastAPI(
    title="GhostTerminal AI",
    description="A haunted developer terminal & cockpit powered by local open-weight AI.",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_origin, "http://localhost:5173", "http://127.0.0.1:5173", "*"],
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

app.include_router(router)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    logger.exception("Spectral disturbance on %s %s", request.method, request.url.path)
    return JSONResponse(
        status_code=500,
        content={"error": "spectral_error", "message": "An otherworldly server anomaly occurred."},
    )


if __name__ == "__main__":
    import uvicorn

    s = get_settings()
    uvicorn.run(
        "app.main:app",
        host=s.backend_host,
        port=s.backend_port,
        reload=True,
        log_level="info",
    )
