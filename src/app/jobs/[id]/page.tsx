"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Navbar } from "@/components/Navbar";

interface NodeOutput {
  content: string;
  model?: string;
  tokens?: number;
  error?: string;
}

interface JobResult {
  node_outputs?: Record<string, NodeOutput>;
  execution_time_ms?: number;
  total_cost_usd?: number;
}

interface Job {
  job_id: string;
  status: string;
  created_at?: string;
  result?: JobResult;
  config?: {
    name?: string;
    nodes?: Array<{ id: string; type: string; model?: string }>;
  };
}

interface ParsedPrediction {
  quarterly_forecasts?: Array<{quarter?: string; growth?: number; confidence?: string}>;
  gdp_growth?: number;
  trend?: string;
  outlook?: string;
  summary?: string;
  narrative?: string;
  risks?: Array<string | {description?: string}>;
}

interface ParsedFactors {
  factors?: Array<{name?: string; factor?: string; impact?: string; direction?: string}>;
  summary?: string;
  analysis?: string;
}

interface ParsedSentiment {
  score?: number;
  summary?: string;
}

interface ParsedSynthesis {
  executive_summary?: string;
  risks?: Array<string | {description?: string}>;
}

function parseContent<T = Record<string, unknown>>(content: string): T | null {
  try {
    return JSON.parse(content) as T;
  } catch {
    const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[1]) as T;
      } catch {}
    }
    return null;
  }
}

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRaw, setShowRaw] = useState(false);
  const [showHelp, setShowHelp] = useState(true);
  const [status, setStatus] = useState<{ status?: string; supported_models?: string[] } | null>(null);

  useEffect(() => {
    api.status().then(setStatus);
    api.getJob(id).then((res) => {
      setJob(res.job || null);
      setLoading(false);
    });
    
    // Poll if running
    const interval = setInterval(async () => {
      const res = await api.getJob(id);
      if (res.job) {
        setJob(res.job);
        if (res.job.status !== "running") clearInterval(interval);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#06060a] text-white flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-[#06060a] text-white flex flex-col items-center justify-center">
        <div className="text-4xl mb-4">❌</div>
        <div className="text-white/60 mb-4">Job not found</div>
        <Link href="/jobs" className="text-blue-400 hover:underline">← Back to jobs</Link>
      </div>
    );
  }

  const outputs = job.result?.node_outputs || {};
  const prediction = outputs.prediction?.content ? parseContent<ParsedPrediction>(outputs.prediction.content) : null;
  const synthesis = outputs.synthesis?.content ? parseContent<ParsedSynthesis>(outputs.synthesis.content) : null;
  const sentiment = outputs.sentiment_analysis?.content ? parseContent<ParsedSentiment>(outputs.sentiment_analysis.content) : null;
  const factors = outputs.factor_extraction?.content ? parseContent<ParsedFactors>(outputs.factor_extraction.content) : null;

  const isComplete = job.status === "completed";
  const isRunning = job.status === "running";

  return (
    <div className="min-h-screen bg-[#06060a] text-white">
      <Navbar status={status?.status} models={status?.supported_models} />

      <main className="max-w-2xl mx-auto px-6 pt-28 pb-12">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <Link href="/jobs" className="text-xs text-white/30 hover:text-white/60 transition mb-2 inline-block">
              ← Back to history
            </Link>
            <h1 className="text-2xl font-semibold mb-1">Analysis Results</h1>
            <p className="text-sm text-white/40">
              {job.created_at && new Date(job.created_at).toLocaleDateString("en-US", {
                weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit"
              })}
            </p>
          </div>
          <button
            onClick={() => setShowHelp(!showHelp)}
            className={`px-3 py-1.5 rounded-lg text-xs transition ${
              showHelp ? "bg-blue-500/20 text-blue-400" : "bg-white/5 text-white/40"
            }`}
          >
            {showHelp ? "? Hide Help" : "? Help"}
          </button>
        </div>

        {/* Help Banner */}
        {showHelp && (
          <div className="mb-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-start gap-3">
              <span className="text-blue-400 text-lg">💡</span>
              <div className="text-sm">
                <p className="text-blue-300 font-medium mb-2">How to read this:</p>
                <ul className="text-white/60 space-y-1 text-xs">
                  <li>• <strong>GDP Forecast</strong> — The AI&apos;s prediction for China&apos;s quarterly GDP growth</li>
                  <li>• <strong>Trend</strong> — Whether the economy is accelerating, stable, or slowing</li>
                  <li>• <strong>Outlook</strong> — Overall assessment (bullish, neutral, bearish)</li>
                  <li>• <strong>Key Factors</strong> — What&apos;s driving the prediction</li>
                </ul>
                <p className="text-white/40 mt-2 text-xs">All results are saved to the database for future reference.</p>
              </div>
            </div>
          </div>
        )}

        {/* Status */}
        {isRunning ? (
          <div className="mb-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />
            <div>
              <div className="font-medium text-blue-400">Analysis in progress</div>
              <div className="text-xs text-white/40">This usually takes 1-2 minutes. Page will update automatically.</div>
            </div>
          </div>
        ) : job.status === "failed" ? (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
            <div className="font-medium text-red-400 mb-1">Analysis failed</div>
            <div className="text-xs text-white/40">Something went wrong during processing.</div>
          </div>
        ) : null}

        {/* Database saved confirmation */}
        {isComplete && (
          <div className="mb-6 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-xs text-emerald-400">Results saved to database</span>
          </div>
        )}

        {isComplete && (
          <div className="space-y-6">
            {/* Main Prediction Card */}
            {prediction && (
              <div className="p-6 rounded-2xl bg-gradient-to-br from-red-500/10 to-amber-500/10 border border-white/10">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span>🎯</span> GDP Forecast
                </h2>
                
                {/* Quarterly forecasts */}
                {prediction.quarterly_forecasts && prediction.quarterly_forecasts.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                    {prediction.quarterly_forecasts.map((q, i) => (
                      <div key={i} className="p-3 rounded-xl bg-black/20">
                        <div className="text-xs text-white/40 mb-1">{q.quarter || `Q${i+1}`}</div>
                        <div className="text-2xl font-bold">{q.growth ? `${q.growth}%` : "N/A"}</div>
                        {q.confidence && <div className="text-xs text-white/30">{q.confidence}</div>}
                      </div>
                    ))}
                  </div>
                )}

                {/* Single prediction */}
                {prediction.gdp_growth !== undefined && !prediction.quarterly_forecasts && (
                  <div className="text-center p-4">
                    <div className="text-4xl font-bold mb-2">{prediction.gdp_growth}%</div>
                    <div className="text-sm text-white/50">Predicted GDP Growth</div>
                  </div>
                )}

                {/* Trend & Outlook */}
                <div className="flex gap-4 mb-4">
                  {(prediction.trend || prediction.outlook) && (
                    <>
                      {prediction.trend && (
                        <div className="flex-1 p-3 rounded-xl bg-black/20">
                          <div className="text-xs text-white/40 mb-1">Trend</div>
                          <div className="font-medium capitalize">{prediction.trend}</div>
                        </div>
                      )}
                      {prediction.outlook && (
                        <div className="flex-1 p-3 rounded-xl bg-black/20">
                          <div className="text-xs text-white/40 mb-1">Outlook</div>
                          <div className="font-medium capitalize">{prediction.outlook}</div>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Narrative summary */}
                {prediction.summary && (
                  <p className="text-sm text-white/60 leading-relaxed">{prediction.summary}</p>
                )}
                {prediction.narrative && (
                  <p className="text-sm text-white/60 leading-relaxed">{prediction.narrative}</p>
                )}
              </div>
            )}

            {/* Key Factors */}
            {factors && (
              <div className="p-5 rounded-xl bg-white/[0.02] border border-white/5">
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <span>🔍</span> Key Factors
                  {showHelp && <span className="text-xs text-white/30 font-normal ml-2">— What&apos;s influencing GDP</span>}
                </h3>
                {factors.factors && factors.factors.length > 0 ? (
                  <div className="space-y-2">
                    {factors.factors.slice(0, 5).map((f, i) => (
                      <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-black/20">
                        <span className="text-sm">{f.name || f.factor || `Factor ${i+1}`}</span>
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          f.impact === "positive" || f.direction === "up" ? "bg-emerald-500/20 text-emerald-400" :
                          f.impact === "negative" || f.direction === "down" ? "bg-red-500/20 text-red-400" :
                          "bg-white/10 text-white/60"
                        }`}>
                          {f.impact || f.direction || "neutral"}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-white/50">{factors.summary || factors.analysis || "Analysis complete"}</p>
                )}
              </div>
            )}

            {/* Sentiment */}
            {sentiment && (
              <div className="p-5 rounded-xl bg-white/[0.02] border border-white/5">
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <span>🎭</span> Market Sentiment
                  {showHelp && <span className="text-xs text-white/30 font-normal ml-2">— How news affects outlook</span>}
                </h3>
                <div className="flex items-center gap-4">
                  {sentiment.score !== undefined && (
                    <div className="p-3 rounded-xl bg-black/20 text-center">
                      <div className={`text-2xl font-bold ${
                        sentiment.score > 0.3 ? "text-emerald-400" :
                        sentiment.score < -0.3 ? "text-red-400" :
                        "text-amber-400"
                      }`}>
                        {(sentiment.score * 100).toFixed(0)}%
                      </div>
                      <div className="text-xs text-white/40">
                        {sentiment.score > 0.3 ? "Positive" : sentiment.score < -0.3 ? "Negative" : "Neutral"}
                      </div>
                    </div>
                  )}
                  {sentiment.summary && (
                    <p className="text-sm text-white/50 flex-1">{sentiment.summary}</p>
                  )}
                </div>
              </div>
            )}

            {/* Executive Summary from Synthesis */}
            {synthesis && synthesis.executive_summary && (
              <div className="p-5 rounded-xl bg-white/[0.02] border border-white/5">
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <span>📋</span> Executive Summary
                </h3>
                <p className="text-sm text-white/60 leading-relaxed">{synthesis.executive_summary}</p>
              </div>
            )}

            {/* Risks */}
            {(synthesis?.risks || prediction?.risks) && (
              <div className="p-5 rounded-xl bg-red-500/5 border border-red-500/10">
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <span>⚠️</span> Key Risks
                </h3>
                <ul className="space-y-1">
                  {(synthesis?.risks || prediction?.risks || []).slice(0, 4).map((risk, i) => (
                    <li key={i} className="text-sm text-white/50 flex items-start gap-2">
                      <span className="text-red-400">•</span>
                      {typeof risk === "string" ? risk : risk.description || JSON.stringify(risk)}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Pipeline Status */}
            <div className="p-5 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium flex items-center gap-2">
                  <span>⚙️</span> Pipeline Status
                  {showHelp && <span className="text-xs text-white/30 font-normal ml-2">— All 6 steps</span>}
                </h3>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center">
                {["news_fetch", "economic_data", "sentiment_analysis", "factor_extraction", "synthesis", "prediction"].map((node) => {
                  const output = outputs[node];
                  const ok = output && !output.error;
                  return (
                    <div key={node} className={`p-2 rounded-lg ${ok ? "bg-emerald-500/10" : "bg-red-500/10"}`}>
                      <div className={`text-lg ${ok ? "text-emerald-400" : "text-red-400"}`}>{ok ? "✓" : "✗"}</div>
                      <div className="text-[10px] text-white/40 truncate">{node.split("_")[0]}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Show Raw Toggle */}
            <div className="text-center">
              <button
                onClick={() => setShowRaw(!showRaw)}
                className="text-xs text-white/30 hover:text-white/50 transition"
              >
                {showRaw ? "Hide" : "Show"} raw technical data
              </button>
            </div>

            {/* Raw Data (Hidden by default) */}
            {showRaw && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="text-xs text-white/30 text-center">Technical Details (for developers)</div>
                {Object.entries(outputs).map(([node, output]) => (
                  <div key={node} className="p-4 rounded-xl bg-black/40 border border-white/5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono text-white/40">{node}</span>
                      {output.model && <span className="text-xs font-mono text-white/20">{output.model}</span>}
                    </div>
                    <pre className="text-xs text-white/50 overflow-x-auto max-h-40 overflow-y-auto">
                      {output.content?.slice(0, 2000) || output.error || "No content"}
                    </pre>
                  </div>
                ))}
                {job.result?.execution_time_ms && (
                  <div className="text-xs text-white/20 text-center">
                    Execution: {(job.result.execution_time_ms / 1000).toFixed(1)}s
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Back link */}
        <div className="mt-8 text-center">
          <Link href="/analyze" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-500 to-amber-500 text-white text-sm font-medium hover:opacity-90 transition">
            Run New Analysis
          </Link>
        </div>
      </main>
    </div>
  );
}
