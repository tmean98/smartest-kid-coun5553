#!/bin/bash
cd "$(dirname "$0")"
node sync.mjs >> sync.log 2>&1
