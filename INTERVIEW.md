# INTERVIEW.md — AgentFlow AI (Multi-Agent Workshop)
## Complete Interview Preparation Guide

---

## TABLE OF CONTENTS

1. [Project Overview](#1-project-overview)
2. [Tech Stack Deep Dive](#2-tech-stack-deep-dive)
3. [System Architecture](#3-system-architecture)
4. [Agent Design Patterns](#4-agent-design-patterns)
5. [Database & Analytics Layer (Firebolt)](#5-database--analytics-layer-firebolt)
6. [AI Integration (Gemini API)](#6-ai-integration-gemini-api)
7. [API Design & Backend Routes](#7-api-design--backend-routes)
8. [Frontend Architecture (Next.js)](#8-frontend-architecture-nextjs)
9. [Email & Notification System](#9-email--notification-system)
10. [Security & Configuration](#10-security--configuration)
11. [Performance & Optimization](#11-performance--optimization)
12. [Testing & Deployment](#12-testing--deployment)
13. [Key Interview Questions & Answers](#13-key-interview-questions--answers)
14. [Data Science / ML Questions](#14-data-science--ml-questions)
15. [System Design Questions](#15-system-design-questions)
16. [Code Walkthroughs](#16-code-walkthroughs)
17. [Behavioral / Project Story Questions](#17-behavioral--project-story-questions)
18. [Quick Reference Cheat Sheet](#18-quick-reference-cheat-sheet)

---

## 1. PROJECT OVERVIEW

### What Is This Project?

**AgentFlow AI** is a production-ready **multi-agent AI orchestration system** that enables natural language querying of an e-commerce database, AI-powered report generation, and automated email delivery — all coordinated by a central orchestrator powered by Google's Gemini AI.

**Live Demo:** https://agentflow-ai-wsmw.onrender.com

### Core Value Proposition

> "A user types a natural language question like *'Show top selling products and email the report to manager@company.com'* and the system automatically queries a database, generates a professional report, and sends the email — all without any manual SQL or email composition."

### Project Type
- Production-ready SaaS demo / Developer Workshop
- Demonstrates multi-agent AI design patterns
- Built for scale: handles 400M+ row analytics database

---

## 2. TECH STACK DEEP DIVE

### Full Stack Overview

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Framework** | Next.js | 14 (App Router) | Full-stack React framework |
| **Language** | TypeScript | 5.3+ | Type-safe development |
| **Styling** | Tailwind CSS | 3.4 | Utility-first CSS |
| **AI Model** | Google Gemini | 2.0/2.5 Flash | NL understanding, SQL gen, reports |
| **Analytics DB** | Firebolt | 1.14 (SDK) | High-performance OLAP database |
| **Email** | Nodemailer + Gmail SMTP | 7.x | Email delivery |
| **UI Components** | Radix UI + shadcn/ui | — | Accessible components |
| **Content** | MDX (next-mdx-remote) | 4.4 | Workshop step rendering |
| **Icons** | Lucide React | 0.294 | Icon library |
| **Protocol** | MCP (Model Context Protocol) | 1.22 | AI-to-service bridge |

### Why These Choices?

**Next.js 14 App Router:**
- Server Components reduce client-side JavaScript
- API routes co-located with frontend (monorepo simplicity)
- Built-in TypeScript support
- `serverActions` experimental flag used for form actions

**Firebolt over Postgres/BigQuery:**
- Purpose-built for analytical workloads (OLAP vs OLTP)
- FACT TABLE abstraction provides automatic sparse indexing
- 10-20x faster than traditional databases for aggregations on 400M+ rows
- MCP protocol integration for AI agent access

**Gemini 2.0/2.5 Flash:**
- Flash variants prioritize speed over raw capability (ideal for real-time demos)
- Free tier: 15 RPM (manageable with built-in rate limiter)
- Strong SQL generation and structured JSON output capabilities

**MCP (Model Context Protocol):**
- Standardized protocol for AI models to use tools/external services
- Separates AI reasoning from execution (security boundary)
- Enables Gemini to "call" Firebolt and Gmail without direct access

---

## 3. SYSTEM ARCHITECTURE

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                     USER / BROWSER                      │
│           (Next.js React Frontend - Client)             │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP/REST
┌────────────────────────▼────────────────────────────────┐
│              NEXT.JS API ROUTES (Server)                 │
│   /api/orchestrator  /api/analytics  /api/report        │
└──────┬──────────────────┬──────────────────┬────────────┘
       │                  │                  │
┌──────▼──────┐  ┌────────▼──────┐  ┌───────▼──────────┐
│  Orchestrator│  │Analytics Agent│  │  Report Agent     │
│    Agent    │  │ (SQL + MCP)   │  │(Gemini + Gmail)  │
└──────┬──────┘  └────────┬──────┘  └───────┬──────────┘
       │                  │                  │
       │         ┌────────▼──────┐  ┌───────▼──────────┐
       │         │  Firebolt MCP │  │   Gmail SMTP      │
       │         │    Client     │  │   (Nodemailer)    │
       │         └────────┬──────┘  └───────────────────┘
       │                  │
┌──────▼──────┐  ┌────────▼──────┐
│ Gemini API  │  │ Firebolt DB   │
│ (Google AI) │  │ (FACT TABLE)  │
└─────────────┘  └───────────────┘
```

### Request Lifecycle: End-to-End

For query: *"Show revenue and email to alice@company.com"*

```
1. User submits query via React UI
2. POST /api/orchestrator { query, action: "execute" }
3. OrchestratorAgent.handleMultiStepQuery(query)
   ├── Regex detection → hasRevenue=true, recipient="alice@company.com"
   ├── AnalyticsAgent.executeQuery("revenue")
   │    └── FireboltMCPClient.execute(SQL) → QueryResult
   ├── ReportAgent.generateFinancialReport(analyticsResult)
   │    └── Gemini API → formatted markdown report string
   └── ReportAgent.sendEmail(recipient, subject, report)
        ├── generateReportHTML(report) → HTML email
        └── GmailClient.send({ recipient, subject, body })
             └── Nodemailer SMTP → Gmail
4. Return steps[] with status tracking to frontend
5. React renders each step with status badges
```

### Folder Structure (Key Directories)

```
src/
├── app/
│   ├── api/
│   │   ├── orchestrator/route.ts   ← Main orchestration endpoint
│   │   ├── analytics/route.ts      ← Analytics query endpoint
│   │   └── report/route.ts         ← Report generation endpoint
│   ├── workshop/                   ← MDX workshop content pages
│   └── firebolt/                   ← Setup guide pages
├── lib/
│   ├── agents/
│   │   ├── orchestrator.ts         ← Coordinates all agents
│   │   ├── analytics.ts            ← SQL execution agent
│   │   └── report.ts               ← Report + email agent
│   ├── services/
│   │   ├── gemini.ts               ← Gemini API wrapper + rate limiting
│   │   ├── firebolt-mcp.ts         ← Firebolt connection + mock fallback
│   │   └── gmail.ts                ← Email delivery (sandbox/production)
│   └── utils/
│       ├── email-templates.ts      ← HTML email generation
│       ├── error-handler.ts        ← Retry logic + rate limiting
│       └── logger.ts               ← Structured logging
└── components/
    ├── agents/                     ← Demo UI components
    ├── layout/                     ← App + Workshop sidebars
    └── ui/                         ← Reusable UI primitives
```

---

## 4. AGENT DESIGN PATTERNS

### The Multi-Agent Pattern

This project implements the **Orchestrator-Worker** pattern:

```
Orchestrator (brain) ─── delegates to ──► Analytics Agent (data)
                     ─── delegates to ──► Report Agent (content + delivery)
```

**Why separate agents?**
- **Single Responsibility Principle**: Each agent has one job
- **Testability**: Each agent can be tested independently
- **Scalability**: Agents can be scaled independently
- **Composability**: Combine agents in any order for new workflows

### Agent 1: OrchestratorAgent (`orchestrator.ts`)

**Responsibilities:**
1. Parse natural language intent using Gemini
2. Route tasks to appropriate agents
3. Chain multi-step workflows
4. Track execution state (steps array)
5. Handle errors gracefully

**Key Methods:**

```typescript
// Method 1: Intent parsing via Gemini
async parseIntent(userQuery: string): Promise<IntentResult>
// → Returns { intent, entities, confidence }

// Method 2: Simple routing
routeTask(intent: IntentResult): AgentType
// → Returns 'analytics' | 'report' | 'email' | 'unknown'

// Method 3: Full workflow execution
async handleMultiStepQuery(userQuery: string)
// → Returns { success, totalSteps, steps[] }
```

**Intent Classification (returned by Gemini):**
```typescript
type IntentResult = {
  intent: 'analytics' | 'report' | 'email' | 'multi_step';
  entities: {
    query_type?: string;    // revenue, top_products, etc.
    time_range?: string;    // "last 30 days"
    recipient?: string;     // "alice@company.com"
  };
  confidence: number;       // 0.0 to 1.0
};
```

**Intent Detection (Regex-based in handleMultiStepQuery):**
```typescript
const hasRevenue   = /revenue|sales|income|earnings|money/.test(lower);
const hasReport    = /report|summary|generate|create report/.test(lower);
const recipientMatch = lower.match(/[\w.-]+@[\w.-]+\.[a-z]{2,}/);
```

**Why dual approach (Gemini + regex)?**
- Regex is fast and deterministic for known patterns
- Gemini handles edge cases and complex language
- Regex runs first; Gemini used for `parseIntent` (slower, richer)

### Agent 2: AnalyticsAgent (`analytics.ts`)

**Responsibilities:**
1. Execute predefined SQL queries against Firebolt
2. Handle natural language to SQL conversion (via Gemini)
3. Provide advanced analytics (funnel, growth, time series)

**Query Types:**

| Query Type | Description | Time Window |
|-----------|-------------|------------|
| `revenue` | Total revenue, purchases, unique customers | All-time |
| `top_products` | Top 10 by purchase count | All-time |
| `user_behavior` | Event counts by type | All-time |
| `category_performance` | Top 10 categories by revenue | All-time |
| `brand_analysis` | Top 10 brands by revenue | All-time |

**Advanced Methods:**
- `getCustomerGrowth()` — Month-over-month with LAG window function
- `getConversionFunnel()` — View → Cart → Purchase with CTE
- `getRevenueTimeSeries(interval)` — Time-series revenue analysis
- `executeNaturalLanguageQuery(text)` — Gemini-powered SQL generation

**Critical SQL pattern (NULL handling):**
```sql
-- GOOD: NULLIF prevents divide-by-zero
ROUND(SUM(price) / NULLIF(COUNT(DISTINCT user_id), 0), 2)

-- GOOD: IS NOT NULL prevents empty groups
WHERE brand IS NOT NULL AND event_type = 'purchase'
GROUP BY brand

-- GOOD: COALESCE provides defaults
COALESCE(brand, 'Unknown') as brand
```

### Agent 3: ReportAgent (`report.ts`)

**Responsibilities:**
1. Generate AI-powered reports using Gemini
2. Convert raw data into narrative insights
3. Render professional HTML emails
4. Deliver via Gmail SMTP

**Report Types:**
- **Summary** (~250-300 words): KPIs, trends, brief recommendations
- **Detailed**: Comprehensive multi-section analysis
- **Financial** (~600-700 words): 4-section structured report

**4-Section Financial Report Structure:**
1. Executive Summary (3-4 sentences)
2. Key Metrics (bullet points with actual values)
3. Trends Analysis (patterns and insights)
4. Recommendations (actionable strategies)

---

## 5. DATABASE & ANALYTICS LAYER (FIREBOLT)

### Firebolt vs Traditional Databases

| Feature | Firebolt | PostgreSQL | BigQuery |
|---------|----------|-----------|---------|
| Query type | OLAP | OLTP + OLAP | OLAP |
| 400M row query | 1-3 seconds | 30-60 seconds | 5-15 seconds |
| Indexing | Automatic (FACT TABLE) | Manual | Automatic (partitions) |
| Cost at scale | Lower (compression) | Higher | Pay-per-query |
| MCP support | Yes | Via adapter | Via adapter |

### FACT TABLE vs Regular Table

```sql
-- Regular Table (manual work required)
CREATE TABLE ecommerce (...);
CREATE INDEX idx_event_time ON ecommerce(event_time);
CREATE INDEX idx_event_type ON ecommerce(event_type);
-- etc... manual management

-- FACT TABLE (automatic optimization!)
CREATE FACT TABLE ecommerce (
  event_time     TIMESTAMPTZ NOT NULL,
  event_type     TEXT NOT NULL,
  product_id     BIGINT NOT NULL,
  category_id    TEXT NULL,
  category_code  TEXT NULL,
  brand          TEXT NULL,
  price          NUMERIC(38, 9) NULL,
  user_id        TEXT NULL,
  user_session   TEXT NULL
)
PRIMARY INDEX event_time;
-- Automatic: sparse indexes on ALL columns, partition pruning, columnar compression
```

### The E-Commerce Data Model

**Event-based schema** (clickstream/behavioral data):

| Field | Type | Nullable | Meaning |
|-------|------|---------|---------|
| `event_time` | TIMESTAMPTZ | NOT NULL | When event occurred |
| `event_type` | TEXT | NOT NULL | 'view', 'cart', 'purchase' |
| `product_id` | BIGINT | NOT NULL | Product identifier |
| `category_code` | TEXT | NULL | Category path (e.g., 'electronics.smartphone') |
| `brand` | TEXT | NULL | Brand name |
| `price` | NUMERIC(38,9) | NULL | Price (NULL for view events) |
| `user_id` | TEXT | NULL | User identifier (NULL = anonymous) |
| `user_session` | TEXT | NULL | Session ID |

**Why price is NULL for views:** E-commerce tracking fires events for every page interaction. A product "view" doesn't involve a price transaction — only 'cart' and 'purchase' typically have prices.

### Important SQL Patterns from the Codebase

**Revenue Query (real production SQL):**
```sql
SELECT 
  ROUND(SUM(price), 2) as total_revenue,
  COUNT(*) as total_purchases,
  COUNT(DISTINCT user_id) as unique_customers,
  ROUND(SUM(price) / NULLIF(COUNT(DISTINCT user_id), 0), 2) as avg_revenue_per_customer
FROM public.ecommerce
WHERE event_type = 'purchase'
AND price IS NOT NULL
```

**Conversion Funnel (CTE + Aggregation):**
```sql
WITH funnel_data AS (
  SELECT 
    user_id, user_session,
    MAX(CASE WHEN event_type = 'view' THEN 1 ELSE 0 END) as viewed,
    MAX(CASE WHEN event_type = 'cart' THEN 1 ELSE 0 END) as added_to_cart,
    MAX(CASE WHEN event_type = 'purchase' THEN 1 ELSE 0 END) as purchased
  FROM public.ecommerce
  WHERE user_id IS NOT NULL
  GROUP BY user_id, user_session
)
SELECT 
  SUM(viewed) as total_views,
  SUM(added_to_cart) as total_cart_adds,
  SUM(purchased) as total_purchases,
  ROUND((SUM(purchased)::NUMERIC / NULLIF(SUM(viewed), 0)) * 100, 2) as overall_conversion_rate
FROM funnel_data
```

**Customer Growth (Window Functions):**
```sql
WITH monthly_customers AS (
  SELECT
    DATE_TRUNC('month', event_time) as month,
    COUNT(DISTINCT user_id) as new_customers
  FROM public.ecommerce
  WHERE event_type = 'purchase' AND user_id IS NOT NULL
  GROUP BY DATE_TRUNC('month', event_time)
)
SELECT
  month, new_customers,
  LAG(new_customers) OVER (ORDER BY month) as prev_month_customers,
  ROUND(
    ((new_customers - LAG(new_customers) OVER (ORDER BY month))::NUMERIC 
    / NULLIF(LAG(new_customers) OVER (ORDER BY month), 0)) * 100, 2
  ) as growth_pct
FROM monthly_customers
ORDER BY month DESC
```

### FireboltMCPClient: Mock vs Real Mode

```typescript
// Automatically switches between mock and real based on env
this.mock = !hasCredentials || !isEnabled;
// FIREBOLT_ENABLED=true + valid credentials = real Firebolt
// Otherwise → deterministic mock data (for workshops/dev)
```

**Mock data strategy:** The `mockExecute` method pattern-matches SQL via regex and returns realistic hardcoded data. This ensures the workshop works without Firebolt credentials.

---

## 6. AI INTEGRATION (GEMINI API)

### GeminiService Architecture

```typescript
export class GeminiService {
  private client: GoogleGenerativeAI;
  private rpmLimit: number; // Default: 15 (free tier)

  async generate(model: GeminiModel, prompt: string): Promise<string> {
    await limiter.removeToken();        // Rate limiting
    return withRetry(async () => {     // Exponential backoff
      const gen = this.client.getGenerativeModel({ model });
      const res = await gen.generateContent(prompt);
      return res.response.text();
    });
  }
}
```

**Two models used:**
- `gemini-2.0-flash` — Used in AnalyticsAgent for SQL generation (faster)
- `gemini-2.5-flash` — Used in OrchestratorAgent and ReportAgent (more capable)

### Rate Limiting Implementation

```typescript
// Token bucket rate limiter (in-memory, single instance)
export function createRateLimiter(tokensPerMinute: number) {
  let tokens = tokensPerMinute;
  let lastRefill = Date.now();

  return {
    async removeToken(): Promise<void> {
      refill(); // Replenish tokens based on elapsed time
      if (tokens > 0) {
        tokens -= 1;
        return;
      }
      // Wait for next available token
      const waitMs = 60000 / tokensPerMinute;
      await new Promise(r => setTimeout(r, waitMs));
      return this.removeToken();
    }
  };
}
```

**Retry with exponential backoff:**
```typescript
export async function withRetry<T>(fn: () => Promise<T>, options?) {
  // Retries on: 429 (rate limit) and 5xx (server errors)
  // Backoff: initialDelay * 2^attempt, capped at maxDelay
}
```

### Natural Language → SQL Pipeline

```typescript
// In AnalyticsAgent.executeNaturalLanguageQuery()
const prompt = `
  You are a SQL expert for Firebolt database.
  Convert the following natural language query into SQL.
  
  DATABASE SCHEMA:
  Table: ${this.tableName}
  Columns: [event_time, event_type, product_id, category_code, brand, price, user_id, user_session]
  
  RULES:
  1. Always filter NULL values when grouping by nullable columns
  2. Use NULLIF() in division to avoid divide-by-zero errors
  3. Limit results to 100 rows maximum
  
  USER QUESTION: ${naturalLanguageQuery}
  
  SQL QUERY (only return SQL, no markdown):
`;

const generatedSQL = await this.gemini.generate('gemini-2.0-flash', prompt);
// Clean up markdown code blocks if present
// Execute via FireboltMCPClient
```

### Prompt Engineering Techniques Used

1. **Role assignment**: "You are a SQL expert for Firebolt database"
2. **Context provision**: Full schema with column names and types
3. **Constraint rules**: Numbered list of SQL writing rules
4. **Output format control**: "Only return SQL, no markdown or explanations"
5. **Few-shot examples** (in parseIntent): Example inputs and expected outputs
6. **JSON format specification**: Exact JSON structure expected in response

### JSON Extraction from Gemini Response

Gemini sometimes wraps JSON in markdown code blocks. The code handles this:
```typescript
// Parse intent from response (handles markdown wrapping)
const jsonMatch = responseText.match(/\{[\s\S]*\}/);
if (!jsonMatch) throw new Error('Failed to parse intent from Gemini response');
return JSON.parse(jsonMatch[0]);

// For SQL responses:
let cleanSQL = generatedSQL.trim();
if (cleanSQL.startsWith('```sql')) {
  cleanSQL = cleanSQL.replace(/```sql\n?/g, '').replace(/```\n?/g, '').trim();
}
```

---

## 7. API DESIGN & BACKEND ROUTES

### Three Core API Endpoints

#### POST /api/orchestrator

```typescript
// Request
{ query: string, action: 'parse' | 'execute' | 'multi_step' }

// Response (parse action)
{
  success: true,
  action: 'intent_parsing',
  query: string,
  intent: IntentResult,
  route: AgentType
}

// Response (execute action)
{
  success: true,
  action: 'multi_step_execution',
  totalSteps: number,
  steps: Array<{ step, action, output, status }>
}
```

#### POST /api/analytics

```typescript
// Request (predefined)
{ queryType: 'revenue' | 'top_products' | 'user_behavior' | 'category_performance' | 'brand_analysis' }

// Request (natural language)
{ naturalLanguageQuery: string }

// Response
{
  success: true,
  type: 'predefined' | 'natural_language',
  queryType?: string,
  sql?: string,       // Only for natural language queries
  result: QueryResult
}
```

#### POST /api/report

```typescript
// Request
{
  data: any,
  reportType: 'summary' | 'detailed' | 'financial',
  recipient?: string,
  subject?: string
}

// Response
{
  success: true,
  reportType: string,
  report: string,     // Markdown content
  emailSent: boolean,
  recipient?: string,
  subject?: string
}
```

### API Design Principles Applied

1. **Validation first**: Check required params before processing
2. **Meaningful HTTP status codes**: 400 (bad request), 500 (server error)
3. **Descriptive error messages**: Include hints for common issues
4. **Dual modes**: GET endpoints return capabilities; POST endpoints process
5. **Environment checks**: Validate API keys before expensive operations
6. **Stack traces in dev only**: `process.env.NODE_ENV === 'development'`

### Error Response Pattern

```typescript
// Consistent error format throughout
return NextResponse.json(
  {
    success: false,
    error: error?.message ?? 'Unknown error',
    details: process.env.NODE_ENV === 'development' ? error?.stack : undefined,
    hint: 'Get your API key from https://aistudio.google.com'  // When helpful
  },
  { status: 500 }
);
```

---

## 8. FRONTEND ARCHITECTURE (NEXT.JS)

### App Router Layout

```
app/
├── layout.tsx           ← Root layout (fonts, metadata)
├── page.tsx             ← Home page (demo tabs)
├── workshop/
│   ├── layout.tsx       ← Workshop sidebar layout
│   ├── page.tsx         ← Workshop overview
│   └── [step]/page.tsx  ← Dynamic MDX step renderer
└── firebolt/
    ├── layout.tsx       ← Firebolt sidebar layout
    └── page.tsx         ← Setup guide (query-param routing)
```

### Component Architecture

**Three-tier component structure:**

```
1. Page Components (app/) — Data fetching, routing
2. Feature Components (components/agents/) — Domain logic UI
3. UI Primitives (components/ui/) — Reusable design system
```

**Demo Components (Client-side with state):**
- `OrchestratorDemo.tsx` — Multi-step query interface
- `AnalyticsDemo.tsx` — Query type selector + results table
- `ReportDemo.tsx` — Report generation + email preview

**All demo components follow same pattern:**
```typescript
const [loading, setLoading] = useState(false);
const [result, setResult] = useState<any>(null);
const [error, setError] = useState<string | null>(null);

async function run() {
  setLoading(true); setError(null); setResult(null);
  try {
    const res = await fetch('/api/...', { method: 'POST', ... });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    setResult(data);
  } catch (e: any) {
    setError(e.message);
  } finally {
    setLoading(false);
  }
}
```

### MDX Workshop System

Workshop steps are MDX files in `src/content/workshop-steps/`:

```typescript
// [step]/page.tsx reads MDX at build/request time
const fileContent = fs.readFileSync(file, 'utf8');
const { data, content } = matter(fileContent); // gray-matter for frontmatter

// MDXRemote renders with custom components
<MDXRemote source={stepData.content} components={{ CodeBlock, Hint, Exercise, Checkpoint }} />
```

**Frontmatter structure:**
```yaml
---
title: "Analytics Agent"
description: "Build a data analytics agent with Firebolt queries"
duration: "60 minutes"
difficulty: "Intermediate"
objectives:
  - "Implement the Analytics Agent class"
---
```

### Dynamic Routing for Firebolt Setup

```typescript
// Uses URL search params for tab-like navigation without separate pages
// /firebolt?section=create-engine → shows CreateEngineSection
// /firebolt?section=service-account → shows FireboltServiceAccountSection

const searchParams = useSearchParams();
const section = searchParams.get('section');
// Wrapped in <Suspense> to handle useSearchParams in client components
```

### Sidebar State Management

Two sidebar components:
- `AppLayout` (main app) — Simple link-based navigation
- `WorkshopLayout` (workshop/firebolt) — Uses `usePathname` + `useSearchParams` for active state

```typescript
// Active state detection
const isActive = pathname === `/workshop/${step.slug}`;
const isFireboltSection = section === 'create-engine';
```

---

## 9. EMAIL & NOTIFICATION SYSTEM

### Dual-Mode Email Architecture

```typescript
// GmailClient constructor logic
const isEnabled = process.env.GMAIL_ENABLED === 'true';
const hasCredentials = process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD;
this.sandbox = !hasCredentials || !isEnabled;
```

**Sandbox mode:** Logs email to console, returns `true` (simulates success)  
**Production mode:** Uses Nodemailer with Gmail SMTP App Password

### Gmail SMTP Configuration

```typescript
// Production transporter
this.transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  secure: process.env.SMTP_SECURE === 'true', // TLS on 587, SSL on 465
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD, // App-specific password (not account password)
  },
});
```

**Why App Password (not OAuth2)?**  
Simpler setup. OAuth2 requires Google Cloud Console project, OAuth credentials, refresh token flow. App Password works after enabling 2-Step Verification — better for workshops and small projects.

### HTML Email Template System

```typescript
// email-templates.ts — Responsive HTML emails
function getBaseTemplate(content: string, title: string): string {
  return `<!DOCTYPE html>...`; // Full HTML with header + footer
}

// Different templates per report type
generateFinancialReportHTML(report, dataSource)  // 4-section structured
generateSummaryReportHTML(report, dataSource)     // Single card view
generateDetailedReportHTML(report, dataSource)    // Section-by-section
```

**Markdown → HTML conversion:**
```typescript
function markdownToHTML(markdown: string): string {
  // Converts: ### headers, **bold**, - bullets, \n\n paragraphs
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/^[\s]*[-*]\s+(.+)$/gm, '<li>$1</li>');
  // etc.
}
```

**Email brand footer:**
- "Firebolt × DevRelSquad"
- "Powered by Gemini AI + Firebolt MCP"
- Responsive design for mobile email clients

---

## 10. SECURITY & CONFIGURATION

### Environment Variable Strategy

```bash
# Required
GEMINI_API_KEY=...

# Optional — enables real Firebolt (mock without this)
FIREBOLT_ENABLED=true
FIREBOLT_CLIENT_ID=...
FIREBOLT_CLIENT_SECRET=...
FIREBOLT_ACCOUNT=...
FIREBOLT_DATABASE=ecommercedb
FIREBOLT_SCHEMA=public
FIREBOLT_ENGINE=your_engine_name  # Must be USER engine, not system engine

# Optional — enables real email (sandbox without this)
GMAIL_ENABLED=true
GMAIL_USER=your@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
```

**Security design decisions:**
1. API keys never exposed to client (server-side only via Next.js API routes)
2. `.env.local` in `.gitignore` (never committed)
3. App Passwords instead of main Gmail password
4. Service accounts for Firebolt (not personal credentials)
5. Explicit enable flags (`FIREBOLT_ENABLED`, `GMAIL_ENABLED`) prevent accidental production connections

### Input Validation

```typescript
// Email validation before sending
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(recipient)) {
  return NextResponse.json({ error: 'Invalid email address format' }, { status: 400 });
}

// Query type allowlist
const validQueryTypes = ['revenue', 'top_products', 'user_behavior', 'category_performance', 'brand_analysis'];
if (!validQueryTypes.includes(queryType)) {
  return NextResponse.json({ error: `Invalid queryType...` }, { status: 400 });
}
```

### Firebolt Engine Security Note

The codebase specifically warns: **"Use a USER engine, not the system engine"**

- **System engine**: Only for metadata (SHOW, DESCRIBE). Throws error on data queries.
- **User engine**: Required for SELECT queries on data tables.

This is a common gotcha that the project explicitly documents.

---

## 11. PERFORMANCE & OPTIMIZATION

### Database Performance

**FACT TABLE benefits (from codebase docs):**
- Automatic sparse indexes on ALL columns
- 10-20x speedup vs regular tables
- Optimized columnar compression
- Fast partition pruning on PRIMARY INDEX (event_time)

**Aggregating indexes for dashboards:**
```sql
CREATE AGGREGATING INDEX daily_revenue_agg ON ecommerce (
  DATE_TRUNC('day', event_time) as date,
  event_type,
  SUM(price) as total_revenue,
  COUNT(*) as event_count
)
WHERE event_type = 'purchase';
```

**Query optimization techniques in codebase:**
- `LIMIT 10` on all ranking queries
- Time-bounded WHERE clauses (should be added for production)
- `IS NOT NULL` filters before GROUP BY
- `COALESCE` for display-safe NULL handling
- `NULLIF` in all divisions

### Application Performance

**Rate limiting prevents API overload:**
```typescript
const RPM_LIMIT = parseInt(process.env.GEMINI_RPM_LIMIT || '15', 10);
const limiter = createRateLimiter(RPM_LIMIT); // Token bucket algorithm
```

**Exponential backoff on failures:**
```typescript
// withRetry: doubles delay each retry, caps at maxDelay
let delay = initialDelay;  // 500ms
delay = Math.min(delay * 2, maxDelay);  // 1000ms, 2000ms, 4000ms, 5000ms
```

**Mock mode for development:**
- No network calls to Firebolt or Gmail
- Instant deterministic responses
- Enables offline development

### Frontend Performance

- **Server Components** for static workshop MDX content (no client-side JS)
- **Client Components** only where interactivity is needed (demos)
- `'use client'` directive explicitly used where needed
- Suspense boundaries around `useSearchParams` hooks

---

## 12. TESTING & DEPLOYMENT

### Testing Strategy (from codebase)

**Manual testing via curl:**
```bash
# Test analytics
curl -X POST http://localhost:3000/api/analytics \
  -H "Content-Type: application/json" \
  -d '{"queryType": "revenue"}'

# Test orchestrator
curl -X POST http://localhost:3000/api/orchestrator \
  -H "Content-Type: application/json" \
  -d '{"query": "Show revenue and email to test@example.com", "action": "execute"}'
```

**Setup verification script (`scripts/verify-setup.js`):**
Checks Node.js version, dependencies, env vars, key files — automated preflight.

### Deployment Options

**Render (current production):**
- `https://agentflow-ai-wsmw.onrender.com`
- Environment variables set in Render dashboard
- Automatic deploys from GitHub

**Vercel:**
```bash
# Import repo, set env vars, deploy
# GEMINI_API_KEY=... set in Vercel dashboard
```

**Google Cloud Run:**
```bash
gcloud builds submit --tag gcr.io/PROJECT_ID/multi-agent-workshop
gcloud run deploy multi-agent-workshop \
  --image gcr.io/PROJECT_ID/multi-agent-workshop \
  --set-env-vars GEMINI_API_KEY=YOUR_KEY
```

**Docker:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

**Stackblitz:**
- `stackblitz.json` configures auto-install + `npm run dev`
- Add `GEMINI_API_KEY` in Stackblitz environment panel

---

## 13. KEY INTERVIEW QUESTIONS & ANSWERS

### General / Architecture Questions

**Q: Walk me through how this application works at a high level.**

A: AgentFlow AI is a multi-agent orchestration system built with Next.js. When a user submits a natural language query, the OrchestratorAgent uses Google's Gemini AI to parse intent and detect keywords. Based on the query, it chains together specialized agents: the AnalyticsAgent executes SQL queries against a Firebolt columnar database via an MCP client, the ReportAgent uses Gemini to transform raw data into professional reports, and the GmailClient delivers those reports via SMTP. Each step is tracked and returned to the frontend as a structured steps array with status indicators.

**Q: What is MCP (Model Context Protocol) and why did you use it?**

A: MCP is an open standard from Anthropic that allows AI models to interact with external tools and services through a standardized protocol. In this project, it acts as a security boundary — Gemini cannot directly access Firebolt's database, but it can call MCP "tools" (run_sql, send_gmail) which are then executed server-side with proper credentials. This separation means credentials never reach the AI model, and you can control exactly what operations the AI can perform.

**Q: Why did you choose Firebolt over PostgreSQL or BigQuery for analytics?**

A: The dataset is 400M+ rows of e-commerce clickstream data. PostgreSQL is optimized for OLTP (transactions), not analytical aggregations at this scale. BigQuery is a good alternative but has pay-per-query costs and latency. Firebolt uses a FACT TABLE abstraction that automatically creates sparse indexes on all columns and uses columnar storage, achieving 1-3 second query times on this data. For a real-time analytics dashboard where users expect quick results, that's a significant difference.

**Q: How does the system handle failures and rate limits?**

A: Multiple layers. First, a token bucket rate limiter ensures we don't exceed Gemini's 15 RPM free tier limit — requests queue and wait rather than failing. Second, `withRetry` wraps all Gemini calls with exponential backoff (500ms → 1000ms → 2000ms → 4000ms), retrying on 429 (rate limit) and 5xx (server) errors. Third, in `handleMultiStepQuery`, errors are caught per-step and added to the steps array with `status: 'failed'`, allowing partial success — the system reports how far it got rather than losing all work.

**Q: Explain the dual-mode (sandbox/production) design.**

A: Both Firebolt and Gmail have sandbox modes enabled by default. For Firebolt, if `FIREBOLT_ENABLED !== 'true'` or credentials are missing, the client falls back to `mockExecute()` which pattern-matches SQL and returns realistic hardcoded data. For Gmail, if `GMAIL_ENABLED !== 'true'`, emails are just logged to console. This design means the application is functional and demonstrable without any external service credentials, which is crucial for workshops and development. The explicit `_ENABLED` flag prevents accidental production connections.

**Q: How do you handle SQL injection or malicious inputs?**

A: Several layers. Query types are validated against an explicit allowlist (not derived from user input). For natural language queries, Gemini generates the SQL — user input is passed as a question in a prompt, not interpolated into SQL strings directly. The Gemini prompt includes constraints like "Limit results to 100 rows maximum" and schema awareness to prevent over-broad queries. In production, I'd add additional sanitization of the Gemini-generated SQL before execution.

---

### Backend / Software Engineering Questions

**Q: Why use TypeScript instead of JavaScript for this project?**

A: Several concrete benefits: First, the `QueryResult`, `IntentResult`, and `AgentType` types catch mismatches at compile time — if Gemini's JSON response doesn't match `IntentResult`, TypeScript helps detect it. Second, IDE autocomplete for Firebolt SDK and Gemini SDK methods reduces bugs. Third, the `VariantProps` from `class-variance-authority` for UI components is much more powerful with TypeScript. The `strict: true` in tsconfig catches null/undefined errors that would be silent runtime failures in JavaScript.

**Q: Describe the error handling strategy in the API routes.**

A: Try/catch wraps all async operations. Errors return JSON with `success: false` and a descriptive `error` message. HTTP status codes are meaningful: 400 for missing/invalid parameters, 500 for server-side failures. Stack traces are only included in development (`NODE_ENV === 'development'`) to avoid leaking implementation details in production. API keys are validated before expensive operations, returning fast with a helpful `hint` field pointing to documentation.

**Q: How does the Next.js App Router affect the architecture?**

A: App Router enables React Server Components by default — the workshop MDX pages (`/workshop/[step]/page.tsx`) are server components that read files at request time using Node.js `fs`, which wouldn't work in client components. The client-side demos use `'use client'` directive. API routes live in `app/api/` and run exclusively on the server, keeping Gemini API keys and Firebolt credentials server-side. The layout system (nested layouts for workshop vs main app) allows different sidebars without duplicating code.

**Q: Walk me through the token bucket rate limiter implementation.**

A: The `createRateLimiter` function creates a closure with `tokens` (starts at RPM limit, e.g., 15) and `lastRefill` timestamp. On each API call, `removeToken()` first calls `refill()` — which calculates elapsed time, computes how many tokens should have been added, and caps at the maximum. If tokens are available, it decrements and returns immediately. If tokens are exhausted, it calculates wait time as `60000 / tokensPerMinute` milliseconds, waits, then recursively calls itself. This ensures we never exceed the rate limit while being as fast as possible within limits.

**Q: How would you scale this application to handle thousands of concurrent users?**

A: Several changes: First, the in-memory rate limiter wouldn't work across multiple instances — replace with Redis-based rate limiting. Second, Gemini API calls would need a request queue with concurrency controls (e.g., using p-queue) since each instance would share the rate limit. Third, add caching for common analytics queries (Redis with TTL based on data freshness requirements). Fourth, use Firebolt's aggregating indexes for dashboard queries to reduce computation on repeated requests. Fifth, consider background job queues (Bull/BullMQ) for email delivery to avoid blocking API responses.

---

### Frontend / Full-Stack Questions

**Q: How does the MDX workshop system work?**

A: Workshop steps are stored as `.mdx` files in `src/content/workshop-steps/`. When a user navigates to `/workshop/04-orchestrator`, Next.js runs `getStepFile('04-orchestrator')` which uses Node.js `fs` to read the file, then `gray-matter` to parse YAML frontmatter (title, description, duration, objectives) from the Markdown content. `MDXRemote` from `next-mdx-remote/rsc` then renders the MDX with custom component mappings — so `<CodeBlock>`, `<Hint>`, `<Exercise>`, `<Checkpoint>` tags in the MDX files render as React components with syntax highlighting, collapsible hints, and interactive checkboxes.

**Q: Why use Radix UI primitives instead of a component library like Material UI?**

A: Radix provides unstyled, accessible components that we style with Tailwind. The `@radix-ui/react-tabs` component handles keyboard navigation, ARIA attributes, and focus management correctly — things that are easy to get wrong when building from scratch. Material UI or Chakra would impose design decisions (Material Design language) that conflict with the custom branding (Firebolt green, dark sidebar). Radix gives accessibility without design constraints.

**Q: Explain the `Suspense` boundary around `useSearchParams`.**

A: `useSearchParams` is a client-side hook in Next.js App Router. When server-rendering, Next.js needs to know at build time that a page uses URL search parameters — if it doesn't, it assumes the page is fully static and caches it. Wrapping the component using `useSearchParams` in `<Suspense fallback={...}>` tells Next.js this component needs client-side rendering and provides a loading state to show during hydration. Without Suspense, the build would fail with an error about static rendering and dynamic search params.

---

## 14. DATA SCIENCE / ML QUESTIONS

**Q: What metrics would you track for this e-commerce data?**

A: The schema naturally supports several key metrics:
- **Revenue metrics**: Total revenue, AOV (Average Order Value = total_revenue/total_purchases), revenue per customer
- **Funnel metrics**: View-to-cart rate, cart-to-purchase rate (conversion funnel)
- **Cohort metrics**: Month-over-month new customer growth (implemented via LAG window function)
- **Product metrics**: Purchase frequency, revenue concentration (top 10 products as % of total)
- **Behavioral**: Session depth (events per session), anonymous vs identified users ratio

**Q: How would you detect fraud or anomalies in this dataset?**

A: Several approaches: Statistical outliers on price (Z-score or IQR — unusually high prices for a product_id). Temporal anomalies — purchases at unusual hours. Session anomalies — extremely high event_count per user_session (bot behavior). User behavior anomalies — user_id with purchases far above their historical average. In Firebolt, you could use window functions to calculate rolling averages and flag deviations. A production system would add a `fraud_score` column from a ML model or use Firebolt's ability to call external models.

**Q: Explain the conversion funnel analysis in the codebase.**

A: The funnel uses a CTE (Common Table Expression). First CTE groups events by `user_id` and `user_session`, using `MAX(CASE WHEN event_type = 'view' THEN 1 ELSE 0 END)` — this creates a binary flag (did this session have a view?). Do the same for cart and purchase. Then aggregate: SUM of these binary flags gives total sessions with each event type. Divide to get conversion rates, using NULLIF to prevent division by zero for edge cases. Industry benchmark: 2-3% overall conversion rate for e-commerce.

**Q: How would you build a recommendation system on this data?**

A: Collaborative filtering approach using this schema: Create a user-product interaction matrix from purchase events (user_id × product_id). Use implicit feedback (purchase=1, cart=0.5, view=0.1 weights). Apply matrix factorization (ALS - Alternating Least Squares) to find latent factors. For real-time serving, store user and item embeddings. In Firebolt, you could use the `category_code` and `brand` fields for content-based fallback for cold-start users. Popular items by `purchase_count` serve as non-personalized baseline.

**Q: What's the difference between OLAP and OLTP, and why does it matter here?**

A: OLTP (Online Transaction Processing) is optimized for many small, fast reads/writes — like an e-commerce cart system. Row-oriented storage is efficient for fetching full records. OLAP (Online Analytical Processing) is optimized for few, large aggregation queries across millions of rows — like our analytics. Columnar storage (only reads relevant columns, e.g., just `price` for revenue calculation) with compression is far more efficient. Firebolt is OLAP. Running analytics queries on a PostgreSQL (OLTP) database causes full table scans and is the classic reason analytics databases exist separately from transactional databases.

---

## 15. SYSTEM DESIGN QUESTIONS

**Q: Design the notification system if it needed to handle 10,000 emails/hour.**

A:
1. **Decouple email from request cycle**: Current design sends email synchronously in the API call. Replace with a job queue (Bull/BullMQ with Redis).
2. **API returns job ID**: `/api/report` returns `{ jobId: '123', status: 'queued' }` immediately.
3. **Worker processes queue**: Separate worker process picks up jobs, sends emails.
4. **Status polling or webhooks**: Client polls `/api/jobs/123` or receives webhook on completion.
5. **Email provider**: Switch from Gmail SMTP (500/day limit) to SendGrid or AWS SES (scales to millions).
6. **Rate limiting per user**: Prevent abuse with per-user email limits using Redis counters.
7. **Dead letter queue**: Failed emails retry with exponential backoff, then move to dead letter queue for manual review.

**Q: How would you add authentication to this application?**

A:
1. **Auth provider**: NextAuth.js (now Auth.js) with Google OAuth2 (natural fit given Gmail/Gemini integration).
2. **Session management**: JWT tokens or database sessions.
3. **Protect API routes**: Middleware checks session before processing requests.
4. **Per-user rate limiting**: Associate Gemini API usage with user accounts.
5. **Credential storage**: Store Firebolt/Gmail credentials per organization (multi-tenant), not global env vars.
6. **RBAC**: Admin roles can configure connections; viewer roles can only query.

**Q: Design a caching layer for the analytics queries.**

A:
- **Cache key**: Hash of SQL query string + current date (for time-bounded queries, cache by day)
- **TTL strategy**: Revenue (1 hour), top products (30 min), user behavior (15 min)
- **Cache store**: Redis for distributed caching; in-memory LRU cache for single-instance
- **Cache invalidation**: Time-based expiry is simplest; for real-time data, use Firebolt's result caching
- **Cache warming**: Pre-execute common queries on a schedule (cron job)
- **Cache stampede prevention**: Use `singleflight` pattern — if same query is inflight, wait for first result rather than all firing simultaneously

**Q: How would you make the NL-to-SQL system more reliable?**

A:
1. **SQL validation**: Parse generated SQL before execution (use a SQL parser library to check syntax)
2. **Schema grounding**: Provide exact column names, types, and constraints in the prompt — fewer hallucinations
3. **Few-shot examples**: Add 5-10 example query pairs in the prompt
4. **Output format control**: Ask for SQL in a specific format, easy to extract
5. **Fallback to predefined queries**: If Gemini SQL fails, try to match to a predefined query
6. **Query sandboxing**: Run in read-only mode, limit execution time, cap result rows
7. **Human-in-the-loop**: Show generated SQL to user before execution (transparency + safety)
8. **Fine-tuning**: With enough example pairs, fine-tune a smaller model specifically for Firebolt SQL

---

## 16. CODE WALKTHROUGHS

### Walkthrough 1: `handleMultiStepQuery` (Most Complex Method)

```typescript
async handleMultiStepQuery(userQuery: string) {
  const steps: any[] = [];
  const lower = userQuery.toLowerCase();
  
  // STEP 1: Keyword detection (fast, no API call)
  const hasRevenue = /revenue|sales|income/.test(lower);
  const hasReport = /report|summary|generate/.test(lower);
  const recipientMatch = lower.match(/[\w.-]+@[\w.-]+\.[a-z]{2,}/);
  const recipient = recipientMatch?.[0];
  
  try {
    let analyticsResult: any;
    const analytics = new AnalyticsAgent();
    
    if (isPredefinedQuery) {
      // STEP 2a: Execute known query type
      analyticsResult = await analytics.executeQuery(queryType);
    } else {
      // STEP 2b: NL → SQL → Execute via Gemini
      const nlResult = await analytics.executeNaturalLanguageQuery(userQuery);
      analyticsResult = nlResult.result;
    }
    
    steps.push({ step: 'analytics', action: `${queryType}_query`, output: analyticsResult, status: 'completed' });
    
    if (hasReport || recipient) {
      const reportAgent = new ReportAgent(geminiKey);
      
      // STEP 3: Generate report (financial vs summary based on query type)
      const reportType = hasRevenue || hasCategoryAnalysis || hasBrandAnalysis ? 'financial' : 'summary';
      const report = reportType === 'financial' 
        ? await reportAgent.generateFinancialReport(analyticsResult)
        : await reportAgent.generateReport(analyticsResult, 'summary');
      
      steps.push({ step: 'report', action: `generate_${reportType}_report`, output: report, status: 'completed' });
      
      if (recipient) {
        // STEP 4: Send email
        const emailSent = await reportAgent.sendEmail(recipient, subject, report, reportType);
        steps.push({ step: 'email', action: 'send_report', output: { recipient, sent: emailSent }, status: emailSent ? 'completed' : 'failed' });
      }
    }
    
    return { success: true, totalSteps: steps.length, steps };
    
  } catch (error) {
    // Track partial completion — don't lose previous successful steps
    steps.push({ step: 'error', action: 'orchestration_failed', output: error.message, status: 'failed' });
    return { success: false, totalSteps: steps.length, steps, error: error.message };
  }
}
```

**Key insights to discuss:**
- Steps array tracks partial success — failure mid-workflow preserves completed steps
- Two analytics paths: predefined (fast, deterministic) vs NL (flexible, AI-powered)
- Report type selected based on query semantics (financial data → financial report format)
- Error is caught at the top level — sub-function errors bubble up cleanly

### Walkthrough 2: `FireboltMCPClient.execute` (Real vs Mock)

```typescript
async execute(sql: string): Promise<QueryResult> {
  if (this.mock) return this.mockExecute(sql); // Instant, no network
  
  try {
    // Auth with service account
    const connection = await this.fireboltClient.connect({
      auth: { client_id, client_secret },
      account, database,
      engineName: this.engine  // Must be USER engine
    });
    
    const statement = await connection.execute(sql);
    const { data, meta } = await statement.fetchResult();
    
    // Transform: Firebolt returns [col1value, col2value] rows
    // We need: { col1: value, col2: value } objects
    const columnNames = meta?.map((m: any) => m.name) || [];
    const rows = data.map(row => {
      const rowObj: Record<string, any> = {};
      columnNames.forEach((colName, idx) => { rowObj[colName] = row[idx]; });
      return rowObj;
    });
    
    return { columns: columnNames, rows };
    
  } catch (error) {
    // Note: Does NOT fall back to mock in real mode
    // Want to surface real errors, not mask them with fake data
    throw new Error(`Firebolt query failed: ${error.message}`);
  }
}
```

**Key design decision to highlight:** The real mode throws errors rather than falling back to mock. This is intentional — in production, silent fallback to fake data would be worse than an obvious failure.

---

## 17. BEHAVIORAL / PROJECT STORY QUESTIONS

**Q: What was the most challenging technical problem you solved?**

A: The dual-mode architecture (sandbox/production) for both Firebolt and Gmail was the trickiest to get right. The challenge was making the application fully functional for workshops without any external credentials, while ensuring the same code path works in production with real services. The solution — explicit `_ENABLED` environment flags plus credential checks in constructors — means the application gracefully degrades rather than crashing. The mock data in `FireboltMCPClient` had to be realistic enough to test real application logic, so I pattern-matched 7 distinct SQL query shapes with appropriate column names and values.

**Q: How did you decide on the multi-agent architecture?**

A: Started by mapping out the user journey: understand intent → fetch data → generate insight → deliver. Each step has different concerns — intent understanding is an NLP problem, data fetching is a SQL problem, report generation is a language generation problem, email delivery is an infrastructure problem. Combining them in one class would violate Single Responsibility. Separate agents also enable independent testing, independent scaling (the analytics agent could be a separate microservice), and composability (add new report types without touching analytics code).

**Q: What would you change or improve if given more time?**

A:
1. **Streaming responses**: Long Gemini generations should stream to the UI rather than waiting for completion (Next.js supports streaming with React Suspense)
2. **SQL validation**: Validate Gemini-generated SQL syntax before execution using a proper SQL parser
3. **Authentication**: Add NextAuth with Google OAuth2 for user-specific rate limiting and audit logs
4. **Comprehensive testing**: Unit tests for SQL generation logic, integration tests for API routes, E2E tests with Playwright
5. **Observability**: Structured logging with correlation IDs, Gemini API usage tracking, query performance monitoring
6. **Caching**: Redis cache for frequent analytics queries with appropriate TTLs
7. **Error recovery UI**: Let users retry failed steps individually rather than re-running the entire workflow

**Q: How did you ensure the application is production-ready?**

A: Several practices: Type-safe API contracts with TypeScript interfaces. Explicit error handling at every async boundary. Rate limiting to stay within API quotas. Environment-based feature flags for external services. Separation of concerns (agents, services, utils). Structured logging with log levels. Deployment documentation for multiple platforms (Render, Vercel, Cloud Run, Docker). Health check via the `npm run verify-setup` script. HTML email templates tested for responsiveness.

---

## 18. QUICK REFERENCE CHEAT SHEET

### Key Numbers to Remember
- **Firebolt dataset**: 400M+ rows
- **Query time (FACT TABLE)**: 1-3 seconds
- **Gemini free tier**: 15 RPM
- **Summary report length**: ~250-300 words
- **Financial report length**: ~600-700 words
- **Top queries limit**: 10 results
- **Max retries**: 3 (with exponential backoff)
- **Initial retry delay**: 500ms, max 5000ms
- **Time windows**: 30 days (most queries), 7 days (user_behavior), 12 months (customer growth), 90 days (time series)

### Key File Locations
| What | Where |
|------|-------|
| Main orchestration logic | `src/lib/agents/orchestrator.ts` |
| SQL queries | `src/lib/agents/analytics.ts` |
| Report generation | `src/lib/agents/report.ts` |
| Firebolt connection | `src/lib/services/firebolt-mcp.ts` |
| Gemini wrapper | `src/lib/services/gemini.ts` |
| Email templates | `src/lib/utils/email-templates.ts` |
| Rate limiter + retry | `src/lib/utils/error-handler.ts` |
| Orchestrator API | `src/app/api/orchestrator/route.ts` |
| Analytics API | `src/app/api/analytics/route.ts` |

### Design Patterns Used
| Pattern | Where |
|---------|-------|
| Orchestrator-Worker | OrchestratorAgent → Analytics/Report agents |
| Strategy Pattern | Mock vs Real mode in Firebolt/Gmail clients |
| Template Method | Report generation (summary/detailed/financial) |
| Token Bucket | Rate limiter in GeminiService |
| Retry with Backoff | `withRetry` utility |
| Factory | `generateReportHTML` dispatches to correct template |
| Dual Mode / Feature Flag | `FIREBOLT_ENABLED`, `GMAIL_ENABLED` env vars |

### SQL Window Functions Used
```sql
LAG(column) OVER (ORDER BY column)        -- Previous row value
DATE_TRUNC('month', timestamp)             -- Truncate to period
MAX(CASE WHEN condition THEN 1 ELSE 0 END) -- Conditional aggregation
COUNT(DISTINCT column)                     -- Unique count
NULLIF(expression, 0)                      -- Prevent divide-by-zero
COALESCE(column, 'default')               -- NULL safe display
```

### Environment Variable Quick Reference
```bash
# Required
GEMINI_API_KEY=AIza...

# Enable real Firebolt (default: mock)
FIREBOLT_ENABLED=true
FIREBOLT_CLIENT_ID=...
FIREBOLT_CLIENT_SECRET=...
FIREBOLT_ACCOUNT=...
FIREBOLT_DATABASE=ecommercedb
FIREBOLT_SCHEMA=public
FIREBOLT_ENGINE=my_user_engine  # NOT system engine!

# Enable real email (default: sandbox/log)
GMAIL_ENABLED=true
GMAIL_USER=you@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx  # 16-char App Password
```

### Agent Methods Cheat Sheet
```typescript
// OrchestratorAgent
orchestrator.parseIntent(query)          → IntentResult
orchestrator.routeTask(intent)           → AgentType
orchestrator.handleMultiStepQuery(query) → { success, steps[] }

// AnalyticsAgent
analytics.executeQuery(type)                      → QueryResult
analytics.executeNaturalLanguageQuery(text)       → { success, sql, result }
analytics.getCustomerGrowth()                     → QueryResult
analytics.getConversionFunnel()                   → QueryResult
analytics.getRevenueTimeSeries('day'|'week'|'month') → QueryResult

// ReportAgent
report.generateReport(data, 'summary'|'detailed') → string (markdown)
report.generateFinancialReport(data)              → string (markdown)
report.generateEcommerceInsights(data)            → string (markdown)
report.sendEmail(recipient, subject, body, type)  → boolean
```

---

*This document covers the complete AgentFlow AI / Multi-Agent Workshop project. Review each section based on the specific role you're interviewing for — backend engineers should focus on sections 4-7 and 11, data scientists on sections 5 and 14, full-stack on all sections, and SWE generalists on sections 3, 13, and 15.*
