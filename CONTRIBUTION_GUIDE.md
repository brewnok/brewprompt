# ☕ BrewPrompt Contribution Guide

Welcome to the **BrewPrompt** contributor community! We are thrilled you want to help grow and refine our open-source AI prompt discovery catalogue.

BrewPrompt is maintained by [**@brewnok**](https://github.com/brewnok) and powered by contributors like you. The goal is simple: **curate high-value, battle-tested AI prompts that help developers, engineers, and professionals get extraordinary results from AI models.**

---

## 📑 Table of Contents

- [Why Contribute?](#why-contribute)
- [How Can You Contribute?](#how-can-you-contribute)
- [Prompt Architecture & Schema](#prompt-architecture--schema)
- [Prompt Quality Standards](#prompt-quality-standards)
- [Dynamic Variables Guide](#dynamic-variables-guide)
- [Step-by-Step GitHub PR Workflow](#step-by-step-github-pr-workflow)
- [Testing Your Changes Locally](#testing-your-changes-locally)
- [Pull Request Review Checklist](#pull-request-review-checklist)
- [Community & Support](#community--support)

---

## 💡 Why Contribute?

- **Zero-Backend, Instant Feedback:** BrewPrompt is 100% static vanilla JavaScript. No complex build pipelines, bundlers, Docker containers, or database migrations are needed. You simply edit a JSON array, and your prompt is live!
- **Community Credit:** Your contribution helps thousands of developers debug, write, architect, and optimize code faster.
- **Battle-Tested Repository:** Every prompt in this library is crafted with structured context, clear constraints, and realistic variable placeholders.

---

## 🛠️ How Can You Contribute?

You can contribute in several ways:
1. **Add New Prompts:** Contribute prompts for Coding, SRE, DevOps, Writing, Business, Productivity, Data, etc.
2. **Improve Existing Prompts:** Enhance clarity, instructions, edge-case constraints, or output formats.
3. **Add Categories/Subcategories:** Suggest and organize new technical domains.
4. **Report Issues:** Found a typo, bug, or broken link? [Open an issue](https://github.com/brewnok/brewprompt/issues).

---

## 📋 Prompt Architecture & Schema

All prompts are stored in:
- **`js/data.js`** inside the `window.PROMPTS` array (primary data source).
- **`data/prompts.json`** (mirrored standalone JSON file).

### Prompt Object Template

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

### Field Definitions

| Field | Type | Required | Guidelines |
|---|---|:---:|---|
| `id` | `number` | Yes | Unique incremental integer. Take the highest existing ID + 1. |
| `title` | `string` | Yes | 3–6 words. Clear, actionable title (e.g. `"Explain Complex Code"`). |
| `slug` | `string` | Yes | Kebab-case URL identifier matching the title (e.g. `"explain-complex-code"`). |
| `description` | `string` | Yes | 1–2 sentences explaining the benefit and outcome. |
| `content` | `string` | Yes | Full prompt text. Must follow our quality structure below. |
| `category` | `string` | Yes | Must match one of the 10 existing categories (e.g. `"Development"`, `"DevOps & SRE"`). |
| `subcategory` | `string` | Yes | Valid subcategory under the selected category (e.g. `"Python"`, `"Docker"`). |
| `difficulty` | `string` | Yes | Exactly `"Beginner"`, `"Intermediate"`, or `"Advanced"`. |
| `tags` | `string[]` | Yes | 3–5 lowercase keywords (e.g. `["python", "debugging", "coding"]`). |
| `aiPlatforms` | `string[]` | Yes | Subset of: `["ChatGPT", "Claude", "Gemini", "GitHub Copilot"]`. |
| `useCases` | `string[]` | Yes | 1–3 practical scenarios (e.g. `["Debugging", "Code Review"]`). |
| `featured` | `boolean` | Yes | Set to `false` for new additions (curators promote to featured). |
| `popular` | `boolean` | Yes | Set to `false` for new additions. |
| `createdDate` | `string` | Yes | Today's date in ISO format (`"YYYY-MM-DD"`). |
| `copyCount` | `number` | Yes | Initialize to `0`. |

---

## 🎯 Prompt Quality Standards

To maintain library quality, all prompts must follow the **6-Part Professional Structure**:

```text
Role Statement:
Act as a senior [SPECIALIZATION / EXPERT].

Context:
Explain when and why to use this prompt. Reference customizable parameters.

Objective:
Clearly state what the AI must accomplish.

Instructions:
1. Step 1: Specific action.
2. Step 2: Specific action.
3. Step 3: Specific action.

Constraints:
- Boundary condition 1.
- Boundary condition 2 (e.g. "Do not assume information that isn't provided").

Output Format:
- Section 1
- Section 2
- Code blocks / tabular format specification
```

### Quality Checklist:
- ❌ **Avoid:** Vague prompts like *"Write code for a website"* or *"Explain Python"*.
- ✅ **Favor:** Specific, repeatable prompts like *"Generate Comprehensive Unit Tests for FastAPI Endpoints"* with explicit mock setups and edge cases.

---

## 🧩 Dynamic Variables Guide

BrewPrompt automatically parses any word inside square brackets `[VARIABLE_NAME]` and generates an interactive customization modal for visitors.

### Conventions:
- Use **UPPERCASE** and underscores: `[TOPIC]`, `[LANGUAGE]`, `[CODE]`, `[TARGET_AUDIENCE]`, `[FRAMEWORK]`.
- Always wrap variables in square brackets: `[BUDGET]`, not `{BUDGET}` or `<BUDGET>`.
- Make variables intuitive so visitors know what to input into the generated form.

### Example:
```text
Draft a comprehensive API migration plan from [SOURCE_FRAMEWORK] to [TARGET_FRAMEWORK] for an enterprise [LANGUAGE] service.
```
When visitors click **"Customize Prompt"**, input fields for `Source Framework`, `Target Framework`, and `Language` will automatically generate with a live preview!

---

## 🚀 Step-by-Step GitHub PR Workflow

### 1. Fork the Repository
Visit [https://github.com/brewnok/brewprompt](https://github.com/brewnok/brewprompt) and click **Fork** (top right) to create a copy in your GitHub account.

### 2. Clone Your Fork
```bash
git clone https://github.com/YOUR_USERNAME/brewprompt.git
cd brewprompt
```

### 3. Configure Remote Upstream
Keep your local clone updated with the original repository:
```bash
git remote add upstream https://github.com/brewnok/brewprompt.git
git fetch upstream
```

### 4. Create a Feature Branch
```bash
git checkout -b add-fastapi-testing-prompt
```

### 5. Add Your Prompt
Open `js/data.js` and add your prompt object to `window.PROMPTS`:
```javascript
// Append to window.PROMPTS in js/data.js
{
  id: 53,
  title: "FastAPI Unit Test Suite",
  slug: "fastapi-unit-test-suite",
  // ...
}
```
*(Optional)* Also mirror your new entry in `data/prompts.json`.

### 6. Test Your Changes Locally
Launch any local static server:
```bash
# Python 3
python -m http.server 8000

# or Node.js
npx serve .
```
Navigate to:
- `http://localhost:8000/prompts.html` — Verify your prompt appears and search works.
- `http://localhost:8000/prompt.html?slug=fastapi-unit-test-suite` — Verify detail view, tags, copy button, and the **"Customize Prompt"** modal.

### 7. Commit & Push
```bash
git add js/data.js data/prompts.json
git commit -m "feat(prompts): add FastAPI unit test suite prompt"
git push origin add-fastapi-testing-prompt
```

### 8. Open a Pull Request
1. Go to [https://github.com/brewnok/brewprompt](https://github.com/brewnok/brewprompt).
2. GitHub will show a banner with your recent branch: click **Compare & pull request**.
3. Provide a clear title and description summarizing your prompt and its use cases.
4. Click **Create pull request**.

---

## ✅ Pull Request Review Checklist

Before submitting your PR, ensure:
- [ ] Prompt ID is unique (incremented from the last prompt).
- [ ] `slug` is valid kebab-case matching the `title`.
- [ ] `category` and `subcategory` match existing categories.
- [ ] `difficulty` is one of: `Beginner`, `Intermediate`, or `Advanced`.
- [ ] All customizable parameters follow `[VARIABLE_NAME]` formatting.
- [ ] Prompt has tested instructions, constraints, and output format.
- [ ] Verified locally using `python -m http.server 8000`.

---

## 💬 Community & Support

- **Repository:** [https://github.com/brewnok/brewprompt](https://github.com/brewnok/brewprompt)
- **Issues & Requests:** [https://github.com/brewnok/brewprompt/issues](https://github.com/brewnok/brewprompt/issues)
- **Pull Requests:** [https://github.com/brewnok/brewprompt/pulls](https://github.com/brewnok/brewprompt/pulls)
- **Maintainer:** [@brewnok](https://github.com/brewnok)

Thank you for helping make **BrewPrompt** the best AI prompt discovery library on the web! ☕⚡
