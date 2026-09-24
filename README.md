# EduPulse AI - Interactive AI Course & Assessment Architecture Engine
> **House of Edtech - Fullstack Developer Assignment 1 (Sep 2026.1)**

[![Live Deployment](https://img.shields.io/badge/Live_App-Vercel-success?style=for-the-badge&logo=vercel)](https://edupulse-ai-two.vercel.app)
[![GitHub Repository](https://img.shields.io/badge/GitHub-EduPulse--AI-indigo?style=for-the-badge&logo=github)](https://github.com/jayeshphale/EduPulse-AI)
[![Next.js 16](https://img.shields.io/badge/Next.js-16_App_Router-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-SQLite-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io)

---

## 🌐 Live Production Application & Links

- 🚀 **Live Deployment URL**: [https://edupulse-ai-two.vercel.app](https://edupulse-ai-two.vercel.app)
- 📁 **GitHub Repository**: [https://github.com/jayeshphale/EduPulse-AI](https://github.com/jayeshphale/EduPulse-AI)
- 👤 **Candidate Name**: **Jayesh Phale**
- 🐙 **GitHub Profile**: [github.com/jayeshphale](https://github.com/jayeshphale)
- 💼 **LinkedIn Profile**: [linkedin.com/in/jayeshphale](https://linkedin.com/in/jayeshphale)

---

## 🌟 Executive Summary

**EduPulse AI** is an advanced, production-grade fullstack web application built for the **House of Edtech Fullstack Developer Assignment**. 

Moving far beyond basic CRUD applications, EduPulse AI provides an end-to-end intelligent learning framework:
1. **Curriculum & Assessment Authoring Engine**: Build multi-module courses, video/text lessons, and Bloom's Taxonomy aligned multiple-choice quizzes.
2. **Google Gemini AI Quiz Generator**: Automatically generate structured assessments mapped to cognitive levels (*Remember, Understand, Apply, Analyze, Evaluate*) with detailed explanations.
3. **AI Submission Evaluator & Remediation Engine**: Real-time auto-grading with personalized feedback reports highlighting student knowledge gaps and recommended next learning steps.
4. **Role-Based Access Control (RBAC) & Audit Logging**: Secure JWT authentication supporting `INSTRUCTOR`, `STUDENT`, and `ADMIN` roles with immutable security logs.
5. **Educational Analytics & Skill Mastery Dashboard**: Metrics tracking average quiz scores, course completion rates, and cognitive domain mastery.

---

## 🛠️ Technology Stack

- **Core Framework**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4, Lucide Icons, Glassmorphic UI System
- **Database & ORM**: Prisma ORM with SQLite
- **Security & Auth**: JWT (`jose`), HTTP-Only Cookies, `bcryptjs` password hashing
- **Data Validation**: Zod runtime schema validation
- **AI Integration**: Google Gemini AI SDK (`@google/genai`) with intelligent fallback
- **Testing**: Vitest unit & integration test suite

---

## ⚡ 1-Click Reviewer Demo Accounts

Reviewers can switch roles instantly directly from the top navigation bar without creating manual accounts:

- **Instructor Demo**: `instructor@edupulse.ai` (Password: `password123`)  
  *Permissions*: Create courses, author modules/lessons, launch Gemini AI Quiz Studio.
- **Student Demo**: `student@edupulse.ai` (Password: `password123`)  
  *Permissions*: Enroll in courses, take interactive quizzes, view AI feedback reports.
- **Admin Demo**: `admin@edupulse.ai` (Password: `password123`)  
  *Permissions*: Platform metrics, cognitive mastery radar, and security audit logs.

---

## 🧪 Local Setup & Development

### 1. Clone the repository
```bash
git clone https://github.com/jayeshphale/EduPulse-AI.git
cd EduPulse-AI
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables (`.env`)
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="edupulse-super-secret-jwt-key-2026-production"
GEMINI_API_KEY="" # Optional: Add your Gemini API key for live AI calls
```

### 4. Setup Database
```bash
npm run db:push
```

### 5. Run Unit Tests (Vitest)
```bash
npm run test
```

### 6. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Automated Testing Verification

Run `npm run test` to execute the full Vitest suite:

```bash
 RUN  v4.1.11 C:/Users/Jayesh Phale/.gemini/antigravity-ide/scratch/edupulse-ai

 ✓ src/__tests__/auth.test.ts (2 tests)
 ✓ src/__tests__/validations.test.ts (5 tests)

 Test Files  2 passed (2)
      Tests  7 passed (7)
```

---

## 📄 License & Attribution

Developed by **Jayesh Phale** for **House of Edtech** Fullstack Developer Assignment (Sep 2026.1).
