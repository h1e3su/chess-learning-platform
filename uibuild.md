# UI Design System & Guidelines (Chess Platform)

This document serves as the single source of truth for all UI/UX components across Web (React) and Mobile (Flutter) platforms.

## 1. Design Philosophy
- **Architecture**: Chess.com style (Fixed Sidebar, Responsive Main Arena, Fixed Right Panel).
- **Aesthetic**: Modern E-sports, Dark Mode First, High Contrast.
- **Focus**: Gamification, clear visual feedback for actions (Good vs. Blunder).

## 2. Color Palette (Tailwind & Flutter)

| Function | Color Hex | Tailwind Class | Usage |
|---|---|---|---|
| **Background Dark** | `#121212` | `bg-neutral-900` | Main application background |
| **Surface Dark** | `#1E1E1E` | `bg-neutral-800` | Cards, Panels, Modals |
| **Primary Accent** | `#10B981` | `text-emerald-500` | Primary buttons, ELO up, Good moves |
| **Secondary Accent**| `#3B82F6` | `text-blue-500` | Links, Highlighted tabs |
| **Danger / Blunder**| `#EF4444` | `text-red-500` | Mistakes, Time < 10s warning |
| **Warning** | `#F59E0B` | `text-amber-500` | Inaccuracies, Pending status |
| **Text Primary** | `#FFFFFF` | `text-white` | Main headings |
| **Text Secondary** | `#9CA3AF` | `text-neutral-400` | Subtitles, secondary info |

## 3. Typography
- **Headings & Numbers**: `Outfit` (Bold, geometric, great for ELO scores and clocks).
- **Body Text**: `Inter` (Clean, highly readable for PGN and chat).

## 4. Core Layout Structure (Web)
Using CSS Grid / Flexbox:
- **Sidebar**: `w-64 fixed h-screen left-0`
- **Main Arena**: `flex-1 ml-64 mr-80 flex justify-center items-center h-screen`
- **Right Panel**: `w-80 fixed h-screen right-0 border-l border-neutral-800 bg-neutral-900/50 backdrop-blur`

## 5. Reusable Components

### `<Timer />`
- **Normal State**: Gray background, white text.
- **Warning State (< 10s)**: `border-red-500 text-red-500 animate-pulse bg-red-500/10`.

### `<EvaluationBar />`
- Vertical bar placed left of the chessboard.
- Height animated based on centipawn score from Stockfish.
- Colors: White (`#FFFFFF`) and Black (`#333333`).

### `<CourseCard />`
- Glassmorphism effect: `bg-white/5 backdrop-blur-md border border-white/10`.
- Hover effect: `hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all`.

### `<PaymentModal />`
- Backdrop: `fixed inset-0 bg-black/70 backdrop-blur-sm z-50`.
- Layout: Flex row. Left side = Order Details. Right side = QR Code with Skeleton Loader before image loads.

## 6. Gamification Elements
- **Badges**: Small glowing icons next to usernames (e.g. 🏆 Tournament Winner, 💎 Premium).
- **Move Highlights**: 
  - Brilliant: Cyan glow.
  - Blunder: Red background with vibrating animation.
- **Toasts**: Bottom-right floating notifications using `framer-motion` for slide-in/out.
