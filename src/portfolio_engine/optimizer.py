from __future__ import annotations

from dataclasses import dataclass
from typing import List, Tuple

from .models import PortfolioProject
from .scoring import ScoreBreakdown


@dataclass(frozen=True)
class OptimizationResult:
    selected_projects: List[PortfolioProject]
    total_score: float
    total_hours: int


def optimize_showcase_selection(
    ranked: List[Tuple[PortfolioProject, ScoreBreakdown]],
    hour_budget: int,
) -> OptimizationResult:
    """0/1 knapsack by hour budget maximizing total score."""
    if hour_budget <= 0:
        return OptimizationResult(selected_projects=[], total_score=0.0, total_hours=0)

    n = len(ranked)
    dp = [[0.0 for _ in range(hour_budget + 1)] for _ in range(n + 1)]
    keep = [[False for _ in range(hour_budget + 1)] for _ in range(n + 1)]

    for i in range(1, n + 1):
        project, breakdown = ranked[i - 1]
        cost = project.hours_to_present
        value = breakdown.total_score
        for w in range(hour_budget + 1):
            dp[i][w] = dp[i - 1][w]
            if cost <= w and dp[i - 1][w - cost] + value > dp[i][w]:
                dp[i][w] = dp[i - 1][w - cost] + value
                keep[i][w] = True

    w = hour_budget
    selected: List[PortfolioProject] = []
    for i in range(n, 0, -1):
        if keep[i][w]:
            project = ranked[i - 1][0]
            selected.append(project)
            w -= project.hours_to_present

    selected.reverse()
    total_hours = sum(p.hours_to_present for p in selected)
    return OptimizationResult(
        selected_projects=selected,
        total_score=round(dp[n][hour_budget], 4),
        total_hours=total_hours,
    )
