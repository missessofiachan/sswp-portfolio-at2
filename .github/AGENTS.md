## Automation Agent Playbook — sswp-portfolio-at2

This file gives AI/autonomous contributors a concise operating manual. Follow it alongside `.github/copilot-instructions.md`.

---

### 🔄 Daily workflow

1. Sync & inspect
	- `git pull --rebase origin main`
	- skim `todo` and the latest commits for context.
2. Reproduce locally
	- Install once: `pnpm install`
	- Optional clean build: `pnpm run build`
3. Work in focus areas
	- **Client** code lives in `client/src/...`
	- **Server** code in `server/src/...`
	- **Docs** in `docs/`
4. Verify incrementally (see verification matrix below).
5. Summarise results, tests run, and follow-ups in your report.

### 🚀 Common commands

- Install deps: `pnpm install`
- Launch both apps: `pnpm run dev`
- Client only dev server: `pnpm -C client run dev`
- Server only dev server: `pnpm -C server run dev`
- Build client: `pnpm -C client run build`
- Build server: `pnpm -C server run build`
- Run client tests: `pnpm -C client run test`
- Run server tests: `pnpm -C server run test`
- Client typecheck: `pnpm -C client run typecheck`
- Server typecheck: `pnpm -C server run typecheck`
- Format: `pnpm run format`
- Lint: `pnpm run lint`

### 🧱 Code organisation essentials

- **React SPA (client/)**: Uses Vite, React Router, Jotai, React Hook Form + Zod, Vanilla Extract for styling, Axios for HTTP (`client/src/lib/axios.ts`).
- **Express API (server/)**: Layered architecture (controller → service → repository). Firestore via Firebase Admin SDK.
- **Shared docs**: `docs/ARCHITECTURE.md`, `docs/project_file_map.md`, `docs/API_REFERENCE.md`. Review before major work.

### ✍️ Coding standards

- TypeScript strict mode everywhere; avoid `any` unless unavoidable (document why).
- Prefer `const` and `let`; never use `var`.
- Keep components and functions focused; extract helpers when logic grows.
- Use descriptive names; align with domain terminology (“product”, “enquiry”, “admin”).
- Follow existing styling approach (Vanilla Extract). Reuse tokens in `client/src/app/theme.css.ts` and utilities in `client/src/app/ui.css.ts`.
- HTTP calls belong in `client/src/api/clients/`; never call `fetch` directly from components.
- Validate user input with Zod (client) or Joi (server) before hitting business logic.
- Error handling: surface human-friendly messages in UI, log technical details in server.
- Document non-obvious behaviour with concise comments referencing ticket numbers when applicable.

### ✅ Verification matrix (run what you touch)

| Change type | Required checks | Optional extras |
|-------------|-----------------|-----------------|
| Client UI/components | `pnpm -C client run typecheck` | `pnpm -C client run test`, manual smoke in dev server |
| Server routes/services | `pnpm -C server run typecheck` | `pnpm -C server run test`, Postman or curl call |
| Shared schema/types | Both client & server typechecks | End-to-end smoke if Firestore queries involved |
| Styling/theme only | Visual check in dev server | Axe accessibility scan |
| Docs only | None required | Proofread & link check |

Record every command you run in the final report.

### 🔐 Security & data handling

- Secrets live in `.env` files (gitignored). Never hardcode or log them.
- Firestore security rules and indexes are documented in `docs/FIRESTORE_INDEXES.md`; update when adding new queries or access patterns.
- Sanitize filenames on upload; avoid trusting client-submitted paths.
- Handle personally identifiable information (emails, addresses) carefully—mask in logs.

### 📸 Evidence & docs expectations

- UI changes: provide before/after screenshots (see `docs/screenshots/README.md` for required shots).
- API changes: update `docs/API_REFERENCE.md` or `docs/ASSESSMENT.md` as needed.
- New patterns: add notes to `todo` or `docs/new things to consider.md`.

### 🔁 Git & review hygiene

- Work on feature branches named `feature/<topic>` or `fix/<topic>`.
- Keep commits scoped; write clear messages (“feat(server): add contact endpoint validation”).
- Before requesting review, ensure lint/typecheck/tests pass.
- Highlight manual steps (index creation, env var updates) in PR description.

### 🆘 When blocked

- Capture exact error messages, commands run, and hypotheses.
- Suggest fallback options (mock data, feature flag) rather than stopping at the problem.
- Flag dependencies on credentials or third-party services early.

---

By following this playbook you keep the repo consistent, testable, and ready for assessment evidence.*** End Patch
