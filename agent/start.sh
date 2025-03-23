#!/bin/sh
docker run \
  --env-file=.env \
  -p 3000:3000 \
  -v aggy-data:/home/node/.n8n \
  definitelynotskynet/aggy-agent:dev