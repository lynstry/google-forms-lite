#!/usr/bin/env bash
# ============================================================================
# Google Forms Lite — Boilerplate Setup Script
# ============================================================================
# Usage:  chmod +x setup.sh && ./setup.sh
# This creates the full monorepo, installs deps, and leaves you ready to run.
# ============================================================================

set -euo pipefail

PROJECT="google-forms-lite"

echo "🚀 Creating $PROJECT monorepo..."
mkdir -p "$PROJECT"
cd "$PROJECT"

# ── Root package.json ───────────────────────────────────────────────────────
cat > package.json << 'EOF'
{
  "name": "google-forms-lite",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "client",
    "server"
  ],
  "scripts": {
    "dev": "concurrently -n server,client -c blue,green \"npm run dev -w server\" \"npm run dev -w client\"",
    "build": "npm run build -w server && npm run build -w client"
  },
  "devDependencies": {
    "concurrently": "^9.1.2"
  }
}
EOF

# ── .gitignore ──────────────────────────────────────────────────────────────
cat > .gitignore << 'EOF'
node_modules/
dist/
.vite/
*.tsbuildinfo
.env
.env.local
EOF

# ============================================================================
# SERVER WORKSPACE
# ============================================================================
echo "📦 Scaffolding server..."
mkdir -p server/src

cat > server/package.json << 'EOF'
{
  "name": "server",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "@apollo/server": "^4.11.3",
    "cors": "^2.8.5",
    "express": "^4.21.2",
    "graphql": "^16.10.0",
    "graphql-tag": "^2.12.6"
  },
  "devDependencies": {
    "@types/cors": "^2.8.17",
    "@types/express": "^5.0.0",
    "@types/node": "^22.13.4",
    "tsx": "^4.19.3",
    "typescript": "^5.7.3"
  }
}
EOF

cat > server/tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "esModuleInterop": true,
    "strict": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
EOF

# ── GraphQL Schema ──────────────────────────────────────────────────────────
cat > server/src/schema.graphql << 'EOF'
enum QuestionType {
  SHORT_ANSWER
  PARAGRAPH
  MULTIPLE_CHOICE
  CHECKBOX
  DROPDOWN
}

type Form {
  id: ID!
  title: String!
  description: String
  questions: [Question!]!
  createdAt: String!
  updatedAt: String!
}

type Question {
  id: ID!
  text: String!
  type: QuestionType!
  options: [String!]
  required: Boolean!
  order: Int!
}

type Answer {
  questionId: ID!
  value: String!
}

type FormResponse {
  id: ID!
  formId: ID!
  answers: [Answer!]!
  submittedAt: String!
}

input QuestionInput {
  text: String!
  type: QuestionType!
  options: [String!]
  required: Boolean!
  order: Int!
}

input AnswerInput {
  questionId: ID!
  value: String!
}

input CreateFormInput {
  title: String!
  description: String
  questions: [QuestionInput!]!
}

input SubmitResponseInput {
  formId: ID!
  answers: [AnswerInput!]!
}

type Query {
  forms: [Form!]!
  form(id: ID!): Form
}

type Mutation {
  createForm(input: CreateFormInput!): Form!
  submitResponse(input: SubmitResponseInput!): FormResponse!
}
EOF

# ── Apollo Server entry point ───────────────────────────────────────────────
cat > server/src/index.ts << 'TSEOF'
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import express from "express";
import cors from "cors";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read the schema file
const typeDefs = readFileSync(resolve(__dirname, "schema.graphql"), "utf-8");

// ----- Mock / Stub Resolvers -----
const resolvers = {
  Query: {
    forms: () => [],
    form: (_: unknown, { id }: { id: string }) => {
      console.log(`Stub: fetching form ${id}`);
      return null;
    },
  },
  Mutation: {
    createForm: (_: unknown, { input }: { input: unknown }) => {
      console.log("Stub: createForm called with", input);
      return {
        id: "stub-id",
        title: "Stub Form",
        description: null,
        questions: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    },
    submitResponse: (_: unknown, { input }: { input: unknown }) => {
      console.log("Stub: submitResponse called with", input);
      return {
        id: "stub-response-id",
        formId: "stub-form-id",
        answers: [],
        submittedAt: new Date().toISOString(),
      };
    },
  },
};

// ----- Server Bootstrap -----
async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 4000;

  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();

  app.use(
    "/graphql",
    cors<cors.CorsRequest>(),
    express.json(),
    expressMiddleware(server)
  );

  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
TSEOF

# ============================================================================
# CLIENT WORKSPACE
# ============================================================================
echo "📦 Scaffolding client..."
mkdir -p client/src/store
mkdir -p client/src/graphql

cat > client/package.json << 'EOF'
{
  "name": "client",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "generate": "graphql-codegen --config codegen.ts"
  },
  "dependencies": {
    "@reduxjs/toolkit": "^2.6.1",
    "graphql": "^16.10.0",
    "graphql-request": "^7.1.2",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-redux": "^9.2.0",
    "react-router-dom": "^7.2.0"
  },
  "devDependencies": {
    "@graphql-codegen/cli": "^5.0.4",
    "@graphql-codegen/typescript": "^4.1.3",
    "@graphql-codegen/typescript-operations": "^4.4.1",
    "@graphql-codegen/typescript-rtk-query": "^3.1.2",
    "@types/react": "^19.0.8",
    "@types/react-dom": "^19.0.3",
    "@vitejs/plugin-react": "^4.3.4",
    "typescript": "^5.7.3",
    "vite": "^6.1.0"
  }
}
EOF

cat > client/tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["src", "codegen.ts"]
}
EOF

cat > client/vite.config.ts << 'EOF'
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/graphql": {
        target: "http://localhost:4000",
        changeOrigin: true,
      },
    },
  },
});
EOF

# ── GraphQL Codegen config ──────────────────────────────────────────────────
cat > client/codegen.ts << 'EOF'
import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "http://localhost:4000/graphql",
  documents: "src/**/*.graphql",
  generates: {
    "./src/store/api.generated.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-rtk-query",
      ],
      config: {
        importBaseApiFrom: "./emptyApi",
        exportHooks: true,
      },
    },
  },
  ignoreNoDocuments: true,
};

export default config;
EOF

# ── RTK Query empty API slice ──────────────────────────────────────────────
cat > client/src/store/emptyApi.ts << 'EOF'
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

/**
 * Empty base API for RTK Query.
 * GraphQL Codegen will inject endpoints into this via api.generated.ts.
 */
export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "/graphql" }),
  endpoints: () => ({}),
});
EOF

# ── Redux store ─────────────────────────────────────────────────────────────
cat > client/src/store/store.ts << 'EOF'
import { configureStore } from "@reduxjs/toolkit";
import { api } from "./emptyApi";

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
EOF

# ── Sample GraphQL operations ───────────────────────────────────────────────
cat > client/src/graphql/operations.graphql << 'EOF'
query GetForms {
  forms {
    id
    title
    description
    createdAt
  }
}

query GetForm($id: ID!) {
  form(id: $id) {
    id
    title
    description
    questions {
      id
      text
      type
      options
      required
      order
    }
    createdAt
    updatedAt
  }
}

mutation CreateForm($input: CreateFormInput!) {
  createForm(input: $input) {
    id
    title
    description
    questions {
      id
      text
      type
      options
      required
      order
    }
    createdAt
    updatedAt
  }
}

mutation SubmitResponse($input: SubmitResponseInput!) {
  submitResponse(input: $input) {
    id
    formId
    answers {
      questionId
      value
    }
    submittedAt
  }
}
EOF

# ── HTML entry point ────────────────────────────────────────────────────────
cat > client/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Google Forms Lite - A lightweight form builder" />
    <title>Google Forms Lite</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
EOF

# ── React entry point ──────────────────────────────────────────────────────
cat > client/src/main.tsx << 'EOF'
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { store } from "./store/store";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
EOF

# ── App component ───────────────────────────────────────────────────────────
cat > client/src/App.tsx << 'EOF'
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div style={{ padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
      <h1>📝 Google Forms Lite</h1>
      <p>Boilerplate is working! Start building your components.</p>

      <Routes>
        <Route path="/" element={<Home />} />
        {/* TODO: Add more routes here */}
      </Routes>
    </div>
  );
}

function Home() {
  return (
    <div>
      <h2>Home</h2>
      <p>Your forms will appear here.</p>
    </div>
  );
}

export default App;
EOF

# ── Vite env declaration (prevents TS errors with import.meta.env) ──────
cat > client/src/vite-env.d.ts << 'EOF'
/// <reference types="vite/client" />
EOF

# ============================================================================
# INSTALL DEPENDENCIES
# ============================================================================
echo ""
echo "📥 Installing dependencies (this may take a minute)..."
npm install

echo ""
echo "============================================"
echo "✅ Setup complete!"
echo "============================================"
echo ""
echo "To start developing:"
echo "  cd $PROJECT"
echo "  npm run dev          # Starts both server & client"
echo ""
echo "To generate RTK Query hooks from the GraphQL schema:"
echo "  1. Make sure the server is running (npm run dev -w server)"
echo "  2. npm run generate -w client"
echo ""
echo "Server:  http://localhost:4000/graphql"
echo "Client:  http://localhost:5173"
echo ""
