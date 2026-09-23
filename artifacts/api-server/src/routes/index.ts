import { Router, type IRouter } from "express";
import healthRouter from "./health";
import jobsRouter from "./jobs";
import companiesRouter from "./companies";
import articlesRouter from "./articles";
import dashboardRouter from "./dashboard";

const router: IRouter = Router();

router.use(healthRouter);
router.use(jobsRouter);
router.use(companiesRouter);
router.use(articlesRouter);
router.use(dashboardRouter);

export default router;
