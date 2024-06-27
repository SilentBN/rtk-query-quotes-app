const express = require("express");
const cors = require("cors");
const path = require("path");
const Yup = require("yup");
const rateLimit = require("express-rate-limit"); // Add this line

const PORT = process.env.PORT || 9009;

const server = express();

// Create a rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

// Apply rate limiter to all requests
server.use(limiter);

server.use(express.json());

server.use(express.static(path.join(__dirname, "../dist")));

server.use(cors());

let id = 1;
const getNextId = () => id++;
let quotes = [
  {
    id: getNextId(),
    quoteText:
      "The success of every woman should be the inspiration to another. We should raise each other up.",
    authorName: "Serena Williams",
    apocryphal: false,
  },
  {
    id: getNextId(),
    quoteText:
      "My mother told me to be a lady. And for her, that meant be your own person, be independent.",
    authorName: "Ruth Bader Ginsburg",
    apocryphal: false,
  },
  {
    id: getNextId(),
    quoteText:
      "Do not follow where the path may lead. Go instead where there is no path and leave a trail.",
    authorName: "Muriel Strode",
    apocryphal: false,
  },
  {
    id: getNextId(),
    quoteText: "You are never too small to make a difference.",
    authorName: "Greta Thunberg",
    apocryphal: false,
  },
];

server.get("/api/quotes", (_, res) => {
  res.json(quotes);
});

server.delete("/api/quotes/:id", (req, res, next) => {
  const quote = quotes.find((qt) => qt.id == req.params.id);
  if (!quote) {
    return next({ status: 404, message: "Quote not found" });
  }
  quotes = quotes.filter((qt) => qt.id != req.params.id);
  res.json(quote);
});

const putSchema = Yup.object()
  .shape({
    authorName: Yup.string().nullable().min(3),
    quoteText: Yup.string().nullable().min(3),
    apocryphal: Yup.boolean().nullable(),
  })
  .test("at-least-one-field", "Provide properties to update", function (obj) {
    return (
      obj.authorName != null || obj.quoteText != null || obj.apocryphal != null
    );
  });
server.put("/api/quotes/:id", async (req, res, next) => {
  const quote = quotes.find((qt) => qt.id == req.params.id);
  if (!quote) {
    return next({ status: 404, message: "Quote not found" });
  }
  try {
    const { authorName, quoteText, apocryphal } = await putSchema.validate(
      req.body,
      { stripUnknown: true }
    );
    if (authorName) quote.authorName = authorName;
    if (quoteText) quote.quoteText = quoteText;
    if (apocryphal != undefined) quote.apocryphal = apocryphal;
    res.json(quote);
  } catch ({ message }) {
    return next({ status: 422, message });
  }
});

const postSchema = Yup.object().shape({
  authorName: Yup.string()
    .required("`authorName` required")
    .min(3, "authorName too short"),
  quoteText: Yup.string()
    .required("`quoteText` required")
    .min(3, "`quoteText` too short"),
  apocryphal: Yup.boolean().nullable(),
});
server.post("/api/quotes", async (req, res, next) => {
  try {
    const { authorName, quoteText, apocryphal } = await postSchema.validate(
      req.body,
      { stripUnknown: true }
    );
    const newQuote = { id: getNextId(), authorName, quoteText };
    if (apocryphal != undefined) newQuote.apocryphal = apocryphal;
    else newQuote.apocryphal = false;
    quotes.push(newQuote);
    res.status(201).json(newQuote);
  } catch ({ message }) {
    return next({ status: 422, message });
  }
});

server.get("*", limiter, (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

server.use((req, res) => {
  res.status(404).json({
    message: `Endpoint [${req.method}] ${req.path} does not exist`,
  });
});

server.use((err, req, res, next) => {
  // eslint-disable-line
  const message = err.message || "Unknown error happened";
  const status = err.status || 500;
  const reason = err.reason;
  const payload = { message };
  if (reason) payload.reason = reason;
  res.status(status).json(payload);
});

server.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
