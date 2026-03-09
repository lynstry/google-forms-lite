import { createApi } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";

interface GraphQLErrorShape {
    message: string;
}

const graphqlBaseQuery: BaseQueryFn<
    { document: string; variables?: unknown },
    unknown,
    { message: string; status?: number }
> = async (arg) => {
    try {
        const response = await fetch("/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: arg.document,
                variables: arg.variables,
            }),
        });

        const json = (await response.json()) as {
            data?: unknown;
            errors?: GraphQLErrorShape[];
        };

        if (json.errors) {
            return {
                error: {
                    message: json.errors.map((e) => e.message).join("\n"),
                    status: response.status,
                },
            };
        }

        return { data: json.data };
    } catch (error: unknown) {
        const message =
            error instanceof Error ? error.message : "GraphQL request failed";
        return {
            error: { message },
        };
    }
};

export const api = createApi({
    reducerPath: "api",
    baseQuery: graphqlBaseQuery,
    endpoints: () => ({}),
});
