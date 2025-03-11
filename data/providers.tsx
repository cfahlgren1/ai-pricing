import type { Provider } from "@/components/provider-tabs"
import OpenAIIcon from "@/components/icons/OpenAIIcon"
import AnthropicIcon from "@/components/icons/AnthropicIcon"
import DeepmindIcon from "@/components/icons/DeepmindIcon"
import TogetherAIIcon from "@/components/icons/TogetherAIIcon"
import FireworksAIIcon from "@/components/icons/FireworksAIIcon"

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
    name: "Together.ai",
    logo: <TogetherAIIcon />,
  },
  {
    id: "fireworks",
    name: "Fireworks AI",
    logo: <FireworksAIIcon />,
  },
];
