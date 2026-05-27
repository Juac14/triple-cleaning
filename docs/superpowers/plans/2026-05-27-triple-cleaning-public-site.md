# Triple Cleaning Public Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a polished static public site for Triple Cleaning with service pricing, included tasks, and a pending-approval booking request flow.

**Architecture:** The site is static HTML/CSS/JavaScript so it can run locally without Node/npm. `index.html` owns the semantic page structure, `styles.css` owns the logo-inspired visual system and responsive layout, `script.js` owns service data, pricing rendering, booking validation, and mailto request creation.

**Tech Stack:** HTML, CSS, vanilla JavaScript, PowerShell verification script.

---

## File Structure

- `index.html`: public homepage, semantic sections, booking form, and accessible content containers.
- `styles.css`: responsive visual design based on the Triple Cleaning logo.
- `script.js`: pricing data, booking options, weekend/time validation, pending request summary, and email request link.
- `assets/logo.png`: supplied Triple Cleaning logo.
- `tests/site-content.tests.ps1`: local checks for required content and booking constraints.
- `docs/superpowers/specs/2026-05-27-triple-cleaning-public-site-design.md`: approved design spec.

### Task 1: Content And Booking Tests

**Files:**
- Create: `tests/site-content.tests.ps1`

- [ ] **Step 1: Write the failing test**

Create a PowerShell script that checks for `index.html`, `styles.css`, `script.js`, the logo, required prices, required service descriptions, weekend-only copy, Pending Approval wording, and the contact email.

- [ ] **Step 2: Run test to verify it fails**

Run: `powershell -ExecutionPolicy Bypass -File tests/site-content.tests.ps1`

Expected: FAIL because `index.html`, `styles.css`, `script.js`, and `assets/logo1.png` do not exist yet.

### Task 2: Static Site Files

**Files:**
- Create: `index.html`
- Create: `styles.css`
- Create: `script.js`
- Create: `assets/logo.png`

- [ ] **Step 1: Add semantic HTML**

Create the single-page structure with hero, services, pricing, included tasks, booking, and contact sections.

- [ ] **Step 2: Add the visual system**

Create responsive CSS using warm white, soft charcoal, champagne gold, thin borders, elegant spacing, and mobile-safe layouts.

- [ ] **Step 3: Add booking behavior**

Create service data, populate prices and durations, enforce Saturday/Sunday date selection messaging, limit time choices to 09:00-18:00, show Pending Approval, and build an email request.

- [ ] **Step 4: Add the logo**

Copy the supplied logo image into `assets/logo.png` and reference it from the header and footer.

- [ ] **Step 5: Run test to verify it passes**

Run: `powershell -ExecutionPolicy Bypass -File tests/site-content.tests.ps1`

Expected: PASS with every check marked.

### Task 3: Visual And Interaction Verification

**Files:**
- Read: `index.html`
- Read: `styles.css`
- Read: `script.js`

- [ ] **Step 1: Open the local page**

Open `index.html` in a browser and verify that the logo, hero, pricing, included lists, and booking form render.

- [ ] **Step 2: Test booking behavior**

Select each service and home size, confirm the price and duration update, choose an unavailable weekday and confirm the page asks for Saturday/Sunday, then choose an available weekend slot and confirm the request summary shows Pending Approval.

- [ ] **Step 3: Final verification**

Run the PowerShell test script again and inspect the page for mobile-safe responsive layout.
