"use server";
import { PostSchema } from "./ui/zod";
import { promises as fs } from "fs";
import { redirect } from "next/navigation";
import { saveFiles } from "@/lib/saveFiles";
import { z } from "zod";
import { join } from "path";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

const postSchema = PostSchema();

/* INSERT INTO */
export async function createPost(
  prevState: string | undefined,
  formData: FormData,
  userId?: string
) {
  try {
    const { title, slug, description, body, tags, image, status } =
      postSchema.parse({
        id: "",
        title: formData.get("title"),
        slug: formData.get("slug"),
        description: formData.get("description"),
        body: formData.get("body"),
        tags: formData.get("tags"),
        image: formData.get("image"),
        status: formData.get("status"),
      });

    const statusValue = status ? Number(status) : 0;

    let image_url = "";

    if (image?.size) {
      [image_url] = await saveFiles([image], slug);
    }

    const tagsForm = tags?.split(",") || [];

    if (tagsForm[0].length > 0) {
      await Promise.all(
        tagsForm.map(async (tag) => {
          await prisma.tag.upsert({
            where: { title: tag },
            update: {},
            create: { title: tag },
          });
        })
      );
    }

    await prisma.post.create({
      data: {
        title,
        slug,
        description,
        body,
        tags: tagsForm.join(","),
        imageUrl: image_url,
        status: statusValue,
        userId: userId,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log(error);
      return `Error db: ${error.issues.map((e) => e.message)}`;
    } else {
      console.log("Error occured: " + error);
    }
  }

  revalidatePath(`/dashboard/posts`);
  redirect("/dashboard/posts");
}

/* UPDATE POST */

export async function updatePost(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    const { id, title, slug, description, body, tags, image, status } =
      postSchema.parse({
        id: formData.get("id"),
        title: formData.get("title"),
        slug: formData.get("slug"),
        description: formData.get("description"),
        body: formData.get("body"),
        tags: formData.get("tags"),
        image: formData.get("image"),
        status: formData.get("status"),
      });

    let image_url = "";

    // Обробка зображення
    if (image?.size) {
      const post = await prisma.post.findUnique({
        where: { id },
        select: { imageUrl: true },
      });

      if (post?.imageUrl) {
        await fs.rm(join(process.cwd(), "public/", post.imageUrl));
      }

      [image_url] = await saveFiles([image], slug);
    } else {
      const post = await prisma.post.findUnique({
        where: { id },
        select: { imageUrl: true },
      });
      image_url = post?.imageUrl || "";
    }

    // Обробка тегів
    const tagsForm = tags?.split(",") || [];

    if (tagsForm[0].length > 0) {
      await Promise.all(
        tagsForm.map(async (tag) => {
          await prisma.tag.upsert({
            where: { title: tag },
            update: {},
            create: { title: tag },
          });
        })
      );
    }

    // Оновлення поста
    await prisma.post.update({
      where: { id },
      data: {
        title,
        slug,
        description,
        body,
        tags: tagsForm.join(","),
        imageUrl: image_url,
        status: Number(status),
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log(error);
      return `Error: ${error.issues.map((e) => e.message)}`;
    } else {
      console.log("Error occurred: ", error);
      return "Failed to update post";
    }
  }

  revalidatePath(`/dashboard/posts`);
  redirect("/dashboard/posts");
}

/* DELETE FROM */
export async function deletePost(formData: FormData, id: string) {
  try {
    // Отримуємо пост для видалення
    const post = await prisma.post.findUnique({
      where: { id },
      select: { slug: true, imageUrl: true },
    });

    if (!post) {
      throw new Error("Post not found");
    }

    // Видаляємо пов'язані файли
    const dir = join(process.cwd(), "/public/uploads/", post.slug);
    try {
      if (await fs.stat(dir)) {
        await fs.rm(dir, { recursive: true });
      }
    } catch (error) {
      console.log("Error removing directory: ", error);
    }

    // Видаляємо сам пост
    await prisma.post.delete({
      where: { id },
    });

    revalidatePath("/dashboard/posts");
    return { success: true };
  } catch (error) {
    console.log("Delete post error: ", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete post",
    };
  }
}
