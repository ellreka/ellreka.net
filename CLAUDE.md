# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

```bash
# Development
npm run dev          # Start development server on port 4444

# Build & Production
npm run build        # Build for production
npm run export       # Export static site

# Linting & Testing
npm run lint         # Run Next.js linting
npm run lint:text    # Run textlint on MDX files in docs/
npm run eslint       # Run ESLint on TypeScript files

# Content Management
npm run gen:docs     # Generate MDX documentation files (bin/gen-mdx.sh)

# Visual Regression Testing
npm run ci:vrt       # Run visual regression tests with reg-suit
```

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 15.3.3 with App Router
- **Language**: TypeScript 5.8.3 with strict mode
- **Styling**: Tailwind CSS v4 with @tailwindcss/postcss
- **Content**: MDX v3 for blog posts with custom processing
- **React**: Version 19 with functional components

### Content Architecture

**MDX Blog Posts (`/docs/*.mdx`)**
- Each MDX file must export a `meta` object:
  ```typescript
  export const meta = {
    date: 'YYYY-MM-DD',
    title: 'Post Title',
    tags: ['tag1', 'tag2'],
    description?: 'Optional description',
    ogpImage?: '/path/to/image'
  }
  ```
- Metadata is extracted using `evaluateSync` from @mdx-js/mdx
- OGP images are automatically generated for each post

**MDX Processing Pipeline**
1. MDX files are processed through a custom webpack loader chain:
   - babel-loader (Next.js default)
   - @mdx-js/loader (MDX compilation)
   - fm-loader.mjs (custom frontmatter extraction)
2. Code highlighting uses rehype-pretty-code with 'ayu-dark' theme
3. Custom MDX components are mapped in `MDXContent` component

### Key Architectural Patterns

**Dynamic Route Handling**
- Blog posts: `/entry/[slug]` - Server-side rendered with static generation
- Tag pages: `/entries/[id]` - Handles URL encoding for tags with spaces
- All dynamic routes use Next.js 15's async params pattern

**External Content Integration**
- Zenn articles are fetched and integrated into the entries list
- Timeline data from `/src/data/timeline.json`
- Releases showcase from `/src/data/releases.json`

**Scroll Position Management**
- Custom `ScrollToTop` component handles navigation vs browser back
- Uses `popstate` event to differentiate navigation types
- Preserves scroll position on browser back/forward

**Theme Management**
- Dark mode toggle stored in localStorage
- Client-side Layout component manages theme state
- CSS variables for custom colors (e.g., `--color-ellreka`)

### Important Implementation Details

**TypeScript Configuration**
- Strict mode enabled
- Path alias: `@/*` maps to `./src/*`
- All components use proper TypeScript interfaces

**URL Encoding for Tags**
- Tags with spaces require `encodeURIComponent` in links
- `decodeURIComponent` in page components to display correctly
- Applied consistently across Entry, List, and getTabs components

**Build Configuration (ES Modules)**
- `next.config.mjs` - ES module configuration
- `postcss.config.mjs` - Tailwind CSS v4 setup
- `fm-loader.mjs` - Custom MDX frontmatter loader
- `tailwind.config.ts` - TypeScript configuration with custom theme

## Project-Specific Guidelines

1. **MDX Content Creation**: Always include proper metadata exports with date, title, and tags
2. **Component Patterns**: Follow existing patterns - components in separate directories with `index.tsx`
3. **TypeScript**: Maintain strict typing, use interfaces for all props
4. **Styling**: Use Tailwind CSS utilities, support dark mode with appropriate classes
5. **Performance**: Leverage static generation where possible, optimize images
6. **Error Handling**: Wrap MDX processing in try-catch blocks
7. **Navigation**: Use Next.js Link component, handle URL encoding for special characters

## Language & Response Style
- Respond in Japanese (technical terms can remain in English)
- Provide concise and clear answers
- Include code explanations when suggesting changes
- Follow existing component styles and patterns