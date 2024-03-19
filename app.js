import express from "express";

import booksRouter from "./routers/books.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Hello World" });
});

app.use("/books", booksRouter);

export default app;