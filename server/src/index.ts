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

// ----- In-Memory Data Store -----
const forms: any[] = [];
const responses: any[] = [];

// Helper to generate IDs
const generateId = () => Math.random().toString(36).substring(2, 11);

const resolvers = {
    Query: {
        forms: () => forms,
        form: (_: unknown, { id }: { id: string }) => {
            return forms.find((f) => f.id === id) || null;
        },
        responses: (_: unknown, { formId }: { formId: string }) => {
            return responses.filter((r) => r.formId === formId);
        },
    },
    Mutation: {
        createForm: (_: unknown, { input }: { input: any }) => {
            const newForm = {
                id: generateId(),
                title: input.title,
                description: input.description,
                questions: input.questions.map((q: any) => ({
                    ...q,
                    id: generateId(),
                })),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            forms.push(newForm);
            return newForm;
        },
        submitResponse: (_: unknown, { input }: { input: any }) => {
            const newResponse = {
                id: generateId(),
                formId: input.formId,
                answers: input.answers,
                submittedAt: new Date().toISOString(),
            };
            responses.push(newResponse);
            return newResponse;
        },
    },
};

// ----- Server Bootstrap -----

async function startServer() {
    const app = express();
    const PORT = Number(process.env.PORT) || 4000;

    const server = new ApolloServer({
        typeDefs,
        resolvers,
    });

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
