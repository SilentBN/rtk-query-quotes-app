import { configureStore } from "@reduxjs/toolkit";
import quotesReducer from "./quotesSlice";
import { quotesApi } from "./quotesApi"; // Import the API slice

export const store = configureStore({
  reducer: {
    quotesState: quotesReducer,
    [quotesApi.reducerPath]: quotesApi.reducer, // Add the generated quotesApi reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(quotesApi.middleware), // Add the generated quotesApi middleware
});
