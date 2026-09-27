import { Router, type IRouter } from "express";
import { RequestUploadUrlBody, RequestUploadUrlResponse } from "@workspace/api-zod";
import { createCvUploadUrl, validateCvMetadata } from "../lib/cv-storage";

const router: IRouter = Router();

router.post("/storage/uploads/request-url", async (req, res): Promise<void> => {
  const parsed = RequestUploadUrlBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Missing or invalid upload fields" });
    return;
  }

  const validationError = validateCvMetadata(parsed.data);
  if (validationError) {
    res.status(400).json({ error: validationError });
    return;
  }

  try {
    res.json(RequestUploadUrlResponse.parse(await createCvUploadUrl(parsed.data)));
  } catch (error) {
    req.log.error({ err: error }, "Error generating CV upload URL");
    res.status(500).json({ error: "មិនអាចរៀបចំការបញ្ចូល CV បានទេ" });
  }
});

export default router;
