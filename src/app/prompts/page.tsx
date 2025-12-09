"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Navbar } from "@/components/Navbar";

interface SavedPrompt {
  prompt_id: string;
  name: string;
  system: string;
  user: string;
  node_type?: string;
  created_at?: string;
}

const NODE_TYPES = [
  { id: "sentiment_analysis", name: "Sentiment", icon: "🎭", description: "Analyze market sentiment from news" },
  { id: "factor_extraction", name: "Factors", icon: "🔍", description: "Extract GDP growth factors" },
  { id: "synthesis", name: "Synthesis", icon: "🧬", description: "Combine analyses into assessment" },
  { id: "prediction", name: "Prediction", icon: "🎯", description: "Generate GDP forecasts" },
];

export default function PromptsPage() {
  const [prompts, setPrompts] = useState<SavedPrompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<SavedPrompt | null>(null);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveResult, setSaveResult] = useState<{ success: boolean; message: string } | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(true);
  const [status, setStatus] = useState<{ status?: string; supported_models?: string[] } | null>(null);

  const loadPrompts = () => {
    api.listPrompts().then((res) => {
      setPrompts(res.prompts || []);
      setLoading(false);
    });
  };

  useEffect(() => {
    api.status().then(setStatus);
    loadPrompts();
  }, []);

  const savePrompt = async () => {
    if (!editing) return;
    setSaving(true);
    setSaveResult(null);
    
    const prompt = {
      prompt_id: editing.prompt_id || `custom_${Date.now()}`,
      name: editing.name,
      system: editing.system,
      user: editing.user,
      node_type: editing.node_type,
    };
    
    try {
      const res = await api.savePrompt(prompt);
      if (res.success) {
        setSaveResult({ success: true, message: `"${editing.name}" saved to database!` });
        loadPrompts();
        setTimeout(() => {
          setEditing(null);
          setCreating(false);
          setSaveResult(null);
        }, 1500);
      } else {
        setSaveResult({ success: false, message: res.error || "Failed to save to database" });
      }
    } catch (e) {
      setSaveResult({ success: false, message: String(e) });
    }
    
    setSaving(false);
  };

  const deletePrompt = async (promptId: string) => {
    if (!confirm("Delete this prompt? This cannot be undone.")) return;
    setDeleting(promptId);
    try {
      await api.savePrompt({ prompt_id: promptId, deleted: true });
      setPrompts((prev) => prev.filter((p) => p.prompt_id !== promptId));
    } catch (e) {
      alert("Failed to delete: " + String(e));
    }
    setDeleting(null);
  };

  const startCreate = () => {
    setEditing({
      prompt_id: "",
      name: "",
      system: "",
      user: "",
      node_type: "sentiment_analysis",
    });
    setCreating(true);
    setSaveResult(null);
  };

  const startEdit = (prompt: SavedPrompt) => {
    setEditing({ ...prompt });
    setCreating(false);
    setSaveResult(null);
  };

  const groupedPrompts = NODE_TYPES.map((type) => ({
    ...type,
    prompts: prompts.filter((p) => 
      p.node_type === type.id || 
      p.prompt_id.startsWith(type.id)
    ),
  }));

  return (
    <div className="min-h-screen bg-[#06060a] text-white">
      <Navbar status={status?.status} models={status?.supported_models} />

      <main className="max-w-2xl mx-auto px-6 pt-28 pb-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold mb-1">Prompt Library</h1>
            <p className="text-sm text-white/40">Saved prompts for reuse across analyses</p>
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
            <button
              onClick={startCreate}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-500 to-amber-500 text-white text-sm font-medium hover:opacity-90 transition"
            >
              + New Prompt
            </button>
          </div>
        </div>

        {/* Help Banner */}
        {showHelp && (
          <div className="mb-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-start gap-3">
              <span className="text-blue-400 text-lg">💡</span>
              <div className="text-sm">
                <p className="text-blue-300 font-medium mb-2">What are prompts?</p>
                <p className="text-white/60 mb-2">
                  Prompts are the instructions you give to the AI. They control how each analysis step works.
                </p>
                <ul className="text-white/50 space-y-1 text-xs">
                  <li>• <strong>System prompt</strong> — Defines the AI&apos;s role and behavior</li>
                  <li>• <strong>Instructions</strong> — The specific task, using {"{variables}"} for input data</li>
                  <li>• All prompts are <strong>saved to the database</strong> and can be reused</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Database Status */}
        <div className="mb-6 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-emerald-400">{prompts.length} prompts saved in database</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          </div>
        ) : prompts.length === 0 && !editing ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-4">📝</div>
            <div className="text-white/40 mb-2">No saved prompts yet</div>
            <p className="text-xs text-white/30 mb-4">Create custom prompts to control how the AI analyzes data</p>
            <button
              onClick={startCreate}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-amber-500 text-white text-sm font-medium"
            >
              Create your first prompt
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {groupedPrompts.map((group) => (
              <div key={group.id} className={group.prompts.length === 0 ? "opacity-50" : ""}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">{group.icon}</span>
                  <span className="text-sm font-medium text-white/60">{group.name}</span>
                  <span className="text-xs text-white/30">({group.prompts.length})</span>
                  {showHelp && <span className="text-xs text-white/20 ml-2">— {group.description}</span>}
                </div>
                
                {group.prompts.length > 0 ? (
                  <div className="space-y-2">
                    {group.prompts.map((prompt) => (
                      <div
                        key={prompt.prompt_id}
                        className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="font-medium">{prompt.name}</div>
                            <div className="text-xs text-white/30 mt-0.5">ID: {prompt.prompt_id}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => startEdit(prompt)}
                              className="px-2 py-1 rounded text-xs text-white/40 hover:text-white hover:bg-white/10 transition"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deletePrompt(prompt.prompt_id)}
                              disabled={deleting === prompt.prompt_id}
                              className="px-2 py-1 rounded text-xs text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition"
                            >
                              {deleting === prompt.prompt_id ? "..." : "Delete"}
                            </button>
                          </div>
                        </div>
                        <div className="text-xs text-white/40 font-mono bg-black/20 p-2 rounded line-clamp-2">
                          {prompt.user.slice(0, 150)}{prompt.user.length > 150 ? "..." : ""}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl border border-dashed border-white/10 text-center">
                    <p className="text-xs text-white/30">No prompts for this step</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Edit/Create Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6 animate-in fade-in duration-200">
          <div className="bg-[#0d0d12] rounded-2xl border border-white/10 p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-lg">{creating ? "New Prompt" : "Edit Prompt"}</h3>
              <button onClick={() => { setEditing(null); setCreating(false); setSaveResult(null); }} className="text-white/40 hover:text-white transition">✕</button>
            </div>

            {showHelp && (
              <div className="mb-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs text-white/60">
                💡 Prompts are saved to the database and can be loaded in any future analysis.
              </div>
            )}

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="text-xs text-white/40 mb-1 block">
                  Prompt Name
                  {showHelp && <span className="text-white/30 ml-2">— A friendly name for this prompt</span>}
                </label>
                <input
                  type="text"
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  placeholder="e.g., Detailed Sentiment Analysis"
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-sm focus:border-blue-500/50 focus:outline-none transition"
                />
              </div>

              {/* Node Type */}
              <div>
                <label className="text-xs text-white/40 mb-1 block">
                  Analysis Step
                  {showHelp && <span className="text-white/30 ml-2">— Which step this prompt is for</span>}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {NODE_TYPES.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setEditing({ ...editing, node_type: type.id })}
                      className={`p-3 rounded-lg text-left transition ${
                        editing.node_type === type.id 
                          ? "bg-white/10 ring-1 ring-white/20" 
                          : "bg-white/5 hover:bg-white/[0.07]"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span>{type.icon}</span>
                        <span className="text-sm font-medium">{type.name}</span>
                      </div>
                      {showHelp && <p className="text-[10px] text-white/30">{type.description}</p>}
                    </button>
                  ))}
                </div>
              </div>

              {/* System Prompt */}
              <div>
                <label className="text-xs text-white/40 mb-1 block">
                  System Prompt
                  {showHelp && <span className="text-white/30 ml-2">— Define the AI&apos;s role</span>}
                </label>
                <textarea
                  value={editing.system}
                  onChange={(e) => setEditing({ ...editing, system: e.target.value })}
                  placeholder="You are an expert economist..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-sm font-mono resize-none focus:border-blue-500/50 focus:outline-none transition"
                />
              </div>

              {/* User Prompt */}
              <div>
                <label className="text-xs text-white/40 mb-1 block">
                  Instructions
                  {showHelp && <span className="text-white/30 ml-2">— Use {"{news}"}, {"{sentiment}"}, etc. for data</span>}
                </label>
                <textarea
                  value={editing.user}
                  onChange={(e) => setEditing({ ...editing, user: e.target.value })}
                  placeholder="Analyze the following data and provide..."
                  rows={6}
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-sm font-mono resize-none focus:border-blue-500/50 focus:outline-none transition"
                />
                {showHelp && (
                  <p className="text-[10px] text-white/30 mt-1">
                    Available variables: {"{news}"}, {"{economic_data}"}, {"{sentiment}"}, {"{factors}"}, {"{synthesis}"}
                  </p>
                )}
              </div>
            </div>

            {/* Save Result */}
            {saveResult && (
              <div className={`mt-4 p-3 rounded-lg text-sm ${
                saveResult.success 
                  ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-400" 
                  : "bg-red-500/20 border border-red-500/30 text-red-400"
              }`}>
                {saveResult.success ? "✓" : "✗"} {saveResult.message}
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setEditing(null); setCreating(false); setSaveResult(null); }}
                className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/60 hover:text-white hover:bg-white/5 transition"
              >
                Cancel
              </button>
              <button
                onClick={savePrompt}
                disabled={saving || !editing.name.trim() || !editing.system.trim() || !editing.user.trim()}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-amber-500 text-white font-medium hover:opacity-90 disabled:opacity-50 transition flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving to Database...
                  </>
                ) : (
                  <>💾 Save Prompt</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

