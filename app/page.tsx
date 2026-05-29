/**
 * Home Page - Family Tree Application
 * 
 * Main landing page that displays the interactive family tree visualization.
 * Features:
 * - Complete family hierarchy visualization
 * - Interactive member cards with generation-based styling
 * - Search and filtering functionality
 * - Member details modal
 * - Navigation controls (back, reset)
 * - Responsive design for mobile and desktop
 */

import { FamilyTree } from '@/components/family-tree/FamilyTree'

export const metadata = {
  title: 'Family Tree - Interactive Genealogy Visualization',
  description:
    'Explore your family history with an interactive family tree application. Visualize generations, relationships, and family branches.',
}

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="border-b bg-white dark:bg-slate-950 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Family Tree
            </h1>
            <p className="text-muted-foreground">
              Explore your family history and relationships
            </p>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="max-w-7xl mx-auto">
        <FamilyTree />
      </div>

      {/* Footer */}
      <footer className="border-t bg-white dark:bg-slate-950 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Family Tree Application. All rights
            reserved.
          </p>
        </div>
      </footer>
    </main>
  )
}
