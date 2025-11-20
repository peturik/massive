import { z } from "zod";

export function PostSchema() {
  return z.object({
    id: z.string().optional(),
    title: z
      .string()
      .min(5, { message: "Title must be at least 5 characters long" })
      .max(255, { message: "Title must be at most 255 characters long" }),
    slug: z
      .string()
      .min(5, { message: "Slug must be at least 5 characters long" })
      .max(255, { message: "Slug must be at most 255 characters long" }),
    description: z
      .string()
      .min(10, { message: "Description must be at least 10 characters long" })
      .max(1000, {
        message: "Description must be at most 1000 characters long",
      }),
    body: z
      .string()
      .min(10, { message: "Body must be at least 10 characters long" }),
    tags: z.string().array().optional(),
    // Дозволяємо File, null або undefined для image
    image: z.union([z.instanceof(File), z.null(), z.undefined()]).optional(),
    // Дозволяємо масив File, null або undefined для gallery
    gallery: z
      .union([z.array(z.instanceof(File)), z.null(), z.undefined()])
      .optional(),
    // galleryUrlArray: z.string().optional(),
    status: z.union([z.string(), z.number()]).optional(),
  });
}
// import { z } from "zod";
//
// export function PostSchema() {
//   const ACCEPTED_IMAGE_TYPES = [
//     "image/jpeg",
//     "image/jpg",
//     "image/png",
//     "image/webp",
//     "application/octet-stream",
//   ];
//
//   const schema = z.object({
//     id: z.string(),
//     title: z.string(),
//     slug: z.string(),
//     description: z.string(),
//     body: z.string(),
//     tags: z.string(),
//     image: z
//       .instanceof(File)
//       .refine(
//         (file: File) => file.size < 5120000,
//         "File size must be less than 5Mb",
//       )
//       .refine(
//         (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
//         "Please upload a valid image file (JPEG, PNG, or WebP).",
//       ),
//     gallery: z
//       .array(z.instanceof(File))
//       // .min(1, "At least 1 file is required")
//       .refine(
//         (files) => files.every((file) => file.size < 5120000),
//         "File size must be less than 5Mb",
//       )
//       .refine(
//         (files) =>
//           files.every((file) => ACCEPTED_IMAGE_TYPES.includes(file.type)),
//         "Please upload a valid image file (JPEG, PNG, or WebP).",
//       ),
//     status: z.coerce.number(),
//     created_at: z.date(),
//     updated_at: z.date(),
//     user_id: z.string(),
//   });
//
//   const postSchema = schema
//     .partial({ image: true, gallery: true })
//     .omit({ created_at: true, updated_at: true, user_id: true });
//
//   return postSchema;
// }
// zod.ts
