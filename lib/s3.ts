import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"

const s3Client = new S3Client({
  region: process.env.AWS_REGION ?? "ap-southeast-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
  },
})

const bucket = process.env.AWS_S3_BUCKET ?? "charlottenim"

export function getPublicUrl(key: string): string {
  return `https://${bucket}.s3.${process.env.AWS_REGION ?? "ap-southeast-2"}.amazonaws.com/${key}`
}

export async function uploadToS3(
  buffer: Buffer,
  contentType: string,
  key: string,
): Promise<string> {
  await s3Client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    }),
  )
  return getPublicUrl(key)
}

export function generateKey(ext: string, prefix: string = "uploads"): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 10)
  return `${prefix}/${timestamp}-${random}.${ext}`
}

export function getExtFromContentType(contentType: string): string {
  const map: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "image/avif": "avif",
    "image/svg+xml": "svg",
  }
  return map[contentType] ?? "jpg"
}
