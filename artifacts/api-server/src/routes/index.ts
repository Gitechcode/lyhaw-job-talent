import { Router, type IRouter } from "express";
import healthRouter from "./health";
import jobsRouter from "./jobs";
import companiesRouter from "./companies";
import articlesRouter from "./articles";
import dashboardRouter from "./dashboard";
import storageRouter from "./storage";
import lessonsRouter from "./lessons";
import { verifyAdmin } from "../lib/admin-auth";

const router: IRouter = Router();

router.use(healthRouter);
router.use(jobsRouter);
router.use(companiesRouter);
router.use(articlesRouter);
router.use(dashboardRouter);
router.use(storageRouter);
router.post("/admin/session", verifyAdmin);
router.use(lessonsRouter);

export default router;
