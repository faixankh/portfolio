from __future__ import annotations

import json
from dataclasses import asdict
from pathlib import Path
from typing import Any, Dict

from .graph import build_tech_cooccurrence, tech_influence_scores
from .models import PortfolioDataset, PortfolioGoals, PortfolioProject
from .narrative import generate_portfolio_narrative
from .optimizer import optimize_showcase_selection
from .scoring import rank_projects


class PortfolioPipeline:
    def __init__(self, dataset: PortfolioDataset):
        dataset.validate()
        self.dataset = dataset

    @classmethod
    def from_json_path(cls, path: str | Path) -> "PortfolioPipeline":
        payload = json.loads(Path(path).read_text())
        projects = [PortfolioProject(**project) for project in payload["projects"]]
        goals = PortfolioGoals(**payload["goals"])
        return cls(PortfolioDataset(projects=projects, goals=goals))

    def run(self, top_k: int = 5, time_budget_hours: int = 120) -> Dict[str, Any]:
        ranked = rank_projects(self.dataset.projects, self.dataset.goals)
        top_ranked = ranked[:top_k]

        optimization = optimize_showcase_selection(top_ranked, time_budget_hours)
        graph = build_tech_cooccurrence(self.dataset.projects)
        influence = tech_influence_scores(graph)
        narratives = generate_portfolio_narrative(optimization.selected_projects)

        return {
            "top_ranked": [
                {
                    "project": asdict(project),
                    "score": breakdown.total_score,
                    "components": breakdown.components,
                }
                for project, breakdown in top_ranked
            ],
            "optimized_selection": {
                "projects": [asdict(project) for project in optimization.selected_projects],
                "total_score": optimization.total_score,
                "total_hours": optimization.total_hours,
            },
            "tech_influence": influence,
            "narratives": narratives,
        }
