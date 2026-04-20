import unittest

from src.portfolio_engine.pipeline import PortfolioPipeline


class TestPipeline(unittest.TestCase):
    def test_end_to_end(self):
        pipeline = PortfolioPipeline.from_json_path("examples/sample_portfolio.json")
        output = pipeline.run(top_k=3, time_budget_hours=120)

        self.assertIn("top_ranked", output)
        self.assertIn("optimized_selection", output)
        self.assertIn("tech_influence", output)
        self.assertIn("narratives", output)
        self.assertGreater(len(output["top_ranked"]), 0)
