# Smart Editor - Design Guidelines

## Design Approach
**Utility-Focused Design System** - Minimalist text editor interface with emphasis on clarity, readability, and focused interaction. Dark mode only with vintage typewriter aesthetic.

## Core Design Principles
1. **Minimal Distraction**: Clean, centered layout keeps focus on text
2. **Instant Clarity**: Color-coded diff system for immediate comprehension
3. **Functional Aesthetics**: Typewriter nostalgia meets modern UX

---

## Typography
**Primary Font**: Monospace typewriter font family
- Use: `'Courier Prime', 'Courier New', monospace` or `'Special Elite'` for authentic typewriter feel
- Input/Output Text: 16px-18px, line-height 1.8 for readability
- UI Elements: 14px for tooltips, 16px for buttons/labels
- Settings Modal: 15px for labels, 14px for descriptions

---

## Layout System
**Spacing Scale**: Tailwind units of 2, 4, 6, 8, 12, 16
- Component padding: p-6 to p-8
- Section margins: mb-8, mt-12
- Icon spacing: mr-2, ml-2
- Modal padding: p-8

**Container Structure**:
- Main editor: max-w-4xl mx-auto, centered with py-12 px-6
- Settings modal: max-w-md, centered overlay
- Full viewport height utilization

---

## Color Palette (Dark Mode Only)
**Background**: `#000000` (pure black)
**Text Colors**:
- Standard text: `#ffffff` (white)
- Error/Deletion: `#ef4444` (red) with `line-through`
- Addition/Grammar: `#22c55e` (green)
- Improvement/Style: `#fef08a` (light yellow highlight as background)
- Muted text: `#9ca3af` (gray-400) for placeholders/labels

**UI Elements**:
- Border: `#374151` (gray-700) for minimalist borders
- Input focus: `#4b5563` (gray-600)
- Modal backdrop: `rgba(0, 0, 0, 0.85)`
- Tooltip background: `#1f2937` (gray-800) with white text

---

## Component Library

### 1. Main Text Input (Pre-Submit)
- Large textarea/contenteditable: w-full, min-h-[400px], border border-gray-700, rounded-lg
- Floating submit arrow icon: Positioned absolute bottom-4 right-4, size 40px, clickable circle with arrow icon
- Placeholder: "Start typing to improve your text..." in gray-400

### 2. Diff Output Display (Post-Submit)
- Read-only container with same dimensions
- Text rendering classes:
  - `.text-error`: `text-[#ef4444] line-through`
  - `.text-addition`: `text-[#22c55e]`
  - `.text-improvement`: `bg-[#fef08a] text-black px-1`
  - `.text-standard`: `text-white`

### 3. Hover Tooltips
- Small popup on hover: bg-gray-800, text-white, px-3 py-2, rounded, text-sm
- Position: Above the hovered word with small arrow
- Content: Change reason (e.g., "Spelling Error", "Passive Voice", "Grammar Fix")

### 4. Settings Modal
- Overlay: Fixed full-screen with backdrop blur
- Card: Centered, bg-gray-900, rounded-xl, p-8, max-w-md
- Close icon: Top-right corner (X icon)
- Input field: Full-width text input for API key with label "OpenRouter API Key"
- Save button: Full-width, bg-white text-black, rounded-lg, py-3, typewriter font
- Persistent storage indication: Small text "Your key is saved securely in your browser"

### 5. Settings Trigger
- Gear/cog icon: Fixed top-right corner, size 24px, clickable
- Color: white with hover opacity-80

### 6. Loading State
- Centered spinner or typewriter animation while processing
- Text: "Analyzing your text..." in gray-400

---

## Interactions & States
**Submit Flow**:
1. User types → Submit arrow clickable
2. Click arrow → Loading state with spinner
3. API response → Transition to diff view (fade-in)

**Hover Behavior**:
- Yellow/Red text: Show tooltip after 300ms hover
- Submit arrow: Scale 1.05 on hover
- Settings icon: Opacity 0.8 on hover

**Accessibility**:
- Line-through MUST accompany red text for errors
- Keyboard navigation: Tab through interactive elements
- Focus states: Visible ring on all interactive elements

---

## Unique Features
- **No animations except**: Fade-in for diff view (300ms), tooltip appearance
- **Single screen focus**: No navigation, no distractions
- **Persistent key storage**: LocalStorage implementation with visual confirmation
- **Minimalist chrome**: Only essential UI elements visible

---

## Images
**No images required** - This is a text-focused utility application. All visual interest comes from typography, color-coded text, and the typewriter aesthetic.