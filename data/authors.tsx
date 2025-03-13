import React from "react";
import OpenAIIcon from "@/components/icons/OpenAIIcon";
import AnthropicIcon from "@/components/icons/AnthropicIcon";
import QwenIcon from "@/components/icons/QwenIcon";
import MistralIcon from "@/components/icons/MistralIcon";
import DeepSeekIcon from "@/components/icons/DeepSeekIcon";
import CohereIcon from "@/components/icons/CohereIcon";
import GoogleAIIcon from "@/components/icons/GoogleAIIcon";
import MetaIcon from "@/components/icons/MetaIcon";
import PerplexityIcon from "@/components/icons/PerplexityIcon";
import MicrosoftIcon from "@/components/icons/MicrosoftIcon";

export type Author = {
  id: string;
  logo: React.ReactNode;
};

export const authors: Author[] = [
  {
    id: "openai",
    logo: <OpenAIIcon />,
  },
  {
    id: "anthropic",
    logo: <AnthropicIcon />,
  },
  {
    id: "qwen",
    logo: <QwenIcon />,
  },
  {
    id: "mistral",
    logo: <MistralIcon />,
  },
  {
    id: "deepseek",
    logo: <DeepSeekIcon />,
  },
  {
    id: "cohere",
    logo: <CohereIcon />,
  },
  {
    id: "google",
    logo: <GoogleAIIcon />,
  },
  {
    id: "meta",
    logo: <MetaIcon />,
  },
  {
    id: "perplexity-ai",
    logo: <PerplexityIcon />,
  },
  {
    id: "microsoft",
    logo: <MicrosoftIcon />,
  },
]; 
