"use client"

import { cn } from "@/lib/utils"
import Link from "next/link"
import { HTMLAttributes } from "react"
import { useQueryState } from "nuqs"

export interface Provider {
  id: string
  name: string
  logo: React.ReactNode
}

interface ProviderTabsProps extends HTMLAttributes<HTMLDivElement> {
  providers: Provider[]
  title?: string
  showViewAll?: boolean
  viewAllHref?: string
}

export default function ProviderTabs({
  providers,
  title = "Providers",
  showViewAll = false,
  viewAllHref = "/providers",
  className,
  ...props
}: ProviderTabsProps) {
  const [selectedProvider, setSelectedProvider] = useQueryState("provider")

  const handleProviderClick = (providerId: string) => {
    setSelectedProvider(providerId === selectedProvider ? null : providerId)
  }

  return (
    <div className={cn("w-full", className)} {...props}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-medium">{title}</h2>
        {showViewAll && (
          <Link 
            href={viewAllHref}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            View all →
          </Link>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {providers.map((provider) => {
          const isSelected = selectedProvider === provider.id
          return (
            <button
              key={provider.id}
              onClick={() => handleProviderClick(provider.id)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 border rounded-full text-sm font-medium transition-all duration-200",
                isSelected 
                  ? "bg-primary border-primary text-primary-foreground" 
                  : "bg-card border-border hover:bg-accent hover:border-accent hover:bg-card/80 hover:scale-105 hover:shadow-sm"
              )}
            >
              <span className="flex items-center justify-center size-5 text-inherit">
                {provider.logo}
              </span>
              {provider.name}
            </button>
          )
        })}
      </div>
    </div>
  )
} 
