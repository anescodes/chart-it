from typing import Any


def generate_financial_insights(stats: dict[str, Any]) -> str:
    """Create a stable local insight when no external LLM is configured."""
    total_spent = stats["total_spent"]
    anomalies_count = stats["anomalies_count"]
    average = stats["avg_transaction"]

    if anomalies_count:
        return (
            f"Total spending was ${total_spent:,.2f} across the uploaded transactions. "
            f"{anomalies_count} unusual transaction(s) were detected; review them first. "
            f"The average transaction was ${average:,.2f}."
        )
    return (
        f"Total spending was ${total_spent:,.2f} across the uploaded transactions. "
        f"No unusual transactions were detected, and the average transaction was "
        f"${average:,.2f}."
    )