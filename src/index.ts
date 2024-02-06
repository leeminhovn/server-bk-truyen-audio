import express, { Request } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";

dotenv.config();

import usersRouter from "./routes/users.routes";

import storyRouter from "./routes/storys.routes";
import databaseServices from "./services/database.services";
databaseServices.connect();

const app = express();

app.use(cors<Request>());
app.use(express.json({ limit: "500mb" }));

app.use(
  bodyParser.json({
    limit: "500mb",
  }),
);

app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: "500mb",
  }),
);
const port = 5000;

app.use("/user", usersRouter);
app.use("/storys", storyRouter);

app.listen(port, () => {
  console.log(`App server listening on port ${port}`);
});
