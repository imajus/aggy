# Aggy AI Agent

Built with n8n.

# Prerequisites

1. Register Nillion SecretVault organisation [here](https://sv-sda-registration.replit.app)
2. Generate Nillion SecretLLM access key [here](https://docs.nillion.com/build/secretLLM/access)
3. Create MultiBaaS deployment [here](https://console.curvegrid.com/)
4. Create Privy app [here](https://dashboard.privy.io/apps).

# Development

1. (once only)
  1. Change current directory: `cd docker`
  1. Copy `.env.example` to `.env` file and fill the variable values
  1. Import the workflows & credentials: `./import.sh`
1. Start the application: `./start.sh`
1. Open http://localhost:3000 and manage workflows or credentials
1. Export the workflows & credentials into the source code: `./export.sh`

# Deploying to Docker hub

```sh
docker login
docker build -t myrepo/myapp:latest .
docker push myrepo/myapp:latest
```

Then deploy to a any hosting supporting Docker providing the required environment variables.