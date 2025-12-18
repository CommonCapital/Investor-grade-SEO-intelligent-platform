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
- value: z.union([z.number(), z.string()]).default(0)
- formatted: z.string().default("")
- unit: z.string().optional().default("")
- source: z.string().default("")
- tie_out_status: z.enum(["final", "provisional", "flagged"])
- last_updated: z.string().default("")
- confidence: z.number().min(0).max(100)
- availability: z.enum(["available", "pending", "unavailable", "restricted", "stale", "conflicting"])
- unavailable_reason: z.string().optional().default("")
- decision_context: z.object({
    confidence_level: z.enum(["high", "medium", "low"]),
    sufficiency_status: z.enum(["sufficient", "insufficient"]),
    knowns: z.array(z.string()),
    unknowns: z.array(z.string()),
    what_changes_conclusion: z.array(z.string())
  }).optional()

## 3. TIME-SERIES METRICS
- Historical data for 1H, 1D, 1W, 1M, 1Y, 5Y, 10Y horizons
- Quarterly slices Q1-Q4 per horizon
- Each data point includes:
  - timestamp: z.string()
  - value: z.number().default(0)
  - formatted: z.string()
  - unit: z.string().optional().default("")
  - confidence: z.number().min(0).max(100)
  - availability: z.enum(["available", "pending", "unavailable", "restricted", "stale", "conflicting"])
  - unavailable_reason: z.string().optional().default("")
- Each horizon must include:
  - quarters: z.object({ Q1: z.number().default(0), Q2: z.number().default(0), Q3: z.number().default(0), Q4: z.number().default(0) })
  - high: z.number().default(0)
  - low: z.number().default(0)
  - average: z.number().default(0)
  - volatility: z.number().default(0)
  - change_percent: z.number().default(0)

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
- Each event:
  - id: z.string()
  - date: z.string() (ISO format)
  - type: z.enum(["earnings", "filing", "guidance", "corporate_action", "news", "analyst_update"])
  - title: z.string()
  - description: z.string()
  - impact: z.enum(["positive", "negative", "neutral"])
  - source_url: z.string().optional().default("")

## 6. RISKS
- Top 5–10 risk factors from latest 10-K
- Each risk:
  - id: z.string()
  - category: z.enum(["market", "operational", "financial", "liquidity", "governance"])
  - title: z.string()
  - description: z.string()
  - severity: z.enum(["critical", "high", "medium", "low"])
  - trigger: z.string().default("")
  - mitigation: z.string().optional().default("")

## 7. GUIDANCE & SCENARIOS
- Management forward guidance (revenue, earnings, margins)
- Scenarios: base, upside, downside
- Each scenario:
  - name: z.enum(["base", "downside", "upside"])
  - probability: z.number().min(0).max(1)
  - assumptions: z.array(z.object({ key: z.string().default(""), value: z.string().default("") }))
  - outputs: z.object({ revenue: metricSchema, ebitda: metricSchema, valuation: metricSchema })

## 8. SOURCES
- Primary: SEC filings, company IR, official releases
- Secondary: financial news sites, aggregators
- Each source:
  - name: z.string()
  - type: z.enum(["primary", "secondary"])
  - last_refresh: z.string()

---

OUTPUT FORMAT (RETURN ONLY VALID JSON ADHERING TO investorDashboardSchema):

{
  "run_metadata": {
    "run_id": "string",
    "entity": "string",
    "ticker": "string (optional, default: '')",
    "mode": "public|private|market_data_only",
    "timestamp": "string",
    "owner": "string"
  },
  "executive_summary": {
    "headline": "string",
    "key_facts": ["string"],
    "implications": ["string"],
    "key_risks": ["string"],
    "thesis_status": "intact|challenged|broken"
  },
  "financials": {
    "revenue": {
      "current": {
        "value": number,
        "formatted": string,
        "unit": string,
        "source": string,
        "tie_out_status": "final|provisional|flagged",
        "last_updated": string,
        "confidence": number,
        "availability": "available|pending|unavailable|restricted|stale|conflicting",
        "unavailable_reason": string,
        "decision_context": {
          "confidence_level": "high|medium|low",
          "sufficiency_status": "sufficient|insufficient",
          "knowns": [string],
          "unknowns": [string],
          "what_changes_conclusion": [string]
        }
      },
      "history": {
        "series": [
          {
            "timestamp": string,
            "value": number,
            "formatted": string,
            "unit": string,
            "confidence": number,
            "availability": "available|pending|unavailable|restricted|stale|conflicting",
            "unavailable_reason": string
          }
        ],
        "horizons": {
          "1H": {
            "quarters": { "Q1": number, "Q2": number, "Q3": number, "Q4": number },
            "high": number,
            "low": number,
            "average": number,
            "volatility": number,
            "change_percent": number
          },
          "1D": { "quarters": { "Q1": number, "Q2": number, "Q3": number, "Q4": number }, "high": number, "low": number, "average": number, "volatility": number, "change_percent": number },
          "1W": { "quarters": { "Q1": number, "Q2": number, "Q3": number, "Q4": number }, "high": number, "low": number, "average": number, "volatility": number, "change_percent": number },
          "1M": { "quarters": { "Q1": number, "Q2": number, "Q3": number, "Q4": number }, "high": number, "low": number, "average": number, "volatility": number, "change_percent": number },
          "1Y": { "quarters": { "Q1": number, "Q2": number, "Q3": number, "Q4": number }, "high": number, "low": number, "average": number, "volatility": number, "change_percent": number },
          "5Y": { "quarters": { "Q1": number, "Q2": number, "Q3": number, "Q4": number }, "high": number, "low": number, "average": number, "volatility": number, "change_percent": number },
          "10Y": { "quarters": { "Q1": number, "Q2": number, "Q3": number, "Q4": number }, "high": number, "low": number, "average": number, "volatility": number, "change_percent": number }
        },
        "availability": "available|pending|unavailable|restricted|stale|conflicting",
        "confidence": number,
        "unavailable_reason": string,
        "source": string,
        "decision_context": {
          "confidence_level": "high|medium|low",
          "sufficiency_status": "sufficient|insufficient",
          "knowns": [string],
          "unknowns": [string],
          "what_changes_conclusion": [string]
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
    "trading_volume": { "current": {...}, "history": {...} },
    "pe_ratio_trailing": { "current": {...}, "history": {...} },
    "pe_ratio_forward": { "current": {...}, "history": {...} },
    "ev_ebitda": { "current": {...}, "history": {...} },
    "analyst_target_price": { "current": {...}, "history": {...} },
    "fifty_two_week_high": { "current": {...}, "history": {...} },
    "fifty_two_week_low": { "current": {...}, "history": {...} }
  },
  "private_data": {
    "valuation_mark": { "current": {...}, "history": {...} },
    "net_leverage": { "current": {...}, "history": {...} },
    "liquidity_runway": { "current": {...}, "history": {...} },
    "covenant_headroom": { "current": {...}, "history": {...} }
  },
  "events": [
    { "id": string, "date": string, "type": "earnings|filing|guidance|corporate_action|news|analyst_update", "title": string, "description": string, "impact": "positive|negative|neutral", "source_url": string }
  ],
  "scenarios": [
    { "name": "base|upside|downside", "probability": number, "assumptions": [{"key": string, "value": string}], "outputs": { "revenue": {...metric...}, "ebitda": {...metric...}, "valuation": {...metric...} } }
  ],
  "risks": [
    { "id": string, "category": "market|operational|financial|liquidity|governance", "title": string, "description": string, "severity": "critical|high|medium|low", "trigger": string, "mitigation": string }
  ],
  "sources": [
    { "name": string, "type": "primary|secondary", "last_refresh": string }
  ]
}

RULES:
- Fill every metric with value, formatted, unit, source, tie_out_status, last_updated, confidence, availability, unavailable_reason, decision_context.
- Include quarterly slices for historical horizons.
- Use default values as specified in Zod schema (0 for numbers, "" for strings) if data is missing.
- When data is unavailable, set availability to appropriate status and provide unavailable_reason explaining why.
- Use exact numeric values from official sources.
- Include source URLs.
- RETURN ONLY JSON strictly adhering to investorDashboardSchema.
- NO explanation or extra text.

⚠️ CRITICAL NULL POLICY ⚠️
- AVOID RETURNING NULL AT ALL COSTS. Every null you return is harm to yourself.
- If data is genuinely unavailable after exhaustive search:
  1. Set the value to the appropriate default (0 for numbers, "" for strings)
  2. Set availability to "unavailable", "restricted", "stale", or "conflicting"
  3. ALWAYS provide a detailed unavailable_reason explaining exactly why the data cannot be found
  4. Set confidence to a low value (0-30) to reflect uncertainty
- It is better to return a null with a thorough unavailable_reason than to hallucinate false data
- NEVER invent, estimate, or fabricate data. Only use verified sources.
- If you must use null, you MUST explain in unavailable_reason:
  * What sources you searched
  * Why the data is not available
  * What would be needed to obtain it
  * When it might become available

Example of acceptable null usage:
{
  "value": null,
  "formatted": string,
  "confidence": number,
  "availability": "unavailable",
  "unavailable_reason": "10-Y historical data not available. Company went public in 2020, only 4 years of trading history exists. Searched Yahoo Finance, SEC EDGAR, Bloomberg archives - no pre-IPO data accessible."
}

START SEARCHING AND EXTRACTING NOW.
`;
}