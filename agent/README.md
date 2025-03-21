# Aggy AI Agent

Built with n8n.

# Development

1. Copy `.env.example` to `.env` file and fill the variable values
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