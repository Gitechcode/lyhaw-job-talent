import { randomUUID } from "node:crypto";

const REPLIT_SIDECAR_ENDPOINT = "http://127.0.0.1:1106";
const MAX_CV_BYTES = 10 * 1024 * 1024;
const ALLOWED_CV_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

export type CvUploadMetadata = {
  name: string;
  size: number;
  contentType: string;
};

export function validateCvMetadata(metadata: CvUploadMetadata) {
  if (!metadata.name.trim() || metadata.size < 1 || metadata.size > MAX_CV_BYTES) {
    return "CV ត្រូវមានទំហំមិនលើស 10MB";
  }
  if (!ALLOWED_CV_TYPES.has(metadata.contentType)) {
    return "សូមបញ្ចូល CV ជា PDF, DOC ឬ DOCX";
  }
  return null;
}

export async function createCvUploadUrl(metadata: CvUploadMetadata) {
  const privateObjectDir = process.env.PRIVATE_OBJECT_DIR;
  if (!privateObjectDir) {
    throw new Error("PRIVATE_OBJECT_DIR is not configured");
  }

  const objectId = randomUUID();
  const objectName = `${privateObjectDir.replace(/\/$/, "")}/cv/${objectId}`;
  const [bucketName, ...objectParts] = objectName.replace(/^\//, "").split("/");
  const objectPath = `/objects/cv/${objectId}`;
  const response = await fetch(`${REPLIT_SIDECAR_ENDPOINT}/object-storage/signed-object-url`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      bucket_name: bucketName,
      object_name: objectParts.join("/"),
      method: "PUT",
      expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    }),
    signal: AbortSignal.timeout(30_000),
  });

  if (!response.ok) {
    throw new Error(`Failed to create CV upload URL: ${response.status}`);
  }

  const result = (await response.json()) as { signed_url?: string };
  if (!result.signed_url) {
    throw new Error("Object storage did not return a signed URL");
  }

  return {
    uploadURL: result.signed_url,
    objectPath,
    metadata,
  };
}
