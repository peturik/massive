"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState, useCallback } from "react";

interface ImageFile {
  id: string;
  file: File | null;
  previewUrl: string;
  isUploading?: boolean;
}

interface MainImageProps {
  existingImage?: string;
  maxSize: number;
}

export function MainImage({ existingImage, maxSize = 5 }: MainImageProps) {
  const [image, setImage] = useState<ImageFile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (existingImage) {
      setImage(() => {
        const existingFile = {
          id: existingImage,
          file: null,
          previewUrl: existingImage,
        };
        return existingFile;
      });
    }
  }, [existingImage]);

  const handleFileSelect = useCallback(
    (file: File) => {
      if (!file) return;

      if (file.size / (1024 * 1024) > maxSize) {
        alert(`File size should be less than ${maxSize}MB`);
        return;
      }
      if (!file.type.startsWith("image/")) {
        alert(`Файл "${file.name}" не є зображенням`);
        return;
      }
      setImage(() => {
        const newfile = {
          id: file.name,
          file,
          previewUrl: URL.createObjectURL(file),
        };
        if (fileInputRef.current) {
          const dt = new DataTransfer();
          dt.items.add(newfile.file);
          fileInputRef.current.files = dt.files;
        }
        return newfile;
      });
    },
    [maxSize],
  );

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
    handleFileSelect(e.dataTransfer.files[0]);
  };

  const removeImage = () => {
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Очищення прев'ю URL
  useEffect(() => {
    return () => {
      if (image?.file) {
        URL.revokeObjectURL(image.previewUrl);
      }
    };
  }, [image]);

  return (
    <div className="space-y-4">
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={(e) => handleFileSelect(e.target.files![0])}
        className="hidden"
        name="image"
      />
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
                Оберіть зображення
              </Button>
              <p className="text-sm text-muted-foreground">
                або перетягніть його сюди
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              Максимум до {maxSize}MB
            </p>
          </div>
        </CardContent>
      </Card>

      {image?.previewUrl && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div className="relative group">
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
                <div className="absolute rounded-xl inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeImage()}
                    type="button"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {/* Loading Indicator */}
                {image.isUploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent" />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
