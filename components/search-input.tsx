"use client";

import type React from "react";

import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  placeholder?: string;
  className?: string;
  value: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
}

export default function SearchInput({
  placeholder = "Search...",
  className,
  value = "",
  onChange,
  onSubmit,
}: SearchInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  };

  const handleClear = () => {
    onChange?.("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(value);
  };

  return (
    <form
      className={cn("relative group max-w-md w-full", className)}
      onSubmit={handleSubmit}
    >
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
          <Search className="h-5 w-5" />
        </div>
        <input
          type="text"
          value={value}
          onChange={handleChange}
          className="block w-full py-3 pl-10 pr-10 bg-background border border-input rounded-lg 
                    focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none
                    transition-all duration-200 shadow-sm hover:border-primary/50 text-[15px]
                    [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden [&::-ms-clear]:hidden placeholder:text-[15px]"
          placeholder={placeholder}
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Clear search</span>
          </button>
        )}
      </div>
    </form>
  );
}
