import { createApi } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";

/**
 * Custom GraphQL base query for RTK Query.
 *
 * The codegen-generated endpoints pass { document, variables } as the query arg.
 * This base query translates that into a proper GraphQL-over-HTTP POST request
 * with { query, variables } in the JSON body — exactly what Apollo Server expects.
 */
const graphqlBaseQuery: BaseQueryFn<
    { document: string; variables?: Record<string, any> },
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

        const json = await response.json();

        if (json.errors) {
            return {
                error: {
                    message: json.errors.map((e: any) => e.message).join("\n"),
                    status: response.status,
                },
            };
        }

        return { data: json.data };
    } catch (error: any) {
        return {
            error: {
                message: error.message || "GraphQL request failed",
            },
        };
    }
};

export const api = createApi({
    reducerPath: "api",
    baseQuery: graphqlBaseQuery,
    endpoints: () => ({}),
});
