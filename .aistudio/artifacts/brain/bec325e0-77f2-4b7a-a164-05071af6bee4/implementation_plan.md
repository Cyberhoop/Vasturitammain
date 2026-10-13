# Comprehensive Dark Mode Text Visibility & Contrast Fix

## Root Cause Analysis
1. **Light Colors Duplicated in `.dark` CSS Tokens**:
   In `src/index.css`, the `.dark` class had `--color-background`, `--color-surface`, and `--color-text` duplicated from light mode (`#FAF6EE` background, `#2A1515` text).
2. **Hardcoded Body Background in `ThemeContext.tsx`**:
   In `ThemeContext.tsx`, `document.body.style.backgroundColor` was set to `#FAF6EE` (light cream) in both light and dark mode, and saved dark mode preference was inadvertently reset to light.
3. **Hardcoded Root Background in `App.tsx`**:
   The outermost `<div>` in `src/App.tsx` had `bg-[#FAF6EE] text-[#2A1515]` hardcoded. When components rendered light text (such as `text-white`, `text-zinc-100`, `text-[#FFF7ED]`) in dark mode, it appeared as white text on a cream background (invisible).
4. **Hardcoded Cards in Testimonials and Contact**:
   - `TestimonialsSection.tsx`: Cards had hardcoded `bg-[#E8D3A8] text-[#2D1B14]`.
   - `ContactSection.tsx`: Direct channel cards and form container had hardcoded `bg-[#FFFDF9] text-[#2A1515]`, while inner inputs switched to `dark:text-zinc-100` (white on cream).
   - `WhatWeDoSection.tsx`: "Need Guidance?" banner was hardcoded to light cream with dark brown text.

## Proposed Changes

### 1. CSS Design Tokens (`src/index.css`)
- Configure authentic, high-contrast Vedic dark mode tokens for `.dark`:
  - `--color-background: #140A0D` (deep obsidian burgundy)
  - `--color-surface: #1E0F14`
  - `--color-surface-soft: #28141B`
  - `--color-surface-hover: #351A24`
  - `--color-text-heading: #FFF6F7`
  - `--color-text-body: #F5E6CC` (warm ivory)
  - `--color-text-muted: #D1BBA2`
  - `--color-border: #44262E`

### 2. Theme Context & Persistence (`src/context/ThemeContext.tsx`)
- In `ThemeContext.tsx`, properly set `document.body.style.backgroundColor = '#140A0D'` and `color = '#FFF6F7'` when dark mode is active.
- Allow persisted `vastu_ritam_theme` from `localStorage` to retain `'dark'`.

### 3. Application Root Container (`src/App.tsx`)
- Update outer wrapper in `src/App.tsx` from hardcoded `bg-[#FAF6EE]` to:
  `isLight ? 'bg-[#FAF6EE] text-[#2A1515]' : 'bg-[#140A0D] text-[#FFF6F7]'`

### 4. Testimonials Section Contrast (`src/components/TestimonialsSection.tsx`)
- Adapt testimonials cards for dark mode:
  - Container: `isLight ? 'bg-[#E8D3A8] text-[#2D1B14] border-[#D4A72C]' : 'bg-[#1E0F14] text-[#FFF6F7] border-[#44262E]'`
  - Quote text: `isLight ? 'text-[#2D1B14]' : 'text-[#F5E6CC]'`
  - Author Name: `isLight ? 'text-[#2D1B14]' : 'text-[#FFF6F7]'`
  - Designation: `isLight ? 'text-[#3A2318]' : 'text-[#D1BBA2]'`
  - Avatar badge: `isLight ? 'bg-[#2D1B14] border-[#D4A72C] text-[#D4A72C]' : 'bg-[#140A0D] border-[#E88A16] text-[#E88A16]'`

### 5. Contact Section Contrast (`src/components/ContactSection.tsx`)
- Update channels card and form card containers:
  - `isLight ? 'bg-[#FFFDF9] text-[#2A1515] border-[var(--color-border)]' : 'bg-[#1E0F14] text-[#FFF6F7] border-[#44262E]'`
- Update channel row cards and input backgrounds:
  - `isLight ? 'bg-[#FAF6EE] border-[var(--color-border)] text-[#2A1515]' : 'bg-[#28141B] border-[#44262E] text-[#FFF6F7]'`
  - Labels: `isLight ? 'text-zinc-800' : 'text-[#E8D3A8]'`

### 6. What We Do CTA Banner (`src/components/WhatWeDoSection.tsx`)
- Update "Need Guidance?" banner:
  - `isLight ? 'bg-gradient-to-br from-[#FFFDF9] via-[#FAF3E6] to-[#F5EADB] border-amber-300 text-[#2A1515]' : 'bg-gradient-to-br from-[#1E0F14] via-[#241318] to-[#170B0E] border-[#44262E] text-[#FFF6F7]'`

## Verification
- Test Dark mode toggle across Home, Discover, Gyan Kosh, Testimonials, What We Do, and Contact.
- Verify text contrast and legibility using `compile_applet` and `lint_applet`.
