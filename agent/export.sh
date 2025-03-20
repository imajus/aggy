#!/bin/sh
# Workflows
docker run \
  --env-file=.env \
  -v aggy-data:/home/node/.n8n \
  -v ./workflows:/backups \
  n8nio/n8n:latest \
  export:workflow \
  --backup \
  --output=/backups
# Credentials
docker run \
  --env-file=.env \
  -v aggy-data:/home/node/.n8n \
  -v ./credentials:/backups \
  n8nio/n8n:latest \
  export:credentials \
  --backup \
  --output=/backups