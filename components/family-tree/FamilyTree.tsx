/**
 * FamilyTree Component
 * 
 * Main component that orchestrates the family tree visualization:
 * - Fetches family tree data from API
 * - Manages tree state (full view, focused view, navigation history)
 * - Handles animations with GSAP
 * - Renders family member cards in hierarchical structure
 * - Manages modal for member details
 * - Provides search and filtering functionality
 */

'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { FamilyMemberCard } from './FamilyMemberCard'
import { MemberDetailsModal } from './MemberDetailsModal'
import { TreeControls } from './TreeControls'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

interface Generation {
  id: number
  generation_no: number
  label: string | null
  color: string | null
}

interface Person {
  id: bigint
  person_name: string
  generation_id: bigint
  father_id: bigint | null
  branch: string | null
  status: string | null
  birth_year: number | null
  death_year: number | null
  sort_order: number | null
  created_at: Date
  updated_at: Date
  generations: Generation
  persons: Person | null
  other_persons: Person[]
}

interface TreeNode extends Person {
  children: TreeNode[]
}

export function FamilyTree() {
  // State management
  const [generations, setGenerations] = useState<Generation[]>([])
  const [allPersons, setAllPersons] = useState<Person[]>([])
  const [treeData, setTreeData] = useState<TreeNode[]>([])
  const [displayedPersons, setDisplayedPersons] = useState<Person[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedPersonId, setSelectedPersonId] = useState<bigint | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [navigationHistory, setNavigationHistory] = useState<bigint[]>([])
  const [focusedPersonId, setFocusedPersonId] = useState<bigint | null>(null)

  // Refs for animations
  const containerRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<Map<string, HTMLDivElement>>(new Map())

  // Fetch family tree data on mount
  useEffect(() => {
    const fetchFamilyTree = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/family-tree')
        const data = await response.json()

        if (data.success) {
          setGenerations(data.data.generations)
          setAllPersons(data.data.persons)
          setTreeData(data.data.tree)
          setDisplayedPersons(data.data.persons)
        } else {
          setError('Failed to load family tree data')
        }
      } catch (err) {
        console.error('Error fetching family tree:', err)
        setError('An error occurred while loading the family tree')
      } finally {
        setLoading(false)
      }
    }

    fetchFamilyTree()
  }, [])

  // Animate initial tree rendering
  useEffect(() => {
    if (!loading && containerRef.current) {
      const cards = containerRef.current.querySelectorAll('[data-card]')
      gsap.fromTo(
        cards,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.05,
          ease: 'power2.out',
        }
      )
    }
  }, [loading, displayedPersons])

  // Handle search and filtering
  useEffect(() => {
    if (!searchQuery.trim()) {
      setDisplayedPersons(allPersons)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = allPersons.filter((person) =>
      person.person_name.toLowerCase().includes(query)
    )
    setDisplayedPersons(filtered)
  }, [searchQuery, allPersons])

  // Handle card click - focus on person and show descendants
  const handleCardClick = (personId: bigint) => {
    // Add to navigation history
    setNavigationHistory([...navigationHistory, focusedPersonId || BigInt(0)])
    setFocusedPersonId(personId)

    // Filter to show only this person and descendants
    const person = allPersons.find((p) => p.id === personId)
    if (person) {
      const descendants = getDescendants(personId, allPersons)
      setDisplayedPersons([person, ...descendants])

      // Animate zoom to selected card
      if (containerRef.current) {
        gsap.to(containerRef.current, {
          scrollIntoView: true,
          duration: 0.6,
          ease: 'power2.inOut',
        })
      }
    }
  }

  // Get all descendants of a person
  const getDescendants = (personId: bigint, persons: Person[]): Person[] => {
    const descendants: Person[] = []
    const children = persons.filter((p) => p.father_id === personId)

    children.forEach((child) => {
      descendants.push(child)
      descendants.push(...getDescendants(child.id, persons))
    })

    return descendants
  }

  // Handle back navigation
  const handleBack = () => {
    if (navigationHistory.length > 0) {
      const newHistory = [...navigationHistory]
      const previousId = newHistory.pop()
      setNavigationHistory(newHistory)

      if (previousId && previousId !== BigInt(0)) {
        setFocusedPersonId(previousId)
        const person = allPersons.find((p) => p.id === previousId)
        if (person) {
          const descendants = getDescendants(previousId, allPersons)
          setDisplayedPersons([person, ...descendants])
        }
      } else {
        setFocusedPersonId(null)
        setDisplayedPersons(allPersons)
      }
    }
  }

  // Handle reset to full tree
  const handleReset = () => {
    setFocusedPersonId(null)
    setNavigationHistory([])
    setDisplayedPersons(allPersons)
    setSearchQuery('')
  }

  // Handle details modal
  const handleDetailsClick = (personId: bigint) => {
    setSelectedPersonId(personId)
    setIsModalOpen(true)
  }

  if (loading) {
    return (
      <div className="space-y-4 p-4">
        <Skeleton className="h-20 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="w-full space-y-4">
      {/* Controls */}
      <TreeControls
        onBack={handleBack}
        onReset={handleReset}
        onSearch={setSearchQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        canGoBack={navigationHistory.length > 0}
      />

      {/* Family tree display */}
      <div
        ref={containerRef}
        className={`p-4 ${
          viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
            : 'space-y-2'
        }`}
      >
        {displayedPersons.length > 0 ? (
          displayedPersons.map((person) => (
            <div
              key={person.id.toString()}
              data-card
              ref={(el) => {
                if (el) {
                  cardsRef.current.set(person.id.toString(), el)
                }
              }}
            >
              <FamilyMemberCard
                id={person.id}
                firstName={person.person_name.split(' ')[0]}
                lastName={person.person_name.split(' ').slice(1).join(' ')}
                generation={person.generations}
                branch={person.branch}
                status={person.status}
                birthYear={person.birth_year}
                deathYear={person.death_year}
                onCardClick={handleCardClick}
                onDetailsClick={handleDetailsClick}
              />
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            No family members found matching your search.
          </div>
        )}
      </div>

      {/* Member details modal */}
      <MemberDetailsModal
        isOpen={isModalOpen}
        personId={selectedPersonId}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}
