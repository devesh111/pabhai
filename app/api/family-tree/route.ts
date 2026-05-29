/**
 * GET /api/family-tree
 * 
 * Fetches the complete family tree data including all persons and generations.
 * Returns a hierarchical structure with generation color codes for styling.
 * 
 * Response format:
 * {
 *   generations: Array of generation objects with color codes
 *   persons: Array of person objects with relationships
 *   tree: Hierarchical tree structure (root persons with descendants)
 * }
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

export async function GET() {
  try {
    // Fetch all generations with their color codes
    const generations = await prisma.generations.findMany({
      orderBy: { generation_no: 'asc' },
    })

    // Fetch all persons with their relationships
    const persons = await prisma.persons.findMany({
      include: {
        generations: true,
        persons: true, // Parent relationship
        other_persons: true, // Children relationships
      },
      orderBy: [
        { generation_id: 'asc' },
        { sort_order: 'asc' },
        { person_name: 'asc' },
      ],
    })

    // Build hierarchical tree structure
    // Root persons are those without a father_id
    const rootPersons = persons.filter((p) => p.father_id === null)

    // Helper function to recursively build tree with descendants
    const buildTree = (personId: bigint) => {
      const person = persons.find((p) => p.id === personId)
      if (!person) return null

      const children = persons.filter((p) => p.father_id === personId)

      return {
        ...person,
        children: children.map((child) => buildTree(child.id)).filter(Boolean),
      }
    }

    // Build complete tree structure
    const tree = rootPersons
      .map((person) => buildTree(person.id))
      .filter(Boolean)

    // Serialize BigInt values to strings for JSON response
    const serializedGenerations = serializeBigInt(generations)
    const serializedPersons = serializeBigInt(persons)
    const serializedTree = serializeBigInt(tree)

    return NextResponse.json(
      {
        success: true,
        data: {
          generations: serializedGenerations,
          persons: serializedPersons,
          tree: serializedTree,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching family tree:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch family tree data',
      },
      { status: 500 }
    )
  }
}
