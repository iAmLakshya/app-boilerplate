#!/bin/bash
if echo "$1" | grep -q "frontend"; then
    # Command 1
    echo "Starting frontend service: $1"
    cp -r ./apps/${SERVICE}/.next/static ./apps/${SERVICE}/.next/standalone/apps/${SERVICE}/.next
    cp -r ./apps/${SERVICE}/public ./apps/${SERVICE}/.next/standalone/apps/${SERVICE}
    node ./apps/${SERVICE}/.next/standalone/apps/${SERVICE}/server.js --prod --port=$PORT --hostname=0.0.0.0
else
    # Command 2
    echo "Starting backend service: $1"
   	node ./dist/apps/${SERVICE}/main.js --port=$PORT
fi