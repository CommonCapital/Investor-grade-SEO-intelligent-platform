import { investorDashboardSchema } from "@/lib/seo-schema";

export function buildInvestorSeaSearchPrompt(target: string): string {
  return `SEARCH THE WEB NOW AND EXTRACT ALL FINANCIAL DATA FOR: ${target}

DO NOT EXPLAIN. DO NOT PLAN. EXECUTE IMMEDIATELY.

REQUIRED DATA TO EXTRACT:

## 1. ENTITY BASICS
- Legal name, ticker symbol, exchange
- Industry, sector, headquarters location

## 2. FINANCIAL METRICS
Search SEC filings, Yahoo Finance, company IR. Extract for FY2024, FY2023, and latest quarter:
- Total Revenue
- Revenue Growth (% YoY)
- EBITDA
- EBITDA Margin (%)
- Free Cash Flow
- Operating Income
- Net Income
- Gross Margin

For EACH metric, include:
- value (nullable if missing)
- formatted
- unit
- source
- tie_out_status
- last_updated
- confidence (0-100)
- availability (available, pending, unavailable, restricted, stale, conflicting)
- unavailable_reason (nullable)
- decision_context (confidence_level, sufficiency_status, knowns, unknowns, what_changes_conclusion)

## 3. TIME-SERIES METRICS
- Historical data for 1H, 1D, 1W, 1M, 1Y, 5Y, 10Y horizons
- Quarterly slices Q1-Q4 per horizon
- Each data point includes:
  - timestamp
  - value (nullable)
  - formatted
  - unit
  - confidence
  - availability
  - unavailable_reason
- Each horizon must include:
  - quarters (Q1-Q4)
  - high, low, average, volatility, change_percent

## 4. MARKET DATA
Search Yahoo Finance, Bloomberg, Google Finance. Include:
- Current stock price
- Market capitalization
- P/E Ratio (trailing & forward)
- EV/EBITDA
- Analyst target price
- 52-week high/low
- Trading volume

Include all fields for metrics as above (value, formatted, confidence, availability, unavailable_reason, decision_context).

## 5. RECENT EVENTS
Last 6 months:
- Earnings, SEC filings (10-K, 10-Q, 8-K), Guidance updates, Corporate actions, News
- Each event: id, date (ISO), type (earnings, filing, guidance, corporate_action, news, analyst_update), title, description, impact (positive, negative, neutral), source_url

## 6. RISKS
- Top 5–10 risk factors from latest 10-K
- Each risk: id, category (market, operational, financial, liquidity, governance), title, description, severity (critical, high, medium, low), trigger (nullable), mitigation (nullable)

## 7. GUIDANCE & SCENARIOS
- Management forward guidance (revenue, earnings, margins)
- Scenarios: base, upside, downside
- Each scenario: name, probability (0-1), assumptions (key, value), outputs (revenue, ebitda, valuation metrics)

## 8. SOURCES
- Primary: SEC filings, company IR, official releases
- Secondary: financial news sites, aggregators

---

OUTPUT FORMAT (RETURN ONLY VALID JSON ADHERING TO investorDashboardSchema:

{
  "run_metadata": {
    "run_id": "",
    "entity": "",
    "ticker": "",
    "mode": "",
    "timestamp": "",
    "owner": ""
  },
  "executive_summary": {
    "headline": "",
    "key_facts": [""],
    "implications": [""],
    "key_risks": [""],
    "thesis_status": "intact|challenged|broken"
  },
  "financials": {
    "revenue": {
      "current": {
        "value": null,
        "formatted": "",
        "unit": "",
        "source": "",
        "tie_out_status": "final|provisional|flagged",
        "last_updated": "",
        "confidence": 0,
        "availability": "available|pending|unavailable|restricted|stale|conflicting",
        "unavailable_reason": null,
        "decision_context": {
          "confidence_level": "high|medium|low",
          "sufficiency_status": "sufficient|insufficient",
          "knowns": [""],
          "unknowns": [""],
          "what_changes_conclusion": [""]
        }
      },
      "history": {
        "series": [
          {
            "timestamp": "",
            "value": null,
            "formatted": "",
            "unit": "",
            "confidence": 0,
            "availability": "available|pending|unavailable|restricted|stale|conflicting",
            "unavailable_reason": null
          }
        ],
        "horizons": {
          "1H": {
            "quarters": { "Q1": null, "Q2": null, "Q3": null, "Q4": null },
            "high": null,
            "low": null,
            "average": null,
            "volatility": null,
            "change_percent": null
          },
          "1D": { ...same structure... },
          "1W": { ...same structure... },
          "1M": { ...same structure... },
          "1Y": { ...same structure... },
          "5Y": { ...same structure... },
          "10Y": { ...same structure... }
        },
        "availability": "available|pending|unavailable|restricted|stale|conflicting",
        "confidence": 0,
        "unavailable_reason": null,
        "source": "",
        "decision_context": {
          "confidence_level": "high|medium|low",
          "sufficiency_status": "sufficient|insufficient",
          "knowns": [""],
          "unknowns": [""],
          "what_changes_conclusion": [""]
        }
      }
    },
    "revenue_growth": { ...same as revenue... },
    "ebitda": { ...same as revenue... },
    "ebitda_margin": { ...same as revenue... },
    "free_cash_flow": { ...same as revenue... }
  },
  "market_data": {
    "stock_price": { "current": {...}, "history": {...} },
    "market_cap": { "current": {...}, "history": {...} },
    "pe_ratio": { "current": {...}, "history": {...} },
    "ev_ebitda": { "current": {...}, "history": {...} },
    "target_price": { "current": {...}, "history": {...} }
  },
  "private_data": {
    "valuation_mark": { "current": {...}, "history": {...} },
    "net_leverage": { "current": {...}, "history": {...} },
    "liquidity_runway": { "current": {...}, "history": {...} },
    "covenant_headroom": { "current": {...}, "history": {...} }
  },
  "events": [
    { "id": "", "date": "", "type": "", "title": "", "description": "", "impact": "positive|negative|neutral", "source_url": "" }
  ],
  "scenarios": [
    { "name": "base|upside|downside", "probability": 0, "assumptions": [{"key": "", "value": ""}], "outputs": { "revenue": {...metric...}, "ebitda": {...metric...}, "valuation": {...metric...} } }
  ],
  "risks": [
    { "id": "", "category": "market|operational|financial|liquidity|governance", "title": "", "description": "", "severity": "critical|high|medium|low", "trigger": null, "mitigation": null }
  ],
  "sources": [
    { "name": "", "type": "primary|secondary", "last_refresh": "" }
  ]
}

RULES:
- Fill every metric with value, formatted, unit, source, tie_out_status, last_updated, confidence, availability, unavailable_reason, decision_context.
- Include quarterly slices for historical horizons.
- Nullable fields if data is missing.
- Yet each nullable is a harm to you and should have explanation of an unavailable_reason.
- Use exact numeric values from official sources.
- Include source URLs.
- RETURN ONLY JSON strictly adhering to investorDashboardSchema.
- NO explanation or extra text.

START SEARCHING AND EXTRACTING NOW.
`;
}