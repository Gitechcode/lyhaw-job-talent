import { Router, type IRouter } from "express";
import {
  GetArticleParams,
  GetArticleResponse,
  ListArticlesResponse,
} from "@workspace/api-zod";
import type { ArticleDetail } from "@workspace/api-zod";
import {
  getArticleDetail,
  getArticlePreview,
  recruitmentArticles,
  addArticle,
  updateArticle,
  deleteArticle,
} from "../lib/recruitment-data";
import { requireAdmin } from "../lib/admin-auth";

const router: IRouter = Router();

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

// ── GET /articles ──────────────────────────────────────────────────────────────
router.get("/articles", (_req, res): void => {
  res.json(ListArticlesResponse.parse(recruitmentArticles.map(getArticlePreview)));
});

// ── GET /articles/:slug ────────────────────────────────────────────────────────
router.get("/articles/:slug", (req, res): void => {
  const params = GetArticleParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const article = getArticleDetail(params.data.slug);
  if (!article) {
    res.status(404).json({ error: "Article not found" });
    return;
  }

  res.json(GetArticleResponse.parse(article));
});

// ── POST /articles ─────────────────────────────────────────────────────────────
router.post("/articles", requireAdmin, (req, res): void => {
  const body = req.body as Record<string, unknown>;
  const title = String(body.title || "");
  if (!title) {
    res.status(400).json({ error: "title is required" });
    return;
  }

  const id = generateId();
  const slug = slugify(`${title}-${id.slice(-4)}`);

  const article: ArticleDetail = {
    id,
    slug,
    title,
    category: String(body.category || "Other"),
    excerpt: String(body.excerpt || ""),
    body: String(body.content || body.body || ""),
    author: String(body.author || "LY Haw Team"),
    image: String(body.image || ""),
    readTime: String(body.readTime || "3 min read"),
    publishedAt: new Date(),
  };

  addArticle(article);
  res.status(201).json(GetArticleResponse.parse(article));
});

// ── PUT /articles/:id ──────────────────────────────────────────────────────────
router.put("/articles/:id", requireAdmin, (req, res): void => {
  const id = String(req.params.id);
  const body = req.body as Record<string, unknown>;

  const patch: Partial<ArticleDetail> = {
    ...(body.title !== undefined && { title: String(body.title) }),
    ...(body.category !== undefined && { category: String(body.category) }),
    ...(body.excerpt !== undefined && { excerpt: String(body.excerpt) }),
    ...(body.content !== undefined && { body: String(body.content) }),
    ...(body.body !== undefined && { body: String(body.body) }),
    ...(body.author !== undefined && { author: String(body.author) }),
    ...(body.image !== undefined && { image: String(body.image) }),
    ...(body.readTime !== undefined && { readTime: String(body.readTime) }),
  };

  const updated = updateArticle(id, patch);
  if (!updated) {
    res.status(404).json({ error: "Article not found" });
    return;
  }

  res.json(GetArticleResponse.parse(updated));
});

// ── DELETE /articles/:id ───────────────────────────────────────────────────────
router.delete("/articles/:id", requireAdmin, (req, res): void => {
  const id = String(req.params.id);
  const deleted = deleteArticle(id);
  if (!deleted) {
    res.status(404).json({ error: "Article not found" });
    return;
  }
  res.json({ success: true });
});

export default router;
