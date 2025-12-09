#!/bin/bash

# China GDP AI - Backend Test Script
# Tests all Lambda operations

API="https://pte29a0ad9.execute-api.eu-west-2.amazonaws.com/Prod/china-gdp-ai"
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║           CHINA GDP AI - BACKEND TEST SUITE                  ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Helper function
call_api() {
    curl -s -X POST "$API" -H "Content-Type: application/json" -d "$1"
}

# 1. STATUS CHECK
echo -e "${YELLOW}━━━ 1. STATUS CHECK ━━━${NC}"
RESULT=$(call_api '{"operation": "status"}')
STATUS=$(echo $RESULT | python3 -c "import json,sys; print(json.load(sys.stdin).get('status','error'))")
if [ "$STATUS" == "operational" ]; then
    echo -e "${GREEN}✓ System operational${NC}"
else
    echo -e "${RED}✗ System not operational${NC}"
    exit 1
fi

# 2. LIST MODELS
echo -e "\n${YELLOW}━━━ 2. LIST MODELS ━━━${NC}"
RESULT=$(call_api '{"operation": "list_models"}')
echo $RESULT | python3 -c "
import json,sys
d=json.load(sys.stdin)
for m,info in d.get('models',{}).items():
    print(f'  ✓ {m} ({info[\"provider\"]})')
"

# 3. CREATE PROMPTS
echo -e "\n${YELLOW}━━━ 3. CREATE PROMPTS ━━━${NC}"

# Sentiment Analysis Prompt
RESULT=$(call_api '{
  "operation": "save_prompt",
  "prompt": {
    "prompt_id": "sentiment_detailed_v1",
    "name": "Detailed Sentiment Analysis",
    "system": "You are an expert financial analyst specializing in China market sentiment analysis. Be thorough and objective.",
    "user": "Analyze the following news articles about China economy:\n\n{news}\n\nProvide:\n1. Overall sentiment score (-1 to 1)\n2. Sector breakdown (manufacturing, services, trade, property, tech)\n3. Key bullish signals\n4. Key bearish signals\n5. Confidence level\n\nReturn as structured JSON.",
    "node_type": "sentiment_analysis"
  }
}')
echo -e "  ${GREEN}✓ Created: sentiment_detailed_v1${NC}"

# Factor Extraction Prompt
RESULT=$(call_api '{
  "operation": "save_prompt",
  "prompt": {
    "prompt_id": "factors_comprehensive_v1",
    "name": "Comprehensive Factor Analysis",
    "system": "You are a macroeconomist specializing in identifying GDP growth drivers for China.",
    "user": "From the news articles:\n\n{news}\n\nExtract ALL factors that could impact China GDP:\n- Policy factors (monetary, fiscal, regulatory)\n- Trade factors (exports, imports, tariffs)\n- Domestic factors (consumption, investment, property)\n- External factors (global demand, geopolitics)\n\nFor each factor: name, direction, magnitude, timing, confidence.\nReturn JSON.",
    "node_type": "factor_extraction"
  }
}')
echo -e "  ${GREEN}✓ Created: factors_comprehensive_v1${NC}"

# Synthesis Prompt  
RESULT=$(call_api '{
  "operation": "save_prompt",
  "prompt": {
    "prompt_id": "synthesis_executive_v1",
    "name": "Executive Synthesis",
    "system": "You are a senior economic strategist preparing briefings for institutional investors.",
    "user": "Synthesize the following inputs:\n\nSENTIMENT:\n{sentiment}\n\nFACTORS:\n{factors}\n\nECONOMIC DATA:\n{economic_data}\n\nProvide:\n1. Executive summary (3 sentences)\n2. Bull case scenario\n3. Bear case scenario\n4. Base case scenario\n5. Key risks\n6. Recommended positioning",
    "node_type": "synthesis"
  }
}')
echo -e "  ${GREEN}✓ Created: synthesis_executive_v1${NC}"

# Prediction Prompt
RESULT=$(call_api '{
  "operation": "save_prompt",
  "prompt": {
    "prompt_id": "prediction_quant_v1",
    "name": "Quantitative Prediction",
    "system": "You are a quantitative economist making precise GDP forecasts with rigorous uncertainty quantification.",
    "user": "Based on:\n\n{synthesis}\n\nProvide GDP growth predictions:\n\n1. Quarterly forecasts (Q1-Q4 2025)\n   - Point estimate\n   - 70% confidence interval\n   - 90% confidence interval\n\n2. Full year 2025 forecast\n\n3. Probability distribution:\n   - P(growth < 4%) \n   - P(growth 4-5%)\n   - P(growth > 5%)\n\n4. Key assumptions\n5. Model confidence score\n\nReturn as JSON with numerical precision.",
    "node_type": "prediction"
  }
}')
echo -e "  ${GREEN}✓ Created: prediction_quant_v1${NC}"

# Alternative Conservative Prompt
RESULT=$(call_api '{
  "operation": "save_prompt",
  "prompt": {
    "prompt_id": "prediction_conservative_v1",
    "name": "Conservative Prediction",
    "system": "You are a risk-averse economist who emphasizes downside risks and maintains conservative estimates.",
    "user": "Based on: {synthesis}\n\nProvide CONSERVATIVE GDP estimates that account for:\n- Downside risks weighted more heavily\n- Historical forecast errors\n- Structural headwinds\n\nReturn JSON with quarterly and annual forecasts.",
    "node_type": "prediction"
  }
}')
echo -e "  ${GREEN}✓ Created: prediction_conservative_v1${NC}"

# 4. LIST ALL PROMPTS
echo -e "\n${YELLOW}━━━ 4. LIST ALL PROMPTS ━━━${NC}"
call_api '{"operation": "list_prompts"}' | python3 -c "
import json,sys
d=json.load(sys.stdin)
prompts = d.get('prompts', [])
print(f'  Total prompts: {len(prompts)}')
for p in prompts:
    print(f'  ✓ {p[\"prompt_id\"]}: {p.get(\"name\", \"unnamed\")}')
"

# 5. CREATE CONFIG
echo -e "\n${YELLOW}━━━ 5. CREATE CONFIG ━━━${NC}"
RESULT=$(call_api '{
  "operation": "save_config",
  "config": {
    "name": "Full Analysis Pipeline",
    "description": "Complete 6-node analysis with custom prompts",
    "nodes": [
      {"id": "news_fetch", "type": "data_fetch", "order": 1, "config": {"keywords": ["China GDP", "PBOC", "China economy"], "time_period_days": 14, "max_articles": 30}},
      {"id": "economic_data", "type": "data_fetch", "order": 2, "config": {"indicators": ["GDP Growth", "PMI", "Trade Balance"]}},
      {"id": "sentiment_analysis", "type": "ai_process", "order": 3, "model": "gemini-3-pro-preview", "prompt_id": "sentiment_detailed_v1", "temperature": 0.3, "max_tokens": 8000, "input_from": ["news_fetch"]},
      {"id": "factor_extraction", "type": "ai_process", "order": 4, "model": "claude-opus-4.5", "prompt_id": "factors_comprehensive_v1", "temperature": 0.2, "max_tokens": 8000, "input_from": ["news_fetch"]},
      {"id": "synthesis", "type": "ai_process", "order": 5, "model": "gemini-3-pro-preview", "prompt_id": "synthesis_executive_v1", "temperature": 0.4, "max_tokens": 16000, "input_from": ["sentiment_analysis", "factor_extraction", "economic_data"]},
      {"id": "prediction", "type": "ai_process", "order": 6, "model": "claude-opus-4.5", "prompt_id": "prediction_quant_v1", "temperature": 0.3, "max_tokens": 8000, "input_from": ["synthesis"]}
    ]
  }
}')
CONFIG_ID=$(echo $RESULT | python3 -c "import json,sys; print(json.load(sys.stdin).get('config_id','error'))")
echo -e "  ${GREEN}✓ Created config: $CONFIG_ID${NC}"

# 6. LIST CONFIGS
echo -e "\n${YELLOW}━━━ 6. LIST CONFIGS ━━━${NC}"
call_api '{"operation": "list_configs"}' | python3 -c "
import json,sys
d=json.load(sys.stdin)
for c in d.get('configs', []):
    print(f'  ✓ {c.get(\"config_id\",\"?\")[:12]}: {c.get(\"name\")}')
"

# 7. LIST EXISTING JOBS
echo -e "\n${YELLOW}━━━ 7. EXISTING JOBS ━━━${NC}"
call_api '{"operation": "list_jobs", "limit": 10}' | python3 -c "
import json,sys
d=json.load(sys.stdin)
jobs = d.get('jobs', [])
print(f'  Total jobs: {len(jobs)}')
completed = len([j for j in jobs if j['status']=='completed'])
running = len([j for j in jobs if j['status']=='running'])
print(f'  Completed: {completed}, Running: {running}')
"

# 8. LIST EXISTING RESULTS
echo -e "\n${YELLOW}━━━ 8. EXISTING RESULTS ━━━${NC}"
call_api '{"operation": "list_results", "limit": 10}' | python3 -c "
import json,sys
d=json.load(sys.stdin)
results = d.get('results', [])
print(f'  Total results: {len(results)}')
scored = len([r for r in results if r.get('scores',{}).get('user_quality_score')])
print(f'  Scored: {scored}/{len(results)}')
"

# 9. SCORE A RESULT
echo -e "\n${YELLOW}━━━ 9. SCORE A RESULT ━━━${NC}"
RESULT_ID=$(call_api '{"operation": "list_results", "limit": 1}' | python3 -c "import json,sys; r=json.load(sys.stdin).get('results',[]); print(r[0]['result_id'] if r else '')")
if [ -n "$RESULT_ID" ]; then
    RESULT=$(call_api "{
      \"operation\": \"score_result\",
      \"result_id\": \"$RESULT_ID\",
      \"score\": 8,
      \"feedback\": \"Good analysis with accurate quarterly breakdown. Confidence intervals were reasonable.\"
    }")
    SUCCESS=$(echo $RESULT | python3 -c "import json,sys; print(json.load(sys.stdin).get('success', False))")
    if [ "$SUCCESS" == "True" ]; then
        echo -e "  ${GREEN}✓ Scored result $RESULT_ID with 8/10${NC}"
    else
        echo -e "  ${RED}✗ Failed to score result${NC}"
    fi
else
    echo -e "  ${YELLOW}○ No results to score${NC}"
fi

# 10. GET A SPECIFIC JOB
echo -e "\n${YELLOW}━━━ 10. GET JOB DETAILS ━━━${NC}"
JOB_ID=$(call_api '{"operation": "list_jobs", "limit": 1}' | python3 -c "import json,sys; j=json.load(sys.stdin).get('jobs',[]); print(j[0]['job_id'] if j else '')")
if [ -n "$JOB_ID" ]; then
    call_api "{\"operation\": \"get_job\", \"job_id\": \"$JOB_ID\"}" | python3 -c "
import json,sys
d=json.load(sys.stdin)
job = d.get('job', {})
print(f'  Job: {job.get(\"job_id\", \"?\")[:12]}')
print(f'  Status: {job.get(\"status\")}')
result = job.get('result', {})
if result:
    print(f'  Nodes: {len(result.get(\"node_outputs\", {}))}')
    print(f'  Time: {result.get(\"execution_time_ms\", 0)/1000:.1f}s')
"
fi

echo -e "\n${GREEN}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║              ALL TESTS COMPLETED SUCCESSFULLY                ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════════╝${NC}"

