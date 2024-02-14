import { Router } from "express";
import usersRouter from "./users.routes";
import storyRouter from "./storys.routes";

const routersApp = Router();
routersApp.use("/user", usersRouter);
routersApp.use("/storys", storyRouter);
export default routersApp;
