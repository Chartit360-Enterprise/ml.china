#!/bin/bash

# China GDP AI - Run Full Analysis Job
# Creates and executes a complete analysis pipeline

API="https://pte29a0ad9.execute-api.eu-west-2.amazonaws.com/Prod/china-gdp-ai"
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║           CHINA GDP AI - RUN FULL ANALYSIS                   ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

call_api() {
    curl -s -X POST "$API" -H "Content-Type: application/json" -d "$1" --max-time 35
}

# Create job with custom plan
echo -e "${YELLOW}Creating analysis job...${NC}"
echo -e "${BLUE}(API may timeout but job runs in background)${NC}"
echo ""

RESULT=$(call_api '{
  "operation": "create_job",
  "execute": true,
  "plan": {
    "name": "Test Analysis Run",
    "description": "Full pipeline test",
    "nodes": [
      {"id": "news_fetch", "type": "data_fetch", "order": 1, "config": {"keywords": ["China GDP", "China economy"], "time_period_days": 7, "max_articles": 15}},
      {"id": "economic_data", "type": "data_fetch", "order": 2},
      {"id": "sentiment_analysis", "type": "ai_process", "order": 3, "model": "gemini-3-pro-preview", "temperature": 0.3, "max_tokens": 8000, "input_from": ["news_fetch"], "prompt_id": "sentiment_analysis"},
      {"id": "factor_extraction", "type": "ai_process", "order": 4, "model": "claude-opus-4.5", "temperature": 0.2, "max_tokens": 8000, "input_from": ["news_fetch"], "prompt_id": "factor_extraction"},
      {"id": "synthesis", "type": "ai_process", "order": 5, "model": "gemini-3-pro-preview", "temperature": 0.4, "max_tokens": 16000, "input_from": ["sentiment_analysis", "factor_extraction", "economic_data"], "prompt_id": "synthesis"},
      {"id": "prediction", "type": "ai_process", "order": 6, "model": "claude-opus-4.5", "temperature": 0.3, "max_tokens": 8000, "input_from": ["synthesis"], "prompt_id": "prediction"}
    ],
    "prompts": {
      "sentiment_analysis": {"system": "You are an expert economic analyst.", "user": "Analyze sentiment from: {news}\n\nReturn JSON with sentiment score (-1 to 1)."},
      "factor_extraction": {"system": "You are an economist.", "user": "Extract GDP factors from: {news}\n\nReturn JSON."},
      "synthesis": {"system": "You synthesize data.", "user": "Synthesize: {sentiment}, {factors}, {economic_data}"},
      "prediction": {"system": "You forecast GDP.", "user": "Based on: {synthesis}\n\nPredict Q1-Q4 2025 GDP. Return JSON."}
    }
  }
}')

JOB_ID=$(echo "$RESULT" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('job_id',''))" 2>/dev/null)

# If timeout, check for latest running job
if [ -z "$JOB_ID" ]; then
    echo -e "${YELLOW}API timed out, checking for running job...${NC}"
    sleep 5
    
    # Get the latest job
    JOB_ID=$(call_api '{"operation": "list_jobs", "limit": 1}' | python3 -c "
import json,sys
d=json.load(sys.stdin)
jobs = d.get('jobs', [])
if jobs:
    print(jobs[0]['job_id'])
")
fi

if [ -z "$JOB_ID" ]; then
    echo -e "${RED}✗ Could not find job${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Job: $JOB_ID${NC}"
echo ""

# Poll for completion
echo -e "${YELLOW}Waiting for analysis to complete...${NC}"
echo -e "${BLUE}(This typically takes 1-2 minutes)${NC}"
echo ""

MAX_WAIT=180
WAITED=0
INTERVAL=10

while [ $WAITED -lt $MAX_WAIT ]; do
    STATUS_RESULT=$(call_api "{\"operation\": \"get_job\", \"job_id\": \"$JOB_ID\"}")
    STATUS=$(echo "$STATUS_RESULT" | python3 -c "import json,sys; print(json.load(sys.stdin).get('job',{}).get('status','unknown'))" 2>/dev/null)
    
    if [ "$STATUS" == "completed" ]; then
        echo -e "\n${GREEN}✓ Analysis completed!${NC}"
        break
    elif [ "$STATUS" == "failed" ]; then
        echo -e "\n${RED}✗ Analysis failed${NC}"
        exit 1
    else
        printf "."
        sleep $INTERVAL
        WAITED=$((WAITED + INTERVAL))
    fi
done

if [ $WAITED -ge $MAX_WAIT ]; then
    echo -e "\n${YELLOW}○ Still running - check manually${NC}"
fi

# Get final results
echo ""
echo -e "${YELLOW}━━━ RESULTS ━━━${NC}"

call_api "{\"operation\": \"get_job\", \"job_id\": \"$JOB_ID\"}" | python3 -c "
import json,sys,re

d = json.load(sys.stdin)
job = d.get('job', {})
result = job.get('result', {})

print(f'Status: {job.get(\"status\")}')

if result:
    print(f'Time: {result.get(\"execution_time_ms\", 0)/1000:.1f}s')
    print()
    
    outputs = result.get('node_outputs', {})
    
    for node_id in ['news_fetch', 'economic_data', 'sentiment_analysis', 'factor_extraction', 'synthesis', 'prediction']:
        if node_id in outputs:
            output = outputs[node_id]
            status = '✗' if output.get('error') else '✓'
            model = output.get('model', '')
            tokens = output.get('tokens', 0)
            
            info = f'{status} {node_id}'
            if model: info += f' [{model}]'
            if tokens: info += f' ({tokens:,} tok)'
            if output.get('error'): info += f' ERR'
            print(info)
    
    # Show prediction
    pred = outputs.get('prediction', {})
    if pred.get('content') and not pred.get('error'):
        print()
        print('━━━ GDP FORECAST ━━━')
        content = pred['content']
        try:
            match = re.search(r'\`\`\`json\s*(.*?)\s*\`\`\`', content, re.DOTALL)
            data = json.loads(match.group(1) if match else content)
            
            if 'full_year_2025' in data:
                fy = data['full_year_2025']
                pe = fy.get('point_estimate', fy) if isinstance(fy, dict) else fy
                print(f'  2025: {pe}%')
            if 'trend' in data:
                print(f'  Trend: {data[\"trend\"]}')
        except:
            print(content[:300])
"

echo ""
echo -e "${GREEN}Done!${NC}"
echo -e "View: ${BLUE}https://china-gdp-ai-frontend.vercel.app/jobs/${JOB_ID}${NC}"
