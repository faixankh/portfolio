from __future__ import annotations

import argparse
import json

from .pipeline import PortfolioPipeline


def main() -> None:
    parser = argparse.ArgumentParser(description="Portfolio Intelligence Engine")
    parser.add_argument("--input", required=True, help="Path to portfolio JSON input")
    parser.add_argument("--top", type=int, default=5, help="Top K projects to rank")
    parser.add_argument("--time-budget", type=int, default=120, help="Hour budget for showcase optimization")
    args = parser.parse_args()

    pipeline = PortfolioPipeline.from_json_path(args.input)
    output = pipeline.run(top_k=args.top, time_budget_hours=args.time_budget)
    print(json.dumps(output, indent=2))


if __name__ == "__main__":
    main()
