/**
 * GET /api/family-tree/[id]
 * 
 * Fetches detailed information about a specific family member including:
 * - Personal information
 * - Generation details with color code
 * - Parent and children relationships
 * - Siblings (people with same father)
 * 
 * @param id - The person's ID
 */

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// Helper function to convert BigInt to string for JSON serialization
function serializeBigInt(obj: any): any {
  if (obj === null || obj === undefined) return obj
  if (typeof obj === 'bigint') return obj.toString()
  if (Array.isArray(obj)) return obj.map(serializeBigInt)
  if (typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      acc[key] = serializeBigInt(obj[key])
      return acc
    }, {} as any)
  }
  return obj
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const personId = BigInt(params.id)

    // Fetch the person with all relationships
    const person = await prisma.persons.findUnique({
      where: { id: personId },
      include: {
        generations: true,
        persons: true, // Parent
        other_persons: true, // Children
      },
    })

    if (!person) {
      return NextResponse.json(
        {
          success: false,
          error: 'Person not found',
        },
        { status: 404 }
      )
    }

    // Fetch siblings (people with same father)
    const siblings = await prisma.persons.findMany({
      where: {
        father_id: person.father_id,
        id: { not: personId },
      },
      include: {
        generations: true,
      },
    })

    // Serialize BigInt values to strings for JSON response
    const serializedPerson = serializeBigInt(person)
    const serializedSiblings = serializeBigInt(siblings)

    return NextResponse.json(
      {
        success: true,
        data: {
          person: serializedPerson,
          siblings: serializedSiblings,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching person details:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch person details',
      },
      { status: 500 }
    )
  }
}
