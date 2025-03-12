import React from "react";
import { ModelRow } from "@/types/huggingface";
import { ModelCard } from "./model-card";

interface ModelGridProps {
  models: ModelRow[];
  title?: string;
}

export function ModelGrid({ models, title }: ModelGridProps) {
  return (
    <div className="mt-8">
      {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}

      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {models.map((model, index) => (
          <div key={index} className="w-full">
            <ModelCard model={model} />
          </div>
        ))}
      </div>
    </div>
  );
}
