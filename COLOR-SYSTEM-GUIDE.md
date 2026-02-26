# Color System Guide

## 📍 Quick Reference
All colors are defined in: `src/styles/theme.css`

**No hardcoded colors should ever be used in components!** Always use the design tokens.

---

## 🎨 Complete Color Token Reference

### Light Mode vs Dark Mode

| Token Name | Light Mode | Dark Mode | Usage |
|-----------|------------|-----------|-------|
| **Brand Colors** |
| `--accent` | `#D47A2B` (Orange) | `#D47A2B` (Same) | Primary brand color |
| `--accent-foreground` | `#FFFFFF` | `#FFFFFF` | Text on accent |
| `--ring` | `#D47A2B` | `#D47A2B` | Focus rings |
| **Backgrounds** |
| `--background` | `#F3F2F0` (Light warm gray) | `#0F0D13` (Very dark purple) | Page background |
| `--background-alt` | `#ECE9E5` (Lighter warm gray) | `#161420` (Dark purple) | Alt background |
| `--card` | `#FFFFFF` (White) | `#1C1A1F` (Dark purple) | Card backgrounds |
| `--card-foreground` | `#1C1A1F` | `#EEECE8` (Light beige) | Text on cards |
| `--window-surface` | `#1C1A1F` | `#1C1A1F` | Special surfaces |
| **Text Colors** |
| `--foreground` | `#1C1A1F` (Dark purple) | `#EEECE8` (Light beige) | Primary text |
| `--muted` | `#ECE9E5` | `#1C1A1F` | Muted backgrounds |
| `--muted-foreground` | `#7E7A75` (Warm gray) | `#9B9790` (Medium gray) | Secondary text |
| `--text-primary-dark` | `#FFFFFF` | `#FFFFFF` | Text for dark surfaces |
| `--text-secondary-dark` | `#C9C6C0` | `#C9C6C0` | Secondary text (dark) |
| `--text-disabled-dark` | `#7E7A75` | `#7E7A75` | Disabled text |
| **Interactive** |
| `--primary` | `#1C1A1F` | `#EEECE8` | Primary elements |
| `--primary-foreground` | `#FFFFFF` | `#0F0D13` | Text on primary |
| `--secondary` | `#F3F2F0` | `#1C1A1F` | Secondary elements |
| `--secondary-foreground` | `#1C1A1F` | `#EEECE8` | Text on secondary |
| **Borders & Inputs** |
| `--border` | `#26242A` | `#26242A` | Border color |
| `--input` | `transparent` | `transparent` | Input borders |
| `--input-background` | `#FFFFFF` | `#1C1A1F` | Input backgrounds |
| `--switch-background` | `#C9C6C0` | `#3A3740` | Toggle backgrounds |
| **Status Colors** |
| `--status-success` | `#2F7A5E` (Green) | `#2F7A5E` (Same) | Success states |
| `--status-error` | `#B23B3B` (Red) | `#B23B3B` (Same) | Error states |
| `--status-warning` | `#C07A2C` (Amber) | `#C07A2C` (Same) | Warning states |
| `--status-info` | `#2F6DAA` (Blue) | `#2F6DAA` (Same) | Info states |
| `--destructive` | `#B23B3B` | `#B23B3B` | Destructive actions |
| **Popovers** |
| `--popover` | `#1C1A1F` | `#1C1A1F` | Popover background |
| `--popover-foreground` | `#FFFFFF` | `#FFFFFF` | Popover text |

---

## 🎯 How to Use in Components

### ✅ CORRECT Usage (Tailwind utilities):

```tsx
// Backgrounds
<div className="bg-background">          {/* Page background */}
<div className="bg-card">                 {/* Card background */}
<div className="bg-accent">               {/* Brand color background */}

// Text
<p className="text-foreground">           {/* Primary text */}
<p className="text-muted-foreground">     {/* Secondary text */}
<p className="text-accent">               {/* Brand color text */}

// Borders
<div className="border border-border">    {/* Standard border */}
<div className="border-accent">           {/* Accent border */}

// Hover states
<button className="hover:bg-accent hover:text-white">
<a className="text-muted-foreground hover:text-accent">
```

### ✅ CORRECT Usage (CSS variables):

```tsx
// When you need direct CSS variable access
<div style={{ backgroundColor: 'var(--accent)' }}>
<div style={{ color: 'var(--muted-foreground)' }}>

// For status badges (use utility classes)
<span className="status-badge-success">Released</span>
<span className="status-badge-warning">In Development</span>
<span className="status-badge-info">Beta</span>
<span className="status-badge-error">Deprecated</span>
```

### ❌ INCORRECT Usage (hardcoded):

```tsx
// NEVER DO THIS:
<div className="bg-[#F3F2F0]">           {/* ❌ Wrong */}
<p className="text-[#D47A2B]">           {/* ❌ Wrong */}
<div className="border-[#26242A]">       {/* ❌ Wrong */}

// INSTEAD USE:
<div className="bg-background">          {/* ✅ Correct */}
<p className="text-accent">              {/* ✅ Correct */}
<div className="border-border">          {/* ✅ Correct */}
```

---

## 🔧 Quick Change Guide

### To Change the Primary Brand Color:
**File:** `src/styles/theme.css`

```css
/* Light mode - Line 15 */
:root {
  --accent: #D47A2B;  /* Change this */
}

/* Dark mode - Line 81 */
.dark {
  --accent: #D47A2B;  /* Change this */
}
```

### To Change Page Background:
```css
/* Light mode - Line 20 */
:root {
  --background: #F3F2F0;  /* Change this */
}

/* Dark mode - Line 86 */
.dark {
  --background: #0F0D13;  /* Change this */
}
```

### To Change Card Background:
```css
/* Light mode - Line 22 */
:root {
  --card: #FFFFFF;  /* Change this */
}

/* Dark mode - Line 88 */
.dark {
  --card: #1C1A1F;  /* Change this */
}
```

### To Change Primary Text:
```css
/* Light mode - Line 27 */
:root {
  --foreground: #1C1A1F;  /* Change this */
}

/* Dark mode - Line 93 */
.dark {
  --foreground: #EEECE8;  /* Change this */
}
```

---

## 📦 Using Design Tokens from Constants

You can also import colors from TypeScript constants:

```tsx
import { COLORS } from '../constants';

// Use in inline styles if needed
<div style={{ backgroundColor: COLORS.ACCENT }}>

// But prefer Tailwind utilities when possible!
<div className="bg-accent">
```

---

## 🎨 Color Palette Reference

### Brand Orange
- **Primary:** `#D47A2B`
- **Hover:** `#C07A2C`

### Neutrals (Light Mode)
- **Background:** `#F3F2F0` - Light warm gray
- **Card:** `#FFFFFF` - Pure white
- **Text:** `#1C1A1F` - Dark purple
- **Muted:** `#7E7A75` - Warm gray

### Neutrals (Dark Mode)
- **Background:** `#0F0D13` - Very dark purple
- **Card:** `#1C1A1F` - Dark purple
- **Text:** `#EEECE8` - Light beige
- **Muted:** `#9B9790` - Medium gray

### Status Colors (Same in both modes)
- **Success:** `#2F7A5E` - Green
- **Error:** `#B23B3B` - Red
- **Warning:** `#C07A2C` - Amber
- **Info:** `#2F6DAA` - Blue

---

## 🚀 CSS Utility Classes Available

### Buttons
```tsx
<button className="btn-primary">Primary Button</button>
<button className="btn-secondary">Secondary Button</button>
```

### Icon Wrappers
```tsx
<div className="icon-wrapper">
  <Icon />
</div>

<div className="icon-wrapper-lg">
  <Icon />
</div>
```

### Status Badges
```tsx
<span className="status-badge-success">Success</span>
<span className="status-badge-warning">Warning</span>
<span className="status-badge-info">Info</span>
<span className="status-badge-error">Error</span>
```

---

## 📝 Best Practices

1. **Always use design tokens** - Never hardcode hex values
2. **Use Tailwind utilities first** - `bg-accent` instead of `style={{ backgroundColor: var(--accent) }}`
3. **Use CSS variables for special cases** - When Tailwind doesn't have the utility
4. **Use utility classes for common patterns** - `.btn-primary`, `.status-badge-success`
5. **Keep all color changes in theme.css** - Single source of truth
6. **Test in both light and dark mode** - Ensure colors work in both

---

## 🔍 Finding Hardcoded Colors

To find any remaining hardcoded colors in your codebase:

```bash
# Search for hex colors in components
grep -r "bg-\[#" src/app/components/
grep -r "text-\[#" src/app/components/
grep -r "border-\[#" src/app/components/
```

Replace them with the appropriate design tokens from the table above.

---

## 💡 Example: Full Component Refactor

### Before (Hardcoded):
```tsx
<div className="bg-[#F3F2F0] pt-20">
  <div className="bg-[#1C1A1F] border border-[#26242A]">
    <h2 className="text-[#FFFFFF]">Title</h2>
    <p className="text-[#C9C6C0]">Description</p>
    <button className="bg-[#D47A2B] hover:bg-[#C07A2C] text-white">
      Click Me
    </button>
  </div>
</div>
```

### After (Design Tokens):
```tsx
<div className="bg-background pt-20">
  <div className="bg-card border border-border">
    <h2 className="text-white">Title</h2>
    <p className="text-muted-foreground">Description</p>
    <button className="btn-primary">
      Click Me
    </button>
  </div>
</div>
```

**Result:** Now changing `--accent` in theme.css updates the button everywhere!

---

## 🎉 Summary

- ✅ All colors defined in one place: `src/styles/theme.css`
- ✅ Distinct light and dark mode sections
- ✅ Clear comments explaining each color
- ✅ Easy to change - just update CSS variables
- ✅ Works automatically with Tailwind utilities
- ✅ No hardcoded values in components

**Need to change a color? Edit `theme.css` and it updates everywhere!**
