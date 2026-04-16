# Workshop Guide

This hands-on workshop builds a production-ready multi-agent orchestration system with room for you to complete 20% via TODOs.

## Sessions

1. Setup
2. Orchestrator
3. Analytics
4. Report
5. Integration

Each step lives under `src/content/workshop-steps/` and is rendered at `/workshop/<step>`.

## Objectives

- Parse user intent and route to the right agent
- Run analytics queries via Firebolt MCP (mocked)
- Generate reports with Gemini and send via Gmail (sandbox)
- Handle freemium constraints (rate limits, retries, fallbacks)

## TODOs

Look for `TODO:` in code with hints and tests. You’ll implement:

- Multi-step orchestration in `orchestrator.ts`
- Customer growth query and optimizations in `analytics.ts`
- Financial report template and email delivery in `report.ts`


