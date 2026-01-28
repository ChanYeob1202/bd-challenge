# Shopify Quick View Modal

A modern e-commerce Quick View feature built for the Bryt Designs technical challenge.

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- TailwindCSS 4
- Motion (animations)
- Shopify Storefront GraphQL API

## Getting Started

```bash
# Install dependencies
pnpm install

# Set up environment variables
# Copy .env.example to .env.local and add your Shopify credentials

# Generate GraphQL types
pnpm codegen

# Start dev server
pnpm dev
```

Visit `http://localhost:3000`

## Features

### Core Functionality
- Product grid fetching from Shopify Storefront API
- Quick View modal (not a drawer)
- Multiple close methods: X button, backdrop click, Escape key
- Background scroll lock when modal is open
- Focus management (focus enters modal on open, returns to trigger on close)
- Loading skeleton while fetching product details

### Modal Layout
- Desktop: Two-column (image gallery left, content right)
- Mobile: Stacked (images top, content bottom)

### Variant Selection
- Pill-style option controls for Size, Color, etc.
- Dynamic variant resolution based on selected options
- Disabled states for unavailable option combinations
- Price updates when variant changes
- Image updates when variant changes (prefers variant image)

### Add to Cart
- Disabled until valid variant is selected
- Simulated async operation (800-1200ms)
- Loading state with spinner
- Success state with checkmark
- Auto-closes modal after success

### Animations
- Backdrop fade in/out
- Modal scale + fade entrance/exit
- Image crossfade on variant change
- Button state transitions (idle → loading → success)
- Animated option selection indicator using layoutId
- Hover and press feedback on interactive elements

### TypeScript
- Proper types for all Shopify data structures
- No `any` types for core product/variant/option shapes
- Type-safe GraphQL queries with code generation

## Architecture

```
app/
├── page.tsx                          # Fetches products server-side
├── components/
│   ├── ProductCard.tsx              # Individual product card
│   ├── ProductGrid.tsx              # Grid + modal state
│   ├── QuickViewModal.tsx           # Modal shell (fetch, focus, scroll lock)
│   ├── QuickViewModalContent.tsx   # Product details + variant logic
│   ├── AddToCartButton.tsx          # CTA with state machine
│   └── LoadingSkeleton.tsx          # Loading state
└── api/
    └── product/route.ts              # Server endpoint for product details

lib/shopify/
├── serverClient.tsx                  # Shopify API client
└── graphql/
    ├── products.ts                   # Query: all products
    └── product.ts                    # Query: single product by handle
```

### Data Flow

1. `page.tsx` fetches products on the server
2. `ProductGrid` receives products, manages modal open/close state
3. User clicks "Quick View" → sets `selectedProductHandle`
4. `QuickViewModal` opens, fetches detailed product data from `/api/product`
5. `QuickViewModalContent` displays data, handles variant selection
6. `AddToCartButton` simulates cart addition
7. Modal closes, focus returns to trigger button

### Why the API Route?

Next.js App Router has a server/client boundary. The Shopify client uses `"server-only"` to protect API credentials, but the modal needs to run client-side for interactivity. The API route bridges this gap - it runs on the server, safely uses the Shopify client, and returns data to the client component.

## Implementation Notes

### What Went Well
- Variant selection logic works correctly for all option combinations
- Animations feel polished and cohesive
- Focus management improves keyboard accessibility
- Loading states prevent layout shift

### Tradeoffs
- **Fetch on open vs prefetch**: Currently fetches when modal opens. Prefetching on hover would be faster but adds complexity and unnecessary API calls if user doesn't open the modal.
- **Component state vs global state**: Using local `useState` for simplicity. Works fine at this scale.
- **Derived state**: Computing `selectedVariant` and `currentImage` on each render. Fast enough for this use case.
- **Focus trap**: Implemented focus entry/exit but not full Tab cycling within modal. Would use `focus-trap-react` for production.

### What I'd Add Next
- Prefetch product data on Quick View button hover
- Full focus trap (Tab key cycles within modal)
- Error states for failed API requests
- Route-based modal (update URL when opening)
- Reduced motion support (`prefers-reduced-motion`)
- Sticky CTA on mobile
- Image zoom on click
- Better keyboard navigation (arrow keys through options)

## Learning Notes

This was my first time working with GraphQL and Shopify's API. I have experience with React, TypeScript, and Next.js, but Shopify's data model was new to me.

**Key things I learned:**
- GraphQL's edge/node structure (why everything is wrapped in `edges` and `node`)
- How Shopify models products, variants, and options
- Variant resolution logic (matching `selectedOptions` to find the right variant)
- When to use Next.js API routes vs server components
- How to properly type GraphQL responses in TypeScript

**Most challenging part:**
Understanding how variant availability works. You can't just disable individual options - you need to check if ANY variant exists with that option value given the current selections. Took some time to wrap my head around the logic.

**What I'm proud of:**
The animations feel really smooth, and the variant selection logic handles all edge cases correctly. Also happy with the focus management - keyboard users can navigate the modal properly.

## Resources Used

- Shopify Storefront API docs
- Next.js App Router docs
- Motion documentation
- Stack Overflow for specific TypeScript issues
- AI (Claude) for learning GraphQL patterns and Shopify's data model

---

Built for the Bryt Designs technical challenge.
