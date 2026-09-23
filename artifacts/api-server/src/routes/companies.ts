import { Router, type IRouter } from "express";
import {
  GetCompanyParams,
  GetCompanyResponse,
  ListCompaniesResponse,
} from "@workspace/api-zod";
import {
  getCompanyDetail,
  recruitmentCompanies,
} from "../lib/recruitment-data";

const router: IRouter = Router();

router.get("/companies", (_req, res): void => {
  res.json(ListCompaniesResponse.parse(recruitmentCompanies));
});

router.get("/companies/:slug", (req, res): void => {
  const params = GetCompanyParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const company = getCompanyDetail(params.data.slug);
  if (!company) {
    res.status(404).json({ error: "Company not found" });
    return;
  }

  res.json(GetCompanyResponse.parse(company));
});

export default router;