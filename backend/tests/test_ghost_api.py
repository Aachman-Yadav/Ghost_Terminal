"""
GhostTerminal AI - Backend API & Engine Test Suite
Tests health, persona switching, command possession, code exorcism, and Ouija divination.
"""
import pytest
from fastapi.testclient import TestClient

from app.config import get_settings
from app.ghost_engine import _extract_json, PERSONAS
from app.main import app


@pytest.fixture
def client():
    # Force demo mode during tests for fast, deterministic execution
    settings = get_settings()
    settings.demo_mode = True
    with TestClient(app) as test_client:
        yield test_client


class TestSystemEndpoints:
    def test_health_check(self, client):
        resp = client.get("/health")
        assert resp.status_code == 200
        data = resp.json()
        assert data["status"] == "ok"
        assert data["demo_mode"] is True
        assert len(data["available_personas"]) == 4

    def test_personas_list(self, client):
        resp = client.get("/api/personas")
        assert resp.status_code == 200
        personas = resp.json()
        assert len(personas) == 4
        ids = [p["id"] for p in personas]
        assert "spectre" in ids
        assert "daemon" in ids
        assert "lovelace" in ids
        assert "void" in ids


class TestCommandPossession:
    def test_possess_simple_command(self, client):
        payload = {"command": "git push --force", "persona": "spectre"}
        resp = client.post("/api/possess", json=payload)
        assert resp.status_code == 200
        data = resp.json()
        assert data["command"] == "git push --force"
        assert data["ghost_name"] == PERSONAS["spectre"].name
        assert len(data["whisper"]) > 0
        assert data["sound_fx"] in ["whisper", "screech", "bell", "hum", "glitch", "wind"]
        assert data["eerie_code"].startswith("0x")

    def test_possess_daemon_persona(self, client):
        payload = {"command": "rm -rf /", "persona": "daemon"}
        resp = client.post("/api/possess", json=payload)
        assert resp.status_code == 200
        data = resp.json()
        assert data["ghost_name"] == PERSONAS["daemon"].name
        assert "rm -rf /" in data["whisper"]

    def test_empty_command_validation(self, client):
        payload = {"command": "", "persona": "spectre"}
        resp = client.post("/api/possess", json=payload)
        assert resp.status_code == 422


class TestCodeExorcism:
    def test_exorcise_python_bug(self, client):
        payload = {
            "code_or_error": "def divide(a, b):\n    return a / b  # crashes when b=0",
            "language": "python",
            "persona": "spectre",
        }
        resp = client.post("/api/exorcise", json=payload)
        assert resp.status_code == 200
        data = resp.json()
        assert "curse_diagnosis" in data
        assert "cleansed_code" in data
        assert "explanation" in data
        assert "spirit_blessing" in data

    def test_too_short_code_rejected(self, client):
        payload = {"code_or_error": "a", "language": "python"}
        resp = client.post("/api/exorcise", json=payload)
        assert resp.status_code == 422


class TestOuijaDivination:
    def test_ask_ouija_question(self, client):
        payload = {
            "question": "Will my PR be merged by Halloween night?",
            "persona": "lovelace",
        }
        resp = client.post("/api/ouija", json=payload)
        assert resp.status_code == 200
        data = resp.json()
        assert data["question"] == "Will my PR be merged by Halloween night?"
        assert data["ghost_name"] == PERSONAS["lovelace"].name
        assert data["omen_level"] in ["mild", "ominous", "catastrophic"]
        assert len(data["answer"]) > 0


class TestJsonExtractor:
    def test_extract_clean_json(self):
        text = '{"whisper": "Hello world"}'
        assert _extract_json(text) == '{"whisper": "Hello world"}'

    def test_extract_markdown_fenced_json(self):
        text = '```json\n{"whisper": "Spooky"}\n```'
        assert _extract_json(text) == '{"whisper": "Spooky"}'

    def test_extract_json_with_preamble(self):
        text = 'Here is the spectral output:\n{"whisper": "Beware", "sound_fx": "wind"}\nEnd of transmission.'
        assert _extract_json(text) == '{"whisper": "Beware", "sound_fx": "wind"}'

    def test_extract_json_failure(self):
        with pytest.raises(Exception):
            _extract_json("No braces anywhere here.")
