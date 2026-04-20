import unittest

from src.portfolio_engine.models import PortfolioGoals, PortfolioProject
from src.portfolio_engine.optimizer import optimize_showcase_selection
from src.portfolio_engine.scoring import rank_projects


class TestScoringOptimizer(unittest.TestCase):
    def setUp(self):
        self.goals = PortfolioGoals(
            target_roles=["Senior"],
            must_include_tech=["Python", "Kafka"],
            weights={
                "impact": 0.24,
                "complexity": 0.18,
                "novelty": 0.12,
                "quality": 0.18,
                "business_value": 0.18,
                "tech_alignment": 0.10,
            },
        )
        self.projects = [
            PortfolioProject("a", "A", "d", ["Python", "Kafka"], 8, 9, 7, 8, 8, 3, 40),
            PortfolioProject("b", "B", "d", ["Python"], 7, 8, 9, 9, 7, 2, 20),
            PortfolioProject("c", "C", "d", ["Go"], 9, 7, 8, 7, 8, 4, 25),
        ]

    def test_rank_order(self):
        ranked = rank_projects(self.projects, self.goals)
        self.assertEqual(ranked[0][0].id, "a")

    def test_optimize_hours(self):
        ranked = rank_projects(self.projects, self.goals)
        result = optimize_showcase_selection(ranked, hour_budget=45)
        self.assertLessEqual(result.total_hours, 45)
        self.assertGreater(result.total_score, 0)
