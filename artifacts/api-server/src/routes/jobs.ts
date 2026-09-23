import { Router, type IRouter } from "express";
import {
  GetJobParams,
  GetJobResponse,
  ListJobsQueryParams,
  ListJobsResponse,
} from "@workspace/api-zod";
import { recruitmentJobs } from "../lib/recruitment-data";

const router: IRouter = Router();

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

  const response = {
    data,
    meta: { page, limit, total, totalPages },
  };
  res.json(ListJobsResponse.parse(response));
});

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

export default router;