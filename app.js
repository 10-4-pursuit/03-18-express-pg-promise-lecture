import express from "express";

import booksRouter from "./routers/books.js";
import usersRouter from "./routers/users.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Hello World" });
});

app.use("/books", booksRouter);
app.use("/users", usersRouter);

export default app;