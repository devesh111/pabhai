/**
 * MemberDetailsModal Component
 * 
 * Displays detailed information about a family member in a modal dialog:
 * - Full name and generation
 * - Birth/death years
 * - Branch and status
 * - Contact information (email, phone)
 * - Address and occupation
 * - Notes and additional information
 * - Family relationships (parent, children, siblings)
 */

'use client'

import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Mail, Phone, MapPin, Briefcase, Users } from 'lucide-react'

interface PersonDetails {
  id: bigint
  person_name: string
  generation_id: bigint
  father_id: bigint | null
  branch: string | null
  status: string | null
  birth_year: number | null
  death_year: number | null
  notes: string | null
  sort_order: number | null
  created_at: Date
  updated_at: Date
  generations: {
    id: number
    generation_no: number
    label: string | null
    color: string | null
  }
  persons: PersonDetails | null
  other_persons: PersonDetails[]
}

interface MemberDetailsModalProps {
  isOpen: boolean
  personId: bigint | null
  onClose: () => void
}

export function MemberDetailsModal({
  isOpen,
  personId,
  onClose,
}: MemberDetailsModalProps) {
  const [person, setPerson] = useState<PersonDetails | null>(null)
  const [siblings, setSiblings] = useState<PersonDetails[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isOpen || !personId) return

    const fetchPersonDetails = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/family-tree/${personId}`)
        const data = await response.json()

        if (data.success) {
          setPerson(data.data.person)
          setSiblings(data.data.siblings)
        }
      } catch (error) {
        console.error('Error fetching person details:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPersonDetails()
  }, [isOpen, personId])

  if (!person) return null

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

  const getYearRange = () => {
    if (person.birth_year && person.death_year) {
      return `${person.birth_year} - ${person.death_year}`
    } else if (person.birth_year) {
      return `Born: ${person.birth_year}`
    }
    return 'Year information not available'
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{person.person_name}</DialogTitle>
          <DialogDescription>
            {person.generations?.label ||
              `Generation ${person.generations?.generation_no}`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="font-semibold mb-3">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Years</p>
                <p className="font-medium">{getYearRange()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                {person.status && (
                  <Badge className={`${getStatusColor(person.status)}`}>
                    {person.status}
                  </Badge>
                )}
              </div>
              {person.branch && (
                <div>
                  <p className="text-sm text-muted-foreground">Branch</p>
                  <p className="font-medium">{person.branch}</p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Contact Information */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Contact Information
            </h3>
            <div className="space-y-2 text-sm">
              <p className="text-muted-foreground">
                Email and phone information not available in current database
              </p>
            </div>
          </div>

          <Separator />

          {/* Family Relationships */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Family Relationships
            </h3>
            <div className="space-y-3">
              {person.persons && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Father</p>
                  <p className="font-medium">{person.persons.person_name}</p>
                </div>
              )}

              {person.other_persons && person.other_persons.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Children ({person.other_persons.length})
                  </p>
                  <div className="space-y-1">
                    {person.other_persons.map((child) => (
                      <p key={child.id} className="text-sm font-medium">
                        {child.person_name}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {siblings && siblings.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Siblings ({siblings.length})
                  </p>
                  <div className="space-y-1">
                    {siblings.map((sibling) => (
                      <p key={sibling.id} className="text-sm font-medium">
                        {sibling.person_name}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          {person.notes && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-3">Notes</h3>
                <p className="text-sm text-muted-foreground">{person.notes}</p>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
