FROM n8nio/n8n:latest
# Install missing NPM packages
USER root
RUN npm i -g \
	https://github.com/imajus/secretvaults-js.git#d3f9fcd94435692e405e59bce87cdf05c72bde80 \
	ethers@5
# Import workflows & credentials from the project
USER node
COPY credentials .n8n/backup/credentials
COPY workflows .n8n/backup/workflows
RUN n8n import:credentials --separate --input=.n8n/backup/credentials
RUN n8n import:workflow --separate --input=.n8n/backup/workflows
# Activate all workflows
RUN n8n update:workflow --id=Zy500iauQJjTM3In --active=true
RUN n8n update:workflow --id=iiEWQuPdY1KZKLol --active=true
# Allow passing custom encryption key
RUN rm .n8n/config
# Init environment variable defaults
ENV N8N_PORT=3000
ENV NODE_ENV=production
ENV NODE_FUNCTION_ALLOW_BUILTIN=*
ENV NODE_FUNCTION_ALLOW_EXTERNAL=*
ENV N8N_DISABLE_UI=true