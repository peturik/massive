import React, { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// Тип для тегу
interface Tag {
  id: string;
  title: string;
}

interface Props {
  tag: Tag[];
  setValue: (value: string[]) => void;
  existingTags?: string;
}

export function MultiTagSelect({ tag, setValue, existingTags = "" }: Props) {
  const [selectedOption, setSelectedOption] = useState<string[]>([]);
  const [tags, setTags] = useState<Tag[]>(tag);
  const [isOpen, setIsOpen] = useState(false);
  const [newTagInput, setNewTagInput] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setValue(selectedOption);
  }, [selectedOption, setValue]);

  useEffect(() => {
    if (existingTags) {
      setSelectedOption(
        existingTags
          .split(",")
          .filter(Boolean)
          .map((item) => item),
      );
    }
  }, [existingTags]);

  // Handler та handleAddTag
  function handler(evalue: string) {
    if (evalue === "add-new") {
      setIsOpen(true); // Відкриваємо модалку
      return;
    }

    if (selectedOption.includes(evalue)) {
      const arr = selectedOption.filter((item) => item !== evalue);
      setSelectedOption(arr);
    } else {
      const arr = [...selectedOption, evalue];
      setSelectedOption(arr.filter((item) => item !== "")); // Фільтр для безпеки
    }
  }

  const handleAddTag = () => {
    if (!newTagInput.trim()) return; // Валідація

    const newTag: Tag = {
      id: Date.now().toString(), // Проста генерація ID; використовуйте UUID для продакшену
      title: newTagInput.trim(),
    };

    // Додаємо до списку тегів
    setTags([...tags, newTag]);

    // Опціонально: відразу вибираємо новий тег
    handler(newTag.title);

    // Очищуємо та закриваємо модалку
    setNewTagInput("");
    setIsOpen(false);
  };

  return (
    <div className="space-y-6 p-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-lg shadow-md dark:shadow-slate-500/20 max-w-md mx-auto">
      {/* Multi-Select */}
      <div className="relative">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-12 w-full border-2 border-gradient-to-r from-blue-400 to-purple-500 dark:from-blue-500 dark:to-purple-600 rounded-xl px-4 text-sm font-medium transition-all duration-200 hover:shadow-lg hover:border-blue-500 dark:hover:border-blue-400 hover:from-blue-500 hover:to-purple-600 dark:hover:from-blue-600 dark:hover:to-purple-700 flex justify-between items-center bg-white dark:bg-slate-800"
            >
              <span className="flex items-center">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
                Select tags
              </span>
              {selectedOption.length > 0 && (
                <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                  {selectedOption.length}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[250px] p-0 border-0 shadow-2xl rounded-xl overflow-hidden dark:bg-slate-800">
            <Command className="bg-white dark:bg-slate-800">
              <CommandInput
                placeholder="Search tags..."
                className="border-b border-slate-200 dark:border-slate-700 px-3 py-2 focus:border-blue-400 dark:focus:border-blue-500 transition-colors"
              />
              <CommandEmpty className="py-3 px-3 text-slate-500 dark:text-slate-400 text-sm">
                No tags found.
              </CommandEmpty>
              <CommandGroup className="max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600">
                {tags.map((tag) => (
                  <CommandItem
                    key={tag.id}
                    onSelect={() => handler(tag.title)}
                    className="cursor-pointer px-3 py-2 mx-1 rounded-md transition-colors hover:bg-blue-50 dark:hover:bg-slate-700/50 hover:text-blue-700 dark:hover:text-blue-300 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={selectedOption.includes(tag.title)}
                        onCheckedChange={() => handler(tag.title)}
                        className="border-blue-400 dark:border-blue-500 data-[state=checked]:bg-blue-500 dark:data-[state=checked]:bg-blue-400"
                      />
                      <span className="text-sm font-medium">{tag.title}</span>
                    </div>
                  </CommandItem>
                ))}
                <CommandItem
                  onSelect={() => handler("add-new")}
                  className="cursor-pointer justify-center text-center font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-slate-700/50 hover:bg-blue-100 dark:hover:bg-slate-700 mx-1 rounded-md py-3 transition-colors"
                >
                  <svg
                    className="w-4 h-4 inline mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Add new tag
                </CommandItem>
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Відображення вибраних тегів */}
        {selectedOption.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3 p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            {selectedOption.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-600 dark:to-purple-600 text-white text-xs px-3 py-1 rounded-full cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-md flex items-center"
                onClick={() => handler(tag)}
              >
                {tag}
                <svg
                  className="w-3 h-3 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Модалка */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md bg-gradient-to-b from-white dark:from-slate-800 to-slate-50 dark:to-slate-900 rounded-2xl shadow-2xl">
          <DialogHeader className="bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 text-white rounded-t-2xl p-6">
            <DialogTitle className="text-xl font-bold flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add New Tag
            </DialogTitle>
            <DialogDescription className="text-blue-100 dark:text-blue-200 mt-1">
              Enter the name of the new tag below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-6">
            <Input
              placeholder="Tag name..."
              value={newTagInput}
              onChange={(e) => setNewTagInput(e.target.value)}
              className="border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all"
            />
          </div>
          <DialogFooter className="pt-4 border-t border-slate-100 dark:border-slate-700">
            <Button
              variant="outline"
              onClick={() => {
                setIsOpen(false);
                setNewTagInput("");
              }}
              className="px-6 py-2 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddTag}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-600 dark:to-purple-600 hover:from-blue-600 hover:to-purple-600 dark:hover:from-blue-700 dark:hover:to-purple-700 rounded-xl font-medium"
              disabled={!newTagInput.trim()}
            >
              Add Tag
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
