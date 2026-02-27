import { createApi } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";

/**
 * The shape of a single error object returned by Apollo Server in the
 * `errors` array of a GraphQL response.
 */
interface GraphQLErrorShape {
    message: string;
}

/**
 * Custom GraphQL base query for RTK Query.
 *
 * The codegen-generated endpoints pass { document, variables } as the query arg.
 * This base query translates that into a proper GraphQL-over-HTTP POST request
 * with { query, variables } in the JSON body — exactly what Apollo Server expects.
 */
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
