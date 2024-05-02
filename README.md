## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

# Necessary Config

1- You should have a .env.local file and based on .env.example add your API keys there

# Run Project(Docker)

1- docker build -t news-app .

2- docker run -p 3000:3000 news-app:latest
