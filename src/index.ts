import express, { Request } from "express";
import dotenv from "dotenv";
dotenv.config();
import http from "http";
import fs from "fs";
import bodyParser from "body-parser";
import usersRouter from "./routes/users.routes";
import datanaseServices from "~/services/database.services";
import storyRouter from "./routes/storys.routes";
import cors from "cors";

import https from "https";
import path from "path";

datanaseServices.connect();

const app = express();

const sslServer = https.createServer(
  {
    key: fs.readFileSync(path.join(__dirname, "config/cetificates/key.pem")),
    cert: fs.readFileSync(path.join(__dirname, "config/cetificates/cert.pem")),
  },
  app,
);

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

sslServer.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
