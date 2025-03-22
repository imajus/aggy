FROM n8nio/n8n:latest
# Install missing NPM packages
USER root
RUN npm i -g \
	https://github.com/imajus/secretvaults-js.git#d3f9fcd94435692e405e59bce87cdf05c72bde80
# Import workflows & credentials from the project
USER node
COPY credentials .n8n/backup/credentials
COPY workflows .n8n/backup/workflows
RUN n8n import:credentials --separate --input=.n8n/backup/credentials
RUN n8n import:workflow --separate --input=.n8n/backup/workflows
# Activate all workflows
RUN n8n update:workflow --all --active=true
# Allow passing custom encryption key
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