import { investorDashboardSchema } from "@/lib/seo-schema";

export function buildInvestorSeaSearchPrompt(target: string): string {
  return `SEARCH THE WEB NOW AND EXTRACT ALL FINANCIAL DATA FOR: ${target}

DO NOT EXPLAIN. DO NOT PLAN. EXECUTE IMMEDIATELY.

REQUIRED DATA TO EXTRACT:

## 1. ENTITY BASICS
- Legal name, ticker symbol, exchange
- Industry, sector, headquarters location

## 2. FINANCIAL METRICS (Search SEC filings, Yahoo Finance, company IR)
Extract for FY2024, FY2023, and latest quarter:
- Total Revenue (exact number, currency, period)
- Revenue Growth (%, YoY)
- EBITDA (exact number, currency)
- EBITDA Margin (%)
- Free Cash Flow (exact number, currency)
- Operating Income
- Net Income
- Gross Margin

For EACH metric include: raw_value, unit, period, source_name, source_url, publication_date

## 3. MARKET DATA (Search Yahoo Finance, Google Finance, Bloomberg)
- Current stock price (timestamp)
- Market capitalization (current)
- P/E Ratio (trailing & forward if available)
- EV/EBITDA (if available)
- Analyst target price (consensus if available)
- 52-week high/low
- Trading volume

## 4. RECENT EVENTS (Search company IR, SEC filings, financial news)
Find last 6 months of:
- Earnings announcements (date, title, brief description)
- SEC filings (10-K, 10-Q, 8-K with dates)
- Guidance updates (any forward-looking statements)
- Corporate actions (M&A, buybacks, dividends)
- Major news events

For EACH event: date (ISO format), title, description, category, source_url

## 5. RISKS (Search latest 10-K filing "Risk Factors" section)
Extract verbatim:
- Top 5-10 explicitly stated risk factors
- Category (market/operational/financial/liquidity/governance)
- Direct quotes from filing

## 6. GUIDANCE & SCENARIOS (Search earnings calls, press releases)
- Management's forward guidance (revenue, earnings, margins)
- Any disclosed assumptions or scenarios
- Analyst projections if quoted in news

## 7. SOURCES
List ALL sources used:
- Primary: SEC filings, company IR, official releases
- Secondary: Financial news sites, data aggregators

---

OUTPUT FORMAT (RETURN ONLY VALID JSON) :

{
  "entity_identifiers": {
    "legal_name": "",
    "tickers": [""],
    "exchange": "",
    "industry": "",
    "sector": "",
    "geography": ""
  },
  "raw_financial_metrics": [
    {
      "metric_name": "",
      "raw_value": "",
      "unit_currency": "",
      "period": "",
      "source_name": "",
      "source_url": "",
      "publication_date": "",
      "notes": ""
    }
  ],
  "raw_market_data": {
    "stock_price": [
      {
        "value": "",
        "currency": "USD",
        "timestamp": "",
        "source_name": "",
        "source_url": ""
      }
    ],
    "market_cap": [
      {
        "value": "",
        "currency": "USD",
        "timestamp": "",
        "source_name": "",
        "source_url": ""
      }
    ],
    "pe_ratio": [
      {
        "trailing": 0,
        "forward": 0,
        "source_name": "",
        "source_url": ""
      }
    ],
    "ev_ebitda": [
      {
        "value": 0,
        "source_name": "",
        "source_url": ""
      }
    ],
    "target_price": [
      {
        "value": 0,
        "currency": "USD",
        "source_name": "",
        "source_url": ""
      }
    ]
  },
  "raw_events": [
    {
      "date": "",
      "title": "",
      "description": "",
      "category": "",
      "source_url": ""
    }
  ],
  "raw_guidance": [
    {
      "name": "",
      "raw_value": "",
      "source_name": "",
      "source_url": "",
      "publication_date": ""
    }
  ],
  "raw_risks": [
    {
      "category": "",
      "title": "",
      "description": "",
      "source_excerpt": ""
    }
  ],
  "source_index": {
    "primary": [
      {
        "name": "",
        "url": "",
        "publication_date": ""
      }
    ],
    "secondary": [
      {
        "name": "",
        "url": "",
        "publication_date": ""
      }
    ]
  }
}

RULES:
- Search real websites NOW (SEC.gov, Yahoo Finance, company IR pages)
- Extract exact values as stated - no rounding, no interpretation
- Include source URLs for every data point
- If data not found, put "not found" in notes field
- Return ONLY the JSON structure above
- NO explanatory text before or after JSON
- Just output the JSON format as specified above without excedding the structure and size.

START SEARCHING AND EXTRACTING NOW.
`;
}