// create your RTK Query endpoints here
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// The quotesApi slice - handling API interactions for user data
export const quotesApi = createApi({
  // Unique key that defines where the data will be stored in the Redux state
  reducerPath: "quotesApi",
  // Setting up the base query with the base URL pointing to the backend service
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:9009/api/" }),
  // Defining the tags for the API slice
  tagTypes: ["Quotes"],
  // Endpoint definitions
  endpoints: (builder) => ({
    // getQuotes endpoint - fetches all quotes
    getQuotes: builder.query({
      query: () => "quotes",
      providesTags: ["Quotes"],
    }),
    // createQuote endpoint - creates a new quote
    createQuote: builder.mutation({
      query: (quote) => ({
        url: "quotes",
        method: "POST",
        body: quote,
      }),
      invalidatesTags: ["Quotes"],
    }),
    // deleteQuote endpoint - deletes a quote by ID
    deleteQuote: builder.mutation({
      query: (id) => ({
        url: `quotes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Quotes"],
    }),
    // toggleFake endpoint - toggles the apocryphal status of a quote
    toggleFake: builder.mutation({
      query: ({ id, apocryphal }) => ({
        url: `quotes/${id}`,
        method: "PUT",
        body: { apocryphal },
      }),
      invalidatesTags: ["Quotes"],
    }),
  }),
});

// Export the auto-generated hooks for the API endpoints
export const {
  useGetQuotesQuery,
  useCreateQuoteMutation,
  useDeleteQuoteMutation,
  useToggleFakeMutation,
} = quotesApi;
