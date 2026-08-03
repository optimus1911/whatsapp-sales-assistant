import React, { useState } from 'react'

export default function Avatar({ src, name = 'User', size = 'md', online = false }) {
  const [hasError, setHasError] = useState(false)

  // Size mapping dictionary for CSS Tailwind styling
  const avatarSizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-14 h-14 text-lg'
  }

  // Size mapping for the absolute positioned online indicator dot
  const statusIndicatorSizes = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-3.5 h-3.5',
    xl: 'w-4 h-4'
  }

  // Generates fallback initials (up to 2 letters) from a display name
  const getFallbackInitials = (displayName) => {
    if (!displayName) return '?'
    const nameSegments = displayName.trim().split(/\s+/)
    if (nameSegments.length >= 2) {
      return (nameSegments[0][0] + nameSegments[1][0]).toUpperCase()
    }
    return displayName.substring(0, 2).toUpperCase()
  }

  const resolvedAvatarSize = avatarSizes[size] || avatarSizes.md
  const resolvedIndicatorSize = statusIndicatorSizes[size] || statusIndicatorSizes.md

  return (
    <div className="relative inline-block select-none flex-shrink-0">
      {src && !hasError ? (
        <img
          src={src}
          alt={`${name}'s profile avatar`}
          onError={() => setHasError(true)}
          className={`${resolvedAvatarSize} rounded-full object-cover border border-whatsapp-border bg-whatsapp-panel`}
        />
      ) : (
        <div
          className={`${resolvedAvatarSize} rounded-full flex items-center justify-center bg-whatsapp-teal text-white font-semibold border border-whatsapp-border`}
          aria-label={name}
        >
          {getFallbackInitials(name)}
        </div>
      )}
      
      {online && (
        <span
          className={`absolute bottom-0 right-0 rounded-full bg-whatsapp-green border-2 border-whatsapp-sidebar ${resolvedIndicatorSize}`}
          title="Online"
          role="status"
          aria-label="Online"
        />
      )}
    </div>
  )
}
