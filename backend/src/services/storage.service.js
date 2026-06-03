import dotenv from "dotenv";
import {
  CreateBucketCommand,
  HeadBucketCommand,
  PutObjectCommand,
  S3Client
} from "@aws-sdk/client-s3";

dotenv.config();

const minioEndpoint = process.env.MINIO_ENDPOINT || "localhost";
const minioPort = process.env.MINIO_PORT || "9000";
const minioUseSsl = process.env.MINIO_USE_SSL === "true";
const minioProtocol = minioUseSsl ? "https" : "http";
const bucketName = process.env.MINIO_BUCKET || "vrt-bucket";

const s3Client = new S3Client({
  region: "us-east-1",
  endpoint: `${minioProtocol}://${minioEndpoint}:${minioPort}`,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.MINIO_ROOT_USER || "minioadmin",
    secretAccessKey: process.env.MINIO_ROOT_PASSWORD || "minioadmin"
  }
});

const encodeObjectKey = (filename) =>
  filename
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");

export const ensureBucketExists = async () => {
  try {
    await s3Client.send(new HeadBucketCommand({ Bucket: bucketName }));
  } catch (error) {
    const statusCode = error?.$metadata?.httpStatusCode;
    if (statusCode === 404 || error?.name === "NotFound" || error?.name === "NoSuchBucket") {
      await s3Client.send(new CreateBucketCommand({ Bucket: bucketName }));
      return;
    }
    throw error;
  }
};

export const uploadImage = async (buffer, filename) => {
  await s3Client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: filename,
      Body: buffer,
      ContentType: "image/png"
    })
  );
  return `${minioProtocol}://${minioEndpoint}:${minioPort}/${bucketName}/${encodeObjectKey(filename)}`;
};

export default {
  ensureBucketExists,
  uploadImage
};
