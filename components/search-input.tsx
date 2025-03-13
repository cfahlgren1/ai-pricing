"use client";

import { Search, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import * as React from "react";

interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value" | "onSubmit"> {
  value: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  isLoading?: boolean;
  className?: string;
  containerClassName?: string;
  autoFocus?: boolean;
}

export default function SearchInput({
  placeholder = "Search...",
  className,
  containerClassName,
  value = "",
  onChange,
  onSubmit,
  isLoading = false,
  autoFocus = true,
  ...props
}: SearchInputProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  
  React.useEffect(() => {
    if (autoFocus && inputRef.current) {
      // Focus immediately without delay
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  };

  const handleClear = () => {
    onChange?.("");
    inputRef.current?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(value);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow Escape key to clear the search
    if (e.key === "Escape" && value) {
      e.preventDefault();
      handleClear();
    }
  };

  return (
    <form
      className={cn("relative group w-full max-w-xl", containerClassName)}
      onSubmit={handleSubmit}
      role="search"
    >
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-muted-foreground">
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Search className="h-5 w-5" />
          )}
        </div>
        <Input
          ref={inputRef}
          type="search"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className={cn(
            "pl-12 pr-12 py-6 text-base rounded-md",
            "shadow hover:shadow-md focus:shadow-lg",
            "border border-input/30 dark:border-input/40 focus:border-primary/40 dark:focus:border-primary/50",
            "transition-all duration-200 ease-in-out",
            "[&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden [&::-ms-clear]:hidden",
            "focus:ring-2 focus:ring-primary/10 focus:outline-none",
            className
          )}
          placeholder={placeholder}
          aria-label={placeholder}
          {...props}
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 flex items-center pr-4 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Clear search"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
    </form>
  );
}
