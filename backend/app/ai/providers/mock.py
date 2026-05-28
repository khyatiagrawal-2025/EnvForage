"""
MockProvider — deterministic test fixtures with confidence fields.

Scenarios:
  "high"  → all HIGH-confidence fixes (no gating expected)
  "mixed" → HIGH + MEDIUM + LOW fixes (tests full pipeline)
  "gate"  → score below LOW_CONFIDENCE_GATE (tests suppression)
"""

from __future__ import annotations
from typing import Type
from pydantic import BaseModel
from ..models import FixConfidenceLevel, SuggestedFix, TroubleshootResponse
from .base import LLMProvider

_HIGH_FIXES = [
    SuggestedFix(
        step=1, title="Upgrade CUDA Toolkit to 12.1",
        description="CUDA 11.7 is incompatible with PyTorch 2.1. Matrix requires CUDA 12.1.",
        severity="CRITICAL",
        safe_commands=["nvcc --version", "nvidia-smi"],
        repair_template_id="repair_cuda_upgrade",
        confidence_level=FixConfidenceLevel.HIGH,
        confidence_score=0.95,
        is_matrix_backed=True,
        uncertainty_reason=None,
        fallback_recommendation=None,
    ),
    SuggestedFix(
        step=2, title="Verify cuDNN 8.9.x is installed",
        description="cuDNN 8.9.x is pinned in the matrix for CUDA 12.1.",
        severity="WARNING",
        safe_commands=["python -c \"import torch; print(torch.backends.cudnn.version())\""],
        repair_template_id=None,
        confidence_level=FixConfidenceLevel.HIGH,
        confidence_score=0.88,
        is_matrix_backed=True,
        uncertainty_reason=None,
        fallback_recommendation=None,
    ),
]

_MIXED_FIXES = [
    SuggestedFix(
        step=1, title="Reinstall PyTorch with CUDA index",
        description="PyTorch installation appears to be CPU-only build.",
        severity="CRITICAL",
        safe_commands=["python -c \"import torch; print(torch.version.cuda)\""],
        repair_template_id="repair_cuda_upgrade",
        confidence_level=FixConfidenceLevel.HIGH,
        confidence_score=0.91,
        is_matrix_backed=True,
        uncertainty_reason=None,
        fallback_recommendation=None,
    ),
    SuggestedFix(
        step=2, title="Check NVIDIA driver version",
        description="Driver 520.x may not support CUDA 12.1. Driver 525+ is recommended.",
        severity="WARNING",
        safe_commands=["nvidia-smi --query-gpu=driver_version --format=csv"],
        repair_template_id=None,
        confidence_level=FixConfidenceLevel.MEDIUM,
        confidence_score=0.58,
        is_matrix_backed=False,
        uncertainty_reason="Exact GPU model not in diagnostic report; minimum driver requirement unconfirmed.",
        fallback_recommendation="Check https://docs.nvidia.com/cuda/cuda-toolkit-release-notes/ for your GPU.",
    ),
    SuggestedFix(
        step=3, title="Consider switching to WSL2",
        description="WSL2 with CUDA passthrough is often more stable for training workloads.",
        severity="INFO",
        safe_commands=["wsl --version"],
        repair_template_id=None,
        confidence_level=FixConfidenceLevel.LOW,
        confidence_score=0.32,
        is_matrix_backed=False,
        uncertainty_reason="User's specific workflow and Windows version unknown; benefit is speculative.",
        fallback_recommendation="Ensure NVIDIA WSL2 CUDA driver is installed separately if you proceed.",
    ),
]

_GATE_FIXES = [
    SuggestedFix(
        step=1, title="Rebuild Python from source",
        description="An extremely unlikely fix for edge cases.",
        severity="INFO",
        safe_commands=["python --version"],
        repair_template_id=None,
        confidence_level=FixConfidenceLevel.LOW,
        confidence_score=0.10,   # below LOW_CONFIDENCE_GATE=0.20 → gets suppressed
        is_matrix_backed=False,
        uncertainty_reason="No evidence in diagnostic report supports this fix.",
        fallback_recommendation="Contact the EnvForge team for manual review.",
    ),
]


class MockProvider(LLMProvider):
    """
    Deterministic mock for unit tests and local dev.

    Args:
        scenario: "high" | "mixed" | "gate"
    """

    def __init__(self, scenario: str = "mixed") -> None:
        self._scenario = scenario

    async def complete(
        self, system_prompt: str, user_message: str, response_schema: Type[BaseModel] = None, response_model: Type[BaseModel] = None
    ) -> BaseModel:
        fixes_map = {"high": _HIGH_FIXES, "mixed": _MIXED_FIXES, "gate": _GATE_FIXES}
        fixes = fixes_map.get(self._scenario, _MIXED_FIXES)
        avg = sum(f.confidence_score for f in fixes) / max(len(fixes), 1)

        return TroubleshootResponse(
            session_id="mock-session-00000000",
            root_cause="Mock root cause: CUDA version mismatch between toolkit and PyTorch build.",
            suggested_fixes=fixes,
            repair_script_available=True,
            confidence=round(avg, 4),
            disclaimer="AI-generated suggestions. Review carefully before executing.",
            suppressed_fix_count=0,
        )
    async def stream(self, system_prompt: str, user_message: str, response_schema=None, response_model=None):
        """Stub stream — not used in tests, required by ABC."""
        raise NotImplementedError("MockProvider does not support streaming")
