import express, { Request } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";

dotenv.config();

import databaseServices from "./services/database.services";
import routersApp from "./routes";
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

app.use(routersApp);

app.listen(port, () => {
  console.log(`App server listening on port ${port}`);
});
