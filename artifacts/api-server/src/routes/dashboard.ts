import { Router, type IRouter } from "express";
import { GetDashboardResponse } from "@workspace/api-zod";
import { dashboardSummary } from "../lib/recruitment-data";

const router: IRouter = Router();

router.get("/dashboard", (_req, res): void => {
  res.json(GetDashboardResponse.parse(dashboardSummary));
});

export default router;