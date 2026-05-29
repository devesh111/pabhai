/**
 * TreeControls Component
 * 
 * Provides navigation and control buttons for the family tree:
 * - Back button to return to previous view
 * - Reset button to restore full tree view
 * - View mode toggle (grid/list)
 * - Search/filter functionality
 */

'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, RotateCcw, Grid3x3, List } from 'lucide-react'

interface TreeControlsProps {
  onBack: () => void
  onReset: () => void
  onSearch: (query: string) => void
  viewMode: 'grid' | 'list'
  onViewModeChange: (mode: 'grid' | 'list') => void
  canGoBack: boolean
}

export function TreeControls({
  onBack,
  onReset,
  onSearch,
  viewMode,
  onViewModeChange,
  canGoBack,
}: TreeControlsProps) {
  return (
    <div className="flex flex-col gap-4 p-4 bg-card border-b rounded-lg">
      {/* Main controls */}
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div className="flex gap-2">
          {/* Back button */}
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            disabled={!canGoBack}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          {/* Reset button */}
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            className="gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
        </div>

        {/* View mode toggle */}
        <div className="flex gap-1 border rounded-lg p-1">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('grid')}
            className="gap-1"
          >
            <Grid3x3 className="w-4 h-4" />
            Grid
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('list')}
            className="gap-1"
          >
            <List className="w-4 h-4" />
            List
          </Button>
        </div>
      </div>

      {/* Search input */}
      <Input
        placeholder="Search family members by name..."
        onChange={(e) => onSearch(e.target.value)}
        className="w-full"
      />
    </div>
  )
}
