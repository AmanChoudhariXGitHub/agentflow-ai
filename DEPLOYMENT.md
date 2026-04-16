# Deployment

## Stackblitz (Primary)

1. Push this repo to GitHub
2. Open on Stackblitz
3. Ensure `stackblitz.json` is present. It runs `npm run dev`.
4. Add `GEMINI_API_KEY` in the Stackblitz env panel for server routes.

## Vercel

1. Import repo in Vercel
2. Set env vars (e.g. `GEMINI_API_KEY`)
3. Deploy

## Google Cloud Run

1. Build image

```
gcloud builds submit --tag gcr.io/PROJECT_ID/multi-agent-workshop
```

2. Deploy service

```
gcloud run deploy multi-agent-workshop \
  --image gcr.io/PROJECT_ID/multi-agent-workshop \
  --platform managed \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=YOUR_KEY
```

## Docker

Create `Dockerfile`:

```
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:

```
docker build -t multi-agent-workshop .
docker run -p 3000:3000 -e GEMINI_API_KEY=YOUR_KEY multi-agent-workshop
```


