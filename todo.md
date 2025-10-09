Detailed TODO for sswp-portfolio-at2

Purpose
- A single place to track short-term work (next-sprint) and medium-term improvements for the portfolio/store project.

How to use this file
- Each item includes: area, short description, priority (High/Med/Low), estimate, acceptance criteria, and one-line next action.
- Mark items done by removing or prefixing with DONE and date.

HIGH PRIORITY (do these first)

1) Server: Contact form endpoint
	 - Description: Provide a POST /contact (or /enquiries) endpoint that accepts name, email, subject, message and enqueues/sends email (or stores in Firestore). Protect with basic rate-limiting.
	 - Priority: High
	 - Estimate: 2-4h
	 - Acceptance criteria:
		 * POST /contact returns 200 on valid payload and 400 on validation errors
		 * Emails are sent via configured email service (or stored in `emails` collection) and visible in server logs
		 * Basic rate-limit (e.g., per IP) is applied to prevent abuse
	 - Next action: Add validator, controller, route, and wire email service in `server/src/api/routes/` and `server/src/services/email.service.ts`.

2) Server: Product schema — include rating & category
	 - Description: Ensure server product model supports `rating: number` and `category: string`, and shortDescription separate from full description (e.g. `summary` or `shortDescription`). Update data contracts and validators.
	 - Priority: High
	 - Estimate: 1-3h
	 - Acceptance criteria:
		 * Product create/update endpoints accept `category`, `rating`, `shortDescription`
		 * Stored documents include fields with correct types in Firestore
		 * API responses include shortDescription for list endpoints and full description for single product endpoint
	 - Next action: Update `server/src/domain/product.ts`, validation schemas in `server/src/api/validators/`, and repository mappings in `server/src/data/firestore/`.

3) Frontend: Contact form -> API submission (not mailto)
	 - Description: Replace current mailto-based submit with a call to server POST /contact and show success/error UI.
	 - Priority: High
	 - Estimate: 2-4h
	 - Acceptance criteria:
		 * Contact form submits JSON to server and shows a success message without opening the mail client
		 * Errors are shown inline and network failures handled gracefully
	 - Next action: Implement API client (`client/src/api/clients/contact.api.ts`) and update `client/src/pages/Contact.tsx` submission handler.

MEDIUM PRIORITY

4) Frontend: Products list enhancements (already implemented)
	 - Description: Show short description, category and rating in the list; keep full description on product detail.
	 - Priority: Medium
	 - Estimate: 1-2h
	 - Acceptance criteria:
		 * Products list displays category, rating stars and a 120-char preview
		 * Product detail page shows category, numeric rating + stars and full description
	 - Next action: Verify designs and tweak CSS tokens for consistent spacing/colour (files: `client/src/pages/Products.tsx`, `ProductShow.tsx`).

5) Server: Uploads & image hosting
	 - Description: Harden the uploads endpoint; verify Content-Type handling and security (file type checking, size limits). Persist uploaded images to a stable path and return public URLs.
	 - Priority: Medium
	 - Estimate: 3-6h
	 - Acceptance criteria:
		 * Upload endpoint accepts multipart/form-data and returns url list
		 * Images are validated (types, max size), and malformed uploads rejected with 4xx
	 - Next action: Inspect `server/src/api/` uploads route and add validation and storage rules.

6) Frontend: Admin product create/edit — support category, rating, shortDescription, and image uploads UI
	 - Description: Make the admin product form produce the new fields and upload images through the upload API; show previews.
	 - Priority: Medium
	 - Estimate: 3-5h
	 - Acceptance criteria:
		 * Admin create/edit pages send category, rating, shortDescription
		 * Image upload control sends files to uploadImages API and populates the images field
	 - Next action: Update `client/src/pages/ProductCreate.tsx` and `ProductEdit.tsx` to include new inputs and use `uploadImages`.

7) Server: Firestore rules / indexes
	 - Description: Add or document necessary composite indexes and tighten security rules so only auth users can mutate protected collections.
	 - Priority: Medium
	 - Estimate: 1-2h
	 - Acceptance criteria:
		 * Required indexes documented in `docs/FIRESTORE_INDEXES.md` with field combinations and example queries that need them
		 * Security rules deny unauthorised writes (high level; implement in Firebase Console or CI)
		 * Rule snippets and deployment instructions captured in repo (e.g., `docs/FIRESTORE_RULES.md` or README section)
	 - Detailed tasks:
		 1. Audit queries in `server/src/data` and `client/src/api` to list any compound filters/orderBy usage.
		 2. Update `docs/FIRESTORE_INDEXES.md` with a table: Query, Fields, Collection Group, Index build status.
		 3. Draft Firestore security rules covering:
			 - Authenticated users can read products/users; only admins can write to users/products.
			 - Only authenticated uploads allowed.
			 - Contact/enquiry writes allowed but limited to new documents and validated fields.
		 4. Store rule drafts locally (e.g., `/server/firestore.rules` or docs) and note deployment command (`firebase deploy --only firestore:rules` if using Firebase CLI).
		 5. If new indexes required, add creation commands (`npx firebase firestore:indexes`) or console instructions, plus expected Firestore console paths.
		 6. Confirm indexes exist (via console screenshot/note) and update docs with the completion date.
	 - Verification steps:
		 * Run through each API endpoint that performs Firestore queries; ensure they succeed with new indexes.
		 * Attempt unauthorized write using emulator or curl → should fail with permission-denied.
		 * Document results in docs commit message or appendix.
	 - Follow-ups:
		 * Consider automating rule deployment via CI (GitHub Action).
		 * Add reminder to review rules quarterly for drift.

LOW PRIORITY / NICE TO HAVE

8) Frontend: Accessibility sweep
	 - Description: Run axe or manual checks on new pages (About, Contact, Products) and fix focus order, form labels, color contrast.
	 - Priority: Low
	 - Estimate: 2-4h
	 - Acceptance criteria:
		 * No critical a11y violations in new pages
	 - Next action: Run `npx axe-core` or use browser axe extension and fix issues.

9) Tests: Basic unit + integration coverage
	 - Description: Add Vitest tests for Product list rendering, ProductShow and Contact form submission (mock axios or msw). Add a server test for contact controller if possible.
	 - Priority: Low -> Medium (depending on assessment requirements)
	 - Estimate: 4-8h
	 - Acceptance criteria:
		 * Tests exist for critical flows and pass in CI
	 - Next action: Create tests in `client/test/` and `server/src/test/` using msw for client side.

10) Project / DevOps: CI, linting and release checks
		- Description: Ensure GH Actions (or CI) runs typecheck, lint, and unit tests for client and server. Optionally add a build step and deploy preview.
		- Priority: Low
		- Estimate: 3-6h
		- Acceptance criteria:
			* CI pipeline runs typecheck and tests and fails on issues
		- Next action: Add or update `.github/workflows/` to run pnpm workspace scripts.

Project housekeeping & commands
- Run client typecheck: `pnpm -C client run typecheck`
- Run server typecheck: `pnpm -C server run typecheck`
- Run client tests: `pnpm -C client run test`
- Build client for production: `pnpm -C client run build`

Estimates & prioritisation notes
- Focus first on the contact endpoint and wiring the frontend to it, then finalize product schema changes and admin flows. After that, finish uploads and security rules.

Acceptance & verification checklist (quick smoke tests)
1. Contact endpoint: `curl -X POST` with a valid payload returns 200 and creates a record or sends email.
2. Client contact form: submit shows success UI and no mail client opens.
3. Products list: categories, ratings and short description display; product detail shows full description.
4. Admin: create product with images and category persists and shows in list.

Who/Notes
- If you'd like, I can open PR branches for each High/Medium ticket and implement them one-by-one. I can also write the server contact route and the client API and wire them immediately—tell me which item to start first and I will implement it.

END



