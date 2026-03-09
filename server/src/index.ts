import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import express from "express";
import cors from "cors";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { Form, FormResponse, Question, CreateFormInput, SubmitResponseInput } from "shared";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const typeDefs = readFileSync(resolve(__dirname, "schema.graphql"), "utf-8");


const forms: Form[] = [];
const responses: FormResponse[] = [];

const generateId = (): string => Math.random().toString(36).substring(2, 11);

const resolvers = {
    Query: {
        forms: (): Form[] => forms,
        form: (_: unknown, { id }: { id: string }): Form | null => {
            return forms.find((f) => f.id === id) ?? null;
        },
        responses: (_: unknown, { formId }: { formId: string }): FormResponse[] => {
            return responses.filter((r) => r.formId === formId);
        },
    },
    Mutation: {
        createForm: (_: unknown, { input }: { input: CreateFormInput }): Form => {
            const newForm: Form = {
                id: generateId(),
                title: input.title,
                description: input.description ?? null,
                questions: input.questions.map((q) => ({
                    ...q,
                    id: generateId(),
                    options: q.options ?? null,
                })),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            forms.push(newForm);
            return newForm;
        },
        submitResponse: (_: unknown, { input }: { input: SubmitResponseInput }): FormResponse => {
            const newResponse: FormResponse = {
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

async function startServer(): Promise<void> {
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

startServer().catch((err: unknown) => {
    console.error("Failed to start server:", err);
    process.exit(1);
});
