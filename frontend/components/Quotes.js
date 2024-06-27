import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setHighlightedQuote, toggleVisibility } from "../state/quotesSlice";
import {
  useGetQuotesQuery,
  useDeleteQuoteMutation,
  useToggleFakeMutation,
} from "../state/quotesApi"; // Import Slice

export default function Quotes() {
  const { data: quotes, isLoading, isError, error } = useGetQuotesQuery(); // Add the useGetQuotesQuery hook
  const [deleteQuote] = useDeleteQuoteMutation(); // Add the deleteQuote mutation
  const [toggleFake] = useToggleFakeMutation(); // Add the toggleFake mutation
  // Add the displayAllQuotes state
  const displayAllQuotes = useSelector(
    (state) => state.quotesState.displayAllQuotes
  );
  // Add the highlightedQuote state
  const highlightedQuote = useSelector(
    (state) => state.quotesState.highlightedQuote
  );
  const dispatch = useDispatch(); // Add the dispatch function

  // Add the loading and error states
  if (isLoading) return <div>Loading quotes...</div>;
  if (isError) return <div>Error loading quotes: {error.message}</div>;
  return (
    <div id="quotes">
      <h3>Quotes</h3>
      <div>
        {quotes
          ?.filter((qt) => {
            return displayAllQuotes || !qt.apocryphal;
          })
          .map((qt) => (
            <div
              key={qt.id}
              className={`quote${qt.apocryphal ? " fake" : ""}${
                highlightedQuote === qt.id ? " highlight" : ""
              }`}
            >
              <div>{qt.quoteText}</div>
              <div>{qt.authorName}</div>
              <div className="quote-buttons">
                <button onClick={() => deleteQuote(qt.id)}>DELETE</button>{" "}
                {/* Add the deleteQuote mutation */}
                <button onClick={() => dispatch(setHighlightedQuote(qt.id))}>
                  HIGHLIGHT
                </button>{" "}
                {/* Add the dispatch function for Highlight */}
                <button
                  onClick={() =>
                    toggleFake({ id: qt.id, apocryphal: !qt.apocryphal })
                  }
                >
                  FAKE
                </button>{" "}
                {/* Add the toggleFake mutation */}
              </div>
            </div>
          ))}
        {!quotes?.length && "No quotes here! Go write some."}
      </div>
      {!!quotes?.length && (
        <button onClick={() => dispatch(toggleVisibility())}>
          {displayAllQuotes ? "HIDE" : "SHOW"} FAKE QUOTES
        </button>
      )}
    </div>
  );
}
