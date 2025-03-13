"use client";
import React, { useState, useEffect } from "react";
import { ModelRow } from "@/types/huggingface";
import { ModelCard } from "./model-card";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModelGridProps {
  models: ModelRow[];
  title?: React.ReactNode;
}

export function ModelGrid({ models, title }: ModelGridProps) {
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <div className="mt-8 relative">
      {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}

      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {models.map((model, index) => (
          <div key={index} className="w-full [content-visibility:auto]">
            <ModelCard model={model} />
          </div>
        ))}
      </div>

      <Button
        onClick={scrollToTop}
        className={cn(
          "fixed cursor-pointer bottom-6 right-6 size-10 rounded-full shadow-md bg-primary/90 hover:bg-primary text-primary-foreground backdrop-blur-sm p-0 transition-all duration-300",
          showScrollToTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
        )}
        aria-label="Scroll to top"
      >
        <ArrowUp className="size-5" />
      </Button>
    </div>
  );
}
