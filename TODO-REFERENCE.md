# Workshop Quick Reference - TODO Locations

This guide shows exactly where to implement code in the workshop.

## ⚡ Quick Start

1. **Analytics Agent** → `src/lib/agents/analytics.ts`
2. **Analytics API** → `src/app/api/analytics/route.ts`
3. **Orchestrator Agent** → `src/lib/agents/orchestrator.ts`
4. **Orchestrator API** → `src/app/api/orchestrator/route.ts`

---

## 📝 File: `src/lib/agents/analytics.ts`

### TODO: Exercise 1 - executeQuery() [REQUIRED]
**Line:** ~55
**What to do:** Implement method that executes 5 predefined SQL queries

```typescript
async executeQuery(queryType: string): Promise<QueryResult> {
  // TODO: Implement this method
  // Step 1: Create queries object with 5 query types
  // Step 2: Validate queryType exists
  // Step 3: Execute and return result
  throw new Error('TODO: Implement executeQuery method');
}
```

**Required query types:**
- `revenue` - SUM(price), COUNT(*), unique customers
- `top_products` - GROUP BY product_id, ORDER BY purchase_count DESC
- `user_behavior` - GROUP BY event_type, show counts
- `category_performance` - GROUP BY category_code, show revenue
- `brand_analysis` - GROUP BY brand, show revenue

**Tutorial:** Step 4, Exercise 1
**Solution:** Click "Full implementation" dropdown in tutorial

---

### TODO: Exercise 3 - getCustomerGrowth() [OPTIONAL]
**Line:** ~160
**What to do:** Month-over-month customer growth with LAG() window function

```typescript
async getCustomerGrowth(): Promise<QueryResult> {
  // TODO: Implement customer growth analysis
  throw new Error('TODO: Implement getCustomerGrowth method');
}
```

**Key concepts:**
- CTE with DATE_TRUNC('month', event_time)
- LAG() window function for previous month
- Growth percentage calculation
- NULL handling for first month

**Tutorial:** Step 4, Exercise 3
**Solution:** Click "Full implementation" dropdown in tutorial

---

### TODO: Exercise 4 - getConversionFunnel() [OPTIONAL]
**Line:** ~175
**What to do:** Track view → cart → purchase conversion rates

```typescript
async getConversionFunnel(): Promise<QueryResult> {
  // TODO: Implement conversion funnel analysis
  throw new Error('TODO: Implement getConversionFunnel method');
}
```

**Key concepts:**
- CTE grouping by user_id and user_session
- MAX(CASE WHEN ...) for each event type
- Conversion rate calculations with NULLIF
- View-to-cart, cart-to-purchase, overall rates

**Tutorial:** Step 4, Exercise 4
**Solution:** Click "Full implementation" dropdown in tutorial

---

## 📝 File: `src/app/api/analytics/route.ts`

### TODO: Exercise 2 - POST endpoint [REQUIRED]
**Line:** ~6
**What to do:** Handle analytics API requests

```typescript
export async function POST(request: NextRequest) {
  try {
    // TODO: Implement POST endpoint
    // 1. Extract queryType and naturalLanguageQuery from request
    // 2. Create AnalyticsAgent instance
    // 3. Handle natural language queries (if provided)
    // 4. Handle predefined queries (validate queryType)
    // 5. Return appropriate JSON responses
    throw new Error('TODO: Implement POST endpoint');
  } catch (error: any) {
    // Error handling already implemented
  }
}
```

**Requirements:**
- Extract `queryType` and `naturalLanguageQuery` from request body
- Validate query type is one of: revenue, top_products, user_behavior, category_performance, brand_analysis
- Support both predefined and natural language queries
- Return JSON with success, type, and result

**Tutorial:** Step 4, Exercise 2
**Solution:** Click "Full implementation" dropdown in tutorial

---

## 📝 File: `src/lib/agents/orchestrator.ts`

### TODO: Exercise 1 - parseIntent() [REQUIRED]
**Line:** ~35
**What to do:** Use Gemini to parse user queries into structured intents

```typescript
async parseIntent(userQuery: string): Promise<IntentResult> {
  // TODO: Implement intent parsing with Gemini
  // Step 1: Create comprehensive prompt
  // Step 2: Call this.model.generateContent(prompt)
  // Step 3: Extract JSON using regex
  // Step 4: Parse and return IntentResult
  throw new Error('TODO: Implement parseIntent method');
}
```

**Requirements:**
- Create prompt explaining system capabilities
- Request JSON response with: intent, entities, confidence
- Support 4 intents: analytics, report, email, multi_step
- Support 5 query types: revenue, top_products, user_behavior, category_performance, brand_analysis
- Extract email addresses and time ranges
- Use regex `/\{[\s\S]*\}/` to extract JSON from response

**Tutorial:** Step 6, Exercise 1
**Solution:** Click "Full implementation" dropdown in tutorial

---

### TODO: Exercise 2 - routeTask() [REQUIRED]
**Line:** ~50
**What to do:** Map intents to agent types

```typescript
routeTask(intent: IntentResult): AgentType {
  // TODO: Implement task routing
  // Map intent to agent type
  throw new Error('TODO: Implement routeTask method');
}
```

**Requirements:**
- Return 'analytics' for analytics intent
- Return 'report' for report intent
- Return 'email' for email intent
- Return 'unknown' for anything else

**Tutorial:** Step 6, Exercise 2
**Solution:** Click "Full implementation" dropdown in tutorial

---

### TODO: Exercise 3 - handleMultiStepQuery() [REQUIRED]
**Line:** ~60
**What to do:** Orchestrate multi-step workflows

```typescript
async handleMultiStepQuery(userQuery: string) {
  // TODO: Implement multi-step orchestration
  // Step 1: Extract intent signals with regex
  // Step 2: Execute analytics query
  // Step 3: Generate report if needed
  // Step 4: Send email if recipient specified
  // Step 5: Track steps and return result
  throw new Error('TODO: Implement handleMultiStepQuery method');
}
```

**Requirements:**
- Detect query types with regex patterns:
  - `/revenue|sales|income/` → revenue
  - `/top\s+products|best\s+sellers?/` → top_products
  - `/user\s+behavior|engagement/` → user_behavior
  - `/categor(y|ies)/` → category_performance
  - `/brand(s)?/` → brand_analysis
- Detect report request: `/report|summary|generate/`
- Extract email: `/[\w.-]+@[\w.-]+\.[a-z]{2,}/`
- Execute AnalyticsAgent query
- Generate report (financial for revenue/category/brand, summary for others)
- Send email if recipient present
- Track each step with status

**Tutorial:** Step 6, Exercise 3
**Solution:** Click "Full implementation" dropdown in tutorial

---

## 📝 File: `src/app/api/orchestrator/route.ts`

### TODO: Exercise 4 - POST endpoint [REQUIRED]
**Line:** ~6
**What to do:** Handle orchestrator API requests

```typescript
export async function POST(request: NextRequest) {
  try {
    // TODO: Implement POST endpoint
    // 1. Extract query and action from request
    // 2. Validate query is provided
    // 3. Validate GEMINI_API_KEY is configured
    // 4. Create OrchestratorAgent instance
    // 5. Handle 'execute' or 'multi_step' action
    // 6. Handle default 'parse' action
    throw new Error('TODO: Implement POST endpoint');
  } catch (error: any) {
    // Error handling already implemented
  }
}
```

**Requirements:**
- Extract `query` and `action` (default: 'parse')
- Validate query is provided (400 error if not)
- Validate GEMINI_API_KEY (500 error if not configured)
- Support two actions:
  - `'execute'` or `'multi_step'` → call handleMultiStepQuery()
  - `'parse'` → call parseIntent() and routeTask()
- Return appropriate JSON responses

**Tutorial:** Step 6, Exercise 4
**Solution:** Click "Full implementation" dropdown in tutorial

---

## 🧪 Testing Your Implementation

### Test Analytics Agent
```bash
# Terminal command
curl -X POST http://localhost:3000/api/analytics \
  -H "Content-Type: application/json" \
  -d '{"queryType": "revenue"}'
```

**Or use the Analytics Demo on homepage**

### Test Orchestrator
```bash
# Terminal command
curl -X POST http://localhost:3000/api/orchestrator \
  -H "Content-Type: application/json" \
  -d '{"query": "Show revenue and email to test@example.com", "action": "execute"}'
```

**Or use the Orchestrator Demo on homepage**

---

## ✅ Completion Checklist

### Analytics Agent
- [ ] Implemented `executeQuery()` with 5 query types
- [ ] Validated query types and handle unknown types
- [ ] Used proper SQL with NULL handling and NULLIF
- [ ] Implemented Analytics API POST endpoint
- [ ] Validated request parameters
- [ ] Tested with Analytics Demo
- [ ] (Optional) Implemented `getCustomerGrowth()`
- [ ] (Optional) Implemented `getConversionFunnel()`

### Orchestrator Agent
- [ ] Implemented `parseIntent()` with Gemini
- [ ] Created comprehensive prompt with examples
- [ ] Extracted JSON from Gemini response
- [ ] Implemented `routeTask()` with proper mapping
- [ ] Implemented `handleMultiStepQuery()` with regex detection
- [ ] Coordinated Analytics → Report → Email workflow
- [ ] Tracked steps with status
- [ ] Implemented Orchestrator API POST endpoint
- [ ] Tested with Orchestrator Demo
- [ ] Verified email previews in console

---

## 📚 Additional Resources

- **Firebolt Schema:** See `02-analytics.mdx` for complete schema
- **Query Examples:** See Analytics Agent for reference queries
- **Error Handling:** Already implemented in API routes
- **Email Templates:** Pre-built in `src/lib/utils/email-templates.ts`
- **MCP Client:** Pre-built in `src/lib/services/firebolt-mcp.ts`
- **Gemini Service:** Pre-built in `src/lib/services/gemini.ts`

---

## 🆘 Help & Solutions

**Stuck on an exercise?**
1. Read the TODO comment instructions carefully
2. Check the tutorial for detailed requirements
3. Look at the Hint dropdown for full solution
4. Test incrementally (one method at a time)
5. Use console logs to debug
6. Check error messages in terminal and browser console

**Common mistakes:**
- Forgetting NULL handling in SQL queries
- Not validating query types before execution
- Missing regex flags for case-insensitive matching
- Forgetting to parse JSON from Gemini's markdown response
- Not handling empty/undefined values in API routes

**Good luck! 🚀**
