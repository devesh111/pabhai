# Family Tree Application - Deployment & Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database (Neon recommended)
- Git

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/devesh111/pabhai.git
   cd pabhai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
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

5. **Run development server**
   ```bash
   npm run dev
   ```

6. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📊 Database Setup

### Neon PostgreSQL (Recommended)

1. Create account at [https://console.neon.tech](https://console.neon.tech)
2. Create a new project and database
3. Copy the connection string
4. Add to `.env.local` as `DATABASE_URL`

### Connection String Format
```
postgresql://user:password@host/database?sslmode=require&connect_timeout=10&pool_timeout=10&connection_limit=10
```

**Parameters:**
- `sslmode=require`: Required for Neon
- `connect_timeout=10`: Connection timeout in seconds
- `pool_timeout=10`: Pool timeout in seconds
- `connection_limit=10`: Maximum connections (adjust based on plan)

## 🏗️ Project Architecture

### Technology Stack
- **Frontend**: Next.js 14+ (App Router), React, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui
- **Database**: PostgreSQL (Neon), Prisma ORM
- **Animations**: GSAP (GreenSock Animation Platform)
- **Icons**: Lucide React
- **Theme**: next-themes for dark mode

### Folder Structure
```
pabhai/
├── app/
│   ├── api/family-tree/          # API routes
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   └── globals.css               # Global styles
├── components/
│   ├── family-tree/              # Family tree components
│   ├── ui/                       # shadcn/ui components
│   └── theme-provider.tsx        # Dark mode provider
├── lib/
│   ├── db.ts                     # Prisma client singleton
│   └── utils.ts                  # Utilities
├── prisma/
│   ├── schema.prisma             # Database schema
│   └── migrations/               # Database migrations
└── public/                       # Static assets
```

## 🔌 API Routes

### GET `/api/family-tree`
Fetches complete family tree data with all persons and generations.

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
- `id`: Person's ID (as string)

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

## 🎨 Key Features

### ✅ Implemented
- [x] Complete family tree visualization
- [x] Generation-based color styling
- [x] Interactive member cards
- [x] Member details modal
- [x] Search and filtering
- [x] Navigation controls (Back, Reset)
- [x] View mode toggle (Grid, List)
- [x] GSAP animations
- [x] Dark mode support
- [x] Responsive design
- [x] SEO metadata
- [x] Database integration with Prisma

### 🔄 Data Flow
1. **Frontend** → Fetches data from API routes
2. **API Routes** → Query database using Prisma
3. **Prisma** → Executes queries on PostgreSQL
4. **Database** → Returns family tree data
5. **Frontend** → Renders with GSAP animations

## 🚢 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Add `DATABASE_URL` environment variable
4. Deploy

### Other Platforms
- Ensure Node.js 18+ is available
- Set `DATABASE_URL` environment variable
- Run `npm run build` and `npm start`

## 📝 Database Schema

### `generations` Table
```sql
- id (BigInt): Primary key
- generation_no (SmallInt): Generation number (unique)
- label (VarChar): Generation label
- color (VarChar): Hex color code
- created_at (Timestamp): Creation timestamp
- updated_at (Timestamp): Last update timestamp
```

### `persons` Table
```sql
- id (BigInt): Primary key
- generation_id (BigInt): Foreign key to generations
- father_id (BigInt): Foreign key to parent person
- person_name (VarChar): Full name
- branch (VarChar): Family branch
- status (VarChar): Status (alive, deceased, unknown)
- birth_year (SmallInt): Birth year
- death_year (SmallInt): Death year
- notes (Text): Additional notes
- sort_order (Int): Display order
- created_at (Timestamp): Creation timestamp
- updated_at (Timestamp): Last update timestamp
```

## 🔧 Development

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

### Prisma Commands
```bash
# Generate Prisma Client
npx prisma generate

# View database schema
npx prisma studio

# Create migration
npx prisma migrate dev --name migration_name

# Deploy migrations
npx prisma migrate deploy
```

## 🐛 Troubleshooting

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
- Review server logs for errors

### Build Errors
- Clear `.next` directory: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Regenerate Prisma Client: `npx prisma generate`

## 📚 Component Documentation

### FamilyTree
Main component orchestrating the family tree visualization.

**Features:**
- Fetches family tree data from API
- Manages tree state and navigation history
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

## 🎯 Performance Optimization

### Database
- Indexed relationships for fast queries
- Prisma client singleton to avoid connection exhaustion
- Optimized queries with proper includes

### Frontend
- Next.js image optimization
- Code splitting with dynamic imports
- GSAP for performant animations
- Skeleton loaders for better UX

## 📖 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [GSAP Documentation](https://greensock.com/docs)
- [Neon PostgreSQL Documentation](https://neon.tech/docs)

## 📞 Support

For issues, questions, or suggestions, please:
1. Check the troubleshooting section above
2. Review the README.md file
3. Open an issue on GitHub
4. Contact the development team

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ for exploring family history**
