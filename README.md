# Musabuddin Mondal — Engineering Passport

A responsive, recruiter-focused portfolio presented as a 32-page 3D passport. It opens on the identity page and lets visitors turn physical-looking pages through experience, projects, skills, education, and contact details.

## Features

- Two-sided CSS 3D page turns with paper depth, cover edges, and a central binding
- Desktop spreads and individual mobile pages, with buttons, keyboard arrows, pointer-following drag turns, and chapter shortcuts
- Career highlights and quantified internship impact
- 23 projects grouped into Machine Learning, Backend, Full Stack, Mobile Apps, and Extensions & Automation, with a project directory and category shortcuts
- Full technical skills, education, coursework, and certifications
- Responsive navigation, section tracking, reduced-motion support, and accessible semantics
- Open Graph and X sharing metadata with a custom branded preview

## Run locally

From the project directory:

```bash
npm install
npm run dev -- --host 127.0.0.1 --port 4173
```

Then open `http://127.0.0.1:4173`. Build with `npm run build`.

Use the **Explore projects** menu above the book or the **Projects** chapter’s directory to jump to a category. Collections start on a complete spread, and the reading view has matching category filters. On phones, the **Jump to** menu reaches every chapter and project collection. Phone layouts use a single page, 48px navigation buttons, compact page spacing, safe-area padding, and a simple page counter. Vertical gestures scroll page content; horizontal gestures turn pages. Landscape phones also use the single-page layout.

The existing HTML remains the source of portfolio content and is available through **Reading view**, including project filters. The book is assembled by `assets/js/passport.js` and styled by `assets/css/passport.css`. The book fits the viewport and keeps navigation arrows visible without scrolling the webpage. Dense pages scroll internally so content remains accessible at small sizes and when zoomed. Drag the right page left to advance, or the left page right to go back; on phones, drag in either direction. Release past 30% of the page width to complete a turn, or release earlier to return it. Reduced-motion preferences disable page-turn animation.

The passport identity page and reading-view identity card use the supplied portrait in `public/musab-portrait.jpg`, with descriptive alternative text and natural colors.
