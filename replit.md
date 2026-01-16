# Shouma Tourism App

## Overview

Shouma (شومة) is a tourism discovery application designed for Oman travelers. The app helps users explore destinations, hotels, restaurants, hiking trips, and taxis. A key feature called "Shoumatak" (شومتك) provides personalized trip planning through a questionnaire-based itinerary generator.

The application follows a modern full-stack architecture with a React frontend and Express backend, using Arabic (RTL) as the primary language with a warm brown/beige design palette inspired by premium travel platforms.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom warm brown/beige color palette
- **Build Tool**: Vite with hot module replacement

**Key Design Decisions:**
- RTL (right-to-left) layout as primary direction for Arabic content
- Typography uses Cairo (Arabic) and Montserrat (headers) Google Fonts
- Card-based UI for destination discovery and exploration
- Mobile-first responsive design with breakpoints for tablet and desktop

### Multi-Language System
- **8 Languages Supported**: Arabic (AR), English (EN), French (FR), Spanish (ES), Turkish (TR), Chinese (ZH), Japanese (JA), Persian (FA)
- **RTL Languages**: Arabic and Persian automatically set document direction to 'rtl' and apply Cairo font
- **Language Context**: `client/src/contexts/LanguageContext.tsx` provides language state and translation function
- **Translation Files**: `client/src/lib/translations.ts` contains all translation dictionaries
- **Language Switcher**: Globe icon dropdown in header with code badges (no emoji flags for compliance)
- **Persistence**: Language preference stored in localStorage with key 'shouma-language'
- **Filter System**: Tour guides page uses language-agnostic keys for specialization/city filters to work across language switches

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **HTTP Server**: Node.js native HTTP server
- **API Pattern**: RESTful JSON APIs under `/api` prefix
- **Storage**: In-memory storage with interface abstraction for future database integration

**Route Structure:**
- `/api/auth/register` - User registration
- `/api/auth/login` - User authentication
- `/api/itinerary` - Trip itinerary generation

### Data Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` (shared between client and server)
- **Validation**: Zod schemas with drizzle-zod integration
- **Current Storage**: MemStorage class (in-memory, ready for database migration)

**Data Models:**
- Users table with username/password authentication
- Questionnaire schema for trip preferences (duration, budget, interests, group size, activities, accommodation, meals)
- Itinerary types for generated trip plans
- Attraction interface with optional lat/lng coordinates for geolocation features

### Nearby Places Feature
- **Route**: `/nearby`
- **Component**: `client/src/pages/nearby-places.tsx`
- **Functionality**: Uses browser Geolocation API to find user's current location and displays nearby tourist attractions sorted by distance
- **Algorithm**: Haversine formula for distance calculation between user location and attraction coordinates
- **States**: Loading (requesting location), Error (location denied/unavailable with retry), Success (grid of nearby attractions)
- **Coverage**: 18+ attractions have coordinates across Muscat, Dakhiliyah, Wusta, North Batinah, and Dhofar governorates

### Build System
- **Development**: Vite dev server with Express middleware integration
- **Production**: esbuild for server bundling, Vite for client build
- **Output**: `dist/` directory with `public/` for static assets

## Pending Features

### Payment Integration (Hotels)
- **Status**: Not configured
- **Requirement**: User requested Apple Pay and credit card payment for hotel bookings
- **Solution**: Stripe integration - user needs to provide Stripe API keys (Secret Key and Publishable Key) or complete the Replit Stripe connector setup
- **Note**: When ready, use Replit's Stripe connector for secure payment processing

## External Dependencies

### Database
- **PostgreSQL**: Configured via `DATABASE_URL` environment variable
- **Connection**: Drizzle ORM with `drizzle-kit` for migrations
- **Session Store**: connect-pg-simple available for session persistence

### UI Framework
- **Radix UI**: Complete primitive component set (dialogs, dropdowns, tabs, tooltips, etc.)
- **Embla Carousel**: Image carousels for destination galleries
- **Lucide Icons**: Icon library for UI elements

### Fonts
- **Google Fonts**: Cairo and Montserrat loaded via CDN in `client/index.html`

### Development Tools
- **Replit Plugins**: Runtime error overlay, cartographer, and dev banner for Replit environment
- **TypeScript**: Strict mode with path aliases (`@/` for client, `@shared/` for shared code)