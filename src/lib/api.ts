const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "/api/proxy";

export async function callAPI(payload: Record<string, unknown>) {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

// API Operations
export const api = {
  // Status
  status: () => callAPI({ operation: "status" }),
  listModels: () => callAPI({ operation: "list_models" }),

  // Jobs
  createJob: (plan?: object, execute = false) =>
    callAPI({ operation: "create_job", plan, execute }),
  getJob: (job_id: string) => callAPI({ operation: "get_job", job_id }),
  listJobs: (limit = 50) => callAPI({ operation: "list_jobs", limit }),
  
  // Start job async - fire and forget, we don't wait for completion
  startJobAsync: (job_id: string) => {
    // Use beacon or fetch without awaiting to avoid Vercel timeout
    const endpoint = process.env.NEXT_PUBLIC_API_BASE || "/api/proxy";
    const payload = JSON.stringify({ operation: "start_job", job_id });
    
    // Try sendBeacon first (fire and forget, survives navigation)
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      const blob = new Blob([payload], { type: "application/json" });
      navigator.sendBeacon(endpoint, blob);
      return Promise.resolve({ sent: true });
    }
    
    // Fallback: fetch with keepalive (also fire and forget)
    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(() => {}); // Ignore errors - we're navigating away anyway
    
    return Promise.resolve({ sent: true });
  },

  // Configs
  saveConfig: (config: object) => callAPI({ operation: "save_config", config }),
  getConfig: (config_id: string) => callAPI({ operation: "get_config", config_id }),
  listConfigs: () => callAPI({ operation: "list_configs" }),
  deleteConfig: (config_id: string) => callAPI({ operation: "delete_config", config_id }),
  getDefaultConfig: () => callAPI({ operation: "get_default_config" }),

  // Results
  getResult: (result_id: string) => callAPI({ operation: "get_result", result_id }),
  listResults: (limit = 50) => callAPI({ operation: "list_results", limit }),
  scoreResult: (result_id: string, score: number, feedback?: string) =>
    callAPI({ operation: "score_result", result_id, score, feedback }),

  // Prompts
  savePrompt: (prompt: object) => callAPI({ operation: "save_prompt", prompt }),
  getPrompt: (prompt_id: string) => callAPI({ operation: "get_prompt", prompt_id }),
  listPrompts: () => callAPI({ operation: "list_prompts" }),
};

// Types
export interface Node {
  id: string;
  type: "data_fetch" | "ai_process" | "aggregate";
  order: number;
  model?: string;
  input_from?: string[];
  prompt_id?: string;
  temperature?: number;
  max_tokens?: number;
  config?: Record<string, unknown>;
}

export interface Prompt {
  system: string;
  user: string;
  variables?: string[];
}

export interface Config {
  config_id?: string;
  name: string;
  description: string;
  nodes: Node[];
  prompts: Record<string, Prompt>;
  weights: Record<string, number>;
  output_format?: Record<string, boolean>;
}

export interface Job {
  job_id: string;
  created_at: string;
  completed_at?: string;
  status: "pending" | "running" | "completed" | "failed";
  config_id?: string;
  plan: Config;
  result?: JobResult;
  result_id?: string;
}

export interface JobResult {
  node_outputs: Record<string, NodeOutput>;
  execution_time_ms: number;
  total_cost_usd: number;
  model_usage: Record<string, { tokens: number; cost_usd: number; calls: number }>;
  final_output?: string;
  completed_at: string;
}

export interface NodeOutput {
  content?: string;
  model?: string;
  tokens?: number;
  error?: string;
  [key: string]: unknown;
}

export interface Result {
  result_id: string;
  job_id: string;
  config_id?: string;
  created_at: string;
  result: JobResult;
  scores: {
    user_quality_score?: number;
    accuracy_score?: number;
    scored_at?: string;
    feedback?: string;
  };
  actual_outcome?: {
    actual_gdp_growth?: number;
    reported_at?: string;
    prediction_error?: number;
  };
}
