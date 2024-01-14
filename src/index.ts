import express from "express";
import dotenv from "dotenv";
dotenv.config();

import bodyParser from "body-parser";
import usersRouter from "./routes/users.routes";
import datanaseServices from "~/services/database.services";
import postRotuer from "./routes/posts.routes";
import storyRouter from "./routes/storys.routes";
const cors = require("cors");

datanaseServices.connect();

const app = express();
app.use(cors());
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
app.use(postRotuer);
app.use("/storys", storyRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
