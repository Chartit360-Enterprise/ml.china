"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Navbar } from "@/components/Navbar";

interface Job {
  job_id: string;
  status: string;
  created_at?: string;
  config?: {
    name?: string;
  };
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [showHelp, setShowHelp] = useState(true);
  const [status, setStatus] = useState<{ status?: string; supported_models?: string[] } | null>(null);

  useEffect(() => {
    api.status().then(setStatus);
    
    const fetchJobs = async () => {
      const res = await api.listJobs();
      setJobs(res.jobs || []);
      setLoading(false);
    };
    
    fetchJobs();
    
    // Poll every 5 seconds if there are pending/running jobs
    const interval = setInterval(async () => {
      const res = await api.listJobs();
      const jobList = res.jobs || [];
      setJobs(jobList);
      
      // Stop polling if no pending/running jobs
      if (!jobList.some((j: Job) => j.status === "pending" || j.status === "running")) {
        clearInterval(interval);
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) + " at " +
      d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  };

  const getStatusIcon = (s: string) => {
    switch (s) {
      case "completed": return "✓";
      case "running": return "⟳";
      case "pending": return "◐";
      case "failed": return "✗";
      default: return "○";
    }
  };

  const getStatusColor = (s: string) => {
    switch (s) {
      case "completed": return "text-emerald-400";
      case "running": return "text-blue-400 animate-pulse";
      case "pending": return "text-amber-400 animate-pulse";
      case "failed": return "text-red-400";
      default: return "text-white/40";
    }
  };

  return (
    <div className="min-h-screen bg-[#06060a] text-white">
      <Navbar status={status?.status} models={status?.supported_models} />

      <main className="max-w-2xl mx-auto px-6 pt-28 pb-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold mb-1">Analysis History</h1>
            <p className="text-sm text-white/40">All your GDP analysis runs</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHelp(!showHelp)}
              className={`px-3 py-1.5 rounded-lg text-xs transition ${
                showHelp ? "bg-blue-500/20 text-blue-400" : "bg-white/5 text-white/40"
              }`}
            >
              {showHelp ? "? Hide Help" : "? Help"}
            </button>
            <Link
              href="/analyze"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-500 to-amber-500 text-white text-sm font-medium hover:opacity-90 transition"
            >
              + New Analysis
            </Link>
          </div>
        </div>

        {/* Help Banner */}
        {showHelp && (
          <div className="mb-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-start gap-3">
              <span className="text-blue-400 text-lg">💡</span>
              <div className="text-sm">
                <p className="text-blue-300 font-medium mb-2">What is this?</p>
                <p className="text-white/60 mb-2">
                  This is your history of all GDP analyses. Each job runs through the 6-step pipeline you configured.
                </p>
                <ul className="text-white/50 space-y-1 text-xs">
                  <li>• <span className="text-emerald-400">✓ Completed</span> — Analysis finished successfully, click to view results</li>
                  <li>• <span className="text-blue-400">⟳ Running</span> — Analysis in progress on AWS</li>
                  <li>• <span className="text-amber-400">◐ Pending</span> — Job queued, starting soon</li>
                  <li>• <span className="text-red-400">✗ Failed</span> — Something went wrong, check details</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Database Status */}
        <div className="mb-6 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-emerald-400">{jobs.length} jobs saved in database</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-4">📊</div>
            <div className="text-white/40 mb-2">No analyses yet</div>
            <p className="text-xs text-white/30 mb-4">Start your first analysis to generate GDP predictions</p>
            <Link
              href="/analyze"
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-amber-500 text-white text-sm font-medium inline-block"
            >
              Start your first analysis
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {jobs.map((job) => (
              <Link
                key={job.job_id}
                href={`/jobs/${job.job_id}`}
                className="block p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.03] transition group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className={`text-lg ${getStatusColor(job.status)}`}>
                      {getStatusIcon(job.status)}
                    </span>
                    <div>
                      <div className="font-medium text-white/80 group-hover:text-white transition">
                        {formatDate(job.created_at) || "Analysis"}
                      </div>
                      <div className="text-xs text-white/30 capitalize">{job.status}</div>
                    </div>
                  </div>
                  <span className="text-xs text-white/30 group-hover:text-white/60 transition">
                    View →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Refresh hint */}
        {jobs.some(j => j.status === "running" || j.status === "pending") && (
          <div className="mt-4 text-center text-xs text-white/30">
            ⟳ Auto-refreshing every 5 seconds...
          </div>
        )}
      </main>
    </div>
  );
}
