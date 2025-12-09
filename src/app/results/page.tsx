"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Navbar } from "@/components/Navbar";

interface Result {
  result_id: string;
  job_id?: string;
  created_at?: string;
  summary?: {
    prediction?: number;
    trend?: string;
    outlook?: string;
  };
  scores?: {
    user_quality_score?: number;
    feedback?: string;
  };
}

export default function ResultsPage() {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [scoring, setScoring] = useState<string | null>(null);
  const [scoreValue, setScoreValue] = useState(5);
  const [feedback, setFeedback] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveResult, setSaveResult] = useState<{ success: boolean; message: string } | null>(null);
  const [showHelp, setShowHelp] = useState(true);
  const [status, setStatus] = useState<{ status?: string; supported_models?: string[] } | null>(null);

  const loadResults = () => {
    api.listResults().then((res) => {
      setResults(res.results || []);
      setLoading(false);
    });
  };

  useEffect(() => {
    api.status().then(setStatus);
    loadResults();
  }, []);

  const submitScore = async () => {
    if (!scoring) return;
    setSaving(true);
    setSaveResult(null);
    
    try {
      const res = await api.scoreResult(scoring, scoreValue, feedback);
      if (res.success) {
        setSaveResult({ success: true, message: "Score saved to database!" });
        setScoring(null);
        loadResults();
        setTimeout(() => setSaveResult(null), 3000);
      } else {
        setSaveResult({ success: false, message: res.error || "Failed to save" });
      }
    } catch (e) {
      setSaveResult({ success: false, message: String(e) });
    }
    
    setSaving(false);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "Unknown date";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) + " at " +
      d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="min-h-screen bg-[#06060a] text-white">
      <Navbar status={status?.status} models={status?.supported_models} />

      <main className="max-w-2xl mx-auto px-6 pt-28 pb-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold mb-1">Results & Scoring</h1>
            <p className="text-sm text-white/40">Rate predictions to improve future analyses</p>
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
                <p className="text-blue-300 font-medium mb-2">Why score results?</p>
                <p className="text-white/60 mb-2">
                  Scoring helps identify which AI configurations perform best. Your feedback is saved to the database
                  and can be used to refine future predictions.
                </p>
                <ul className="text-white/50 space-y-1 text-xs">
                  <li>• <strong>1-3</strong> — Poor prediction, major issues</li>
                  <li>• <strong>4-6</strong> — Acceptable, room for improvement</li>
                  <li>• <strong>7-8</strong> — Good prediction, minor issues</li>
                  <li>• <strong>9-10</strong> — Excellent, highly accurate</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Database Status */}
        <div className="mb-6 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-emerald-400">{results.length} results saved in database</span>
        </div>

        {/* Save Result Toast */}
        {saveResult && (
          <div className={`mb-4 p-3 rounded-lg text-sm animate-in fade-in slide-in-from-top-2 duration-200 ${
            saveResult.success 
              ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-400" 
              : "bg-red-500/20 border border-red-500/30 text-red-400"
          }`}>
            {saveResult.success ? "✓" : "✗"} {saveResult.message}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-4">📈</div>
            <div className="text-white/40 mb-2">No results yet</div>
            <p className="text-xs text-white/30 mb-4">Complete an analysis to see results here</p>
            <Link
              href="/analyze"
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-amber-500 text-white text-sm font-medium inline-block"
            >
              Start an analysis
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {results.map((result) => (
              <div
                key={result.result_id}
                className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-medium text-white/80">{formatDate(result.created_at)}</div>
                    {result.summary?.prediction !== undefined && (
                      <div className="text-sm text-white/40 mt-0.5">
                        Predicted: <span className="text-amber-400">{result.summary.prediction}%</span> GDP growth
                        {result.summary.outlook && <span className="ml-2 capitalize">• {result.summary.outlook}</span>}
                      </div>
                    )}
                  </div>
                  {result.job_id && (
                    <Link
                      href={`/jobs/${result.job_id}`}
                      className="text-xs text-white/30 hover:text-white/60 transition"
                    >
                      View details →
                    </Link>
                  )}
                </div>

                {/* Score Display / Button */}
                <div className="flex items-center gap-3">
                  {result.scores?.user_quality_score !== undefined && result.scores?.user_quality_score !== null ? (
                    <div className="flex items-center gap-2">
                      <div className={`px-3 py-1.5 rounded-lg ${
                        result.scores.user_quality_score >= 7 ? "bg-emerald-500/20 text-emerald-400" :
                        result.scores.user_quality_score >= 4 ? "bg-amber-500/20 text-amber-400" :
                        "bg-red-500/20 text-red-400"
                      }`}>
                        <span className="text-lg font-bold">{result.scores.user_quality_score}</span>
                        <span className="text-xs opacity-60">/10</span>
                      </div>
                      {result.scores.feedback && (
                        <span className="text-xs text-white/40 max-w-xs truncate">{result.scores.feedback}</span>
                      )}
                      <button
                        onClick={() => {
                          setScoring(result.result_id);
                          setScoreValue(result.scores?.user_quality_score || 5);
                          setFeedback(result.scores?.feedback || "");
                        }}
                        className="text-xs text-white/30 hover:text-white/60 transition ml-2"
                      >
                        Edit
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setScoring(result.result_id);
                        setScoreValue(5);
                        setFeedback("");
                      }}
                      className="px-3 py-1.5 rounded-lg bg-white/5 text-white/60 text-xs hover:bg-white/10 hover:text-white transition"
                    >
                      Rate this prediction
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Scoring Modal */}
      {scoring && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6 animate-in fade-in duration-200">
          <div className="bg-[#0d0d12] rounded-2xl border border-white/10 p-6 w-full max-w-md animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-lg">Rate Prediction</h3>
              <button onClick={() => setScoring(null)} className="text-white/40 hover:text-white transition">✕</button>
            </div>

            {showHelp && (
              <div className="mb-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs text-white/60">
                💡 Your score helps improve future predictions. Be honest — all feedback is saved to the database.
              </div>
            )}

            {/* Score Slider */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm text-white/60">Quality Score</label>
                <span className={`text-2xl font-bold ${
                  scoreValue >= 7 ? "text-emerald-400" :
                  scoreValue >= 4 ? "text-amber-400" :
                  "text-red-400"
                }`}>{scoreValue}</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={scoreValue}
                onChange={(e) => setScoreValue(parseInt(e.target.value))}
                className="w-full accent-amber-500"
              />
              <div className="flex justify-between text-xs text-white/30 mt-1">
                <span>Poor</span>
                <span>Acceptable</span>
                <span>Excellent</span>
              </div>
            </div>

            {/* Feedback */}
            <div className="mb-6">
              <label className="text-sm text-white/60 mb-2 block">
                Feedback (optional)
                {showHelp && <span className="text-white/30 ml-2">— What was good/bad?</span>}
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="What did the prediction get right or wrong?"
                rows={3}
                className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-sm resize-none focus:border-blue-500/50 focus:outline-none"
              />
            </div>

            {/* Submit */}
            <div className="flex gap-3">
              <button
                onClick={() => setScoring(null)}
                className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/60 hover:text-white hover:bg-white/5 transition"
              >
                Cancel
              </button>
              <button
                onClick={submitScore}
                disabled={saving}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-amber-500 text-white font-medium hover:opacity-90 disabled:opacity-50 transition flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>💾 Save Score</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
