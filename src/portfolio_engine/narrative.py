from __future__ import annotations

from typing import List

from .models import PortfolioProject


def generate_star_bullet(project: PortfolioProject) -> str:
    highlights = "; ".join(project.highlights[:2]) if project.highlights else "Delivered measurable outcomes"
    return (
        f"Situation: Needed a high-impact solution in {project.title}. "
        f"Task: Build with {', '.join(project.tech_stack[:4])}. "
        f"Action: Engineered a system with complexity {project.complexity:.1f}/10 and quality {project.quality:.1f}/10. "
        f"Result: {highlights}; business value scored {project.business_value:.1f}/10."
    )


def generate_portfolio_narrative(projects: List[PortfolioProject]) -> List[str]:
    return [generate_star_bullet(project) for project in projects]
