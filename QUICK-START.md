# Quick Start Guide - Portfolio Website

## 🚀 Getting Started

### Initial Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The dev server will start at `http://localhost:5173/`

---

## 👥 Working with Another Developer

### Git Workflow

#### First Time Setup
```bash
# Clone the repository
git clone <repository-url>
cd Songimportfolio

# Install dependencies
npm install

# Start working
npm run dev
```

#### Daily Workflow
```bash
# Pull latest changes
git pull origin main

# Create a feature branch
git branch feature/your-feature-name
git checkout feature/your-feature-name

# Make your changes...
# Test your changes with npm run dev

# Stage and commit
git add .
git commit -m "Description of changes"

# Push to remote
git push origin feature/your-feature-name

# Create Pull Request on GitHub
```

### Important: .gitignore
The `.gitignore` file is already configured. It excludes:
- ✅ `node_modules/` - Never commit dependencies
- ✅ `dist/` - Build output
- ✅ `.env` files - Environment variables
- ✅ IDE files (`.vscode/`, `.idea/`)
- ✅ OS files (`.DS_Store`, `Thumbs.db`)

---

## 📁 Project Structure

```
Songimportfolio/
├── src/
│   ├── main.tsx                 # Entry point
│   ├── app/
│   │   ├── App.tsx              # Main app with routing
│   │   └── components/          # All React components
│   │       ├── hero-section.tsx
│   │       ├── navigation.tsx
│   │       ├── about-section.tsx
│   │       ├── projects-section.tsx
│   │       ├── gallery-section.tsx
│   │       ├── contact-preview.tsx
│   │       └── footer.tsx
│   └── styles/
│       ├── index.css            # Main CSS imports
│       ├── theme.css            # Design system variables
│       ├── fonts.css            # Font imports
│       └── tailwind.css         # Tailwind config
├── public/                      # Static assets
├── DESIGN-SYSTEM.md             # Complete design guidelines
├── DESIGN-IMPLEMENTATION-SUMMARY.md  # What was implemented
└── package.json                 # Dependencies
```

---

## 🎨 Design System Quick Reference

### Typography (Major Third Scale)
```tsx
// Headings
<h1>                           // 61px (3.815rem)
<h2>                           // 49px (3.052rem)
<h3>                           // 39px (2.441rem)
<h4>                           // 31px (1.953rem)
<p>                            // 16px (1rem)
```

### Spacing (8-Point Grid)
```tsx
style={{ padding: '8px' }}     // xs - Inline
style={{ padding: '16px' }}    // sm - Related elements
style={{ padding: '24px' }}    // md - Component spacing
style={{ padding: '32px' }}    // lg - Section spacing
style={{ padding: '48px' }}    // xl - Between sections
style={{ padding: '64px' }}    // 2xl - Large sections
style={{ padding: '80px' }}    // 3xl - Major breaks
```

### Colors (60-30-10 Rule)
```tsx
// 60% - Neutrals
bg-[#F3F2F0]    // Light background
bg-[#1C1A1F]    // Dark background
text-white       // White text
text-[#C9C6C0]  // Light gray text

// 30% - Secondary
bg-[#FFFFFF]    // Cards
bg-[#ECE9E5]    // Muted backgrounds

// 10% - Accent
bg-[#D47A2B]    // Primary orange (CTAs)
hover:bg-[#C07A2C]  // Hover state
```

### CTA Buttons (Standard Pattern)
```tsx
<button
  className="inline-flex items-center justify-center gap-3 px-8 py-4 
             bg-[#D47A2B] text-white font-semibold rounded-lg 
             hover:bg-[#C07A2C] transition-all duration-300 
             transform hover:scale-105 shadow-lg hover:shadow-xl"
  style={{
    minWidth: '200px',
    minHeight: '56px',
    fontSize: '1.125rem',
    padding: '16px 32px'
  }}
>
  Button Text
</button>
```

---

## 🛠️ Common Tasks

### Adding a New Component
1. Create file in `src/app/components/`
2. Follow typography scale from `theme.css`
3. Use 8px spacing multiples
4. Apply 60-30-10 color rule
5. Ensure CTAs are prominent (min 56px height)

### Modifying Colors
- Edit `src/styles/theme.css`
- Update CSS variables in `:root`
- Colors automatically apply throughout

### Changing Typography
- Edit scale in `src/styles/theme.css`
- Modify `--text-h1` through `--text-base`
- Changes apply to all components

### Adding New Page/Route
1. Create component in `src/app/components/`
2. Add route in `src/app/App.tsx`
3. Update navigation in `src/app/components/navigation.tsx`

---

## 🐛 Troubleshooting

### "npm install" fails
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Dev server won't start
```bash
# Check if port 5173 is in use
# Kill process using port
netstat -ano | findstr :5173
taskkill /F /PID <PID>

# Or change port in vite.config.ts
```

### TypeScript errors
```bash
# Restart TypeScript service in IDE
# Or reinstall types
npm install --save-dev @types/node @types/react @types/react-dom
```

### Git conflicts in package-lock.json
```bash
# Accept theirs and reinstall
git checkout --theirs package-lock.json
npm install
```

---

## 📝 Before Committing

### Checklist
- [ ] Code runs without errors (`npm run dev`)
- [ ] No console errors in browser
- [ ] Changes follow design system
- [ ] New components use proper spacing (8px multiples)
- [ ] CTAs are prominent and accessible
- [ ] Tested on mobile viewport
- [ ] Committed only source files (no node_modules, dist)

### Commit Message Format
```
type: Short description

Longer description if needed

Examples:
- feat: Add new projects page
- fix: Correct navigation highlighting issue
- style: Update button hover effects
- docs: Add installation instructions
- refactor: Restructure component files
```

---

## 🎯 Design Principles (Always Follow)

1. **Typography**: Use defined scale, don't create random sizes
2. **Spacing**: Everything in 8px multiples (8, 16, 24, 32, 48, 64, 80, 96)
3. **Colors**: Stick to palette, use opacity for variations
4. **CTAs**: Always prominent, min 200×56px, high contrast
5. **Hierarchy**: Size + contrast + proximity = clear importance
6. **Consistency**: Follow existing patterns in codebase

---

## 📚 Resources

### Documentation
- `DESIGN-SYSTEM.md` - Complete design guidelines
- `DESIGN-IMPLEMENTATION-SUMMARY.md` - What's been implemented
- Component files - Examples of proper implementation

### External Tools
- [Type Scale](https://type-scale.com) - Typography reference
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) - Accessibility
- React Docs - https://react.dev
- Tailwind CSS - https://tailwindcss.com

---

## 💡 Tips for Collaboration

### DO ✅
- Pull latest changes before starting work
- Create feature branches for new work
- Test changes locally before committing
- Follow existing code style
- Use design system variables
- Write clear commit messages
- Ask questions in PR comments

### DON'T ❌
- Commit `node_modules/`
- Commit `.env` files
- Push directly to main
- Create random font sizes
- Use arbitrary spacing
- Ignore design system
- Leave console.log statements

---

## 🚀 Deployment

### Build for Production
```bash
# Create optimized build
npm run build

# Test production build locally
npm run preview
```

### Deploy to Hosting
The `dist/` folder contains the production build. Upload to:
- Netlify
- Vercel
- GitHub Pages
- AWS S3
- Your own server

---

## 📞 Need Help?

1. Check `DESIGN-SYSTEM.md` for design questions
2. Check component files for code examples
3. Search error messages online
4. Ask your collaborator
5. Check React/Vite documentation

---

**Last Updated:** February 2026  
**Version:** 1.0  
**Status:** ✅ Production Ready
