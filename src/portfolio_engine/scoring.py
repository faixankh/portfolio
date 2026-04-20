from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, Iterable

from .models import PortfolioGoals, PortfolioProject


@dataclass(frozen=True)
class ScoreBreakdown:
    total_score: float
    components: Dict[str, float]


def _tech_alignment(project: PortfolioProject, must_include: Iterable[str]) -> float:
    normalized = {t.lower() for t in project.tech_stack}
    targets = [t.lower() for t in must_include]
    if not targets:
        return 10.0
    matches = sum(1 for tech in targets if tech in normalized)
    return 10.0 * (matches / len(targets))


def score_project(project: PortfolioProject, goals: PortfolioGoals) -> ScoreBreakdown:
    alignment = _tech_alignment(project, goals.must_include_tech)
    raw_components = {
        "impact": project.impact,
        "complexity": project.complexity,
        "novelty": project.novelty,
        "quality": project.quality,
        "business_value": project.business_value,
        "tech_alignment": alignment,
    }

    weighted = {
        key: raw_components[key] * goals.weights[key]
        for key in raw_components
    }

    risk_penalty = project.delivery_risk * 0.07
    total = max(0.0, sum(weighted.values()) - risk_penalty)

    return ScoreBreakdown(total_score=round(total, 4), components={k: round(v, 4) for k, v in weighted.items()})


def rank_projects(projects: list[PortfolioProject], goals: PortfolioGoals) -> list[tuple[PortfolioProject, ScoreBreakdown]]:
    scored = [(project, score_project(project, goals)) for project in projects]
    return sorted(scored, key=lambda item: item[1].total_score, reverse=True)
