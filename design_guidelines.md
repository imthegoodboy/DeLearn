# Massa DeAds - Design Guidelines

## Design Approach
Reference-based approach inspired by modern Web3 platforms (Uniswap, OpenSea) with Linear's dashboard clarity and Stripe's payment section trust. Clean, modern aesthetic that balances sophistication with approachability for both advertisers and publishers.

## Typography System

**Font Stack**: 
- Primary: Inter (via Google Fonts) - UI elements, body text, data displays
- Accent: Space Grotesk (via Google Fonts) - Headlines, hero sections, feature callouts

**Hierarchy**:
- Hero Headlines: 4xl to 6xl, font-bold, Space Grotesk
- Dashboard Headers: 2xl to 3xl, font-semibold, Inter
- Section Titles: xl to 2xl, font-semibold
- Body Text: base to lg, font-normal, leading-relaxed
- Data/Metrics: lg to 2xl, font-bold for numbers, font-normal for labels
- Code Snippets: mono font, text-sm, with syntax highlighting

## Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, 12, 16, 20, 24 for consistent rhythm
- Component padding: p-4 to p-8
- Section spacing: py-12 to py-20
- Card gaps: gap-4 to gap-6
- Grid gaps: gap-6 to gap-8

**Container Strategy**:
- Marketing pages: max-w-7xl mx-auto
- Dashboard content: max-w-screen-2xl mx-auto
- Form sections: max-w-2xl
- Code snippets: max-w-4xl with horizontal scroll

**Grid Patterns**:
- Ad cards: 3-column grid on desktop (lg:grid-cols-3), 2-col tablet (md:grid-cols-2), single mobile
- Analytics metrics: 4-column grid (lg:grid-cols-4) for key stats
- Dashboard sections: 2-column split for main content + sidebar where appropriate

## Component Library

**Navigation**:
- Top navbar: Sticky header with wallet connect button (prominent, right-aligned)
- Logo left, navigation center, wallet/profile right
- Dashboard sidebar: Fixed left sidebar (w-64) with icon + label navigation
- Mobile: Hamburger menu with slide-out drawer

**Buttons**:
- Primary CTA: Large, rounded-lg, font-semibold
- Secondary: Outlined with border-2
- Icon buttons: Square aspect ratio with rounded-md
- Wallet connect: Gradient background with subtle animation

**Cards**:
- Ad cards: Rounded-xl, subtle shadow (shadow-md), hover lift effect (hover:-translate-y-1)
- Dashboard cards: Rounded-lg, border, minimal shadow
- Stats cards: Large numbers prominent, label below, icon accent top-right
- Preview cards: Aspect ratio preserved, contained image with overlay controls

**Forms**:
- Input fields: Rounded-lg, border-2, focus ring
- File upload: Drag-and-drop zone with dashed border
- Select dropdowns: Custom styled with chevron icon
- Budget inputs: Currency symbol prefix, numeric formatting

**Data Displays**:
- Analytics charts: Line/bar charts with gradient fills, tooltips on hover
- Tables: Striped rows, sticky headers, sortable columns
- Metrics: Large numbers with trend indicators (up/down arrows)
- Progress bars: Rounded-full, gradient fills showing budget consumption

**Code Snippets**:
- Syntax highlighted blocks with dark background
- Language selector tabs above code block
- One-click copy button (top-right)
- Line numbers for longer snippets

**Modals/Overlays**:
- Ad preview: Large modal (max-w-4xl) showing ad in context
- Confirmation dialogs: Centered, rounded-xl, backdrop blur
- Loading states: Skeleton screens for data, spinner for actions

## Dashboard-Specific Components

**Hoster Dashboard**:
- Campaign creation: Multi-step wizard with progress indicator
- Ad upload: Large preview area with drag-drop functionality
- Analytics grid: 4-column metrics (impressions, clicks, spent, remaining)
- Campaign list: Table view with status badges, action buttons

**Developer Dashboard**:
- Ad marketplace: Grid of cards with preview, category badge, payment rate highlighted
- Integration section: Tabbed code snippets with framework icons
- Earnings tracker: Line chart over time + breakdown table
- Performance cards: Side-by-side comparison of best-performing ads

## Page Structures

**Landing Page**:
- Hero: Full-width section (py-20) with headline, subheading, dual CTA buttons ("I'm a Hoster" / "I'm a Developer")
- How It Works: 3-step process cards with numbered icons
- Features: 2-column grid alternating image/text showcasing platform capabilities
- Stats section: 4-column grid with animated counters (Total Ads, Developers, Impressions, Earned)
- CTA footer: Centered, compelling final call-to-action

**Onboarding Flow**:
- Role selection: Large cards with icons representing Hoster vs Developer
- Form steps: Progress bar, one section per screen
- Profile setup: Form with avatar upload, business details, category multi-select

**Wallet Connection**:
- Modal overlay with supported wallet options (MassaStation, Bearby)
- Connection status indicator in navbar
- Address truncated with copy functionality

## Animations

**Use Sparingly - Key Moments Only**:
- Wallet connect: Subtle pulse on connect button when disconnected
- Card hover: Smooth lift (transform + shadow transition)
- Page transitions: Fade-in for dashboard content
- Number counters: Animate on scroll for stats
- Success states: Checkmark animation for completed actions
- Loading: Skeleton screens fade to content

## Images

**Hero Section**: 
Large, modern illustration or 3D render showing the advertising ecosystem (advertisers connecting with publishers through blockchain). Abstract, tech-forward aesthetic. Place as background with gradient overlay for text readability.

**Feature Sections**:
- Dashboard screenshots: Mockups of actual interface showing analytics, ad creation
- Ad preview examples: Sample banner ads in various sizes/formats
- Integration illustrations: Visual representation of code integration process

**Trust Elements**:
- Blockchain visualization: Abstract nodes/connections for "on-chain" sections
- Security badges: Icons for wallet security, smart contract verification

## Accessibility & Polish

- High contrast ratios for all text
- Focus states: Ring-2 with offset for keyboard navigation
- Loading states: Smooth transitions, never abrupt changes
- Error states: Inline validation, helpful messages
- Empty states: Friendly illustrations with clear next steps
- Tooltips: Hover explanations for complex features

This design creates a professional, trustworthy platform that appeals to both business-focused advertisers and technical developers while maintaining a modern Web3 aesthetic.