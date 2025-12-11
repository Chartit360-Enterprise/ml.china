"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Navbar } from "@/components/Navbar";

interface SavedPrompt {
  prompt_id: string;
  name: string;
  system: string;
  user: string;
  created_at?: string;
}

interface PipelineNode {
  id: string;
  name: string;
  description: string;
  type: "data_fetch" | "ai_process";
  icon: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  promptSystem?: string;
  promptUser?: string;
  selectedPromptId?: string;
  confirmed: boolean;
  expanded: boolean;
  config?: Record<string, unknown>;
}

// Get current date for prompts
const getCurrentDate = () => {
  const now = new Date();
  return {
    full: now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
    year: now.getFullYear(),
    month: now.toLocaleDateString('en-US', { month: 'long' }),
    quarter: `Q${Math.ceil((now.getMonth() + 1) / 3)}`,
  };
};

const DEFAULT_PIPELINE: PipelineNode[] = [
  {
    id: "news_fetch",
    name: "News Collection",
    description: "Gathers recent news articles about China's economy from multiple sources",
    type: "data_fetch",
    icon: "📰",
    confirmed: false,
    expanded: false,
    config: { 
      keywords: [
        "China GDP growth 2025",
        "China economic outlook",
        "PBOC monetary policy",
        "China manufacturing PMI",
        "China property market",
        "China trade surplus deficit",
        "China consumer spending",
        "China infrastructure investment",
        "RMB yuan exchange rate",
        "China tech sector regulation"
      ], 
      time_period_days: 14, 
      max_articles: 50 
    },
  },
  {
    id: "economic_data",
    name: "Economic Data",
    description: "Fetches official economic indicators like GDP, PMI, and trade data",
    type: "data_fetch",
    icon: "📊",
    confirmed: false,
    expanded: false,
    config: { 
      indicators: [
        "GDP Growth Rate",
        "Manufacturing PMI",
        "Services PMI", 
        "Trade Balance",
        "CPI Inflation",
        "PPI",
        "Industrial Production",
        "Retail Sales",
        "Fixed Asset Investment",
        "Unemployment Rate"
      ] 
    },
  },
  {
    id: "sentiment_analysis",
    name: "Sentiment Analysis",
    description: "AI analyzes the collected news to determine overall market sentiment",
    type: "ai_process",
    icon: "🎭",
    model: "gemini-3-pro-preview",
    temperature: 0.3,
    maxTokens: 8000,
    promptSystem: `You are an expert economic analyst specializing in China's economy. Today's date is ${getCurrentDate().full}. You provide rigorous, data-driven analysis.`,
    promptUser: `Analyze the sentiment and implications of these recent news articles about China's economy.

NEWS ARTICLES:
{news}

Provide a comprehensive sentiment analysis in JSON format:
{
  "analysis_date": "${getCurrentDate().full}",
  "overall_sentiment": {
    "score": <float from -1 to 1>,
    "label": "<very bearish/bearish/neutral/bullish/very bullish>",
    "confidence": "<low/medium/high>"
  },
  "key_themes": [
    {"theme": "<theme>", "sentiment": "<positive/negative/neutral>", "importance": "<high/medium/low>"}
  ],
  "market_implications": {
    "short_term": "<1-3 month outlook>",
    "medium_term": "<3-12 month outlook>"
  },
  "key_quotes": ["<important quotes from articles>"],
  "data_quality": {
    "article_count": <number>,
    "relevance_score": <0-100>,
    "date_range": "<date range of articles>"
  }
}`,
    confirmed: false,
    expanded: false,
  },
  {
    id: "factor_extraction",
    name: "Factor Extraction",
    description: "AI identifies key factors that could impact GDP growth",
    type: "ai_process",
    icon: "🔍",
    model: "claude-opus-4.5",
    temperature: 0.2,
    maxTokens: 8000,
    promptSystem: `You are a senior economist at a major investment bank, specializing in China macro analysis. Today is ${getCurrentDate().full}. You identify and quantify economic drivers with precision.`,
    promptUser: `Based on the following news about China's economy, identify and analyze ALL factors that could impact GDP growth in ${getCurrentDate().year} and ${getCurrentDate().year + 1}.

NEWS DATA:
{news}

Provide a detailed factor analysis in JSON format:
{
  "analysis_date": "${getCurrentDate().full}",
  "factors": [
    {
      "name": "<factor name>",
      "category": "<fiscal/monetary/trade/property/consumption/investment/external/regulatory>",
      "direction": "<positive/negative/neutral>",
      "magnitude": "<high/medium/low>",
      "gdp_impact_bps": <estimated basis points impact on GDP>,
      "confidence": "<high/medium/low>",
      "time_horizon": "<immediate/short-term/medium-term>",
      "description": "<detailed explanation>",
      "data_points": ["<supporting evidence from news>"]
    }
  ],
  "net_gdp_impact": {
    "total_positive_bps": <sum of positive impacts>,
    "total_negative_bps": <sum of negative impacts>,
    "net_impact_bps": <net effect>
  },
  "structural_vs_cyclical": {
    "structural_factors": ["<long-term structural issues>"],
    "cyclical_factors": ["<short-term cyclical factors>"]
  }
}`,
    confirmed: false,
    expanded: false,
  },
  {
    id: "synthesis",
    name: "Data Synthesis",
    description: "AI combines all analyses into a comprehensive economic assessment",
    type: "ai_process",
    icon: "🧬",
    model: "gemini-3-pro-preview",
    temperature: 0.4,
    maxTokens: 16000,
    promptSystem: `You are the Chief Economist preparing a comprehensive China outlook report. Today is ${getCurrentDate().full}. Synthesize all available data into actionable insights.`,
    promptUser: `Synthesize the following inputs into a comprehensive China economic assessment report.

SENTIMENT ANALYSIS:
{sentiment_analysis}

FACTOR ANALYSIS:
{factor_extraction}

ECONOMIC INDICATORS:
{economic_data}

Create a comprehensive synthesis report in JSON format:
{
  "report_date": "${getCurrentDate().full}",
  "executive_summary": "<2-3 paragraph executive summary>",
  "economic_health_score": <1-100 score>,
  "growth_trajectory": "<accelerating/stable/decelerating/contracting>",
  
  "key_findings": [
    {"finding": "<key finding>", "implication": "<what it means for GDP>", "confidence": "<high/medium/low>"}
  ],
  
  "scenario_analysis": {
    "base_case": {
      "probability": <percent>,
      "gdp_growth": "<expected growth>",
      "description": "<scenario description>",
      "key_assumptions": ["<assumptions>"]
    },
    "bull_case": {
      "probability": <percent>,
      "gdp_growth": "<upside growth>",
      "description": "<what would need to happen>",
      "catalysts": ["<positive catalysts>"]
    },
    "bear_case": {
      "probability": <percent>,
      "gdp_growth": "<downside growth>",
      "description": "<risk scenario>",
      "triggers": ["<negative triggers>"]
    }
  },
  
  "risk_matrix": [
    {"risk": "<risk>", "probability": "<high/medium/low>", "impact": "<high/medium/low>", "mitigation": "<how China might address>"}
  ],
  
  "policy_outlook": {
    "monetary_policy": "<expected PBOC actions>",
    "fiscal_policy": "<expected government spending/stimulus>",
    "regulatory": "<key regulatory changes expected>"
  },
  
  "sector_impacts": {
    "winners": ["<sectors that will benefit>"],
    "losers": ["<sectors that will struggle>"]
  }
}`,
    confirmed: false,
    expanded: false,
  },
  {
    id: "prediction",
    name: "GDP Prediction",
    description: "AI generates quarterly GDP growth predictions with confidence intervals",
    type: "ai_process",
    icon: "🎯",
    model: "claude-opus-4.5",
    temperature: 0.3,
    maxTokens: 8000,
    promptSystem: `You are a quantitative economist at a top-tier research firm. Today is ${getCurrentDate().full}. You make precise, well-reasoned GDP forecasts backed by data.`,
    promptUser: `Based on this comprehensive analysis, generate detailed GDP growth predictions for China.

SYNTHESIS REPORT:
{synthesis}

Provide your GDP forecast in this exact JSON format:
{
  "forecast_date": "${getCurrentDate().full}",
  "methodology": "<brief description of forecasting approach>",
  
  "quarterly_forecasts": {
    "Q1_${getCurrentDate().year}": {
      "gdp_growth_yoy": <year-over-year growth percent>,
      "gdp_growth_qoq_saar": <quarter-over-quarter seasonally adjusted annualized>,
      "confidence_interval": {"low": <>, "high": <>},
      "key_drivers": ["<main growth drivers>"],
      "key_risks": ["<main risks>"],
      "commentary": "<brief quarter outlook>"
    },
    "Q2_${getCurrentDate().year}": { <same structure> },
    "Q3_${getCurrentDate().year}": { <same structure> },
    "Q4_${getCurrentDate().year}": { <same structure> }
  },
  
  "annual_forecast": {
    "year": ${getCurrentDate().year},
    "gdp_growth": <full year growth>,
    "confidence_interval": {"low": <>, "high": <>},
    "comparison_to_consensus": "<above/in-line/below IMF/World Bank forecasts>",
    "revision_from_prior": "<if applicable, change from prior forecast>"
  },
  
  "forward_guidance": {
    "next_year_preliminary": <${getCurrentDate().year + 1} early estimate>,
    "medium_term_trajectory": "<3-5 year growth path>",
    "structural_growth_rate": "<China's potential GDP growth>"
  },
  
  "model_inputs": {
    "base_effects": "<impact of prior year base>",
    "policy_assumptions": ["<key policy assumptions>"],
    "external_assumptions": ["<global economy assumptions>"]
  },
  
  "investment_implications": {
    "asset_class_views": {
      "china_equities": "<bullish/neutral/bearish>",
      "china_bonds": "<view>",
      "rmb_currency": "<view>"
    },
    "sector_recommendations": ["<top sectors>"],
    "risk_factors_to_monitor": ["<key things to watch>"]
  }
}`,
    confirmed: false,
    expanded: false,
  },
];

export default function AnalyzePage() {
  const router = useRouter();
  const [pipeline, setPipeline] = useState<PipelineNode[]>(DEFAULT_PIPELINE);
  const [models, setModels] = useState<string[]>([]);
  const [savedPrompts, setSavedPrompts] = useState<SavedPrompt[]>([]);
  const [running, setRunning] = useState(false);
  const [showHelp, setShowHelp] = useState(true);
  const [showPromptPicker, setShowPromptPicker] = useState<string | null>(null);
  const [savingPrompt, setSavingPrompt] = useState<string | null>(null);
  const [newPromptName, setNewPromptName] = useState("");
  const [saveStatus, setSaveStatus] = useState<{ node: string; status: "saving" | "saved" | "error"; message?: string } | null>(null);
  const [status, setStatus] = useState<{ status?: string; supported_models?: string[] } | null>(null);

  useEffect(() => {
    api.status().then(setStatus);
    api.listModels().then((r) => setModels(Object.keys(r.models || {})));
    api.listPrompts().then((r) => setSavedPrompts(r.prompts || []));
  }, []);

  const allConfirmed = pipeline.every((n) => n.confirmed);
  const confirmedCount = pipeline.filter((n) => n.confirmed).length;

  const toggleExpand = (id: string) => {
    setPipeline((prev) => prev.map((n) => n.id === id ? { ...n, expanded: !n.expanded } : n));
  };

  const updateNode = (id: string, updates: Partial<PipelineNode>) => {
    setPipeline((prev) => prev.map((n) => n.id === id ? { ...n, ...updates } : n));
  };

  const confirmNode = (id: string) => {
    setPipeline((prev) => prev.map((n) => n.id === id ? { ...n, confirmed: true, expanded: false } : n));
  };

  const selectPrompt = (nodeId: string, prompt: SavedPrompt) => {
    updateNode(nodeId, {
      promptSystem: prompt.system,
      promptUser: prompt.user,
      selectedPromptId: prompt.prompt_id,
      confirmed: false,
    });
    setShowPromptPicker(null);
  };

  const saveCurrentPrompt = async (nodeId: string) => {
    const node = pipeline.find((n) => n.id === nodeId);
    if (!node || !newPromptName.trim()) return;
    
    setSaveStatus({ node: nodeId, status: "saving" });
    
    const prompt = {
      prompt_id: `${nodeId}_${Date.now()}`,
      name: newPromptName.trim(),
      system: node.promptSystem || "",
      user: node.promptUser || "",
      node_type: nodeId,
    };
    
    try {
      const res = await api.savePrompt(prompt);
      if (res.success) {
        setSavedPrompts((prev) => [...prev, { ...prompt, created_at: new Date().toISOString() }]);
        updateNode(nodeId, { selectedPromptId: prompt.prompt_id });
        setSaveStatus({ node: nodeId, status: "saved", message: `Saved as "${newPromptName}"` });
        setNewPromptName("");
        setTimeout(() => setSaveStatus(null), 3000);
      } else {
        setSaveStatus({ node: nodeId, status: "error", message: res.error || "Failed to save" });
      }
    } catch (e) {
      setSaveStatus({ node: nodeId, status: "error", message: String(e) });
    }
    
    setSavingPrompt(null);
  };

  const [fetchingData, setFetchingData] = useState(false);
  const [realData, setRealData] = useState<{ summary?: string; news?: unknown; fred?: unknown; metals?: unknown } | null>(null);

  const runAnalysis = async () => {
    setRunning(true);
    setFetchingData(true);

    // Step 1: Fetch real data from our APIs
    let dataContext = "";
    try {
      const dataRes = await fetch("/api/data/all");
      const data = await dataRes.json();
      if (data.success && data.summary) {
        dataContext = data.summary;
        setRealData(data.data);
      }
    } catch (e) {
      console.error("Failed to fetch real data:", e);
    }
    setFetchingData(false);

    // Step 2: Inject real data into prompts
    const enhancedPipeline = pipeline.map((node) => {
      if (node.type === "ai_process" && dataContext) {
        // Add real data context to each AI prompt
        const enhancedPromptUser = node.promptUser + `\n\n---\nREAL-TIME DATA CONTEXT:\n${dataContext}`;
        return { ...node, promptUser: enhancedPromptUser };
      }
      return node;
    });

    const plan = {
      name: `Analysis ${new Date().toLocaleDateString()}`,
      nodes: enhancedPipeline.map((node, idx) => ({
        id: node.id,
        type: node.type,
        order: idx + 1,
        ...(node.model && { model: node.model }),
        ...(node.temperature !== undefined && { temperature: node.temperature }),
        ...(node.maxTokens && { max_tokens: node.maxTokens }),
        ...(node.type === "ai_process" && { prompt_id: node.id }),
        ...(node.config && { config: node.config }),
        ...(node.type === "ai_process" && {
          input_from: node.id === "sentiment_analysis" || node.id === "factor_extraction" 
            ? ["news_fetch"] 
            : node.id === "synthesis" 
              ? ["sentiment_analysis", "factor_extraction", "economic_data"]
              : ["synthesis"]
        }),
      })),
      prompts: Object.fromEntries(
        enhancedPipeline.filter((n) => n.type === "ai_process").map((n) => [n.id, { system: n.promptSystem, user: n.promptUser }])
      ),
      // Include real data in plan metadata
      real_data: realData ? {
        fetched_at: new Date().toISOString(),
        has_news: !!realData.news,
        has_fred: !!realData.fred,
        has_metals: !!realData.metals,
      } : null,
    };
    
    // Fire the job creation request - don't wait for response (avoids Vercel timeout)
    const endpoint = "/api/proxy";
    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ operation: "create_job", plan, execute: true }),
      keepalive: true,
    }).catch(() => {}); // Ignore errors - we're navigating away
    
    // Navigate immediately to jobs list - polling will pick up the job
    router.push(`/jobs?submitted=true`);
  };

  const getPromptsForNode = (nodeId: string) => {
    return savedPrompts.filter((p) => 
      p.prompt_id.startsWith(nodeId) || 
      (p as SavedPrompt & { node_type?: string }).node_type === nodeId
    );
  };

  return (
    <div className="min-h-screen bg-[#06060a] text-white">
      <Navbar status={status?.status} models={status?.supported_models} />

      <main className="max-w-2xl mx-auto px-6 pt-28 pb-32">
        {/* Header with Help Toggle */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold mb-1">Configure Analysis</h1>
            <p className="text-white/40 text-sm">Set up your GDP analysis pipeline</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowHelp(!showHelp)}
              className={`px-3 py-1.5 rounded-lg text-xs transition ${
                showHelp ? "bg-blue-500/20 text-blue-400" : "bg-white/5 text-white/40"
              }`}
            >
              {showHelp ? "? Hide Help" : "? Show Help"}
            </button>
            <div className="text-right">
              <div className="text-xl font-bold text-white">{confirmedCount}<span className="text-white/30">/{pipeline.length}</span></div>
              <div className="text-[10px] text-white/30">Ready</div>
            </div>
          </div>
        </div>

        {/* Help Banner */}
        {showHelp && (
          <div className="mb-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-start gap-3">
              <span className="text-blue-400 text-lg">💡</span>
              <div className="text-sm">
                <p className="text-blue-300 font-medium mb-2">How this works:</p>
                <ol className="text-white/60 space-y-1 list-decimal list-inside">
                  <li><strong>Expand</strong> each step by clicking on it</li>
                  <li><strong>Review</strong> the settings and customize if needed</li>
                  <li><strong>Confirm</strong> each step when you&apos;re satisfied</li>
                  <li>Once all 6 steps are confirmed, click <strong>Run Analysis</strong></li>
                </ol>
                <p className="text-white/40 mt-2 text-xs">Your custom prompts are automatically saved to the database for reuse.</p>
              </div>
            </div>
          </div>
        )}

        {/* Pipeline Steps */}
        <div className="space-y-2">
          {pipeline.map((node, idx) => (
            <div key={node.id} className={`rounded-xl border transition-all duration-300 ${
              node.confirmed ? "bg-emerald-500/5 border-emerald-500/20" : "bg-white/[0.02] border-white/5"
            }`}>
              {/* Header */}
              <button
                onClick={() => toggleExpand(node.id)}
                className="w-full px-4 py-3 flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white/30 w-4">{idx + 1}</span>
                    <span className="text-lg">{node.icon}</span>
                  </div>
                  <div>
                    <span className="font-medium">{node.name}</span>
                    {showHelp && (
                      <p className="text-xs text-white/40 mt-0.5">{node.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {node.model && <span className="text-xs text-white/30 font-mono hidden sm:inline">{node.model}</span>}
                  {node.selectedPromptId && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400">Custom</span>
                  )}
                  {node.confirmed && <span className="text-emerald-400 text-sm">✓</span>}
                  <span className="text-white/30 text-sm ml-1">{node.expanded ? "−" : "+"}</span>
                </div>
              </button>

              {/* Expanded Content */}
              {node.expanded && (
                <div className="px-4 pb-4 pt-2 border-t border-white/5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                  
                  {/* Step Help */}
                  {showHelp && (
                    <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                      <p className="text-xs text-white/50">
                        {node.type === "data_fetch" 
                          ? "This step collects data from external sources. Adjust the parameters below to control what data is fetched."
                          : "This step uses AI to process data. You can choose the model, adjust creativity (temperature), and customize the instructions (prompts)."}
                      </p>
                    </div>
                  )}

                  {/* Data Fetch Config */}
                  {node.type === "data_fetch" && node.id === "news_fetch" && (
                    <>
                      <div>
                        <label className="text-xs text-white/40 mb-1 block">
                          Search Keywords
                          {showHelp && <span className="text-white/30 ml-2">— Topics to search for in news</span>}
                        </label>
                        <input
                          type="text"
                          value={(node.config?.keywords as string[])?.join(", ") || ""}
                          onChange={(e) => updateNode(node.id, { 
                            config: { ...node.config, keywords: e.target.value.split(",").map(s => s.trim()) },
                            confirmed: false 
                          })}
                          className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-sm focus:border-blue-500/50 focus:outline-none transition"
                          placeholder="China GDP, PBOC, China economy..."
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-white/40 mb-1 block">
                            Time Period
                            {showHelp && <span className="text-white/30 ml-1">— Days back</span>}
                          </label>
                          <input
                            type="number"
                            value={node.config?.time_period_days as number}
                            onChange={(e) => updateNode(node.id, { config: { ...node.config, time_period_days: parseInt(e.target.value) }, confirmed: false })}
                            className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-sm focus:border-blue-500/50 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-white/40 mb-1 block">
                            Max Articles
                            {showHelp && <span className="text-white/30 ml-1">— Limit</span>}
                          </label>
                          <input
                            type="number"
                            value={node.config?.max_articles as number}
                            onChange={(e) => updateNode(node.id, { config: { ...node.config, max_articles: parseInt(e.target.value) }, confirmed: false })}
                            className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-sm focus:border-blue-500/50 focus:outline-none"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {node.type === "data_fetch" && node.id === "economic_data" && (
                    <div>
                      <label className="text-xs text-white/40 mb-2 block">
                        Economic Indicators
                        {showHelp && <span className="text-white/30 ml-2">— Select which data to fetch</span>}
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {["GDP Growth", "PMI", "Trade Balance", "CPI", "Industrial Production", "Retail Sales"].map((ind) => {
                          const selected = (node.config?.indicators as string[])?.includes(ind);
                          return (
                            <button
                              key={ind}
                              onClick={() => {
                                const current = (node.config?.indicators as string[]) || [];
                                const updated = selected ? current.filter(i => i !== ind) : [...current, ind];
                                updateNode(node.id, { config: { ...node.config, indicators: updated }, confirmed: false });
                              }}
                              className={`px-3 py-1.5 rounded-lg text-xs transition ${
                                selected ? "bg-white/10 text-white" : "bg-white/5 text-white/40 hover:text-white/60"
                              }`}
                            >
                              {selected && "✓ "}{ind}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* AI Process Config */}
                  {node.type === "ai_process" && (
                    <>
                      {/* Model Selection */}
                      <div>
                        <label className="text-xs text-white/40 mb-1 block">
                          AI Model
                          {showHelp && <span className="text-white/30 ml-2">— Which AI to use for this step</span>}
                        </label>
                        <div className="flex gap-2">
                          {models.map((m) => (
                            <button
                              key={m}
                              onClick={() => updateNode(node.id, { model: m, confirmed: false })}
                              className={`flex-1 px-3 py-2 rounded-lg text-xs font-mono transition ${
                                node.model === m ? "bg-white/10 text-white ring-1 ring-white/20" : "bg-white/5 text-white/40 hover:text-white/60"
                              }`}
                            >
                              {m}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Temperature & Tokens */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-white/40 mb-1 block">
                            Temperature: {node.temperature}
                            {showHelp && <span className="text-white/30 ml-1">— Creativity</span>}
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={node.temperature}
                            onChange={(e) => updateNode(node.id, { temperature: parseFloat(e.target.value), confirmed: false })}
                            className="w-full accent-blue-500"
                          />
                          {showHelp && (
                            <div className="flex justify-between text-[10px] text-white/20 mt-1">
                              <span>Precise</span>
                              <span>Creative</span>
                            </div>
                          )}
                        </div>
                        <div>
                          <label className="text-xs text-white/40 mb-1 block">
                            Max Tokens
                            {showHelp && <span className="text-white/30 ml-1">— Response length</span>}
                          </label>
                          <input
                            type="number"
                            value={node.maxTokens}
                            onChange={(e) => updateNode(node.id, { maxTokens: parseInt(e.target.value), confirmed: false })}
                            className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-sm focus:border-blue-500/50 focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Prompt Section */}
                      <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-xs text-blue-400 font-medium">
                            Custom Instructions
                            {showHelp && <span className="text-blue-400/50 ml-2">— Tell the AI what to do</span>}
                          </label>
                          {getPromptsForNode(node.id).length > 0 && (
                            <button
                              onClick={() => setShowPromptPicker(showPromptPicker === node.id ? null : node.id)}
                              className="text-xs text-blue-400 hover:underline"
                            >
                              📚 Load saved ({getPromptsForNode(node.id).length})
                            </button>
                          )}
                        </div>

                        {/* Saved Prompts Picker */}
                        {showPromptPicker === node.id && (
                          <div className="mb-3 p-2 rounded-lg bg-black/20 space-y-1 max-h-32 overflow-y-auto animate-in fade-in duration-200">
                            {getPromptsForNode(node.id).map((p) => (
                              <button
                                key={p.prompt_id}
                                onClick={() => selectPrompt(node.id, p)}
                                className={`w-full text-left px-2 py-1.5 rounded text-xs hover:bg-white/5 transition flex items-center justify-between ${
                                  node.selectedPromptId === p.prompt_id ? "bg-blue-500/20 text-blue-400" : "text-white/60"
                                }`}
                              >
                                <span>{p.name}</span>
                                {node.selectedPromptId === p.prompt_id && <span>✓</span>}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* System Prompt */}
                        <div className="mb-3">
                          <label className="text-xs text-white/30 mb-1 block">
                            System Prompt
                            {showHelp && <span className="text-white/20 ml-1">— AI&apos;s role/persona</span>}
                          </label>
                          <textarea
                            value={node.promptSystem}
                            onChange={(e) => updateNode(node.id, { promptSystem: e.target.value, confirmed: false, selectedPromptId: undefined })}
                            rows={2}
                            className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-sm font-mono resize-none focus:border-blue-500/50 focus:outline-none"
                          />
                        </div>

                        {/* User Prompt */}
                        <div className="mb-3">
                          <label className="text-xs text-white/30 mb-1 block">
                            Instructions
                            {showHelp && <span className="text-white/20 ml-1">— Use {"{variable}"} for data from previous steps</span>}
                          </label>
                          <textarea
                            value={node.promptUser}
                            onChange={(e) => updateNode(node.id, { promptUser: e.target.value, confirmed: false, selectedPromptId: undefined })}
                            rows={4}
                            className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-sm font-mono resize-none focus:border-blue-500/50 focus:outline-none"
                          />
                        </div>

                        {/* Save Prompt */}
                        <div className="flex gap-2 items-center">
                          <input
                            type="text"
                            value={savingPrompt === node.id ? newPromptName : ""}
                            onChange={(e) => {
                              setSavingPrompt(node.id);
                              setNewPromptName(e.target.value);
                            }}
                            onFocus={() => setSavingPrompt(node.id)}
                            placeholder="Name to save this prompt..."
                            className="flex-1 px-2 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs focus:border-blue-500/50 focus:outline-none"
                          />
                          <button
                            onClick={() => saveCurrentPrompt(node.id)}
                            disabled={!newPromptName.trim() || savingPrompt !== node.id || saveStatus?.status === "saving"}
                            className="px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-400 text-xs hover:bg-blue-500/30 disabled:opacity-30 transition flex items-center gap-1"
                          >
                            {saveStatus?.node === node.id && saveStatus.status === "saving" ? (
                              <>
                                <span className="w-3 h-3 border border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />
                                Saving...
                              </>
                            ) : (
                              <>💾 Save</>
                            )}
                          </button>
                        </div>

                        {/* Save Status */}
                        {saveStatus?.node === node.id && saveStatus.status !== "saving" && (
                          <div className={`mt-2 text-xs ${saveStatus.status === "saved" ? "text-emerald-400" : "text-red-400"}`}>
                            {saveStatus.status === "saved" ? "✓" : "✗"} {saveStatus.message}
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {/* Confirm Button */}
                  <button
                    onClick={() => confirmNode(node.id)}
                    className={`w-full py-2.5 rounded-lg text-sm font-medium transition ${
                      node.confirmed 
                        ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30" 
                        : "bg-white/10 text-white hover:bg-white/15"
                    }`}
                  >
                    {node.confirmed ? "✓ Confirmed — Click to Update" : "Confirm This Step"}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#06060a]/95 backdrop-blur-xl border-t border-white/5">
        <div className="max-w-2xl mx-auto">
          {showHelp && !allConfirmed && (
            <p className="text-xs text-white/30 text-center mb-2">
              {pipeline.filter(n => !n.confirmed).length} step{pipeline.filter(n => !n.confirmed).length > 1 ? "s" : ""} remaining: {pipeline.filter(n => !n.confirmed).map(n => n.name).join(", ")}
            </p>
          )}
          <button
            onClick={runAnalysis}
            disabled={!allConfirmed || running}
            className={`w-full py-3 rounded-xl font-medium transition ${
              allConfirmed
                ? "bg-gradient-to-r from-red-500 to-amber-500 text-white hover:opacity-90"
                : "bg-white/5 text-white/30 cursor-not-allowed"
            }`}
          >
            {running ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {fetchingData ? "📡 Fetching Real-Time Data..." : "🚀 Starting Analysis..."}
              </span>
            ) : allConfirmed ? (
              "🚀 Run Analysis (with Live Data)"
            ) : (
              `Confirm all ${pipeline.length} steps to run`
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
