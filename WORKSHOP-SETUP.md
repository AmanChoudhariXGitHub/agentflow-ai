# Workshop Setup Guide

This document explains the hands-on workshop structure where participants build a multi-agent system step by step.

## Workshop Structure

This is a **hands-on coding workshop** where participants implement:
1. **Analytics Agent** - Data queries against Firebolt database
2. **Report Agent** - AI-powered report generation (pre-built for reference)
3. **Orchestrator Agent** - Multi-agent coordination with Gemini AI
4. **API Routes** - HTTP endpoints for each agent

## Files with TODO Markers

### Core Agent Implementations

#### 1. Analytics Agent (`src/lib/agents/analytics.ts`)
**TODO Exercises:**
- ✅ **Exercise 1**: Implement `executeQuery()` method with 5 query types
  - revenue, top_products, user_behavior, category_performance, brand_analysis
  - SQL queries with proper NULL handling and aggregations
- ✅ **Exercise 3** (Optional): Implement `getCustomerGrowth()` with window functions
- ✅ **Exercise 4** (Optional): Implement `getConversionFunnel()` with CTEs

**Reference Implementations (Complete):**
- `executeNaturalLanguageQuery()` - Gemini + Firebolt MCP integration
- `optimizeQuery()` - Query optimization guidance
- `getRevenueTimeSeries()` - Time-series analysis

#### 2. Orchestrator Agent (`src/lib/agents/orchestrator.ts`)
**TODO Exercises:**
- ✅ **Exercise 1**: Implement `parseIntent()` - Use Gemini to parse user queries
  - Create comprehensive prompt with examples
  - Extract JSON from Gemini response
  - Return structured IntentResult
- ✅ **Exercise 2**: Implement `routeTask()` - Map intents to agent types
  - Simple routing logic (analytics, report, email, unknown)
- ✅ **Exercise 3**: Implement `handleMultiStepQuery()` - Multi-step orchestration
  - Regex-based intent detection
  - Sequential agent coordination
  - Step tracking with status

#### 3. Report Agent (`src/lib/agents/report.ts`)
**Status:** ✅ **COMPLETE** (Reference implementation)
- All methods are fully implemented
- Used as example of proper AI integration
- Students review but don't modify

### API Routes

#### 4. Analytics API (`src/app/api/analytics/route.ts`)
**TODO Exercise:**
- ✅ **Exercise 2**: Implement POST endpoint
  - Extract queryType or naturalLanguageQuery from body
  - Validate query types
  - Call AnalyticsAgent methods
  - Return proper JSON responses

#### 5. Orchestrator API (`src/app/api/orchestrator/route.ts`)
**TODO Exercise:**
- ✅ **Exercise 4**: Implement POST endpoint
  - Support 'parse' and 'execute' actions
  - Validate GEMINI_API_KEY
  - Call OrchestratorAgent methods
  - Return structured responses

## Tutorial Files with Solutions

### Step 4: Analytics Agent (`src/content/workshop-steps/04-orchestrator.mdx`)
**Format:**
```markdown
## Exercise 1: Build the Analytics Agent Class

**📝 File:** `src/lib/agents/analytics.ts`

Look for the `TODO: Exercise 1` comment in the file...

<Hint title="Full implementation (click to reveal)">
<CodeBlock language="typescript" code={`...full solution...`} />
</Hint>
```

**What's Updated:**
- Added file path references with 📝 emoji
- Explicit instructions to find TODO comments
- Solution dropdowns with complete code
- All 4 exercises have solution dropdowns

### Step 5: Report Agent (`src/content/workshop-steps/05-report.mdx`)
**Status:** No changes needed
- Report Agent is already complete
- Tutorial explains the implementation
- Students review and understand, no coding required

### Step 6: Orchestrator (`src/content/workshop-steps/06-integration.mdx`)
**Format:** Same as Step 4
- File path references added
- TODO comment instructions
- Solution dropdowns for all exercises
- Step-by-step implementation guidance

## How Students Use This Workshop

### 1. Read the Tutorial (Step 2-3)
- **Step 2**: Analytics Overview - Understand Firebolt schema and queries
- **Step 3**: Orchestration Theory - Learn multi-agent patterns

### 2. Implement Analytics Agent (Step 4)
1. Open `src/lib/agents/analytics.ts`
2. Find `TODO: Exercise 1` comment
3. Read requirements in tutorial
4. Implement `executeQuery()` method
5. Test with Analytics Demo
6. (Optional) Complete Exercise 3-4 for advanced queries
7. Implement `POST /api/analytics` route

### 3. Review Report Agent (Step 5)
1. Open `src/lib/agents/report.ts`
2. Review complete implementation
3. Understand report generation patterns
4. Test with Report Demo
5. No coding required - just understanding

### 4. Implement Orchestrator (Step 6)
1. Open `src/lib/agents/orchestrator.ts`
2. Find `TODO: Exercise 1` - Implement `parseIntent()`
3. Find `TODO: Exercise 2` - Implement `routeTask()`
4. Find `TODO: Exercise 3` - Implement `handleMultiStepQuery()`
5. Test with Orchestrator Demo
6. Implement `POST /api/orchestrator` route

### 5. Integration Testing (Step 6)
- Test end-to-end workflows
- Try natural language queries
- Verify email previews in console
- Complete all checkpoint items

## Solution Access

**Dropdown Solutions in Tutorial:**
- Each exercise has a `<Hint>` component with full solution
- Students can reveal when stuck or for verification
- Dropdowns are collapsed by default (learn by doing first)

**Example:**
```markdown
<Hint title="Full implementation (click to reveal)">
<CodeBlock language="typescript" code={`
async executeQuery(queryType: string): Promise<QueryResult> {
  const queries: Record<string, string> = {
    revenue: \`SELECT ...\`,
    // ... complete implementation
  };
  
  if (!queries[queryType]) {
    throw new Error(\`Unknown query type: \${queryType}\`);
  }
  
  return await this.mcpClient.execute(queries[queryType]);
}
`} />
</Hint>
```

## Workshop Flow

```
Step 1: Setup (Firebolt/Gemini config)
   ↓
Step 2: Analytics Overview (Theory)
   ↓
Step 3: Orchestration Theory
   ↓
Step 4: BUILD Analytics Agent ← Students code here
   ├─ Exercise 1: executeQuery() [REQUIRED]
   ├─ Exercise 2: API Route [REQUIRED]
   ├─ Exercise 3: getCustomerGrowth() [OPTIONAL]
   └─ Exercise 4: getConversionFunnel() [OPTIONAL]
   ↓
Step 5: REVIEW Report Agent ← No coding, just learn
   ├─ Review generateReport()
   ├─ Review generateFinancialReport()
   └─ Review sendEmail()
   ↓
Step 6: BUILD Orchestrator ← Students code here
   ├─ Exercise 1: parseIntent() [REQUIRED]
   ├─ Exercise 2: routeTask() [REQUIRED]
   ├─ Exercise 3: handleMultiStepQuery() [REQUIRED]
   └─ Exercise 4: API Route [REQUIRED]
   ↓
Step 7: Test & Deploy
```

## Testing Your Implementation

### Analytics Agent Tests
```bash
# Test predefined query
curl -X POST http://localhost:3000/api/analytics \
  -H "Content-Type: application/json" \
  -d '{"queryType": "revenue"}'

# Test natural language query
curl -X POST http://localhost:3000/api/analytics \
  -H "Content-Type: application/json" \
  -d '{"naturalLanguageQuery": "Show me the top 5 selling products"}'
```

### Orchestrator Tests
```bash
# Test intent parsing
curl -X POST http://localhost:3000/api/orchestrator \
  -H "Content-Type: application/json" \
  -d '{"query": "Show me revenue", "action": "parse"}'

# Test multi-step execution
curl -X POST http://localhost:3000/api/orchestrator \
  -H "Content-Type: application/json" \
  -d '{"query": "Show revenue and email to test@example.com", "action": "execute"}'
```

## Common Workshop Issues

### Issue: GEMINI_API_KEY not configured
**Solution:** Check `.env` file has valid API key from https://aistudio.google.com

### Issue: executeQuery returns empty results
**Solution:** 
- Check NULL filtering in SQL queries
- Use `WHERE price IS NOT NULL` for purchase events
- Use `COALESCE()` for display fields

### Issue: parseIntent fails to extract JSON
**Solution:**
- Check regex pattern: `/\{[\s\S]*\}/`
- Gemini may wrap JSON in markdown code blocks
- Clean response text before parsing

### Issue: Email not sending
**Solution:**
- Workshop runs in sandbox mode by default
- Check browser console for "📧 Email Preview" logs
- Set `NODE_ENV=production` for real email delivery

## File Structure Summary

```
src/
├── lib/
│   ├── agents/
│   │   ├── analytics.ts      ← TODO: Exercise 1, 3, 4
│   │   ├── orchestrator.ts   ← TODO: Exercise 1, 2, 3
│   │   └── report.ts         ← COMPLETE (reference)
│   ├── services/
│   │   ├── firebolt-mcp.ts   ← Pre-built (MCP client)
│   │   ├── gemini.ts         ← Pre-built (Gemini service)
│   │   └── gmail.ts          ← Pre-built (Gmail client)
│   └── utils/
│       ├── email-templates.ts ← Pre-built (HTML templates)
│       ├── error-handler.ts   ← Pre-built (retry logic)
│       └── logger.ts          ← Pre-built (logging)
├── app/api/
│   ├── analytics/
│   │   └── route.ts          ← TODO: Exercise 2
│   └── orchestrator/
│       └── route.ts          ← TODO: Exercise 4
└── content/
    └── workshop-steps/
        ├── 02-analytics.mdx        ← Theory
        ├── 03-orchestration-theory.mdx ← Theory
        ├── 04-orchestrator.mdx     ← BUILD (Analytics)
        ├── 05-report.mdx           ← REVIEW
        └── 06-integration.mdx      ← BUILD (Orchestrator)
```

## Expected Workshop Outcomes

By the end of the workshop, participants will have:

✅ Built a complete Analytics Agent with 5 query types
✅ Implemented API routes with proper validation
✅ Created an Orchestrator that parses natural language
✅ Coordinated multi-step workflows (analytics → report → email)
✅ Integrated Gemini AI for intent parsing and SQL generation
✅ Connected to Firebolt database via MCP protocol
✅ Handled errors and edge cases properly
✅ Tested all components end-to-end

## Next Steps After Workshop

1. **Deploy to Production**
   - Set environment variables
   - Configure real Firebolt database
   - Enable production email sending

2. **Extend Functionality**
   - Add more query types
   - Create custom report templates
   - Implement scheduled reports
   - Add authentication

3. **Optimize Performance**
   - Add query result caching
   - Create Firebolt aggregating indexes
   - Implement rate limiting
   - Add request queuing

---

**Workshop Duration:** 2-3 hours
**Difficulty:** Intermediate to Advanced
**Prerequisites:** TypeScript, SQL basics, understanding of REST APIs
