// actions.ts
"use server";
import { PostSchema } from "./zod";
import { redirect } from "next/navigation";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Post, Tag } from "./types";

const postSchema = PostSchema();

/**
 * Допоміжна функція для обробки тегів.
 */
async function handleTags(tagsString: string | undefined) {
  const tags =
    tagsString
      ?.split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0) || [];

  try {
    if (tags.length > 0) {
      const supabase = await createClient();

      for (const tag of tags) {
        const { data: existingTag } = await supabase
          .from("tags")
          .select("title")
          .eq("title", tag)
          .single();

        if (!existingTag) {
          try {
            const { error: errorDataTag } = await supabase
              .from("tags")
              .insert([{ title: tag }]);

            if (errorDataTag) console.log("errorDataTag: ", errorDataTag);
          } catch (error) {
            console.error("Error while create tag: ", error);
          }
        }
      }
    }
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to create Tags");
  }

  return tags;
}

/**
 * Допоміжна функція для завантаження файлів у Supabase Storage.
 */
async function uploadSupabaseFiles(files: File[], dir: string) {
  const arrFiles: string[] = [];
  const uploadDir = dir;
  const supabase = await createClient();

  for (const file of files) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const fileExt = file.name.split(".").pop() || "unknown";
    const filename = `${uniqueSuffix}.${fileExt}`;
    const filePath = `${uploadDir}/${filename}`;

    const { error } = await supabase.storage
      .from("images")
      .upload(filePath, file, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error(`Error uploading file ${filename}:`, error.message);
      throw new Error(`Failed to upload file: ${error.message}`);
    }

    const { data: publicUrlData } = supabase.storage
      .from("images")
      .getPublicUrl(filePath);

    arrFiles.push(publicUrlData.publicUrl);
  }

  return arrFiles;
}

/**
 * Допоміжна функція для видалення теки із Supabase Storage.
 */
async function deleteSupabaseFolder(dirPath: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.storage.from("images").list(dirPath);

  if (error) {
    console.error(`Error listing files in folder ${dirPath}:`, error.message);
    throw new Error(`Failed to list files: ${error.message}`);
  }

  if (data && data.length > 0) {
    const filePaths = data.map((file) => `${dirPath}/${file.name}`);
    const { error: removeError } = await supabase.storage
      .from("images")
      .remove(filePaths);

    if (removeError) {
      console.error(
        `Error removing files from folder ${dirPath}:`,
        removeError.message,
      );
      throw new Error(`Failed to remove files: ${removeError.message}`);
    }
  }
}

/**
 * Допоміжна функція для отримання файлів з FormData
 */
function getFilesFromFormData(formData: FormData, fieldName: string): File[] {
  const files: File[] = [];

  if (fieldName === "gallery") {
    const galleryEntries = formData.getAll(fieldName);
    for (const entry of galleryEntries) {
      if (entry instanceof File && entry.size > 0 && entry.name) {
        files.push(entry);
      }
    }
  } else if (fieldName === "image") {
    const imageEntry = formData.get(fieldName);
    if (imageEntry instanceof File && imageEntry.size > 0 && imageEntry.name) {
      files.push(imageEntry);
    }
  }

  return files;
}

/* `createPost` (Створення нового поста) */
export async function createPost(
  prevState: string | undefined,
  formData: FormData,
  userId?: string,
) {
  const supabase = await createClient();

  if (!userId) {
    const { data: user } = await supabase.auth.getUser();
    userId = user.user?.id;
  }

  try {
    // Спочатку отримуємо файли
    const imageFiles = getFilesFromFormData(formData, "image");
    const galleryFiles = getFilesFromFormData(formData, "gallery");

    // Парсимо текстові поля з правильними значеннями для файлів
    const { title, slug, description, body, tags, status } = postSchema.parse({
      id: "",
      title: formData.get("title"),
      slug: formData.get("slug"),
      description: formData.get("description"),
      body: formData.get("body"),
      tags: formData.get("tags"),
      image: imageFiles[0] || null, // Передаємо File або null
      gallery: galleryFiles.length > 0 ? galleryFiles : null, // Передаємо масив File або null
      status: formData.get("status"),
    });

    const statusValue = status ? Number(status) : 0;
    let imageUrl = "";
    let galleryUrl: string[] = [];

    // Завантажуємо галерею
    if (galleryFiles.length > 0) {
      galleryUrl = await uploadSupabaseFiles(galleryFiles, `${slug}/gallery`);
    }

    // Завантажуємо основне зображення
    if (imageFiles.length > 0) {
      [imageUrl] = await uploadSupabaseFiles(imageFiles, slug);
    }

    const tagsForm = await handleTags(tags);

    // Створення поста в Supabase
    const { error } = await supabase.from("posts").insert([
      {
        title,
        slug,
        description,
        body,
        tags: tagsForm.join(","),
        image_url: imageUrl,
        gallery: galleryUrl,
        status: statusValue,
        user_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      throw new Error(`Supabase error from Create Post: ${error.message}`);
    }
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
  formData: FormData,
) {
  const supabase = await createClient();

  try {
    // Спочатку отримуємо файли
    const imageFiles = getFilesFromFormData(formData, "image");
    const galleryFiles = getFilesFromFormData(formData, "gallery");

    // Парсимо текстові поля з правильними значеннями для файлів
    const { id, title, slug, description, body, tags, status } =
      postSchema.parse({
        id: formData.get("id"),
        title: formData.get("title"),
        slug: formData.get("slug"),
        description: formData.get("description"),
        body: formData.get("body"),
        tags: formData.get("tags"),
        image: imageFiles[0] || null, // Передаємо File або null
        gallery: galleryFiles.length > 0 ? galleryFiles : null, // Передаємо масив File або null
        status: formData.get("status"),
      });

    // Отримуємо пост з Supabase
    const { data: post, error: fetchError } = await supabase
      .from("posts")
      .select("image_url, slug, gallery")
      .eq("id", id)
      .single();

    if (fetchError || !post) {
      return "Post not found.";
    }

    let imageUrl = post?.image_url;
    const galleryUrl = post?.gallery ? JSON.parse(post?.gallery) : [];

    // Обробка галереї
    if (galleryFiles.length > 0) {
      galleryUrl.push(
        ...(await uploadSupabaseFiles(galleryFiles, `${slug}/gallery`)),
      );
    }

    // Обробка основного зображення
    if (imageFiles.length > 0) {
      // Видаляємо старе зображення з Supabase
      if (post.image_url && post.slug) {
        // Отримуємо список файлів у теці поста
        const { data: folderFiles } = await supabase.storage
          .from("images")
          .list(post.slug);

        // Видаляємо всі файли з теки поста (основне зображення)
        if (folderFiles && folderFiles.length > 0) {
          const filePaths = folderFiles.map(
            (file) => `${post.slug}/${file.name}`,
          );
          await supabase.storage.from("images").remove(filePaths);
        }
      }
      // Завантажуємо нове зображення
      [imageUrl] = await uploadSupabaseFiles(imageFiles, slug);
    }

    const tagsForm = await handleTags(tags);

    // Оновлення поста в Supabase
    const { error } = await supabase
      .from("posts")
      .update({
        title,
        slug,
        description,
        body,
        tags: tagsForm.join(","),
        image_url: imageUrl,
        gallery: galleryUrl,
        status: Number(status),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      throw new Error(`Supabase error from update Post: ${error.message}`);
    }
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
  const supabase = await createClient();
  const id = formData.get("id") as string;

  try {
    // Отримуємо пост з Supabase
    const { data: post, error: fetchError } = await supabase
      .from("posts")
      .select("slug, gallery")
      .eq("id", id)
      .single();

    if (fetchError || !post) {
      throw new Error("Post not found");
    }

    // Видаляємо теку з файлами із Supabase Storage
    if (post.slug) {
      // Видаляємо основне зображення
      await deleteSupabaseFolder(post.slug);

      // Видаляємо галерею
      await deleteSupabaseFolder(`${post.slug}/gallery`);
    }

    // Видаляємо сам пост з бази даних
    const { error } = await supabase.from("posts").delete().eq("id", id);

    if (error) {
      throw new Error(`Supabase error: ${error.message}`);
    }

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

export async function getPostAndTags(id: string) {
  const supabase = await createClient();
  try {
    // Отримання поста
    const { data: post, error: postError } = await supabase
      .from("posts")
      .select("*")
      .eq("id", id)
      .single();

    if (postError) {
      throw new Error(`Post fetch error: ${postError.message}`);
    }

    // Отримання тегів
    const { data: tags, error: tagsError } = await supabase
      .from("tags")
      .select("*")
      .order("rate", { ascending: false });

    if (tagsError) {
      throw new Error(`Tags fetch error: ${tagsError.message}`);
    }

    const postData = post as unknown as Post;
    const tagsData = tags as unknown as Tag[];

    return { post: postData, tags: tagsData };
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to fetch data");
  }
}

export async function getTags() {
  const supabase = await createClient();
  try {
    const { data: tags, error: tagsError } = await supabase
      .from("tags")
      .select("*")
      .order("rate", { ascending: false });

    if (tagsError) {
      throw new Error(`Tags fetch error: ${tagsError.message}`);
    }

    return tags as unknown as Tag[];
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to fetch Tags data");
  }
}
