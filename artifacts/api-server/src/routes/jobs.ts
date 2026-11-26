import { Router, type IRouter } from "express";
import {
  GetJobParams,
  GetJobResponse,
  ListJobsQueryParams,
  ListJobsResponse,
} from "@workspace/api-zod";
import type { Job } from "@workspace/api-zod";
import {
  recruitmentJobs,
  recruitmentCompanies,
  addJob,
  updateJob,
  deleteJob,
} from "../lib/recruitment-data";
import { requireAdmin } from "../lib/admin-auth";

const router: IRouter = Router();

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

// ── GET /jobs ──────────────────────────────────────────────────────────────────
router.get("/jobs", (req, res): void => {
  const parsed = ListJobsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { search, category, location, jobType, workArrangement, featured, urgent, sort, page, limit } =
    parsed.data;
  const normalizedSearch = search?.trim().toLowerCase();
  const filtered = recruitmentJobs
    .filter((job) => {
      if (
        normalizedSearch &&
        ![
          job.position,
          job.titleKhmer,
          job.titleEnglish,
          job.company.name,
          job.category,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearch)
      ) {
        return false;
      }
      if (category && job.category !== category) return false;
      if (location && job.location !== location) return false;
      if (jobType && job.jobType !== jobType) return false;
      if (workArrangement && job.workArrangement !== workArrangement) return false;
      if (featured !== undefined && job.featured !== featured) return false;
      if (urgent !== undefined && job.urgent !== urgent) return false;
      return true;
    })
    .sort((a, b) => {
      if (sort === "deadline") return a.deadline.getTime() - b.deadline.getTime();
      if (sort === "salary") return b.salary.localeCompare(a.salary);
      return b.publishedAt.getTime() - a.publishedAt.getTime();
    });

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;
  const data = filtered.slice(start, start + limit);

  res.json(ListJobsResponse.parse({ data, meta: { page, limit, total, totalPages } }));
});

router.get("/admin/jobs", requireAdmin, (_req, res): void => {
  res.json({
    data: recruitmentJobs,
    meta: { page: 1, limit: recruitmentJobs.length, total: recruitmentJobs.length, totalPages: 1 },
  });
});

// ── GET /jobs/:slug ────────────────────────────────────────────────────────────
router.get("/jobs/:slug", (req, res): void => {
  const params = GetJobParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const job = recruitmentJobs.find((item) => item.slug === params.data.slug);
  if (!job) {
    res.status(404).json({ error: "Recruitment post not found" });
    return;
  }

  res.json(GetJobResponse.parse(job));
});

// ── POST /jobs ─────────────────────────────────────────────────────────────────
router.post("/jobs", requireAdmin, (req, res): void => {
  const body = req.body as Record<string, unknown>;

  const titleEnglish = String(body.titleEnglish || "");
  if (!titleEnglish) {
    res.status(400).json({ error: "titleEnglish is required" });
    return;
  }

  // Resolve company
  const companyId = String(body.companyId || "");
  const company = recruitmentCompanies.find((c) => c.id === companyId) ?? recruitmentCompanies[0];
  if (!company) {
    res.status(400).json({ error: "No companies available" });
    return;
  }

  const id = generateId();
  const slug = slugify(`${titleEnglish}-${company.name}-${id.slice(-4)}`);
  const reference = `LYH-${Date.now().toString().slice(-4)}`;

  const toArray = (v: unknown): string[] => {
    if (Array.isArray(v)) return v.map(String);
    if (typeof v === "string") return v.split("\n").map(s => s.trim()).filter(Boolean);
    return [];
  };

  const job: Job = {
    id,
    reference,
    slug,
    titleKhmer: String(body.titleKhmer || ""),
    titleEnglish,
    position: titleEnglish,
    company,
    category: String(body.category || "Other"),
    location: String(body.location || "Phnom Penh"),
    jobType: String(body.jobType || "Full-time"),
    workArrangement: String(body.workArrangement || "On-site"),
    salary: String(body.salary || ""),
    vacancies: Number(body.vacancies) || 1,
    experience: String(body.experience || ""),
    education: String(body.education || ""),
    summary: String(body.summary || ""),
    description: String(body.description || ""),
    responsibilities: toArray(body.responsibilities),
    requirements: toArray(body.requirements),
    benefits: toArray(body.benefits),
    skills: toArray(body.skills),
    applicationInstructions: String(body.applicationInstructions || ""),
    applicationEmail: String(body.applicationEmail || ""),
    applicationPhone: String(body.applicationPhone || ""),
    telegram: String(body.telegram || ""),
    publishedAt: new Date(),
    deadline: body.deadline ? new Date(String(body.deadline)) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    featured: Boolean(body.featured),
    urgent: Boolean(body.urgent),
    coverImage: null,
    posterImage: null,
    gallery: [],
  };

  addJob(job);
  res.status(201).json(GetJobResponse.parse(job));
});

// ── PUT /jobs/:id ──────────────────────────────────────────────────────────────
router.put("/jobs/:id", requireAdmin, (req, res): void => {
  const id = String(req.params.id);
  const body = req.body as Record<string, unknown>;

  const toArray = (v: unknown): string[] | undefined => {
    if (v === undefined) return undefined;
    if (Array.isArray(v)) return v.map(String);
    if (typeof v === "string") return v.split("\n").map(s => s.trim()).filter(Boolean);
    return undefined;
  };

  // Resolve company if companyId provided
  let companyPatch: Pick<Job, "company"> | undefined;
  if (body.companyId) {
    const company = recruitmentCompanies.find((c) => c.id === String(body.companyId));
    if (company) companyPatch = { company };
  }

  const patch: Partial<Job> = {
    ...(body.titleEnglish !== undefined && { titleEnglish: String(body.titleEnglish), position: String(body.titleEnglish) }),
    ...(body.titleKhmer !== undefined && { titleKhmer: String(body.titleKhmer) }),
    ...(body.category !== undefined && { category: String(body.category) }),
    ...(body.location !== undefined && { location: String(body.location) }),
    ...(body.jobType !== undefined && { jobType: String(body.jobType) }),
    ...(body.workArrangement !== undefined && { workArrangement: String(body.workArrangement) }),
    ...(body.salary !== undefined && { salary: String(body.salary) }),
    ...(body.experience !== undefined && { experience: String(body.experience) }),
    ...(body.education !== undefined && { education: String(body.education) }),
    ...(body.summary !== undefined && { summary: String(body.summary) }),
    ...(body.description !== undefined && { description: String(body.description) }),
    ...(body.deadline !== undefined && { deadline: new Date(String(body.deadline)) }),
    ...(body.featured !== undefined && { featured: Boolean(body.featured) }),
    ...(body.urgent !== undefined && { urgent: Boolean(body.urgent) }),
    ...(body.applicationEmail !== undefined && { applicationEmail: String(body.applicationEmail) }),
    ...(body.applicationPhone !== undefined && { applicationPhone: String(body.applicationPhone) }),
    ...(body.telegram !== undefined && { telegram: String(body.telegram) }),
    ...(toArray(body.responsibilities) !== undefined && { responsibilities: toArray(body.responsibilities) }),
    ...(toArray(body.requirements) !== undefined && { requirements: toArray(body.requirements) }),
    ...(toArray(body.benefits) !== undefined && { benefits: toArray(body.benefits) }),
    ...(toArray(body.skills) !== undefined && { skills: toArray(body.skills) }),
    ...companyPatch,
  };

  const updated = updateJob(id, patch);
  if (!updated) {
    res.status(404).json({ error: "Job not found" });
    return;
  }

  res.json(GetJobResponse.parse(updated));
});

// ── DELETE /jobs/:id ───────────────────────────────────────────────────────────
router.delete("/jobs/:id", requireAdmin, (req, res): void => {
  const id = String(req.params.id);
  const deleted = deleteJob(id);
  if (!deleted) {
    res.status(404).json({ error: "Job not found" });
    return;
  }
  res.json({ success: true });
});

export default router;
