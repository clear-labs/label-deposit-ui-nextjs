import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image"

interface LabelIconProps {
  symbol?: string
  image?: string
  name?: string
  size?: "xs" | "sm" | "md" | "lg" | "xl"
  showLabel?: boolean
}

export function LabelIcon({
  symbol,
  image,
  name,
  size = "md",
  showLabel = false
}: LabelIconProps) {
  const sizeClass = {
    xs: "h-4 w-4",
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12",
    xl: "h-16 w-16"
  }[size]

  const imageSizes = {
    xs: 14,
    sm: 22,
    md: 30,
    lg: 44,
    xl: 56
  }[size]

  const fallbackText = symbol?.slice(0, 2).toUpperCase() || '??'

  return (
    <div className={`${sizeClass} flex items-center gap-2 relative`}>
      {image && (
        <div className={`${sizeClass} absolute top-0 left-0 blur opacity-50`}>
          <Image
            src={image}
            alt={name || symbol || ''}
            width={imageSizes}
            height={imageSizes}
          />
        </div>
      )}
      <Avatar className={`relative ${sizeClass}`}>
        {image && (
          <AvatarImage
            src={image}
            alt={name || symbol || ''}
          />
        )}
        <AvatarFallback>
          {fallbackText}
        </AvatarFallback>
      </Avatar>
      {showLabel && symbol && (
        <span>{symbol}</span>
      )}
    </div>
  )
} 