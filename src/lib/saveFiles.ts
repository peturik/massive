import mime from "mime";
// import * as dateFn from "date-fns";
import { join } from "path";
import { mkdir, stat, writeFile } from "fs/promises";

export async function saveFiles(files: File[], dir: string) {
  const relativeUploadDir = `uploads/${dir}`;
  //  /${dateFn.format( Date.now(), "yyyy-MM-dd")}
  const uploadDir = join(process.cwd(), "public/", relativeUploadDir);

  try {
    await stat(uploadDir);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      await mkdir(uploadDir, { recursive: true });
    } else {
      console.error(
        "Error while trying to create directory when uploading a file\n",
        error
      );
    }
  }

  const arrFiles: string[] = [];

  try {
    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const filename = `${uniqueSuffix}.${mime.getExtension(file.type)}`;

      await writeFile(`${uploadDir}/${filename}`, buffer);

      arrFiles.push(`${relativeUploadDir}/${filename}`);
    }
  } catch (error) {
    console.error("Error while trying to upload a file\n", error);
  }
  return arrFiles;
}
