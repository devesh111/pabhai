# Family Tree Application

An interactive, modern family tree visualization application built with Next.js, Prisma ORM, and PostgreSQL. Explore your family history with beautiful generation-based styling, smooth animations, and intuitive navigation.

## Features

### 🌳 Family Tree Visualization
- **Complete Family Hierarchy**: Display the entire family tree with parent-child relationships
- **Generation-Based Styling**: Each generation has a unique color code for visual distinction
- **Interactive Cards**: Click on family members to focus on their branch and descendants
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop devices

### 🎨 Visual Features
- **Generation Color Codes**: Dynamically applied from database to card borders and backgrounds
- **Status Indicators**: Visual badges for alive, deceased, or unknown status
- **Branch Information**: Display family branch identifiers
- **Year Ranges**: Birth and death years for each family member

### 🔍 Interactive Features
- **Search & Filter**: Find family members by name
- **View Modes**: Toggle between grid and list views
- **Navigation Controls**:
  - **Back Button**: Return to previous tree view
  - **Reset Button**: Restore complete family tree view
- **Member Details Modal**: View comprehensive information about each family member

### ⚡ Animations
- **GSAP Animations**: Smooth transitions for:
  - Initial tree rendering
  - Card hover effects
  - Zoom to selected member
  - Tree reset and navigation transitions
- **Premium Feel**: Animations similar to modern genealogy applications

### 🗄️ Database
- **PostgreSQL with Neon**: Cloud-hosted PostgreSQL database
- **Prisma ORM**: Type-safe database access
- **Optimized Queries**: Indexed relationships for fast data retrieval

## Tech Stack

- **Frontend**: Next.js 14+ (App Router), React, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui components
- **Database**: PostgreSQL (Neon), Prisma ORM
- **Animations**: GSAP (GreenSock Animation Platform)
- **Icons**: Lucide React
- **Theme**: next-themes for dark mode support

## Project Structure

```
pabhai/
├── app/
│   ├── api/
│   │   └── family-tree/
│   │       ├── route.ts              # GET /api/family-tree - Fetch all family data
│   │       └── [id]/
│   │           └── route.ts          # GET /api/family-tree/[id] - Fetch person details
│   ├── layout.tsx                    # Root layout with metadata
│   ├── page.tsx                      # Home page
│   └── globals.css                   # Global styles
├── components/
│   ├── family-tree/
│   │   ├── FamilyTree.tsx            # Main tree component with state management
│   │   ├── FamilyMemberCard.tsx      # Individual member card component
│   │   ├── MemberDetailsModal.tsx    # Details modal dialog
│   │   └── TreeControls.tsx          # Navigation and control buttons
│   ├── ui/                           # shadcn/ui components
│   └── theme-provider.tsx            # Dark mode theme provider
├── lib/
│   ├── db.ts                         # Prisma client singleton
│   └── utils.ts                      # Utility functions
├── prisma/
│   ├── schema.prisma                 # Database schema
│   └── migrations/                   # Database migrations
├── public/                           # Static assets
├── .env.example                      # Environment variables template
├── .env.local                        # Local environment variables (not committed)
├── package.json                      # Dependencies
├── tsconfig.json                     # TypeScript configuration
├── tailwind.config.ts                # Tailwind CSS configuration
└── README.md                         # This file
```

## Database Schema

### `generations` Table
Stores generation information with color codes for styling.

```sql
- id (BigInt): Primary key
- generation_no (SmallInt): Generation number (unique)
- label (VarChar): Generation label (e.g., "Generation 1")
- color (VarChar): Hex color code for styling (e.g., "#FF5733")
- created_at (Timestamp): Creation timestamp
- updated_at (Timestamp): Last update timestamp
```

### `persons` Table
Stores family member information with relationships.

```sql
- id (BigInt): Primary key
- generation_id (BigInt): Foreign key to generations
- father_id (BigInt): Foreign key to parent person (nullable)
- person_name (VarChar): Full name of the person
- branch (VarChar): Family branch identifier
- status (VarChar): Status (alive, deceased, unknown)
- birth_year (SmallInt): Birth year
- death_year (SmallInt): Death year
- notes (Text): Additional notes
- sort_order (Int): Display order
- created_at (Timestamp): Creation timestamp
- updated_at (Timestamp): Last update timestamp
```

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database (Neon recommended)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/devesh111/pabhai.git
   cd pabhai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your Neon PostgreSQL connection string:
   ```
   DATABASE_URL="postgresql://user:password@host/database?sslmode=require&connect_timeout=10&pool_timeout=10&connection_limit=10"
   ```

4. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## API Routes

### GET `/api/family-tree`
Fetches the complete family tree data.

**Response:**
```json
{
  "success": true,
  "data": {
    "generations": [...],
    "persons": [...],
    "tree": [...]
  }
}
```

### GET `/api/family-tree/[id]`
Fetches detailed information about a specific family member.

**Parameters:**
- `id` (string): The person's ID

**Response:**
```json
{
  "success": true,
  "data": {
    "person": {...},
    "siblings": [...]
  }
}
```

## Component Documentation

### FamilyTree
Main component that orchestrates the family tree visualization.

**Features:**
- Fetches family tree data from API
- Manages tree state (full view, focused view, navigation history)
- Handles GSAP animations
- Manages search and filtering
- Renders family member cards

### FamilyMemberCard
Displays a single family member as an interactive card.

**Props:**
- `id`: Person's ID
- `firstName`: First name
- `lastName`: Last name
- `generation`: Generation object with color code
- `branch`: Family branch
- `status`: Person's status
- `birthYear`: Birth year
- `deathYear`: Death year
- `onCardClick`: Callback when card is clicked
- `onDetailsClick`: Callback when details button is clicked

### MemberDetailsModal
Displays detailed information about a family member in a modal.

**Props:**
- `isOpen`: Whether modal is open
- `personId`: ID of person to display
- `onClose`: Callback when modal closes

### TreeControls
Provides navigation and control buttons.

**Props:**
- `onBack`: Callback for back button
- `onReset`: Callback for reset button
- `onSearch`: Callback for search input
- `viewMode`: Current view mode ('grid' or 'list')
- `onViewModeChange`: Callback for view mode toggle
- `canGoBack`: Whether back button should be enabled

## Styling

### Generation Colors
Generation colors are fetched from the database and dynamically applied to:
- Card border color (full color)
- Card background color (10% opacity)

### Responsive Design
- **Mobile**: Single column layout, optimized touch targets
- **Tablet**: Two column grid layout
- **Desktop**: Three column grid layout

### Dark Mode
The application supports dark mode using next-themes. Users can toggle between light, dark, and system preferences.

## Animations

### GSAP Animations
- **Initial Render**: Cards fade in and slide up with staggered timing
- **Card Hover**: Subtle scale and shadow effects
- **Navigation**: Smooth transitions when focusing on members
- **Reset**: Fade out and fade in for tree reset

## Database Connection

### Neon PostgreSQL Setup
1. Create a free account at [https://console.neon.tech](https://console.neon.tech)
2. Create a new project and database
3. Copy the connection string
4. Add to `.env.local` as `DATABASE_URL`

### Connection Parameters
- `sslmode=require`: Required for Neon
- `connect_timeout=10`: Connection timeout in seconds
- `pool_timeout=10`: Pool timeout in seconds
- `connection_limit=10`: Maximum connections (adjust based on plan)

## Development

### Running Tests
```bash
npm run test
```

### Building for Production
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
```

## Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Add `DATABASE_URL` environment variable
4. Deploy

### Other Platforms
- Ensure Node.js 18+ is available
- Set `DATABASE_URL` environment variable
- Run `npm run build` and `npm start`

## Performance Optimization

### Database
- Indexed relationships for fast queries
- Prisma client singleton to avoid connection exhaustion
- Optimized queries with proper includes

### Frontend
- Next.js image optimization
- Code splitting with dynamic imports
- GSAP for performant animations
- Skeleton loaders for better UX

## Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Check SSL mode is set to `require`
- Ensure connection limits are appropriate
- Check Neon dashboard for connection status

### Animations Not Working
- Ensure GSAP is installed: `npm install gsap`
- Check browser console for errors
- Verify refs are properly attached to DOM elements

### Data Not Loading
- Check API routes in browser DevTools
- Verify database has data
- Check Prisma schema matches database structure

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues, questions, or suggestions, please open an issue on GitHub or contact the development team.

## Changelog

### Version 1.0.0
- Initial release
- Complete family tree visualization
- Interactive member cards
- Member details modal
- Search and filtering
- Dark mode support
- Responsive design
- GSAP animations

---

**Built with ❤️ for exploring family history**
