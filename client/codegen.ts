import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
    // Point to the schema file in the server directory
    schema: "../server/src/schema.graphql",
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
    // Silently skip if no .graphql document files exist yet
    ignoreNoDocuments: true,
};

export default config;
