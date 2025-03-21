FROM n8nio/n8n:latest
# TODO: Maybe install missing NPM packages?
# Import workflows & credentials from the project
COPY credentials /backup/credentials
COPY workflows /backup/workflows
RUN n8n import:credentials --separate --input=/backup/credentials
RUN n8n import:workflow --separate --input=/backup/workflows
# Activate all workflows
RUN n8n update:workflow --all --active=true
# Allow passing the envruption key via environment variable
RUN rm .n8n/config
# Set environment variable defaults
ENV N8N_PORT=3000
ENV N8N_DIAGNOSTICS_ENABLED=false
ENV N8N_TEMPLATES_ENABLED=false
ENV NODE_ENV=production
ENV N8N_DIAGNOSTICS_CONFIG_FRONTEND=
ENV N8N_DIAGNOSTICS_CONFIG_BACKEND=
ENV EXTERNAL_FRONTEND_HOOKS_URLS=
ENV NODE_FUNCTION_ALLOW_BUILTIN=*
ENV NODE_FUNCTION_ALLOW_EXTERNAL=*
ENV N8N_DISABLE_UI=true