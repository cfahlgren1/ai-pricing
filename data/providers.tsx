import type { Provider } from "@/components/provider-tabs";
import OpenAIIcon from "@/components/icons/OpenAIIcon";
import AnthropicIcon from "@/components/icons/AnthropicIcon";
import DeepmindIcon from "@/components/icons/DeepmindIcon";
import TogetherAIIcon from "@/components/icons/TogetherAIIcon";
import FireworksAIIcon from "@/components/icons/FireworksAIIcon";
import MetaIcon from "@/components/icons/MetaIcon";
import MistralIcon from "@/components/icons/MistralIcon";
import ReplicateIcon from "@/components/icons/ReplicateIcon";
import GroqIcon from "@/components/icons/GroqIcon";
import CloudflareIcon from "@/components/icons/CloudflareIcon";
import OpenChatIcon from "@/components/icons/OpenChatIcon";
import NovitaIcon from "@/components/icons/NovitaIcon";
import DeepAIIcon from "@/components/icons/DeepAIIcon";
import QwenIcon from "@/components/icons/QwenIcon";
import PerplexityIcon from "@/components/icons/PerplexityIcon";
import AzureAIIcon from "@/components/icons/AzureAIIcon";
import DeepSeekIcon from "@/components/icons/DeepSeekIcon";
import MinimaxIcon from "@/components/icons/MinimaxIcon";
import VertexAIIcon from "@/components/icons/VertexAIIcon";
import XAIIcon from "@/components/icons/XAIIcon";
import AI21Icon from "@/components/icons/AI21Icon";
import CohereIcon from "@/components/icons/CohereIcon";
import SambaNovaIcon from "@/components/icons/SambaNovaIcon";
import BedrockIcon from "@/components/icons/BedrockIcon";
import GoogleAIIcon from "@/components/icons/GoogleAIIcon";
import LambdaIcon from "@/components/icons/LambdaIcon";

export const providers: Provider[] = [
  {
    id: "openai",
    name: "OpenAI",
    logo: <OpenAIIcon />,
  },
  {
    id: "anthropic",
    name: "Anthropic",
    logo: <AnthropicIcon />,
  },
  {
    id: "deepmind",
    name: "DeepMind",
    logo: <DeepmindIcon />,
  },
  {
    id: "together",
    name: "Together",
    logo: <TogetherAIIcon />,
  },
  {
    id: "fireworks",
    name: "Fireworks AI",
    logo: <FireworksAIIcon />,
  },
  {
    id: "meta",
    name: "Meta",
    logo: <MetaIcon />,
  },
  {
    id: "mistral",
    name: "Mistral",
    logo: <MistralIcon />,
  },
  {
    id: "replicate",
    name: "Replicate",
    logo: <ReplicateIcon />,
  },
  {
    id: "groq",
    name: "Groq",
    logo: <GroqIcon />,
  },
  {
    id: "cloudflare",
    name: "Cloudflare",
    logo: <CloudflareIcon />,
  },
  {
    id: "openchat",
    name: "OpenChat",
    logo: <OpenChatIcon />,
  },
  {
    id: "novita",
    name: "Novita",
    logo: <NovitaIcon />,
  },
  {
    id: "deepai",
    name: "DeepAI",
    logo: <DeepAIIcon />,
  },
  {
    id: "alibaba",
    name: "Qwen",
    logo: <QwenIcon />,
  },
  {
    id: "perplexity",
    name: "Perplexity",
    logo: <PerplexityIcon />,
  },
  {
    id: "azure",
    name: "Azure AI",
    logo: <AzureAIIcon />,
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    logo: <DeepSeekIcon />,
  },
  {
    id: "minimax",
    name: "Minimax",
    logo: <MinimaxIcon />,
  },
  {
    id: "google vertex",
    name: "Vertex AI",
    logo: <VertexAIIcon />,
  },
  {
    id: "google vertex (europe)",
    name: "Vertex AI (Europe)",
    logo: <VertexAIIcon />,
  },
  {
    id: "xai",
    name: "xAI",
    logo: <XAIIcon />,
  },
  {
    id: "ai21",
    name: "AI21",
    logo: <AI21Icon />,
  },
  {
    id: "cohere",
    name: "Cohere",
    logo: <CohereIcon />,
  },
  {
    id: "sambanova",
    name: "SambaNova",
    logo: <SambaNovaIcon />,
  },
  {
    id: "novitaai",
    name: "Novita AI",
    logo: <NovitaIcon />,
  },
  {
    id: "bedrock",
    name: "Amazon Bedrock",
    logo: <BedrockIcon />,
  },
  {
    id: "google ai",
    name: "Google AI Studio",
    logo: <GoogleAIIcon />,
  },
  {
    id: "lambda",
    name: "Lambda Labs",
    logo: <LambdaIcon />,
  },
];
