"use client";

import { useState } from "react";
import Link from "next/link";

interface Section {
  id: string;
  title: string;
  icon: string;
}

const SECTIONS: Section[] = [
  { id: "overview", title: "Overview", icon: "🎯" },
  { id: "architecture", title: "Architecture", icon: "🏗️" },
  { id: "frontend", title: "Frontend", icon: "🖥️" },
  { id: "backend", title: "Backend", icon: "⚙️" },
  { id: "database", title: "Database", icon: "🗄️" },
  { id: "ai-models", title: "AI Models", icon: "🤖" },
  { id: "pipeline", title: "Pipeline", icon: "🔄" },
  { id: "security", title: "Security", icon: "🔐" },
  { id: "api", title: "API Design", icon: "📡" },
  { id: "deployment", title: "Deployment", icon: "🚀" },
  { id: "costs", title: "Costs", icon: "💰" },
  { id: "decisions", title: "Tech Decisions", icon: "🧠" },
];

export default function AboutPage() {
  const [activeSection, setActiveSection] = useState("overview");

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#06060a] text-white">
      {/* Minimal Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#06060a]/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-amber-500 flex items-center justify-center text-sm">
              🇨🇳
            </div>
            <span className="font-semibold text-white/80 group-hover:text-white transition">China GDP AI</span>
          </Link>
          <div className="text-xs text-white/30">Technical Documentation</div>
        </div>
      </header>

      {/* Side Navigation */}
      <nav className="fixed left-0 top-20 bottom-0 w-64 border-r border-white/5 overflow-y-auto hidden lg:block p-4">
        <div className="text-xs text-white/30 uppercase tracking-wider mb-4 px-3">Contents</div>
        {SECTIONS.map((section) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition flex items-center gap-2 ${
              activeSection === section.id
                ? "bg-white/10 text-white"
                : "text-white/50 hover:text-white hover:bg-white/5"
            }`}
          >
            <span>{section.icon}</span>
            {section.title}
          </button>
        ))}
      </nav>

      {/* Main Content */}
      <main className="lg:ml-64 pt-24 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          
          {/* Hero */}
          <div className="mb-16 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 text-xs text-white/50 mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Internal Documentation
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              China GDP AI
            </h1>
            <p className="text-xl text-white/40 max-w-2xl mx-auto">
              A comprehensive technical deep-dive into the architecture, implementation, and design decisions behind the AI-powered economic forecasting platform.
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-20">
            
            {/* Overview */}
            <section id="overview" className="scroll-mt-24">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="text-3xl">🎯</span> Overview
              </h2>
              <div className="prose-custom">
                <p>
                  <strong>China GDP AI</strong> is an AI-powered economic intelligence platform that predicts China&apos;s quarterly GDP growth by synthesizing real-time news sentiment, official economic indicators, and multi-model AI analysis.
                </p>
                <p>
                  The system is built on a <strong>frontend-controlled pipeline architecture</strong> — all AI configurations, prompts, model selections, and processing logic are defined by the user interface, while the backend acts as a pure execution engine without autonomous decision-making.
                </p>
                
                <div className="grid sm:grid-cols-3 gap-4 my-8">
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className="text-3xl mb-2">~90s</div>
                    <div className="text-sm text-white/40">Analysis time</div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className="text-3xl mb-2">6</div>
                    <div className="text-sm text-white/40">Pipeline stages</div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className="text-3xl mb-2">2</div>
                    <div className="text-sm text-white/40">AI models</div>
                  </div>
                </div>

                <h3>Core Capabilities</h3>
                <ul>
                  <li><strong>News Aggregation</strong> — Collects China-related economic news from World News API</li>
                  <li><strong>Economic Data</strong> — Fetches GDP, PMI, Trade Balance from World Bank & FRED</li>
                  <li><strong>Sentiment Analysis</strong> — AI-powered sentiment scoring of news coverage</li>
                  <li><strong>Factor Extraction</strong> — Identifies growth drivers and inhibitors</li>
                  <li><strong>Data Synthesis</strong> — Combines all signals into coherent assessment</li>
                  <li><strong>GDP Prediction</strong> — Quarterly forecasts with confidence intervals</li>
                </ul>

                <h3>Target Users</h3>
                <ul>
                  <li>Portfolio managers adjusting EM allocation</li>
                  <li>Corporate strategists planning China market entry</li>
                  <li>Macro analysts generating baseline forecasts</li>
                  <li>Researchers studying AI-driven economic forecasting</li>
                </ul>
              </div>
            </section>

            {/* Architecture */}
            <section id="architecture" className="scroll-mt-24">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="text-3xl">🏗️</span> Architecture
              </h2>
              <div className="prose-custom">
                <p>
                  The system follows a <strong>serverless, event-driven architecture</strong> with clear separation between presentation (Vercel), computation (AWS Lambda), and storage (DynamoDB/S3).
                </p>

                <div className="my-8 p-6 rounded-xl bg-black/40 border border-white/10 font-mono text-sm overflow-x-auto">
                  <pre className="text-white/70">{`┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      VERCEL (Frontend)                           │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    Next.js 16 App                         │   │
│  │  • Server Components (static pages)                       │   │
│  │  • Client Components (interactive UI)                     │   │
│  │  • API Routes (/api/proxy, /api/auth)                    │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                    HTTPS (via /api/proxy)
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        AWS CLOUD                                 │
│                                                                  │
│  ┌────────────────┐      ┌─────────────────────────────────┐   │
│  │  API Gateway   │─────▶│         Lambda Function          │   │
│  │  (REST API)    │      │         (Python 3.11)            │   │
│  │                │      │                                   │   │
│  │  /china-gdp-ai │      │  ┌─────────────────────────────┐ │   │
│  └────────────────┘      │  │    Multi-Model AI Engine    │ │   │
│                          │  │  • Claude Opus 4.5          │ │   │
│  ┌────────────────┐      │  │  • Gemini 3 Pro Preview     │ │   │
│  │  EventBridge   │─────▶│  └─────────────────────────────┘ │   │
│  │ (Daily 10 UTC) │      │                                   │   │
│  └────────────────┘      │  ┌─────────────────────────────┐ │   │
│                          │  │      External APIs          │ │   │
│  ┌────────────────┐      │  │  • World News API           │ │   │
│  │    Secrets     │─────▶│  │  • World Bank API           │ │   │
│  │    Manager     │      │  │  • FRED API                 │ │   │
│  └────────────────┘      │  └─────────────────────────────┘ │   │
│                          └──────────────┬───────────────────┘   │
│                                         │                        │
│              ┌──────────────────────────┼──────────────────┐    │
│              │                          │                   │    │
│              ▼                          ▼                   ▼    │
│        ┌──────────┐            ┌─────────────────┐    ┌───────┐ │
│        │    S3    │            │    DynamoDB     │    │  SNS  │ │
│        │ Reports  │            │  4 Tables       │    │Alerts │ │
│        └──────────┘            └─────────────────┘    └───────┘ │
└─────────────────────────────────────────────────────────────────┘`}</pre>
                </div>

                <h3>Key Architectural Decisions</h3>
                <ol>
                  <li>
                    <strong>Frontend-Controlled Pipeline</strong> — The backend doesn&apos;t decide how to analyze data. The frontend sends a complete &quot;plan&quot; specifying nodes, models, prompts, and parameters. The backend simply executes.
                  </li>
                  <li>
                    <strong>Serverless</strong> — No servers to manage. Lambda scales automatically. Pay only for compute time used.
                  </li>
                  <li>
                    <strong>API Proxy Pattern</strong> — Frontend calls <code>/api/proxy</code> which forwards to Lambda. This hides the AWS endpoint and allows adding auth, logging, transformations at the edge.
                  </li>
                  <li>
                    <strong>Persistent Storage</strong> — All jobs, configs, prompts, and results stored in DynamoDB. Nothing is ephemeral.
                  </li>
                </ol>
              </div>
            </section>

            {/* Frontend */}
            <section id="frontend" className="scroll-mt-24">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="text-3xl">🖥️</span> Frontend
              </h2>
              <div className="prose-custom">
                <h3>Technology Stack</h3>
                <table>
                  <tbody>
                    <tr><td>Framework</td><td>Next.js 16 (App Router)</td></tr>
                    <tr><td>Language</td><td>TypeScript</td></tr>
                    <tr><td>Styling</td><td>Tailwind CSS v4</td></tr>
                    <tr><td>Fonts</td><td>Geist Sans, Geist Mono</td></tr>
                    <tr><td>Deployment</td><td>Vercel</td></tr>
                    <tr><td>Auth</td><td>Server-side password gate with HTTP-only cookies</td></tr>
                  </tbody>
                </table>

                <h3>Page Structure</h3>
                <div className="my-6 p-4 rounded-xl bg-white/[0.02] border border-white/5 font-mono text-sm">
                  <pre className="text-white/60">{`src/app/
├── page.tsx              # Home - dashboard with CTA
├── analyze/page.tsx      # 6-step configuration wizard
├── jobs/
│   ├── page.tsx          # Job history list
│   └── [id]/page.tsx     # Job detail with results
├── results/page.tsx      # Results with scoring
├── prompts/page.tsx      # Prompt library CRUD
├── about/page.tsx        # This documentation (hidden)
└── api/
    ├── proxy/route.ts    # Lambda proxy
    └── auth/route.ts     # Password authentication`}</pre>
                </div>

                <h3>Design System</h3>
                <ul>
                  <li><strong>Color Palette</strong> — Dark base (#06060a), white/opacity text, red-to-amber gradient for CTAs</li>
                  <li><strong>Glassmorphism</strong> — Subtle backdrop-blur effects on navbar and modals</li>
                  <li><strong>Animations</strong> — CSS transitions, Tailwind animate-in utilities, smooth scrolling</li>
                  <li><strong>Typography</strong> — System fonts with monospace for technical content</li>
                </ul>

                <h3>Key Components</h3>
                <ul>
                  <li><strong>Navbar</strong> — Animated with mouse-following glow, gradient border, hamburger menu, pulsing status indicator</li>
                  <li><strong>PasswordGate</strong> — Server-authenticated protection wrapper</li>
                  <li><strong>Pipeline Wizard</strong> — Expand/confirm flow forcing users to review each step</li>
                </ul>

                <h3>State Management</h3>
                <p>
                  No global state library. Each page fetches its own data via the API client. React useState for local UI state. URL params for job IDs.
                </p>

                <h3>API Client</h3>
                <div className="my-6 p-4 rounded-xl bg-black/40 border border-white/10 font-mono text-sm overflow-x-auto">
                  <pre className="text-white/60">{`// src/lib/api.ts
export const api = {
  status: () => call({ operation: "status" }),
  listModels: () => call({ operation: "list_models" }),
  createJob: (plan, autoRun) => call({ operation: "create_job", plan, auto_run: autoRun }),
  getJob: (jobId) => call({ operation: "get_job", job_id: jobId }),
  listJobs: (limit) => call({ operation: "list_jobs", limit }),
  savePrompt: (prompt) => call({ operation: "save_prompt", prompt }),
  listPrompts: () => call({ operation: "list_prompts" }),
  scoreResult: (resultId, score, feedback) => call({ ... }),
  // ... etc
};`}</pre>
                </div>
              </div>
            </section>

            {/* Backend */}
            <section id="backend" className="scroll-mt-24">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="text-3xl">⚙️</span> Backend
              </h2>
              <div className="prose-custom">
                <h3>Technology Stack</h3>
                <table>
                  <tbody>
                    <tr><td>Runtime</td><td>AWS Lambda (Python 3.11)</td></tr>
                    <tr><td>Framework</td><td>AWS SAM (Serverless Application Model)</td></tr>
                    <tr><td>API</td><td>Amazon API Gateway (REST)</td></tr>
                    <tr><td>Timeout</td><td>900 seconds (15 minutes)</td></tr>
                    <tr><td>Memory</td><td>512 MB</td></tr>
                  </tbody>
                </table>

                <h3>Lambda Handler Structure</h3>
                <div className="my-6 p-4 rounded-xl bg-black/40 border border-white/10 font-mono text-sm overflow-x-auto">
                  <pre className="text-white/60">{`def lambda_handler(event, context):
    body = json.loads(event.get('body', '{}'))
    operation = body.get('operation', 'status')
    
    operations = {
        'status': handle_status,
        'list_models': handle_list_models,
        'create_job': handle_create_job,
        'get_job': handle_get_job,
        'list_jobs': handle_list_jobs,
        'save_config': handle_save_config,
        'get_config': handle_get_config,
        'list_configs': handle_list_configs,
        'get_default_config': handle_get_default_config,
        'save_prompt': handle_save_prompt,
        'get_prompt': handle_get_prompt,
        'list_prompts': handle_list_prompts,
        'list_results': handle_list_results,
        'score_result': handle_score_result,
    }
    
    handler = operations.get(operation, handle_unknown)
    return handler(body)`}</pre>
                </div>

                <h3>Core Classes</h3>
                <ul>
                  <li><strong>Database</strong> — DynamoDB operations (CRUD for jobs, configs, prompts, results)</li>
                  <li><strong>MultiModelAI</strong> — Unified interface to Claude and Gemini</li>
                  <li><strong>AnthropicClient</strong> — Claude Opus 4.5 wrapper</li>
                  <li><strong>GoogleClient</strong> — Gemini 3 Pro Preview wrapper</li>
                  <li><strong>WorldNewsAnalyzer</strong> — News fetching and processing</li>
                  <li><strong>WorldBankClient</strong> — GDP data from World Bank API</li>
                  <li><strong>FREDClient</strong> — Economic indicators from Federal Reserve</li>
                </ul>

                <h3>Pipeline Execution</h3>
                <p>
                  When a job is created with <code>auto_run: true</code>, the Lambda executes each node in sequence:
                </p>
                <ol>
                  <li>Parse the plan&apos;s nodes, sort by order</li>
                  <li>For data_fetch nodes: call external APIs, store output</li>
                  <li>For ai_process nodes: build prompt from inputs, call AI, store output</li>
                  <li>Save complete result to DynamoDB</li>
                  <li>Return job_id to frontend</li>
                </ol>

                <h3>Environment Variables</h3>
                <div className="my-6 p-4 rounded-xl bg-white/[0.02] border border-white/5 font-mono text-sm">
                  <pre className="text-white/60">{`JOBS_TABLE=china-gdp-jobs
CONFIGS_TABLE=china-gdp-configs
RESULTS_TABLE=china-gdp-results
PROMPTS_TABLE=china-gdp-prompts
REPORTS_BUCKET=china-gdp-ai-reports-{account_id}
SECRET_NAME=china-gdp-ai/api-keys`}</pre>
                </div>
              </div>
            </section>

            {/* Database */}
            <section id="database" className="scroll-mt-24">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="text-3xl">🗄️</span> Database
              </h2>
              <div className="prose-custom">
                <h3>DynamoDB Tables</h3>
                <p>
                  Four tables, all using PAY_PER_REQUEST billing (no provisioned capacity, auto-scales, pay per operation).
                </p>

                <h4>china-gdp-jobs</h4>
                <div className="my-4 p-4 rounded-xl bg-black/40 border border-white/10 font-mono text-sm overflow-x-auto">
                  <pre className="text-white/60">{`{
  "job_id": "1ee1603b-aab8-426b-bb57-1157889a247b",  // Partition Key
  "status": "completed",                              // pending | running | completed | failed
  "created_at": "2025-12-09T14:45:02.716615",
  "config": {
    "name": "Analysis",
    "nodes": [ ... ]                                   // Full pipeline definition
  },
  "result": {
    "node_outputs": {
      "news_fetch": { "content": "...", "tokens": 0 },
      "sentiment_analysis": { "content": "...", "model": "gemini-3-pro-preview", "tokens": 4101 },
      // ...
    },
    "execution_time_ms": 102900,
    "total_cost_usd": 0.0601
  }
}`}</pre>
                </div>

                <h4>china-gdp-configs</h4>
                <div className="my-4 p-4 rounded-xl bg-black/40 border border-white/10 font-mono text-sm overflow-x-auto">
                  <pre className="text-white/60">{`{
  "config_id": "cf112479-5eb5-4ac4-b...",  // Partition Key
  "name": "Production Config",
  "description": "Standard 6-node pipeline",
  "nodes": [
    { "id": "news_fetch", "type": "data_fetch", "order": 1, "config": {...} },
    { "id": "sentiment_analysis", "type": "ai_process", "order": 3, "model": "gemini-3-pro-preview" },
    // ...
  ],
  "created_at": "2025-12-09T14:00:00.000000"
}`}</pre>
                </div>

                <h4>china-gdp-results</h4>
                <div className="my-4 p-4 rounded-xl bg-black/40 border border-white/10 font-mono text-sm overflow-x-auto">
                  <pre className="text-white/60">{`{
  "result_id": "bb4b1411-f9e...",  // Partition Key
  "job_id": "1ee1603b-aab8-...",   // Reference to job
  "created_at": "2025-12-09T14:46:45.000000",
  "summary": {
    "prediction": 4.8,
    "trend": "stable",
    "outlook": "cautiously_optimistic"
  },
  "scores": {
    "user_quality_score": 8,
    "feedback": "Accurate Q1 prediction"
  }
}`}</pre>
                </div>

                <h4>china-gdp-prompts</h4>
                <div className="my-4 p-4 rounded-xl bg-black/40 border border-white/10 font-mono text-sm overflow-x-auto">
                  <pre className="text-white/60">{`{
  "prompt_id": "sentiment_detailed_v1",  // Partition Key
  "name": "Detailed Sentiment Analysis",
  "node_type": "sentiment_analysis",
  "system": "You are an expert economic analyst specializing in China...",
  "user": "Analyze the sentiment of these news articles about China's economy:\\n\\n{news}\\n\\n...",
  "created_at": "2025-12-09T13:30:00.000000"
}`}</pre>
                </div>

                <h3>Why DynamoDB?</h3>
                <ul>
                  <li><strong>Serverless</strong> — No database servers to manage</li>
                  <li><strong>Auto-scaling</strong> — Handles any load without configuration</li>
                  <li><strong>Pay-per-request</strong> — Perfect for variable/low traffic</li>
                  <li><strong>Low latency</strong> — Single-digit millisecond reads</li>
                  <li><strong>Fully managed</strong> — Backups, encryption, replication handled by AWS</li>
                </ul>
              </div>
            </section>

            {/* AI Models */}
            <section id="ai-models" className="scroll-mt-24">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="text-3xl">🤖</span> AI Models
              </h2>
              <div className="prose-custom">
                <h3>Selected Models</h3>
                <table>
                  <thead>
                    <tr><th>Model</th><th>Provider</th><th>Use Case</th><th>Why</th></tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>claude-opus-4-5-20251101</td>
                      <td>Anthropic</td>
                      <td>Factor extraction, GDP prediction</td>
                      <td>Best reasoning, handles nuance</td>
                    </tr>
                    <tr>
                      <td>gemini-2.0-flash</td>
                      <td>Google</td>
                      <td>Sentiment analysis, synthesis</td>
                      <td>Fast, good at summarization</td>
                    </tr>
                  </tbody>
                </table>

                <h3>Model Pricing (per 1M tokens)</h3>
                <table>
                  <thead>
                    <tr><th>Model</th><th>Input</th><th>Output</th></tr>
                  </thead>
                  <tbody>
                    <tr><td>Claude Opus 4.5</td><td>$15.00</td><td>$75.00</td></tr>
                    <tr><td>Gemini 3 Pro</td><td>~$1.25</td><td>~$5.00</td></tr>
                  </tbody>
                </table>

                <h3>Why These Models?</h3>
                <p>
                  <strong>Claude Opus 4.5</strong> was chosen for the critical reasoning tasks (factor extraction and final prediction) because:
                </p>
                <ul>
                  <li>Superior at complex reasoning and nuanced analysis</li>
                  <li>Better at following structured output formats (JSON)</li>
                  <li>More reliable at quantitative predictions</li>
                </ul>
                <p>
                  <strong>Gemini 3 Pro Preview</strong> handles sentiment and synthesis because:
                </p>
                <ul>
                  <li>Faster response times for high-volume text processing</li>
                  <li>Cost-effective for summarization tasks</li>
                  <li>Good at extracting sentiment from large text corpora</li>
                </ul>

                <h3>Why Not GPT?</h3>
                <p>
                  GPT-5 was initially included but removed due to:
                </p>
                <ul>
                  <li>API compatibility issues (max_tokens vs max_completion_tokens parameter)</li>
                  <li>Higher latency for similar quality output</li>
                  <li>Decision to focus on fewer, more reliable models</li>
                </ul>

                <h3>Model Integration</h3>
                <div className="my-6 p-4 rounded-xl bg-black/40 border border-white/10 font-mono text-sm overflow-x-auto">
                  <pre className="text-white/60">{`class MultiModelAI:
    def __init__(self, secrets):
        self.anthropic = AnthropicClient(secrets.get('ANTHROPIC_API_KEY'))
        self.google = GoogleClient(secrets.get('GEMINI_API_KEY'))
    
    def generate(self, model: str, system: str, user: str, **kwargs) -> dict:
        if model.startswith('claude'):
            return self.anthropic.generate(model, system, user, **kwargs)
        elif model.startswith('gemini'):
            return self.google.generate(model, system, user, **kwargs)
        else:
            raise ValueError(f"Unknown model: {model}")`}</pre>
                </div>
              </div>
            </section>

            {/* Pipeline */}
            <section id="pipeline" className="scroll-mt-24">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="text-3xl">🔄</span> Pipeline
              </h2>
              <div className="prose-custom">
                <h3>6-Stage Analysis Pipeline</h3>
                <div className="my-8">
                  <div className="flex flex-col gap-4">
                    {[
                      { num: 1, name: "News Collection", type: "data_fetch", model: "—", desc: "Fetches recent China economic news from World News API" },
                      { num: 2, name: "Economic Data", type: "data_fetch", model: "—", desc: "Pulls GDP, PMI, Trade Balance from World Bank & FRED" },
                      { num: 3, name: "Sentiment Analysis", type: "ai_process", model: "Gemini", desc: "Analyzes news sentiment, returns score (-1 to +1)" },
                      { num: 4, name: "Factor Extraction", type: "ai_process", model: "Claude", desc: "Identifies growth drivers with direction and magnitude" },
                      { num: 5, name: "Data Synthesis", type: "ai_process", model: "Gemini", desc: "Combines all signals into comprehensive assessment" },
                      { num: 6, name: "GDP Prediction", type: "ai_process", model: "Claude", desc: "Generates quarterly forecasts with confidence intervals" },
                    ].map((stage) => (
                      <div key={stage.num} className="flex gap-4 items-start">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${
                          stage.type === "data_fetch" ? "bg-blue-500/20 text-blue-400" : "bg-purple-500/20 text-purple-400"
                        }`}>
                          {stage.num}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{stage.name}</span>
                            <span className={`text-xs px-2 py-0.5 rounded ${
                              stage.type === "data_fetch" ? "bg-blue-500/10 text-blue-400" : "bg-purple-500/10 text-purple-400"
                            }`}>{stage.type}</span>
                            {stage.model !== "—" && (
                              <span className="text-xs text-white/30">{stage.model}</span>
                            )}
                          </div>
                          <p className="text-sm text-white/50 mt-1">{stage.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <h3>Data Flow</h3>
                <div className="my-6 p-4 rounded-xl bg-black/40 border border-white/10 font-mono text-sm overflow-x-auto">
                  <pre className="text-white/60">{`news_fetch ──────────┬──────────────────────────────────────────┐
                     │                                          │
                     ▼                                          │
              sentiment_analysis ──────────┐                    │
                                           │                    │
economic_data ─────────────────────────────┼────────────────────┤
                                           │                    │
                     ┌─────────────────────┘                    │
                     ▼                                          │
              factor_extraction ───────────┤                    │
                                           │                    │
                                           ▼                    │
                                      synthesis ◀───────────────┘
                                           │
                                           ▼
                                      prediction`}</pre>
                </div>

                <h3>Configurable Parameters</h3>
                <table>
                  <thead>
                    <tr><th>Node Type</th><th>Parameters</th></tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>data_fetch (news)</td>
                      <td>keywords, time_period_days, max_articles</td>
                    </tr>
                    <tr>
                      <td>data_fetch (econ)</td>
                      <td>indicators (GDP, PMI, Trade Balance, CPI, etc.)</td>
                    </tr>
                    <tr>
                      <td>ai_process</td>
                      <td>model, temperature, max_tokens, system prompt, user prompt</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Security */}
            <section id="security" className="scroll-mt-24">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="text-3xl">🔐</span> Security
              </h2>
              <div className="prose-custom">
                <h3>Authentication</h3>
                <table>
                  <tbody>
                    <tr><td>Method</td><td>Server-side password verification</td></tr>
                    <tr><td>Storage</td><td>HTTP-only secure cookie (not localStorage)</td></tr>
                    <tr><td>Password</td><td>Stored in Vercel env var (SITE_PASSWORD)</td></tr>
                    <tr><td>Visibility</td><td>Never sent to browser, not in source code</td></tr>
                  </tbody>
                </table>

                <h3>How Auth Works</h3>
                <div className="my-6 p-4 rounded-xl bg-black/40 border border-white/10 font-mono text-sm overflow-x-auto">
                  <pre className="text-white/60">{`1. User visits site
   └─▶ PasswordGate component mounts
   
2. Check auth status
   └─▶ POST /api/auth { action: "check" }
   └─▶ Server reads HTTP-only cookie
   └─▶ Returns { authenticated: true/false }

3. If not authenticated, show password form
   └─▶ User enters password
   └─▶ POST /api/auth { action: "login", password: "..." }
   └─▶ Server compares with SITE_PASSWORD env var
   └─▶ If match: Set HTTP-only cookie, return success
   └─▶ If no match: Return 401

4. Cookie properties:
   httpOnly: true      // JavaScript can't read it
   secure: true        // HTTPS only
   sameSite: strict    // No cross-site requests
   maxAge: 30 days     // Auto-expire`}</pre>
                </div>

                <h3>API Key Management</h3>
                <ul>
                  <li><strong>Storage</strong>: AWS Secrets Manager</li>
                  <li><strong>Access</strong>: Lambda IAM role only</li>
                  <li><strong>Keys stored</strong>: ANTHROPIC_API_KEY, GEMINI_API_KEY, FRED_API_KEY, WORLD_NEWS_API_KEY</li>
                  <li><strong>Rotation</strong>: Can be rotated in Secrets Manager without code changes</li>
                </ul>

                <h3>Network Security</h3>
                <ul>
                  <li><strong>HTTPS everywhere</strong> — TLS 1.3 on Vercel and API Gateway</li>
                  <li><strong>CORS</strong> — API Gateway configured for specific origins</li>
                  <li><strong>No direct Lambda access</strong> — Always through API Gateway</li>
                  <li><strong>API proxy</strong> — AWS endpoint hidden behind Vercel</li>
                </ul>

                <h3>What&apos;s NOT Protected</h3>
                <p className="text-amber-400/80">
                  The Lambda API itself is publicly accessible. Anyone who discovers the API Gateway URL can call it directly without authentication. For full protection, you would add:
                </p>
                <ul>
                  <li>API key header validation in Lambda</li>
                  <li>JWT tokens issued after login</li>
                  <li>AWS Cognito for full auth system</li>
                </ul>
              </div>
            </section>

            {/* API Design */}
            <section id="api" className="scroll-mt-24">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="text-3xl">📡</span> API Design
              </h2>
              <div className="prose-custom">
                <h3>Single Endpoint, Operation-Based Routing</h3>
                <p>
                  Rather than REST-style multiple endpoints, the API uses a single POST endpoint with operation-based routing. This simplifies CORS, reduces API Gateway costs, and allows flexible payload structures.
                </p>

                <div className="my-6 p-4 rounded-xl bg-black/40 border border-white/10 font-mono text-sm">
                  <pre className="text-white/60">{`POST /china-gdp-ai
Content-Type: application/json

{ "operation": "...", ...params }`}</pre>
                </div>

                <h3>Operations</h3>
                <table>
                  <thead>
                    <tr><th>Operation</th><th>Description</th><th>Params</th></tr>
                  </thead>
                  <tbody>
                    <tr><td>status</td><td>Health check</td><td>—</td></tr>
                    <tr><td>list_models</td><td>Available AI models</td><td>—</td></tr>
                    <tr><td>create_job</td><td>Create/run analysis</td><td>plan, auto_run</td></tr>
                    <tr><td>get_job</td><td>Get job by ID</td><td>job_id</td></tr>
                    <tr><td>list_jobs</td><td>List all jobs</td><td>limit?</td></tr>
                    <tr><td>save_config</td><td>Save pipeline config</td><td>config</td></tr>
                    <tr><td>get_config</td><td>Get config by ID</td><td>config_id</td></tr>
                    <tr><td>list_configs</td><td>List all configs</td><td>—</td></tr>
                    <tr><td>get_default_config</td><td>Default 6-node pipeline</td><td>—</td></tr>
                    <tr><td>save_prompt</td><td>Save/update prompt</td><td>prompt</td></tr>
                    <tr><td>get_prompt</td><td>Get prompt by ID</td><td>prompt_id</td></tr>
                    <tr><td>list_prompts</td><td>List all prompts</td><td>—</td></tr>
                    <tr><td>list_results</td><td>List results with scores</td><td>limit?</td></tr>
                    <tr><td>score_result</td><td>Add rating to result</td><td>result_id, score, feedback?</td></tr>
                  </tbody>
                </table>

                <h3>Response Format</h3>
                <div className="my-6 p-4 rounded-xl bg-black/40 border border-white/10 font-mono text-sm overflow-x-auto">
                  <pre className="text-white/60">{`// Success
{
  "success": true,
  "job_id": "...",    // or whatever the operation returns
  ...data
}

// Error
{
  "success": false,
  "error": "Error message"
}`}</pre>
                </div>

                <h3>Job Creation Payload</h3>
                <div className="my-6 p-4 rounded-xl bg-black/40 border border-white/10 font-mono text-sm overflow-x-auto">
                  <pre className="text-white/60">{`{
  "operation": "create_job",
  "auto_run": true,
  "plan": {
    "name": "My Analysis",
    "nodes": [
      {
        "id": "news_fetch",
        "type": "data_fetch",
        "order": 1,
        "config": {
          "keywords": ["China GDP", "PBOC"],
          "time_period_days": 14,
          "max_articles": 30
        }
      },
      {
        "id": "sentiment_analysis",
        "type": "ai_process",
        "order": 3,
        "model": "gemini-3-pro-preview",
        "temperature": 0.3,
        "max_tokens": 8000,
        "input_from": ["news_fetch"]
      },
      // ... more nodes
    ],
    "prompts": {
      "sentiment_analysis": {
        "system": "You are an economic analyst...",
        "user": "Analyze sentiment of: {news}"
      }
    }
  }
}`}</pre>
                </div>
              </div>
            </section>

            {/* Deployment */}
            <section id="deployment" className="scroll-mt-24">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="text-3xl">🚀</span> Deployment
              </h2>
              <div className="prose-custom">
                <h3>Frontend (Vercel)</h3>
                <div className="my-6 p-4 rounded-xl bg-black/40 border border-white/10 font-mono text-sm">
                  <pre className="text-white/60">{`cd china-gdp-ai-frontend
vercel --prod

# Environment variables (set in Vercel dashboard or CLI):
# AWS_API_ENDPOINT=https://xxx.execute-api.eu-west-2.amazonaws.com/Prod/china-gdp-ai
# SITE_PASSWORD=Minsk2024`}</pre>
                </div>

                <h3>Backend (AWS SAM)</h3>
                <div className="my-6 p-4 rounded-xl bg-black/40 border border-white/10 font-mono text-sm">
                  <pre className="text-white/60">{`cd china-gdp-ai/lambda-source

# Build
sam build

# Deploy (first time)
sam deploy --guided

# Deploy (subsequent)
sam deploy

# Resources created:
# - Lambda function
# - API Gateway
# - DynamoDB tables (4)
# - S3 bucket
# - EventBridge rule
# - IAM roles`}</pre>
                </div>

                <h3>SAM Template Structure</h3>
                <div className="my-6 p-4 rounded-xl bg-black/40 border border-white/10 font-mono text-sm overflow-x-auto">
                  <pre className="text-white/60">{`AWSTemplateFormatVersion: '2010-09-09'
Transform: AWS::Serverless-2016-10-31

Resources:
  # S3 Bucket for reports
  ReportsBucket:
    Type: AWS::S3::Bucket
    
  # DynamoDB Tables
  JobsTable:
    Type: AWS::DynamoDB::Table
    Properties:
      TableName: china-gdp-jobs
      BillingMode: PAY_PER_REQUEST
      
  ConfigsTable: ...
  ResultsTable: ...
  PromptsTable: ...
  
  # Lambda Function
  ChinaGDPFunction:
    Type: AWS::Serverless::Function
    Properties:
      Handler: handler.lambda_handler
      Runtime: python3.11
      Timeout: 900
      MemorySize: 512
      Policies:
        - DynamoDBCrudPolicy: ...
        - S3FullAccessPolicy: ...
        - SecretsManagerReadWrite
      Events:
        ApiPost:
          Type: Api
          Properties:
            Path: /china-gdp-ai
            Method: post
        DailyReport:
          Type: Schedule
          Properties:
            Schedule: cron(0 10 * * ? *)`}</pre>
                </div>

                <h3>URLs</h3>
                <table>
                  <tbody>
                    <tr><td>Frontend</td><td>https://china.ai.chartit360.com</td></tr>
                    <tr><td>API</td><td>https://pte29a0ad9.execute-api.eu-west-2.amazonaws.com/Prod/china-gdp-ai</td></tr>
                    <tr><td>Region</td><td>eu-west-2 (London)</td></tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Costs */}
            <section id="costs" className="scroll-mt-24">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="text-3xl">💰</span> Costs
              </h2>
              <div className="prose-custom">
                <h3>Per-Analysis Cost</h3>
                <table>
                  <thead>
                    <tr><th>Component</th><th>Tokens</th><th>Cost</th></tr>
                  </thead>
                  <tbody>
                    <tr><td>Gemini (sentiment)</td><td>~4,000</td><td>~$0.005</td></tr>
                    <tr><td>Claude (factors)</td><td>~200</td><td>~$0.015</td></tr>
                    <tr><td>Gemini (synthesis)</td><td>~2,000</td><td>~$0.003</td></tr>
                    <tr><td>Claude (prediction)</td><td>~500</td><td>~$0.038</td></tr>
                    <tr><td><strong>Total AI</strong></td><td></td><td><strong>~$0.06</strong></td></tr>
                  </tbody>
                </table>

                <h3>Monthly Infrastructure (Estimated)</h3>
                <table>
                  <thead>
                    <tr><th>Service</th><th>Usage</th><th>Cost</th></tr>
                  </thead>
                  <tbody>
                    <tr><td>Lambda</td><td>~1000 invocations</td><td>~$0.50</td></tr>
                    <tr><td>API Gateway</td><td>~1000 requests</td><td>~$0.01</td></tr>
                    <tr><td>DynamoDB</td><td>Pay per request</td><td>~$0.01</td></tr>
                    <tr><td>S3</td><td>Minimal storage</td><td>~$0.01</td></tr>
                    <tr><td>Secrets Manager</td><td>4 secrets</td><td>~$1.60</td></tr>
                    <tr><td>Vercel</td><td>Hobby tier</td><td>$0</td></tr>
                    <tr><td><strong>Total Infra</strong></td><td></td><td><strong>~$2-3</strong></td></tr>
                  </tbody>
                </table>

                <h3>Total Monthly Estimate</h3>
                <div className="my-6 p-6 rounded-xl bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20">
                  <div className="text-3xl font-bold text-emerald-400 mb-2">$10-25/month</div>
                  <div className="text-sm text-white/50">
                    Assuming ~100-300 analyses per month. Scales linearly with usage.
                  </div>
                </div>

                <h3>Cost Optimization Decisions</h3>
                <ul>
                  <li><strong>DynamoDB PAY_PER_REQUEST</strong> — No idle costs, perfect for variable traffic</li>
                  <li><strong>Lambda over EC2</strong> — Only pay when code runs</li>
                  <li><strong>Gemini for high-token tasks</strong> — 10x cheaper than Claude for summarization</li>
                  <li><strong>Claude for critical reasoning</strong> — Worth the premium for predictions</li>
                  <li><strong>Vercel free tier</strong> — More than enough for this traffic level</li>
                </ul>
              </div>
            </section>

            {/* Tech Decisions */}
            <section id="decisions" className="scroll-mt-24">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="text-3xl">🧠</span> Tech Decisions
              </h2>
              <div className="prose-custom">
                <h3>Why Next.js 16?</h3>
                <ul>
                  <li>App Router for modern React patterns</li>
                  <li>Server components reduce client bundle</li>
                  <li>Built-in API routes for proxy</li>
                  <li>Excellent Vercel integration</li>
                  <li>TypeScript first-class support</li>
                </ul>

                <h3>Why AWS Lambda over alternatives?</h3>
                <table>
                  <thead>
                    <tr><th>Option</th><th>Rejected Because</th></tr>
                  </thead>
                  <tbody>
                    <tr><td>EC2</td><td>Always-on cost, management overhead</td></tr>
                    <tr><td>Vercel Functions</td><td>10s timeout too short for AI</td></tr>
                    <tr><td>Cloudflare Workers</td><td>Limited Python support, no DynamoDB</td></tr>
                    <tr><td>Google Cloud Run</td><td>More complex setup, less AWS integration</td></tr>
                  </tbody>
                </table>
                <p>Lambda won because: 15-minute timeout, Python support, native DynamoDB/S3 access, SAM for IaC.</p>

                <h3>Why DynamoDB over PostgreSQL?</h3>
                <ul>
                  <li>No schema migrations needed</li>
                  <li>Scales automatically without tuning</li>
                  <li>Pay-per-request eliminates idle costs</li>
                  <li>Document model fits our JSON-heavy data</li>
                  <li>We don&apos;t need relational queries or joins</li>
                </ul>

                <h3>Why Tailwind CSS v4?</h3>
                <ul>
                  <li>Utility-first speeds up development</li>
                  <li>No context switching between files</li>
                  <li>Easy dark mode with opacity utilities</li>
                  <li>Purges unused CSS for tiny bundles</li>
                </ul>

                <h3>Why Frontend-Controlled Pipeline?</h3>
                <p>The backend could make its own decisions about models, prompts, and processing. We chose frontend control because:</p>
                <ul>
                  <li><strong>Transparency</strong> — User sees exactly what will happen</li>
                  <li><strong>Reproducibility</strong> — Same config = same process</li>
                  <li><strong>Flexibility</strong> — Change prompts without deploy</li>
                  <li><strong>Iteration</strong> — Test different approaches easily</li>
                  <li><strong>Auditability</strong> — Full config stored with each job</li>
                </ul>

                <h3>Why HTTP-only Cookies over JWT?</h3>
                <ul>
                  <li>Simpler implementation</li>
                  <li>Can&apos;t be stolen via XSS (httpOnly)</li>
                  <li>Auto-sent with requests (no header management)</li>
                  <li>Server controls expiry</li>
                  <li>Good enough for simple password protection</li>
                </ul>

                <h3>Why Single POST Endpoint?</h3>
                <ul>
                  <li>One CORS config to manage</li>
                  <li>Flexible payload structures per operation</li>
                  <li>Cheaper (fewer API Gateway routes)</li>
                  <li>Easier to add new operations</li>
                  <li>All operations documented in one place</li>
                </ul>

                <h3>What Would We Do Differently?</h3>
                <ul>
                  <li><strong>Add API key auth</strong> — Protect Lambda from direct access</li>
                  <li><strong>Use Zod for validation</strong> — Runtime type safety on API payloads</li>
                  <li><strong>Add retry logic</strong> — AI APIs occasionally fail</li>
                  <li><strong>Implement caching</strong> — News/econ data don&apos;t change hourly</li>
                  <li><strong>Add monitoring</strong> — CloudWatch dashboards, alerts</li>
                </ul>
              </div>
            </section>

          </div>

          {/* Footer */}
          <div className="mt-20 pt-10 border-t border-white/5 text-center">
            <p className="text-white/30 text-sm mb-4">
              Built December 2025 • Updated {new Date().toLocaleDateString()}
            </p>
            <Link 
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-500 to-amber-500 text-white text-sm font-medium hover:opacity-90 transition"
            >
              ← Back to App
            </Link>
          </div>
        </div>
      </main>

      {/* Styles for prose */}
      <style jsx global>{`
        .prose-custom p {
          color: rgba(255, 255, 255, 0.6);
          line-height: 1.7;
          margin-bottom: 1rem;
        }
        .prose-custom strong {
          color: white;
        }
        .prose-custom h3 {
          color: white;
          font-size: 1.125rem;
          font-weight: 600;
          margin-top: 2rem;
          margin-bottom: 0.75rem;
        }
        .prose-custom h4 {
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.875rem;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
        }
        .prose-custom ul, .prose-custom ol {
          color: rgba(255, 255, 255, 0.6);
          margin-bottom: 1rem;
          padding-left: 1.5rem;
        }
        .prose-custom li {
          margin-bottom: 0.5rem;
        }
        .prose-custom code {
          background: rgba(255, 255, 255, 0.1);
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
          font-size: 0.875rem;
          color: #f97316;
        }
        .prose-custom pre code {
          background: transparent;
          padding: 0;
        }
        .prose-custom table {
          width: 100%;
          border-collapse: collapse;
          margin: 1rem 0;
        }
        .prose-custom th, .prose-custom td {
          text-align: left;
          padding: 0.75rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        .prose-custom th {
          color: rgba(255, 255, 255, 0.4);
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .prose-custom td {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.875rem;
        }
      `}</style>
    </div>
  );
}

