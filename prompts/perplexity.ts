import { InvestorDashboard, InvestorDashboardSchema } from "@/lib/seo-schema";

export function buildInvestorSeaSearchPrompt(target: string): string {
  return `
You are an institutional investment analyst and data validation expert specializing in exhaustive financial and market research.

TASK:
Perform a deep, multi-angle web investigation of the target entity and produce structured financial analysis data that strictly adheres to the InvestorDashboardSchema.

TARGET: ${target}

INSTRUCTIONS:

1. **COMPREHENSIVE FINANCIAL SEARCH SCOPE**
   Investigate the target across all authoritative financial dimensions:
   - Latest earnings reports, transcripts, and press releases
   - SEC/Regulatory filings (10-Q, 10-K, 8-K)
   - Analyst reports, consensus estimates, and price targets
   - Current market data (stock price, market cap, key multiples)
   - Management commentary, forward-looking guidance, and key risks
   - Liquidity and private valuation markers (if mode is 'private')

2. **METRIC EXTRACTION & PROVENANCE**
   For every field under 'financials', 'market_data', and 'private_data', extract the latest data and provide a structured object including:
   - **value**: Raw numeric value
   - **formatted**: Human-readable string (e.g., "$1.2B", "15.5%")
   - **source**: Specific source (e.g., "Q3 2025 Press Release", "Bloomberg")
   - **tie_out_status**: Set to "final" (primary source), "provisional" (derived/secondary), or "flagged" (missing/ambiguous)
   - **last_updated**: Date/Time reflecting the data's freshness (ISO 8601 string)

3. **ANALYTICAL SYNTHESIS: EXECUTIVE SUMMARY**
   Extract or synthesize the core investment narrative:
   - **headline**: Single, concise analytical summary of the latest events
   - **key_facts**: 3-5 verifiable quantitative facts driving the narrative
   - **implications**: 3-5 analytical takeaways for the investment thesis
   - **key_risks**: 3-5 critical risks cited by management or analysts
   - **thesis_status**: Set to "intact", "challenged", or "broken"

4. **EVENT TIMELINE EXTRACTION**
   Identify all significant material events within the last 12 months:
   - **date**: ISO date
   - **type**: Classify as "earnings", "filing", "guidance", "corporate_action", "news", or "analyst_update"
   - **impact**: Set as "positive", "negative", or "neutral" based on market/commentary
   - **source_url**: Provide the primary URL if found

5. **RISK AND SCENARIO IDENTIFICATION**
   - **risks**: Identify 3-5 critical, structured risks (title, description, severity, trigger) for the entity.
   - **scenarios**: If explicit forward-looking guidance or consensus is found, structure it into 'base', 'downside', and 'upside' scenarios with probability and outputs. **OMIT the 'scenarios' array if data is insufficient.**

6. **DATA SOURCES AND METADATA**
   - **sources**: List all unique official publications and data sources used. Classify as "primary" (company-issued) or "secondary" (market/news).
   - **run_metadata**: Populate all fields using the TARGET, provided TICKER, and MODE parameter.

7. **EVIDENCE-BASED REPORTING**
   Use verifiable facts and figures. Prioritize accuracy, completeness, and credibility.

Return a full structured data output that strictly adheres to the InvestorDashboardSchema.
  `.trim();
}
