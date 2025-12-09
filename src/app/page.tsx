"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Navbar } from "@/components/Navbar";

interface Job {
  job_id: string;
  status: string;
  created_at: string;
}

export default function Home() {
  const [status, setStatus] = useState<{ status?: string; supported_models?: string[] } | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    api.status().then(setStatus);
    api.listJobs(3).then((r) => setJobs(r.jobs || []));
  }, []);

  return (
    <div className="min-h-screen bg-[#06060a] text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-red-500/5 to-amber-500/5 rounded-full blur-3xl" />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Navbar */}
      <Navbar status={status?.status} models={status?.supported_models} />

      {/* Hero */}
      <main className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20">
        <div className="max-w-lg w-full text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="text-xs text-white/60">AI-Powered Economic Intelligence</span>
          </div>

          {/* Title */}
          <h1 className="text-5xl font-bold mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: "100ms" }}>
            <span className="bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
              China GDP
            </span>
            <br />
            <span className="bg-gradient-to-r from-red-400 to-amber-400 bg-clip-text text-transparent">
              Analysis
            </span>
          </h1>

          <p className="text-white/40 mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: "200ms" }}>
            Configure your pipeline. Customize prompts.<br />Run AI predictions.
          </p>

          {/* CTA */}
          <Link
            href="/analyze"
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-red-500 to-amber-500 text-white font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-500/25 animate-in fade-in slide-in-from-bottom-4 duration-700"
            style={{ animationDelay: "300ms" }}
          >
            <span>Start Analysis</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>

          {/* Pipeline Preview */}
          <div className="flex items-center justify-center gap-2 mt-12 animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: "400ms" }}>
            {[
              { icon: "📰", label: "News" },
              { icon: "📊", label: "Data" },
              { icon: "🎭", label: "Sentiment" },
              { icon: "🔍", label: "Factors" },
              { icon: "🧬", label: "Synthesis" },
              { icon: "🎯", label: "Predict" },
            ].map((step, i) => (
              <div key={i} className="flex items-center">
                <div className="group relative">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-lg transition-all duration-300 hover:scale-110 hover:bg-white/10 cursor-default">
                    {step.icon}
                  </div>
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-white/30 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {step.label}
                  </div>
                </div>
                {i < 5 && (
                  <div className="w-4 h-px bg-gradient-to-r from-white/20 to-transparent mx-1" />
                )}
              </div>
            ))}
          </div>

          {/* Recent Jobs */}
          {jobs.length > 0 && (
            <div className="mt-16 animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: "500ms" }}>
              <div className="text-xs text-white/30 uppercase tracking-widest mb-3">Recent</div>
              <div className="space-y-2">
                {jobs.map((job) => (
                  <Link
                    key={job.job_id}
                    href={`/jobs/${job.job_id}`}
                    className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        job.status === "completed" ? "bg-emerald-400" :
                        job.status === "running" ? "bg-blue-400 animate-pulse" :
                        "bg-white/30"
                      }`} />
                      <span className="text-sm text-white/60">{new Date(job.created_at).toLocaleDateString()}</span>
                    </div>
                    <span className="text-xs text-white/30 group-hover:text-white/50 transition-colors">
                      {job.status === "completed" ? "View →" : job.status}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
