<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# RoleMap

## Project Description

RoleMap is a high-fidelity organizational intelligence platform designed to eliminate the structural ambiguity common in modern AI and product engineering teams. It transforms messy, unstructured professional data—like LinkedIn profiles or resume text—into actionable, visual maps of accountability and responsibility.

### The Problem it Solves

AI teams often suffer from "responsibility overlap" or "accountability gaps." When a model fails in production, is it the MLE's responsibility, the MLOps engineer's, or the Data Governance lead's? RoleMap provides instant clarity by mapping talent to a canonical taxonomy of AI roles and then aligning that talent against a standard delivery lifecycle.

## Core Platform Pillars

### 1. Zero-Friction Talent Ingestion

Instead of manual data entry, RoleMap features a "Magic Paste" interface. Users can dump raw text from LinkedIn search results or internal rosters. The platform utilizes Gemini 3 Flash to split, parse, and structure this data into distinct professional entities, extracting name, title, seniority, and specialized skills in seconds.

### 2. Canonical AI Role Classification

The engine automatically maps employees to one of 20+ Canonical AI Roles (e.g., Applied AI Engineer, Conversation Designer, Model Risk Specialist). This creates a unified language for the organization, allowing leadership to see their functional distribution across Product, Engineering, Data, and Governance clusters.

### 3. Intelligent RACI Mapping

The centerpiece of the platform is an interactive Responsibility Assignment Matrix (RACI).

- **Auto-Assign**: Leveraging Gemini 3 Pro, the platform can intelligently suggest who should be Responsible, Accountable, Consulted, or Informed for specific tasks based on their role and seniority.
- **Dynamic UI**: The matrix features resizable columns and high-density information layouts to handle large enterprise rosters without losing context.

### 4. Structural Health & Gap Analysis

RoleMap doesn't just display data; it audits it. The Health Analysis engine runs a dual-layer scan:

- **Heuristic Layer**: Flags deterministic risks like "Activities with no Accountable owner" or "Individuals with too many primary responsibilities" (Risk Concentration).
- **AI Layer**: Uses LLM reasoning to identify qualitative gaps, such as "A production team lacking MLOps coverage" or "Safety activities without a Responsible AI specialist."

## User Experience & Aesthetic

Built with a "Stripe-inspired" aesthetic, RoleMap prioritizes high-contrast typography, subtle glassmorphism, and a rigorous, data-heavy layout that remains clean and readable. It is designed for the Director of AI or VP of Product who needs a boardroom-ready view of their organization's capability coverage and operational risks.

## Technical Foundation

- **LLM Core**: Gemini 3 Pro for complex reasoning (RACI/Gaps) and Gemini 3 Flash for high-speed parsing.
- **Persistence**: A robust simulated Supabase architecture with multi-tenant support.
- **Safety**: Built-in integrated test suite to ensure the integrity of the parsing and gap-detection logic.

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key

3. Run the app:
   ```bash
   npm run dev
   ```

View your app in AI Studio: https://ai.studio/apps/drive/1uP90dT_06r6CSSEqgPlfgjeVVHw_H-nD
