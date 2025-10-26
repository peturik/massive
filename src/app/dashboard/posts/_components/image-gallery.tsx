// components/image-gallery.tsx
"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Upload, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

import { DeleteImage } from "./delete-image";

interface ImageFile {
  id: string;
  file: File | null;
  previewUrl: string;
  isUploading?: boolean;
  uploadedUrl?: string;
}

interface ImageGalleryProps {
  postSlug?: string;
  existingImages?: string[];
  maxImages?: number;
  maxSize?: number;
  onImagesChange: (images: string[]) => void;
}

export function ImageGallery({
  postSlug,
  existingImages = [],
  maxImages = 10,
  maxSize = 5,
  onImagesChange,
}: ImageGalleryProps) {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Ініціалізація існуючих зображень
  useEffect(() => {
    if (existingImages.length > 0) {
      const existingImageFiles: ImageFile[] = existingImages
        .filter((url) => url !== undefined)
        .map((url, index) => {
          // const newItems =
          return {
            id: `existing-${index}`,
            file: null,
            previewUrl: url,
            uploadedUrl: url,
          };
        });
      const existImg = existingImageFiles.concat(
        images.filter((img) => img.file),
      );

      setImages(existImg);
    }
  }, [existingImages]);

  // Обробка вибору файлів
  const handleFileSelect = useCallback(
    (files: FileList | null) => {
      if (!files) return;

      const validFiles: File[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Перевірка типу файлу
        if (!file.type.startsWith("image/")) {
          alert(`Файл "${file.name}" не є зображенням`);
          continue;
        }

        // Перевірка розміру
        if (file.size > maxSize * 1024 * 1024) {
          alert(
            `Зображення "${file.name}" перевищує максимальний розмір ${maxSize}MB`,
          );
          continue;
        }

        // Перевірка кількості
        if (images.length + validFiles.length >= maxImages) {
          alert(`Максимальна кількість зображень: ${maxImages}`);
          break;
        }

        validFiles.push(file);
      }

      const newImages: ImageFile[] = validFiles.map((file) => ({
        id: Math.random().toString(36).substring(2, 9),
        file,
        previewUrl: URL.createObjectURL(file),
      }));

      setImages((prev) => {
        const newFiles = [...prev, ...newImages];

        if (fileInputRef.current) {
          const dt = new DataTransfer();
          newFiles.forEach((img) => {
            if (img.file) {
              dt.items.add(img.file);
            }
          });
          fileInputRef.current.files = dt.files;
        }
        return newFiles;
      });
    },
    [images.length, maxImages, maxSize],
  );

  // Видалення зображення
  const removeImage = (id: string) => {
    if (id.startsWith("existing-")) {
      const image = images.find((img) => img.id === id);
      const imageUrl = image?.uploadedUrl;
      deleteImage(imageUrl!);
      onImagesChange(
        images.filter((img) => img.id !== id).map((img) => img.uploadedUrl!),
      );
    }
    // setImages((prev) => prev.filter((img) => img.id !== id));
    setImages((prev) => {
      const newFiles = prev.filter((img) => img.id !== id);

      // Створюємо новий FileList для input
      if (fileInputRef.current) {
        const dt = new DataTransfer();

        newFiles.forEach((img) => {
          if (img.file) {
            dt.items.add(img.file);
          }
        });
        fileInputRef.current.files = dt.files;
      }

      return newFiles;
    });
  };

  const deleteImage = async (
    imagePath: string,
    bucketName: string = "images",
  ) => {
    const supabase = createClient();

    const imgName = imagePath?.split("/").pop();

    try {
      const { error } = await supabase.storage
        .from(bucketName)
        .remove([`${postSlug}/gallery/${imgName}`]);

      if (error) {
        throw error;
      }
      const { error: errordb } = await supabase
        .from("posts")
        .update({
          gallery: images
            .filter((img) => img.uploadedUrl && img.uploadedUrl !== imagePath)
            .map((img) => img.uploadedUrl!),
        })
        .eq("slug", postSlug);

      if (errordb) {
        throw errordb;
      }

      return { success: true };
    } catch (error) {
      console.error("Помилка при видаленні зображення:", error);
      return { success: false, error };
    }
  };
  // Drag & Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  // Очищення прев'ю URL
  useEffect(() => {
    return () => {
      images.forEach((image) => {
        if (image.file) {
          URL.revokeObjectURL(image.previewUrl);
        }
      });
    };
  }, [images]);

  return (
    <div className="space-y-4">
      {/* Основний файловий input для FormData */}
      <input
        type="file"
        ref={fileInputRef}
        multiple
        accept="image/*"
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
        name="gallery" // Важливо: name="gallery" для FormData
      />

      {/* Drop Zone */}
      <Card
        className={`border-2 border-dashed transition-colors ${
          isDragging
            ? "border-primary bg-primary/10"
            : "border-muted-foreground/25"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <CardContent className="p-6 text-center">
          <div className="space-y-2">
            <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
            <div>
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="mb-2"
              >
                <Plus className="h-4 w-4 mr-2" />
                Обрати зображення
              </Button>
              <p className="text-sm text-muted-foreground">
                або перетягніть їх сюди
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              Максимум {maxImages} зображень, до {maxSize}MB кожне
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Gallery Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <div key={image.id} className="relative group">
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="w-full h-32 relative">
                    <Image
                      src={image.previewUrl}
                      alt="Preview"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    />
                  </div>

                  {/* Overlay */}
                  <DeleteImage image={image.id} removeImage={removeImage} />

                  {/* Loading Indicator */}
                  {image.isUploading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent" />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      )}

      {/* Image Count */}
      {images.length > 0 && (
        <div className="text-sm text-muted-foreground">
          {images.length} з {maxImages} зображень
        </div>
      )}
    </div>
  );
}
