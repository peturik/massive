import { z } from "zod";

export function PostSchema() {
  const ACCEPTED_IMAGE_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "application/octet-stream",
  ];

  const schema = z.object({
    id: z.string(),
    title: z.string(),
    slug: z.string(),
    description: z.string(),
    body: z.string(),
    tags: z.string(),
    image: z
      .instanceof(File)
      .refine(
        (file: File) => file.size < 2048000,
        "File size must be less than 2Mb"
      )
      .refine(
        (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
        "Please upload a valid image file (JPEG, PNG, or WebP)."
      ),
    // galleryImages: z
    //   .array(z.instanceof(File))
    //   .min(1, "At least 1 file is required")
    //   .refine(
    //     (files) => files.every((file) => file.size < 2048000),
    //     "File size must be less than 2Mb"
    //   ),
    status: z.coerce.number(),
    created_at: z.date(),
    updated_at: z.date(),
    userId: z.string(),
  });

  const postSchema = schema
    .partial({ image: true })
    .omit({ created_at: true, updated_at: true, userId: true });

  return postSchema;
}
