# EventPass

A modern event management application built with React, TypeScript, and Tailwind CSS. It features a comprehensive signup wizard, responsive design with container queries, and a secure organizer dashboard.

## Overview Flow
1. **User** visits Dashboard to see overview stats.
2. User browses **Events**, filters by category.
3. User selects an event, views details, and clicks "Book Now".
4. **Wizard** opens: Step 1 (Info) -> Step 2 (Slot Selection) -> Step 3 (Summary + reCAPTCHA).
5. Upon success, user is redirected to **My Signups**.
6. **Organizer** can toggle role in top bar, visit **Admin** to see charts and table of participants.

## Setup & Run

1. **Install Dependencies** (Standard Vite project):
   ```bash
   npm install
   ```
2. **Environment Variables**: Create `.env`
   ```
   VITE_RECAPTCHA_SITE_KEY=your_site_key_here
   RECAPTCHA_SECRET_KEY=your_secret_key_here (For Backend)
   ```
3. **Run Dev Server**:
   ```bash
   npm run dev
   ```
4. **Deploy to Vercel**:
   - Push to GitHub.
   - Import in Vercel.
   - Add Environment Variables in Vercel settings.

## Map of Requirements

| Requirement | File / Location | Description |
| :--- | :--- | :--- |
| **Tech Stack** | `package.json` (implied) | React, Vite, TS, Tailwind, Zod, RHF. |
| **Container Queries** | `components/EventCard.tsx` | Used `@container` and `@lg:flex-row` to resize card content based on card width. |
| **Tailwind Config** | `index.html` | Configured inside script tag with `container-queries` plugin and custom keyframes. |
| **Role/Paid Types** | `types.ts` | `Role` (Union), `AppEvent` (Intersection of Base & Paid/Free). |
| **Generic Types** | `types.ts` | `Partial<AppEvent>` used for updates. |
| **Function Overloads** | `lib/utils.ts` | `formatMoney` is overloaded for currency handling. |
| **Type Predicate** | `lib/utils.ts` | `isPaidEvent` checks if event is `PaidEvent`. |
| **Generic Component** | `components/DataTable.tsx` | `DataTable<T>` handles any data type. |
| **RHF + Zod** | `pages/EventWizard.tsx` | Complex multi-step form with conditional validation. |
| **Custom Controller** | `pages/EventWizard.tsx` | `SlotSelector` component used inside `Controller`. |
| **Zod Refine** | `pages/EventWizard.tsx` | Regex for phone, `literal(true)` for terms. |
| **Compound Component** | `components/Stepper.tsx` | `<Stepper><Stepper.Step /></Stepper>` pattern. |
| **Shadcn Integration** | `components/ui.tsx` | Manual implementation of Shadcn API (Card, Button, Input) using Tailwind. |
| **ReCAPTCHA** | `pages/EventWizard.tsx` | Step 3 includes Captcha. Serverless function in `api/verify-captcha.ts`. |
| **LocalStorage** | `lib/store.ts` | `useStore` hook manages persistence. |
| **Routing** | `App.tsx` | React Router DOM with Protected Admin Route logic. |

---
*Generated via AI Studio: LINK_DO_ROZMOWY_AI_STUDIO*
