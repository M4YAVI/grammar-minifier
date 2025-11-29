# Smart Editor

AI-powered text refinement application that analyzes and improves writing with intelligent grammar fixes, stylistic improvements, and error detection displayed in a beautiful diff view.

## Overview

Smart Editor uses OpenRouter's x-ai/grok-4.1-fast:free model to analyze text and provide:
- **Error Detection**: Spelling mistakes, grammatical errors (shown in red strikethrough)
- **Grammar Fixes**: Correct spelling, punctuation, word usage (shown in green)
- **Style Improvements**: Better sentence flow, active voice suggestions (shown with yellow highlight)

## Features

- Dark mode only with vintage typewriter aesthetic (Courier Prime font)
- Persistent API key storage in localStorage
- Settings modal for API key management
- Diff view with color-coded text changes
- Hover tooltips explaining each change
- Keyboard shortcut (Ctrl+Enter) for quick submission
- Loading states with typewriter animation

## Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS + Shadcn UI
- **Backend**: Express.js
- **AI**: OpenRouter x-ai/grok-4.1-fast:free
- **State**: TanStack Query for data fetching

## Project Structure

```
client/
  src/
    components/
      settings-modal.tsx    # API key settings modal
      diff-renderer.tsx     # Color-coded diff display
      ui/                   # Shadcn components
    pages/
      smart-editor.tsx      # Main editor page
    lib/
      queryClient.ts        # API request utilities
    index.css              # Custom CSS with text classes

server/
  routes.ts               # API endpoint for text analysis
  
shared/
  schema.ts              # TypeScript interfaces & Zod schemas
```

## API Endpoints

### POST /api/analyze
Analyzes text and returns diff segments.

**Request:**
```json
{
  "text": "Text to analyze",
  "apiKey": "OpenRouter API key"
}
```

**Response:**
```json
{
  "segments": [
    {"text": "word", "type": "error|addition|improvement|standard", "reason": "optional"}
  ],
  "originalText": "original",
  "improvedText": "corrected text"
}
```

## Getting Started

1. Click the settings gear icon (top-right)
2. Enter your OpenRouter API key (get one free at openrouter.ai/keys)
3. Save the key
4. Start typing in the editor
5. Click the arrow or press Ctrl+Enter to analyze

## User Preferences

- Dark mode only design
- Typewriter font (Courier Prime)
- Pure black background
- Minimalist UI with focus on text
