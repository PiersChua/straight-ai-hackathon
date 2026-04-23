# Aptly

Aptly is a two-sided talent matching platform that evaluates candidates on demonstrated capability rather than pedigree, school brand, or social network access. It inserts a structured, AI-scored assessment layer between candidate discovery and employer review — ensuring no human bias enters the process until a candidate's capability has already been established and ranked.

---

## Tech Stack

- **Framework** — Next.js (App Router)
- **Database** — PostgreSQL via Prisma ORM
- **Auth** — Better Auth
- **AI / Voice** — OpenAI, ElevenLabs Conversational AI

---

## Local Setup

### 1. Clone & Install

```bash
git clone <repo-url>
npm install
```

### 2. Environment Variables

Create a `.env` file in the project root:

```env
# Database
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/aptly?schema=public"

# Auth
BETTER_AUTH_SECRET=your_secret_here
BETTER_AUTH_URL=http://localhost:3000

# AI Services
OPENAI_API_KEY=your_openai_key
ELEVENLABS_API_KEY=your_elevenlabs_key
ELEVENLABS_AGENT_ID=your_agent_id
```

Generate a secure `BETTER_AUTH_SECRET` with:

```bash
openssl rand -base64 32
```
Alternatively, generate it at https://better-auth.com/docs/installation
### 3. Database Setup

This project uses a custom Prisma config. **Always include the `--config` flag** in Prisma commands or they will fail.

Run the initial migration:

```bash
npx prisma migrate dev --name init --config=prisma/prisma.config.ts
```

This creates the database schema and generates the Prisma Client.

### 4. Run the Dev Server

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

---

## Prisma Workflow

Whenever you modify `schema.prisma`:

```bash
# 1. Apply migration
npx prisma migrate dev --name your_migration_name --config=prisma/prisma.config.ts

# 2. Regenerate Prisma Client
npx prisma generate --config=prisma/prisma.config.ts
```

---

## OpenAI Setup
 
Aptly uses OpenAI for AI-powered candidate assessment and scoring.
 
### Getting Your API Key
 
1. Go to [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Create a new secret key
3. Copy it into your `.e nv` as `OPENAI_API_KEY`

---

## ElevenLabs Agent Setup

Aptly uses an ElevenLabs Conversational AI agent to conduct structured voice interviews with candidates.

### Creating the Agent

1. Go to [elevenlabs.io](https://elevenlabs.io) and navigate to **Conversational AI → Agents**
2. Create a new agent and configure the following:

### Dynamic Variables

| Variable    | Description                                                                                 |
| ----------- | --------------------------------------------------------------------------------------------|
| `questions` | The list of interview questions for the specific posting, injected per conversation session |

### Getting Your Credentials

After setup, copy the following values into your `.env`:

- `ELEVENLABS_API_KEY` — found under **Profile → API Keys**
- `ELEVENLABS_AGENT_ID` — found on the agent's settings page
