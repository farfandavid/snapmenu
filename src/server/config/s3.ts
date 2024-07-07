import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3"

export const s3 = new S3Client({
    region: "auto",
    endpoint: `https://${import.meta.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/`,
    credentials: {
        accessKeyId: import.meta.env.R2_ACCESS_KEY,
        secretAccessKey: import.meta.env.R2_SECRET_KEY,
        accountId: import.meta.env.R2_ACCOUNT_ID,
    }
})

export async function deleteObject(Key: string) {
    return await s3.send(
        new DeleteObjectCommand({
            Bucket: import.meta.env.R2_BUCKET,
            Key
        })
    )
}

export async function putObject(Key: string, Body: Buffer, ContentType: string) {
    return await s3.send(
        new PutObjectCommand({
            Bucket: import.meta.env.R2_BUCKET,
            Key,
            Body,
            ContentType
        })
    )
}