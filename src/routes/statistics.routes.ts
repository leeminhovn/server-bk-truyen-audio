import { Router } from "express";
import {
  getStatisticAuthorController,
  getStatisticUserController,
  getStatisticsAdminController,
} from "~/controllers/statistics.controller";

const statisticsRouter = Router();

statisticsRouter.get("/statistics-admin", getStatisticsAdminController);
statisticsRouter.get("/statistics-author", getStatisticAuthorController);
statisticsRouter.get("/statistics-user", getStatisticUserController);
export default statisticsRouter;
