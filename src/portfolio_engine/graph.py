from __future__ import annotations

from collections import defaultdict
from typing import Dict, List

from .models import PortfolioProject


def build_tech_cooccurrence(projects: List[PortfolioProject]) -> Dict[str, Dict[str, float]]:
    graph: Dict[str, Dict[str, float]] = defaultdict(lambda: defaultdict(float))

    for project in projects:
        stack = list({tech.strip() for tech in project.tech_stack if tech.strip()})
        for i, src in enumerate(stack):
            for dst in stack[i + 1 :]:
                weight = 1.0 + project.impact / 10.0
                graph[src][dst] += weight
                graph[dst][src] += weight

    return {k: dict(v) for k, v in graph.items()}


def tech_influence_scores(
    graph: Dict[str, Dict[str, float]],
    damping: float = 0.85,
    iterations: int = 30,
) -> Dict[str, float]:
    if not graph:
        return {}

    nodes = list(graph.keys())
    n = len(nodes)
    scores = {node: 1.0 / n for node in nodes}

    for _ in range(iterations):
        next_scores = {node: (1.0 - damping) / n for node in nodes}
        for node in nodes:
            neighbors = graph[node]
            total_weight = sum(neighbors.values())
            if total_weight == 0:
                continue
            for neighbor, weight in neighbors.items():
                next_scores[neighbor] += damping * scores[node] * (weight / total_weight)
        scores = next_scores

    return dict(sorted(scores.items(), key=lambda item: item[1], reverse=True))
