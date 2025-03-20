#!/bin/sh
docker run \
  --env-file=.env \
  -p 5678:5678 \
  -v aggy-data:/home/node/.n8n \
  n8nio/n8n:latest