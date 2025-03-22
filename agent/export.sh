#!/bin/sh
# Workflows
docker run \
  --env-file=.env \
  -v aggy-data:/home/node/.n8n \
  -v ./workflows:/backups \
  definitelynotskynet/aggy-agent:dev \
  export:workflow \
  --backup \
  --output=/backups
# Credentials
docker run \
  --env-file=.env \
  -v aggy-data:/home/node/.n8n \
  -v ./credentials:/backups \
  definitelynotskynet/aggy-agent:dev \
  export:credentials \
  --backup \
  --output=/backups