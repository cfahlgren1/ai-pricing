import React from "react";
import { ModelRow } from "@/types/huggingface";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import HFIcon from "@/components/icons/HFIcon";
import Link from "next/link";
import { formatPrice, calculateMedianThroughput, formatThroughput } from "@/lib/model-utils";

interface ModelCardProps {
  model: ModelRow;
}

export function ModelCard({ model }: ModelCardProps) {
  const medianThroughput = calculateMedianThroughput(model);
  
  return (
    <Card className="w-full hover:shadow-md transition-all flex flex-col aspect-square">
      <CardHeader className="pb-2 flex-shrink-0">
        <CardTitle
          className="text-base font-medium truncate"
          title={model.name}
        >
          {model.name}
        </CardTitle>
        
        <div className="flex flex-wrap items-center gap-1 mt-1">
          {model.author && (
            <Button
              variant="outline"
              className="text-[10px] px-1.5 py-0.5 h-auto"
              size="sm"
              title={model.author}
            >
              <span className="truncate max-w-[100px]">
                {model.author}
              </span>
            </Button>
          )}
          
          <Button
            variant="outline"
            className="text-[10px] px-1.5 py-0.5 h-auto font-mono text-bold"
            size="sm"
          >
            {formatThroughput(medianThroughput)}
          </Button>
          
          {model.hf_id && (
            <Button 
              variant="outline" 
              className="text-[10px] p-1 rounded-full h-auto"
              size="sm"
            >
              <Link href={`https://huggingface.co/${model.hf_id}`} target="_blank">
                <HFIcon className="size-3.5" />
              </Link>
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-3 flex-grow flex items-center justify-center">
        <div className="w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-lg relative">
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="absolute w-[35%] h-[2px] bg-slate-200 dark:bg-slate-700 rotate-[-35deg]"></div>
            
            <div className="w-full flex flex-col items-center gap-3 z-10">
              <div className="flex flex-col items-center transform -translate-x-[25%] md:-translate-x-[20%] lg:-translate-x-[25%] 2xl:-translate-x-[40%] -translate-y-2 md:-translate-y-0.5 lg:-translate-y-2 2xl:-translate-y-3">
                <span className="text-[10px] lg:text-xs text-muted-foreground font-medium">Input</span>
                <div className="font-mono text-3xl md:text-lg xl:text-4xl 2xl:text-3xl font-bold">
                  {formatPrice(model.median_input_cost)}
                </div>
              </div>
              
              <div className="flex flex-col items-center transform translate-x-[25%] md:translate-x-[20%] lg:translate-x-[25%] 2xl:translate-x-[40%] translate-y-2 md:translate-y-0.5 lg:translate-y-2 2xl:translate-y-3">
                <span className="text-[10px] lg:text-xs text-muted-foreground font-medium">Output</span>
                <div className="font-mono text-3xl md:text-lg xl:text-4xl 2xl:text-3xl font-bold">
                  {formatPrice(model.median_output_cost)}
                </div>
              </div>
            </div>
          </div>
          
          <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600"></div>
          <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600"></div>
        </div>
      </CardContent>
    </Card>
  );
}
