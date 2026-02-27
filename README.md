# Google Forms Lite

A simplified clone of Google Forms with core functionality for form creation, viewing, and submission. With this app you can create forms with different types of questions such as text, multiple choice, checkboxes, and date, mark questions as required, and fill out existing forms. Users have access to all submitted responses and can view them per form.

## Tech Stack

**Frontend:** React, TypeScript, Redux Toolkit, RTK Query, React Router, Vite, plain CSS  
**Backend:** Node.js, TypeScript, Apollo Server, Express, GraphQL  
**Tooling:** npm workspaces (monorepo), GraphQL codegen, concurrently

## Project Structure

```
google-forms-lite/
├── client/          # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── store/
│   │   └── graphql/
├── server/          # Node.js GraphQL backend
│   └── src/
└── package.json     # Root monorepo config
```

## Prerequisites

- Node.js (v18+ or v20+)
- npm (comes with Node.js)

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/lynstry/google-forms-lite.git
cd google-forms-lite
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open your browser:
   - **Frontend:** http://localhost:5173
   - **GraphQL API:** http://localhost:4000/graphql

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts client and server concurrently |
| `npm run dev -w server` | Starts only the server |
| `npm run dev -w client` | Starts only the client |
| `npm run generate -w client` | Re-runs GraphQL code generation |

## Notes

1. Data is **in-memory only** - a server restart will reset all data.
2. No authentication is implemented.
