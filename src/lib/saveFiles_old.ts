import { createClient } from "./supabase/server";

export async function saveFiles(files: File[], dir: string) {
  const supabase = await createClient();

  const relativeUploadDir = `/${dir}`; // Базовий шлях із вкладеними теками
  const arrFiles: string[] = [];

  try {
    for (const file of files) {
      // Генерація унікального імені файлу
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const fileExt = file.name.split(".").pop() || "unknown";
      const filename = `${uniqueSuffix}.${fileExt}`;
      const filePath = `${relativeUploadDir}/${filename}`; // Повний шлях із теками

      // Завантаження файлу в Supabase Storage
      const { data, error } = await supabase.storage
        .from("uploads") // Назва бакета
        .upload(filePath, file, {
          contentType: file.type,
          cacheControl: "3600",
          upsert: false,
        });

      if (data) {
        console.log(`File ${filename} uploaded successfully.`);
      }

      if (error) {
        console.log(filePath);
        console.error(`Error uploading file ${filename}:`, error.message);
        throw error;
      }

      // Отримання публічного URL файлу
      const { data: publicUrlData } = supabase.storage
        .from("uploads")
        .getPublicUrl(filePath);

      arrFiles.push(publicUrlData.publicUrl);
    }
  } catch (error) {
    console.error("Error while trying to upload files to Supabase:", error);
    throw error;
  }

  return arrFiles;
}
