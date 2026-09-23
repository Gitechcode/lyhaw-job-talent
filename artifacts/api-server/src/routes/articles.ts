import { Router, type IRouter } from "express";
import {
  GetArticleParams,
  GetArticleResponse,
  ListArticlesResponse,
} from "@workspace/api-zod";
import {
  getArticleDetail,
  getArticlePreview,
  recruitmentArticles,
} from "../lib/recruitment-data";

const router: IRouter = Router();

router.get("/articles", (_req, res): void => {
  res.json(ListArticlesResponse.parse(recruitmentArticles.map(getArticlePreview)));
});

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

export default router;