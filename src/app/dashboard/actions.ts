"use server";
import { PostSchema } from "./ui/zod";
import { redirect } from "next/navigation";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";

const postSchema = PostSchema();

/**
 * Допоміжна функція для обробки тегів.
 * @param tagsString Рядок тегів, розділених комою.
 * @returns Масив тегів.
 */
async function handleTags(tagsString: string | undefined) {
  const tagsForm =
    tagsString
      ?.split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0) || [];

  if (tagsForm.length > 0) {
    await Promise.all(
      tagsForm.map((tag) =>
        prisma.tag.upsert({
          where: { title: tag },
          update: {},
          create: { title: tag },
        })
      )
    );
  }
  return tagsForm;
}

/**
 * Допоміжна функція для завантаження файлів у Supabase Storage.
 * @param files Масив об'єктів File.
 * @param dir Назва теки для завантаження.
 * @returns Масив публічних URL-адрес завантажених файлів.
 */
async function uploadSupabaseFiles(files: File[], dir: string) {
  const arrFiles: string[] = [];
  const uploadDir = dir;
  const supabase = await createClient();

  for (const file of files) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const fileExt = file.name.split(".").pop() || "unknown";
    const filename = `${uniqueSuffix}.${fileExt}`;
    const filePath = `/${uploadDir}/${filename}`;

    const { error } = await supabase.storage
      .from("uploads")
      .upload(filePath, file, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.log(file);
      console.error(`Error uploading file ${filename}:`, error.message);
      throw new Error(`Failed to upload file: ${error.message}`);
    }

    const { data: publicUrlData } = supabase.storage
      .from("uploads")
      .getPublicUrl(filePath);

    arrFiles.push(publicUrlData.publicUrl);
  }

  return arrFiles;
}

/**
 * Допоміжна функція для видалення теки із Supabase Storage.
 * @param dirPath Шлях до теки для видалення.
 */
async function deleteSupabaseFolder(dirPath: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.storage.from("uploads").list(dirPath);

  if (error) {
    console.error(`Error listing files in folder ${dirPath}:`, error.message);
    throw new Error(`Failed to list files: ${error.message}`);
  }

  if (data && data.length > 0) {
    const filePaths = data.map((file) => `${dirPath}/${file.name}`);
    const { error: removeError } = await supabase.storage
      .from("uploads")
      .remove(filePaths);

    if (removeError) {
      console.error(
        `Error removing files from folder ${dirPath}:`,
        removeError.message
      );
      throw new Error(`Failed to remove files: ${removeError.message}`);
    }
  }
}

/* `createPost` (Створення нового поста) */

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
    let imageUrl = "";

    if (image instanceof File && image?.size > 0) {
      [imageUrl] = await uploadSupabaseFiles([image], slug);
    }

    const tagsForm = await handleTags(tags);

    await prisma.post.create({
      data: {
        title,
        slug,
        description,
        body,
        tags: tagsForm.join(","),
        imageUrl: imageUrl,
        status: statusValue,
        userId: userId,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error(error);
      return `Error db: ${error.issues.map((e) => e.message).join(", ")}`;
    } else {
      console.error("Error occurred: " + error);
      return "Failed to create post.";
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

    const post = await prisma.post.findUnique({
      where: { id },
      select: { imageUrl: true, slug: true },
    });

    if (!post) {
      return "Post not found.";
    }

    let imageUrl = post.imageUrl;

    // Якщо завантажується нове зображення
    if (image instanceof File && image?.size > 0) {
      // Видаляємо старе зображення з Supabase
      if (post.slug) {
        await deleteSupabaseFolder(post.slug);
      }
      // Завантажуємо нове зображення
      [imageUrl] = await uploadSupabaseFiles([image], slug);
    }

    const tagsForm = await handleTags(tags);

    // Оновлення поста
    await prisma.post.update({
      where: { id },
      data: {
        title,
        slug,
        description,
        body,
        tags: tagsForm.join(","),
        imageUrl: imageUrl,
        status: Number(status),
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error(error);
      return `Error: ${error.issues.map((e) => e.message).join(", ")}`;
    } else {
      console.error("Error occurred: ", error);
      return "Failed to update post";
    }
  }

  revalidatePath(`/dashboard/posts`);
  redirect("/dashboard/posts");
}

/* DELETE FROM */
export async function deletePost(formData: FormData) {
  const id = formData.get("id") as string;

  try {
    const post = await prisma.post.findUnique({
      where: { id },
      select: { slug: true },
    });

    if (!post) {
      throw new Error("Post not found");
    }

    // Видаляємо теку з файлами із Supabase Storage
    if (post.slug) {
      await deleteSupabaseFolder(post.slug);
    }

    // Видаляємо сам пост з бази даних
    await prisma.post.delete({
      where: { id },
    });

    revalidatePath("/dashboard/posts");
    return { success: true };
  } catch (error) {
    console.error("Delete post error: ", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete post",
    };
  }
}
