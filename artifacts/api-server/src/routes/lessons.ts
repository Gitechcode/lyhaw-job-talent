import { Router, type IRouter } from "express";
import { requireAdmin } from "../lib/admin-auth";
import {
  addLesson,
  deleteLesson,
  generateId,
  recruitmentLessons,
  updateLesson,
  type AdminLesson,
} from "../lib/recruitment-data";

const router: IRouter = Router();

function cleanLines(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String).map((item) => item.trim()).filter(Boolean);
  return String(value || "").split("\n").map((item) => item.trim()).filter(Boolean);
}

router.get("/lessons", (req, res): void => {
  const includeDrafts = req.query.admin === "true";
  if (includeDrafts) {
    requireAdmin(req, res, () => res.json(recruitmentLessons));
    return;
  }
  res.json(recruitmentLessons.filter((lesson) => lesson.published));
});

router.post("/lessons", requireAdmin, (req, res): void => {
  const body = req.body as Record<string, unknown>;
  const title = String(body.title || "").trim();
  const summary = String(body.summary || "").trim();
  if (!title || !summary) {
    res.status(400).json({ error: "title and summary are required" });
    return;
  }
  const now = new Date().toISOString();
  const lesson: AdminLesson = {
    id: generateId(), title,
    category: String(body.category || "ជំនាញការងារ"),
    level: String(body.level || "មូលដ្ឋាន"),
    duration: String(body.duration || "15 នាទី"),
    summary, lessons: cleanLines(body.lessons),
    published: body.published !== false,
    createdAt: now, updatedAt: now,
  };
  res.status(201).json(addLesson(lesson));
});

router.put("/lessons/:id", requireAdmin, (req, res): void => {
  const body = req.body as Record<string, unknown>;
  const updated = updateLesson(String(req.params.id), {
    ...(body.title !== undefined && { title: String(body.title).trim() }),
    ...(body.category !== undefined && { category: String(body.category) }),
    ...(body.level !== undefined && { level: String(body.level) }),
    ...(body.duration !== undefined && { duration: String(body.duration) }),
    ...(body.summary !== undefined && { summary: String(body.summary).trim() }),
    ...(body.lessons !== undefined && { lessons: cleanLines(body.lessons) }),
    ...(body.published !== undefined && { published: Boolean(body.published) }),
  });
  if (!updated) { res.status(404).json({ error: "Lesson not found" }); return; }
  res.json(updated);
});

router.delete("/lessons/:id", requireAdmin, (req, res): void => {
  if (!deleteLesson(String(req.params.id))) { res.status(404).json({ error: "Lesson not found" }); return; }
  res.json({ success: true });
});

export default router;
