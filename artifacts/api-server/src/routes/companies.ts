import { Router, type IRouter } from "express";
import {
  GetCompanyParams,
  GetCompanyResponse,
  ListCompaniesResponse,
} from "@workspace/api-zod";
import type { Company } from "@workspace/api-zod";
import {
  getCompanyDetail,
  recruitmentCompanies,
  addCompany,
  updateCompany,
  deleteCompany,
} from "../lib/recruitment-data";
import { requireAdmin } from "../lib/admin-auth";

const router: IRouter = Router();

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

// ── GET /companies ─────────────────────────────────────────────────────────────
router.get("/companies", (_req, res): void => {
  res.json(ListCompaniesResponse.parse(recruitmentCompanies));
});

// ── GET /companies/:slug ───────────────────────────────────────────────────────
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

// ── POST /companies ────────────────────────────────────────────────────────────
router.post("/companies", requireAdmin, (req, res): void => {
  const body = req.body as Record<string, unknown>;
  const name = String(body.name || "");
  if (!name) {
    res.status(400).json({ error: "name is required" });
    return;
  }

  const id = generateId();
  const slug = slugify(`${name}-${id.slice(-4)}`);

  const company: Company = {
    id,
    slug,
    name,
    industry: String(body.industry || "Other"),
    location: String(body.location || "Phnom Penh"),
    description: String(body.description || ""),
    website: body.website ? String(body.website) : null,
    logo: String(body.logo || ""),
    verified: Boolean(body.verified),
  };

  addCompany(company);
  res.status(201).json(company);
});

// ── PUT /companies/:id ─────────────────────────────────────────────────────────
router.put("/companies/:id", requireAdmin, (req, res): void => {
  const id = String(req.params.id);
  const body = req.body as Record<string, unknown>;

  const patch: Partial<Company> = {
    ...(body.name !== undefined && { name: String(body.name) }),
    ...(body.industry !== undefined && { industry: String(body.industry) }),
    ...(body.location !== undefined && { location: String(body.location) }),
    ...(body.description !== undefined && { description: String(body.description) }),
    ...(body.website !== undefined && { website: body.website ? String(body.website) : null }),
    ...(body.logo !== undefined && { logo: String(body.logo) }),
    ...(body.verified !== undefined && { verified: Boolean(body.verified) }),
  };

  const updated = updateCompany(id, patch);
  if (!updated) {
    res.status(404).json({ error: "Company not found" });
    return;
  }

  res.json(updated);
});

// ── DELETE /companies/:id ──────────────────────────────────────────────────────
router.delete("/companies/:id", requireAdmin, (req, res): void => {
  const id = String(req.params.id);
  const deleted = deleteCompany(id);
  if (!deleted) {
    res.status(404).json({ error: "Company not found" });
    return;
  }
  res.json({ success: true });
});

export default router;
