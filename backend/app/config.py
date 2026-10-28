"""
GhostTerminal AI - Configuration Module
Reads settings from environment variables / .env file.
"""
from __future__ import annotations

from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings for GhostTerminal AI."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # Ollama runtime settings
    ollama_base_url: str = "http://localhost:11434"
    ollama_model: str = "llama3.2"
    ollama_timeout: int = 120  # seconds

    # Backend server settings
    backend_host: str = "127.0.0.1"
    backend_port: int = 8000

    # Frontend CORS origin
    frontend_origin: str = "http://localhost:5173"

    # Default Ghost Persona (spectre, daemon, lovelace, void)
    default_persona: str = "spectre"

    # AI retry configuration
    max_retries: int = 2

    # Demo mode: when True, produces deterministic themed responses for review when Ollama is offline
    demo_mode: bool = False


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    """Return a cached Settings instance."""
    return Settings()
