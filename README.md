# BrewPrompt

A modern, premium AI Prompt Library built with vanilla HTML, CSS, and JavaScript.

[![License: MIT](https://img.shields.io/badge/License-MIT-6366f1.svg)](https://opensource.org/licenses/MIT)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/Vanilla_JS-ES6+-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-0-success.svg)](#tech-stack)

BrewPrompt is a lightweight, zero-dependency repository for discovering, previewing, and copying curated prompts for ChatGPT, Claude, Midjourney, Gemini, and other state-of-the-art AI foundation models.

---

## Table of Contents

- [Features](#features)
- [Live Demo](#live-demo)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Adding New Prompts](#adding-new-prompts)
- [Contribution Guide (CONTRIBUTION_GUIDE.md)](CONTRIBUTION_GUIDE.md)
- [Adding Categories](#adding-categories)
- [Customizing Theme](#customizing-theme)
- [Deployment](#deployment)
- [Browser Support](#browser-support)
- [License](#license)

---

## Features

- ⚡ **Zero Dependencies & Blazing Fast** – Pure HTML5, CSS3, and ES6+ JavaScript. No build step, bundlers, or heavy frameworks required.
- 🔍 **Instant Search & Real-Time Filtering** – Search prompts instantly by keyword, tag, or title with fluid debounced input.
- 🗂️ **Categorized Navigation** – Organize prompts across distinct domains such as Coding, Marketing, Writing, Productivity, and Image Generation.
- 📋 **One-Click Copy** – Seamless clipboard integration with interactive visual feedback and toast notifications.
- 🧩 **Interactive Dynamic Variables** – Prompts support customizable placeholder parameters (e.g. `[TOPIC]`, `[LANGUAGE]`) that users can fill out directly in the UI before copying.
- 🔥 **Popular & Trending Leaderboard** – Highlight top-rated and community-favorite prompts dynamically.
- ⭐ **Client-Side Favorites** – Save and bookmark preferred prompts with persistent browser `localStorage` integration.
- 🎨 **Modern Indigo Aesthetics** – Elegant design system featuring clean typography, subtle borders, card hover elevations, and responsive glassmorphism accents.
- 📱 **Mobile-First & Fully Responsive** – Seamlessly adapts across desktops, tablets, and smartphones.
- 🌐 **SEO Optimized** – Pre-configured meta tags, semantic HTML markup, valid `robots.txt`, and XML sitemap.

---

## Live Demo

Explore the live production deployment:

🌐 **[https://brewprompt.com](https://brewprompt.com)** *(Demo link placeholder)*

---

## Tech Stack

- **Markup:** HTML5 Semantic elements (`<main>`, `<nav>`, `<article>`, `<section>`, `<aside>`)
- **Styling:** CSS3 Custom Properties (Variables), Flexbox, CSS Grid, Transitions
- **Scripting:** Vanilla JavaScript (ES6+ Modules, DOM APIs, Clipboard API, `localStorage`)
- **Graphics:** Scalable Vector Graphics (SVG) icons and favicons
- **Runtime Dependencies:** **0** (No npm packages, no React/Vue/Angular, no external runtime libraries)

---

## Project Structure

```text
prompt-library/
│
├── index.html               # Homepage with hero, categories, trending, fresh prompts
├── prompts.html             # Full catalogue with instant search & multi-filter bar
├── prompt.html              # Prompt detail, customization modal, related prompts
├── category.html            # Category & subcategory browser
├── popular.html             # Popular, trending, most viewed & editor's picks
├── favorites.html           # Saved client-side bookmarks & favorites
│
├── css/
│   ├── style.css            # Design tokens, reset, typography, cards & SaaS layout
│   ├── responsive.css       # Mobile & tablet breakpoints (1200, 968, 768, 540px)
│   └── animations.css       # Keyframes, transitions & prefers-reduced-motion
│
├── js/
│   ├── data.js              # 52+ prompt objects & 10 categories
│   ├── utils.js             # Clipboard, toasts, storage, formatting & theme handlers
│   ├── app.js               # Global router, mobile nav & event delegation
│   ├── search.js            # Real-time search engine & highlight utility
│   ├── prompts.js           # Directory filtering, sorting & chips controller
│   ├── categories.js        # Category & subcategory filtering controller
│   └── prompt-details.js    # Modal variable replacement & prompt detail page
│
├── data/
│   └── prompts.json         # Standalone JSON prompt catalogue
│
├── assets/
│   ├── favicon.svg          # Stylized indigo vault emblem (32x32)
│   └── logo.svg             # Vector brand icon (28x28)
│
├── robots.txt               # Search engine crawler instructions
├── sitemap.xml              # XML sitemap index
├── CONTRIBUTION_GUIDE.md    # Detailed contributor & GitHub PR guide
└── README.md                # Comprehensive documentation
```

---

## Getting Started

### Prerequisites

BrewPrompt is a static web application. All you need is any modern web browser and any standard static file server.

### Running Locally

Clone the repository and launch a local web server:

```bash
git clone https://github.com/brewnok/brewprompt.git
cd brewprompt
```

Use any of the following lightweight static servers:

#### Option 1: Python (Built-in)
```bash
python -m http.server 8000
```

#### Option 2: Node.js (`npx serve`)
```bash
npx serve .
```

#### Option 3: VS Code Live Server
- Install the **Live Server** extension (`ritwickdey.liveserver`)
- Right-click `index.html` and choose **"Open with Live Server"**

Then open your browser at:
👉 **[http://localhost:8000](http://localhost:8000)**

---

## Adding New Prompts

<a id="adding-new-prompts"></a>

BrewPrompt features a zero-backend, **auto-discovery data architecture**. The entire prompt inventory lives inside:
- **`js/data.js`** (in the `window.PROMPTS` array) — Primary client-side data store
- **`data/prompts.json`** — Standalone JSON catalogue for static hosts and API consumption

To add a new prompt, you only need to append a new prompt object to `js/data.js`. No backend, build tool, or database is required!

> 💡 **Looking for step-by-step Git workflow & guidelines?** Check out the dedicated [**CONTRIBUTION_GUIDE.md**](CONTRIBUTION_GUIDE.md) for detailed rules on prompt quality, variable formatting, and submitting PRs to [`brewnok/brewprompt`](https://github.com/brewnok/brewprompt).

---

### 📋 Prompt Object Schema

Every prompt object in `window.PROMPTS` must follow this schema:

```javascript
{
  "id": 53,
  "title": "Optimize SQL Query",
  "slug": "optimize-sql-query",
  "description": "Analyze slow database queries, identify execution bottlenecks, and rewrite for optimal performance.",
  "content": "Act as an expert Database Administrator and Performance Engineer.\n\nContext:\nUse this prompt when analyzing a slow-running [DATABASE_ENGINE] query that is causing high CPU or execution times.\n\nObjective:\nIdentify query bottlenecks and provide an optimized, indexed rewrite.\n\nInstructions:\n1. Analyze the provided query and table schema.\n2. Identify full table scans, improper joins, and inefficient WHERE clauses.\n3. Propose optimal indexes and explain the execution plan improvements.\n4. Rewrite the query following performance best practices.\n\nConstraints:\n- Do not change the final result set or business logic.\n- Provide realistic indexing strategies for [DATABASE_ENGINE].\n\nOutput Format:\n- Bottleneck Analysis\n- Recommended Indexes\n- Optimized Query (Code Block)\n- Expected Performance Impact",
  "category": "Development",
  "subcategory": "SQL",
  "difficulty": "Advanced",
  "tags": ["sql", "database", "query-optimization", "performance"],
  "aiPlatforms": ["ChatGPT", "Claude", "Gemini"],
  "useCases": ["Performance Tuning", "Database Administration"],
  "featured": false,
  "popular": false,
  "createdDate": "2026-10-04",
  "copyCount": 0
}
```

---

### 🏷️ Field Breakdown

| Field | Type | Description |
|---|---|---|
| `id` | `number` | Incremental unique integer (e.g. `53`, `54`). |
| `title` | `string` | Clean, readable prompt name (e.g. `"Optimize SQL Query"`). |
| `slug` | `string` | Unique kebab-case URL identifier (e.g. `"optimize-sql-query"`). Used for `prompt.html?slug=optimize-sql-query`. |
| `description` | `string` | A concise 1–2 sentence summary explaining the outcome and value of the prompt. |
| `content` | `string` | The complete prompt text. Use `\n\n` for paragraphs and line breaks. |
| `category` | `string` | Must match one of the 10 defined categories (e.g. `"Development"`, `"DevOps & SRE"`, `"Career"`). |
| `subcategory` | `string` | Must match a valid subcategory for the selected category (e.g. `"SQL"`, `"Kubernetes"`). |
| `difficulty` | `string` | One of: `"Beginner"`, `"Intermediate"`, or `"Advanced"`. |
| `tags` | `string[]` | Array of 3–5 lowercase keywords for tag badges and related prompt discovery. |
| `aiPlatforms` | `string[]` | Models the prompt is tested on: `["ChatGPT", "Claude", "Gemini", "GitHub Copilot"]`. |
| `useCases` | `string[]` | 1–3 practical scenarios (e.g. `["Debugging", "Code Review"]`). |
| `featured` | `boolean` | Set `true` if the prompt should appear in "Editor's Picks" and homepage highlights. |
| `popular` | `boolean` | Set `true` if the prompt should appear in the "Trending" leaderboard. |
| `createdDate` | `string` | Date added in ISO format (`"YYYY-MM-DD"`). Used to sort the "Fresh From the Library" feed. |
| `copyCount` | `number` | Initial copy counter baseline (e.g. `0` for new community prompts). |

---

### 🧩 Dynamic Variables & "Customize Prompt" Modal

BrewPrompt features a client-side variable discovery engine. Any word written in capital letters inside square brackets is **automatically detected as an interactive variable**:

```text
Write a [TONE] email to [RECIPIENT] explaining the delay in [PROJECT_NAME].
```

#### Supported Format:
- `[TOPIC]`
- `[AUDIENCE]`
- `[LANGUAGE]`
- `[CODE]`
- `[DATABASE_ENGINE]`
- `[ROLE]`
- `[BUDGET]`

When visitors open a prompt containing variables and click **"Customize Prompt"**, the UI dynamically:
1. Detects all `[PLACEHOLDER]` tags using regex.
2. Generates dedicated input fields inside an accessible modal.
3. Renders a live preview as the user types.
4. Allows copying the personalized prompt with one click!

---

### 🎯 Prompt Quality Guidelines

Every prompt in brewprompt is expected to follow the **6-Part Professional Structure**:

1. **Role:** Establish the persona (e.g. *"Act as a principal Site Reliability Engineer"*).
2. **Context:** Explain when and why to use the prompt, referencing variables like `[LANGUAGE]`.
3. **Objective:** State the exact result the user needs.
4. **Instructions:** Provide clear, numbered, sequential steps for the AI.
5. **Constraints:** Define strict guardrails (e.g. *"Do not assume missing parameters"*).
6. **Output Format:** Specify clear sections, code fences, bullet points, or tables.

---

### 🚀 Step-by-Step GitHub Contribution Workflow

We welcome community pull requests! Follow these steps to contribute a new prompt:

1. **Fork the Repo:** Click the **[Fork](https://github.com/brewnok/brewprompt)** button in the top navigation or on GitHub.
2. **Clone your fork:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/brewprompt.git
   cd brewprompt
   ```
3. **Create a feature branch:**
   ```bash
   git checkout -b add-sql-optimize-prompt
   ```
4. **Add your prompt to `js/data.js`:**
   Append your prompt object to `window.PROMPTS`. You can also mirror it in `data/prompts.json`.
5. **Test locally:**
   Launch any static file server:
   ```bash
   python -m http.server 8000
   ```
   Open `http://localhost:8000/prompts.html` and verify:
   - Your prompt appears in the directory.
   - Searching for your prompt's title or tags finds it instantly.
   - The customize modal correctly discovers your `[VARIABLES]`.
   - Copying works as expected.
6. **Commit & Open a Pull Request:**
   ```bash
   git commit -am "feat: add Optimize SQL Query prompt"
   git push origin add-sql-optimize-prompt
   ```
   Submit a Pull Request on GitHub. Once reviewed, your prompt will be live in the catalogue!

---

### ⚡ Auto-Discovery Engine
Because brewprompt is 100% static vanilla JavaScript, there is **no build step, no Webpack/Vite bundler, and no database migration**:
- As soon as your prompt is in `js/data.js`, the entire platform picks it up automatically.
- Category prompt counts update dynamically.
- Related prompts algorithms factor it into recommendations.
- Direct URL linking works out of the box (`prompt.html?slug=your-slug`).

---

## Adding Categories

To introduce a new category, update the `window.CATEGORIES` array in `js/data.js`:

```javascript
// js/data.js
window.CATEGORIES = [
  // ... existing categories
  {
    "name": "Machine Learning",
    "icon": "🤖",
    "description": "Prompts for model training, prompt engineering, and evaluation.",
    "subcategories": ["PyTorch", "HuggingFace", "Fine-Tuning", "Evaluation"]
  }
];
```

The application automatically populates category badges, filter pills, and navigation menus across all pages.

---

## Customizing Theme

All visual styles and design tokens are declared as CSS custom properties in `css/style.css`. You can customize the look and feel by editing `:root`:

```css
/* css/style.css */
:root {
  /* Brand Colors */
  --primary: #6366f1;           /* Primary brand indigo */
  --primary-hover: #4f46e5;     /* Darker indigo hover state */
  --primary-light: #e0e7ff;     /* Indigo subtle tint */
  --accent: #818cf8;            /* Accent purple/indigo */

  /* Neutral Surface Colors */
  --bg-main: #f8fafc;           /* Main page background */
  --bg-card: #ffffff;           /* Card & container background */
  --bg-card-hover: #ffffff;     /* Elevated card background */
  --border-color: #e2e8f0;      /* Standard border color */

  /* Typography Colors */
  --text-main: #0f172a;         /* High-contrast headings and body */
  --text-muted: #64748b;        /* Subtitles and secondary metadata */

  /* Shadows & Geometry */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
}
```

---

## Deployment

Because BrewPrompt consists entirely of static assets, it can be deployed to any hosting platform in seconds.

### GitHub Pages
1. Push your code to a GitHub repository:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```
2. In your repository on GitHub, navigate to **Settings** > **Pages**.
3. Under **Build and deployment**, set **Source** to `Deploy from a branch`.
4. Select the `main` branch and `/ (root)` folder, then click **Save**.

### Netlify
- **Option A (Drag & Drop):** Open [Netlify Drop](https://app.netlify.com/drop) and drag the project folder directly into the browser.
- **Option B (Git):** Connect your GitHub/GitLab repository, set build command to empty (`""`), set publish directory to `.` or root, and click **Deploy**.

### Vercel
1. Install Vercel CLI (`npm i -g vercel`) or visit [vercel.com](https://vercel.com).
2. Import your Git repository or run `vercel` in your terminal.
3. Keep default settings (Framework preset: `Other`, Root Directory: `./`) and click **Deploy**.

### Cloudflare Pages
1. Log in to the Cloudflare dashboard and go to **Workers & Pages** > **Create application** > **Pages**.
2. Connect your Git repository.
3. Set **Framework preset** to `None` and **Build output directory** to `/`.
4. Click **Save and Deploy**.

---

## Browser Support

BrewPrompt is thoroughly tested and compatible with all modern evergreen browsers:

| Browser | Supported Versions |
|:---|:---:|
| **Google Chrome** | Latest 2 versions |
| **Microsoft Edge** | Latest 2 versions |
| **Mozilla Firefox** | Latest 2 versions |
| **Apple Safari** | Latest 2 versions |
| **Opera** | Latest 2 versions |

---

## License

This project is licensed under the [MIT License](LICENSE) - feel free to use, modify, and distribute it for personal and commercial projects.

