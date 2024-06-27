import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setHighlightedQuote, toggleVisibility } from "../state/quotesSlice";

export default function Quotes() {
  const quotes = [
    {
      id: 1,
      quoteText: "Don't cry because it's over, smile because it happened.",
      authorName: "Dr. Seuss",
      apocryphal: true,
    },
    {
      id: 2,
      quoteText: "So many books, so little time.",
      authorName: "Frank Zappa",
      apocryphal: false,
    },
    {
      id: 3,
      quoteText: "Be yourself; everyone else is already taken.",
      authorName: "Oscar Wilde",
      apocryphal: false,
    },
  ];
  const displayAllQuotes = useSelector((st) => st.quotesState.displayAllQuotes);
  const highlightedQuote = useSelector((st) => st.quotesState.highlightedQuote);
  const dispatch = useDispatch();
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
                <button>DELETE</button>
                <button onClick={() => dispatch(setHighlightedQuote(qt.id))}>
                  HIGHLIGHT
                </button>
                <button>FAKE</button>
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
