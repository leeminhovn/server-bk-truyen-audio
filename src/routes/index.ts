import { Router } from "express";
import usersRouter from "./users.routes";
import storyRouter from "./storys.routes";
import adminRouter from "./admin.routes";

const routersApp = Router();
routersApp.use("/user", usersRouter);
routersApp.use("/storys", storyRouter);
routersApp.use("/admin", adminRouter);
export default routersApp;
