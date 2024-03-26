import { Router } from "express";
import { getStatisticAuthorController, getStatisticsAdminController } from "~/controllers/statistics.controller";

const statisticsRouter = Router();

statisticsRouter.get("/statistics-admin", getStatisticsAdminController);
statisticsRouter.get("/statistics-author", getStatisticAuthorController);
export default statisticsRouter;
