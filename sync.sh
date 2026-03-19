#!/bin/bash
export PATH="/usr/local/bin:/usr/bin:/bin:$PATH"
cd "$(dirname "$0")"
node sync.mjs >> sync.log 2>&1
echo "[$(date '+%Y-%m-%d %H:%M:%S')] Rebuilding chunks..." >> sync.log
cd web && npx tsx scripts/build-chunks.ts --all >> ../sync.log 2>&1
echo "[$(date '+%Y-%m-%d %H:%M:%S')] Generating weekly summaries..." >> ../sync.log
npx tsx scripts/generate-weekly-summary.ts --all >> ../sync.log 2>&1
echo "[$(date '+%Y-%m-%d %H:%M:%S')] Post-sync complete" >> ../sync.log
