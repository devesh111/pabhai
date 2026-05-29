/**
 * FamilyMemberCard Component
 * 
 * Displays a single family member as an interactive card with:
 * - Name and generation information
 * - Generation-based color styling
 * - Branch and status indicators
 * - Hover effects and animations
 * - Click handlers for focusing on the member
 * - Details button to open modal
 */

'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Info } from 'lucide-react'

interface FamilyMemberCardProps {
  id: bigint
  firstName: string
  lastName: string
  generation: {
    id: number
    generation_no: number
    label: string | null
    color: string | null
  }
  branch: string | null
  status: string | null
  birthYear: number | null
  deathYear: number | null
  onCardClick: (id: bigint) => void
  onDetailsClick: (id: bigint) => void
}

export function FamilyMemberCard({
  id,
  firstName,
  lastName,
  generation,
  branch,
  status,
  birthYear,
  deathYear,
  onCardClick,
  onDetailsClick,
}: FamilyMemberCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Get generation color code (default to slate if not available)
  const colorCode = generation?.color || '#64748b'
  
  // Convert hex color to RGB for lighter background
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 100, g: 116, b: 139 }
  }

  const rgb = hexToRgb(colorCode)
  const lightBgColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`
  const borderColor = colorCode

  // Determine status badge color
  const getStatusColor = (status: string | null) => {
    switch (status?.toLowerCase()) {
      case 'alive':
        return 'bg-green-100 text-green-800'
      case 'deceased':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-blue-100 text-blue-800'
    }
  }

  // Format birth/death years
  const getYearRange = () => {
    if (birthYear && deathYear) {
      return `${birthYear} - ${deathYear}`
    } else if (birthYear) {
      return `b. ${birthYear}`
    }
    return ''
  }

  return (
    <Card
      className="relative overflow-hidden transition-all duration-300 cursor-pointer hover:shadow-lg"
      style={{
        backgroundColor: lightBgColor,
        borderColor: borderColor,
        borderWidth: '2px',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onCardClick(id)}
    >
      <div className="p-4">
        {/* Header with name */}
        <div className="mb-3">
          <h3 className="font-semibold text-sm md:text-base truncate">
            {firstName} {lastName}
          </h3>
          <p className="text-xs text-muted-foreground">
            {generation?.label || `Generation ${generation?.generation_no}`}
          </p>
        </div>

        {/* Year range */}
        {getYearRange() && (
          <p className="text-xs text-muted-foreground mb-2">{getYearRange()}</p>
        )}

        {/* Badges for branch and status */}
        <div className="flex flex-wrap gap-2 mb-3">
          {branch && (
            <Badge variant="outline" className="text-xs">
              {branch}
            </Badge>
          )}
          {status && (
            <Badge className={`text-xs ${getStatusColor(status)}`}>
              {status}
            </Badge>
          )}
        </div>

        {/* Details button - visible on hover */}
        {isHovered && (
          <Button
            size="sm"
            variant="outline"
            className="w-full text-xs"
            onClick={(e) => {
              e.stopPropagation()
              onDetailsClick(id)
            }}
          >
            <Info className="w-3 h-3 mr-1" />
            View Details
          </Button>
        )}
      </div>
    </Card>
  )
}
