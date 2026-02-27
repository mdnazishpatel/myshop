# MyShop - Product Discovery Experience

A modern web application built for the Beespoke.ai Tech Intern R1 Build Challenge, demonstrating product discovery, user preferences, and browsing history tracking.

## 🚀 Live Demo

**Deployed Application:** [https://myshop-8o2t.vercel.app/](https://myshop-8o2t.vercel.app/)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Architecture & Design Decisions](#architecture--design-decisions)
- [State Management](#state-management)
- [Data Persistence](#data-persistence)
- [Key Implementation Details](#key-implementation-details)
- [Future Improvements](#future-improvements)
- [Project Structure](#project-structure)

## 🎯 Overview

MyShop is a product discovery platform that allows users to browse products, express their preferences through like/dislike interactions, view detailed product information, and track their browsing history. The application fetches real product data from the FakeStore API and provides a seamless, persistent user experience.

## ✨ Features

### Core Features (Required)

- **Product Feed**: Dynamic product listing with images, titles, prices, and descriptions
- **Like/Dislike System**: Interactive preference mechanism with visual feedback
- **Local Persistence**: User preferences saved locally and persisted across sessions
- **Product Detail Pages**: Comprehensive product information with navigation
- **Visit Tracking**: Browsing history that tracks which products users have viewed
- **External Product Links**: "Visit Product" button that opens products in new tabs

### Additional Features (Bonus)

- **Responsive Design**: Mobile-first approach that works across all devices
- **Loading States**: Skeleton loaders and loading indicators for better UX
- **Error Handling**: Graceful error messages and fallback UI
- **Category Filtering**: Browse products by category
- **Search Functionality**: Quick product search capability
- **Smooth Animations**: Enhanced user experience with transitions

## 🛠 Tech Stack

- **Framework**: Next.js 14 (React 18)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API + Hooks
- **Data Fetching**: Native Fetch API with async/await
- **Local Storage**: Browser localStorage API
- **Deployment**: Vercel
- **API**: FakeStore API

## 🚦 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/mdnazishpatel/myshop.git
cd myshop
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## 🏗 Architecture & Design Decisions

### 1. Framework Choice:

**Rationale:**
- Built-in routing system simplifies navigation between product feed and detail pages
- Server-side rendering (SSR) capabilities for better initial load performance
- Excellent developer experience with hot reloading and TypeScript support
- Easy deployment on Vercel
- Future scalability with API routes if backend functionality is needed

### 2. TypeScript Integration

**Rationale:**
- Type safety reduces runtime errors and improves code quality
- Better IDE support with autocomplete and inline documentation
- Easier refactoring and maintenance
- Clear interfaces for products, preferences, and history items

### 3. Component Architecture

**Approach:**
- Separation of concerns with reusable components
- Container/Presentational component pattern
- Custom hooks for shared logic
- Composition over inheritance

**Key Components:**
- `ProductCard`: Reusable product display with like/dislike buttons
- `ProductDetail`: Full product information view
- `HistoryList`: Displays browsing history
- `Layout`: Consistent page structure with navigation

## 🔄 State Management

### Choice: React Context API + Custom Hooks

**Rationale:**
- Sufficient for application complexity without over-engineering
- No additional dependencies or bundle size increase
- Built-in React features that team members would be familiar with
- Easy to understand and maintain

**Implementation:**

```typescript
// Three main contexts:
1. PreferencesContext: Manages liked/disliked products
2. HistoryContext: Tracks visited product pages
3. ProductsContext: Handles product data and loading states
```

**Why Not Redux/Zustand?**
- Application state is relatively simple and doesn't require complex middleware
- Context API provides enough performance for this scale
- Reduces learning curve and external dependencies

**Custom Hooks Created:**
- `usePreferences()`: Access and modify user preferences
- `useHistory()`: Track and retrieve browsing history
- `useLocalStorage()`: Generic hook for localStorage operations

## 💾 Data Persistence

### Method: Browser localStorage

**Rationale:**
- Native browser API with wide support
- No backend required
- Data persists across sessions
- Simple key-value storage perfect for preferences and history
- Synchronous API for immediate read/write

**Implementation Strategy:**

```typescript
// Storage keys
const STORAGE_KEYS = {
  PREFERENCES: 'myshop_preferences',
  HISTORY: 'myshop_history',
  LAST_VISIT: 'myshop_last_visit'
}

// Data structure
{
  preferences: {
    liked: [productId1, productId2],
    disliked: [productId3, productId4]
  },
  history: [
    { id, title, timestamp, category }
  ]
}
```

**Alternatives Considered:**
- **IndexedDB**: Too complex for simple key-value storage needs
- **Session Storage**: Doesn't persist across browser sessions
- **Cookies**: Size limitations and security concerns
- **Backend Database**: Unnecessary complexity for MVP

**Data Validation:**
- JSON parsing with try-catch error handling
- Default values if localStorage is empty or corrupted
- Regular cleanup of old history items (optional feature)

## 🔑 Key Implementation Details

### 1. API Integration

**FakeStore API Integration:**
```typescript
// Endpoints used:
- GET /products - Fetch all products
- GET /products/:id - Fetch single product
- GET /products/categories - Get category list
- GET /products/category/:category - Filter by category
```

**Error Handling:**
- Network error detection and user-friendly messages
- Retry logic for failed requests
- Loading states during data fetching
- Fallback UI when API is unavailable

### 2. Like/Dislike Interaction

**UX Pattern:**
- Toggle-style buttons with clear visual states
- Instant UI feedback (optimistic updates)
- Persistent across page navigation
- Clear indication of current preference state

**Implementation:**
```typescript
// State transitions:
- No preference → Like → No preference
- No preference → Dislike → No preference
- Like ↔ Dislike (mutual exclusivity)
```

### 3. Product Detail & Navigation

**Routing Strategy:**
- Dynamic routes: `/product/[id]`
- URL-based navigation for shareable links
- Browser back/forward support
- Breadcrumb navigation for context

**Visit Tracking:**
- Automatic tracking on product detail page mount
- Timestamp for each visit
- Duplicate visit handling (update timestamp vs new entry)
- History limit (e.g., last 50 visits)

### 4. Responsive Design

**Approach:**
- Mobile-first CSS with Tailwind breakpoints
- Grid layouts that adapt to screen size
- Touch-friendly button sizes and spacing
- Optimized images for different viewports

## 🚀 Future Improvements

### With More Time, I Would Add:

1. **Performance Optimizations**
   - Implement virtual scrolling for large product lists
   - Image lazy loading and optimization
   - Caching strategy with React Query or SWR
   - Code splitting for faster initial load

2. **Enhanced Features**
   - Advanced filtering (price range, rating, availability)
   - Sorting options (price, popularity, newest)
   - Product comparison feature
   - Wishlist/favorites collection
   - Shopping cart functionality

3. **Recommendation Engine**
   - Basic ML-based recommendations based on liked products
   - "Similar products" section
   - Category affinity scoring
   - Personalized product feed ordering

4. **Better User Experience**
   - Onboarding tutorial for first-time users
   - Keyboard navigation support
   - Advanced animations and micro-interactions
   - Dark mode support
   - Accessibility improvements (ARIA labels, screen reader support)

5. **Data & Analytics**
   - User behavior analytics
   - A/B testing framework
   - Performance monitoring
   - Error tracking and logging

6. **Testing**
   - Unit tests with Jest
   - Integration tests with React Testing Library
   - E2E tests with Playwright or Cypress
   - Visual regression testing

7. **Technical Improvements**
   - PWA capabilities (offline support, installability)
   - Service worker for background sync
   - Server-side rendering optimization
   - API rate limiting and request batching

8. **Backend Integration**
   - User authentication
   - Cloud database for cross-device sync
   - Real-time updates with WebSockets
   - Product reviews and ratings

## 📁 Project Structure

```
myshop/
├── public/               # Static assets
├── src/
│   ├── app/             # Next.js app directory
│   │   ├── layout.tsx   # Root layout
│   │   ├── page.tsx     # Home page (product feed)
│   │   ├── product/     # Product detail pages
│   │   └── history/     # Browsing history page
│   ├── components/      # Reusable components
│   │   ├── ProductCard.tsx
│   │   ├── ProductDetail.tsx
│   │   ├── Header.tsx
│   │   └── ...
│   ├── contexts/        # React context providers
│   │   ├── PreferencesContext.tsx
│   │   ├── HistoryContext.tsx
│   │   └── ProductsContext.tsx
│   ├── hooks/           # Custom React hooks
│   │   ├── usePreferences.ts
│   │   ├── useHistory.ts
│   │   └── useLocalStorage.ts
│   ├── types/           # TypeScript interfaces
│   │   └── product.ts
│   └── utils/           # Helper functions
│       ├── api.ts
│       └── storage.ts
├── .env.local           # Environment variables
├── next.config.js       # Next.js configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Dependencies
```

## 📝 Code Quality Practices

- **TypeScript**: Full type coverage for better maintainability
- **ESLint**: Code linting for consistency
- **Prettier**: Code formatting
- **Meaningful Names**: Clear variable and function naming
- **Comments**: Documentation for complex logic
- **Error Boundaries**: Graceful error handling
- **Loading States**: User feedback during async operations

## 📧 Contact

For any questions or clarifications regarding this project, please reach out to:
- **Email**: [patelnazish7@gmail.com]
- **GitHub**: [mdnazishpatel](https://github.com/mdnazishpatel)

## 📄 License

This project was created as part of the Beespoke.ai Tech Intern R1 Build Challenge.

---

**Note:** This project demonstrates my approach to building real-world applications with focus on user experience, code quality, and thoughtful product decisions. The implementation prioritizes clarity and maintainability over complexity.
