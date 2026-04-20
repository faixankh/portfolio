import unittest

from src.portfolio_engine.models import PortfolioDataset, PortfolioGoals, PortfolioProject


class TestModels(unittest.TestCase):
    def test_valid_dataset(self):
        project = PortfolioProject(
            id="p1",
            title="Project",
            description="desc",
            tech_stack=["Python"],
            complexity=8,
            impact=9,
            novelty=7,
            quality=8,
            business_value=9,
            delivery_risk=3,
            hours_to_present=10,
            highlights=["x"],
        )
        goals = PortfolioGoals(
            target_roles=["role"],
            must_include_tech=["Python"],
            weights={
                "impact": 0.24,
                "complexity": 0.18,
                "novelty": 0.12,
                "quality": 0.18,
                "business_value": 0.18,
                "tech_alignment": 0.10,
            },
        )
        dataset = PortfolioDataset(projects=[project], goals=goals)
        dataset.validate()

    def test_duplicate_ids_raise(self):
        p1 = PortfolioProject("x", "t", "d", ["Python"], 1, 1, 1, 1, 1, 1, 1)
        p2 = PortfolioProject("x", "t", "d", ["Python"], 1, 1, 1, 1, 1, 1, 1)
        goals = PortfolioGoals(
            target_roles=["r"],
            must_include_tech=[],
            weights={
                "impact": 0.24,
                "complexity": 0.18,
                "novelty": 0.12,
                "quality": 0.18,
                "business_value": 0.18,
                "tech_alignment": 0.10,
            },
        )
        with self.assertRaises(ValueError):
            PortfolioDataset(projects=[p1, p2], goals=goals).validate()
