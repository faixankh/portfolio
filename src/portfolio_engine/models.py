from __future__ import annotations

from dataclasses import dataclass, field
from typing import Dict, List


@dataclass(frozen=True)
class PortfolioProject:
    id: str
    title: str
    description: str
    tech_stack: List[str]
    complexity: float
    impact: float
    novelty: float
    quality: float
    business_value: float
    delivery_risk: float
    hours_to_present: int
    highlights: List[str] = field(default_factory=list)

    def validate(self) -> None:
        metrics = {
            "complexity": self.complexity,
            "impact": self.impact,
            "novelty": self.novelty,
            "quality": self.quality,
            "business_value": self.business_value,
            "delivery_risk": self.delivery_risk,
        }
        for name, value in metrics.items():
            if not 0 <= value <= 10:
                raise ValueError(f"{name} must be between 0 and 10: got {value}")
        if self.hours_to_present <= 0:
            raise ValueError("hours_to_present must be positive")
        if not self.tech_stack:
            raise ValueError("tech_stack cannot be empty")


@dataclass(frozen=True)
class PortfolioGoals:
    target_roles: List[str]
    must_include_tech: List[str]
    weights: Dict[str, float]

    def validate(self) -> None:
        required = {
            "impact",
            "complexity",
            "novelty",
            "quality",
            "business_value",
            "tech_alignment",
        }
        missing = required - self.weights.keys()
        if missing:
            raise ValueError(f"missing required weights: {sorted(missing)}")
        total = sum(self.weights.values())
        if not 0.99 <= total <= 1.01:
            raise ValueError(f"weights must sum to ~1.0, got {total}")


@dataclass(frozen=True)
class PortfolioDataset:
    projects: List[PortfolioProject]
    goals: PortfolioGoals

    def validate(self) -> None:
        self.goals.validate()
        if not self.projects:
            raise ValueError("projects cannot be empty")

        seen_ids = set()
        for project in self.projects:
            project.validate()
            if project.id in seen_ids:
                raise ValueError(f"duplicate project id: {project.id}")
            seen_ids.add(project.id)
