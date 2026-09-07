# Repository working instructions

## Commit flow

- Use Conventional Commit subjects in the format `type: concise description`, such as `feat: add local workspace snapshots`, `fix: handle disconnected profiles`, or `docs: document the implementation roadmap`.
- For larger commits, add a blank line after the subject and a bullet-point body covering the meaningful changes and relevant verification.
- Do not add attribution text, generated-by signatures, or co-author trailers to commits.
- Keep commits focused. Inspect the staged diff and run checks appropriate to the change before committing. Documentation-only changes do not need application tests.
- Stage explicit paths and preserve unrelated user changes. Never force-push unless explicitly authorized.

## Product scope

- V1 is Windows 11, Google Chrome, local-only, and requires no account or cloud service.
- Preserve workspace → Chrome windows → tabs. The user manually chooses the destination OS workspace before restoring.
- Validate extension-window-to-native-window matching; never silently assign uncertain matches or close windows based on a guessed match.
- Save durably before closing and handle changes during capture and partial failures explicitly.
- Future sync is optional and uses the user's own cloud deployment. AWS is the first planned reference provider.

## Coding conventions

- TypeScript must use strict checking. Do not use explicit `any`, unsafe assertions to bypass validation, or suppression comments to conceal type errors.
- Treat external input as `unknown` and validate it at runtime before use. Keep shared message contracts in `packages/protocol`.
- Prefer discriminated unions, readonly data where practical, named exports, and type-only imports. Handle optional values and promise failures explicitly.
- Keep UI, browser integration, persistence, and OS integration separate. Add dependencies only when a feature requires them.
- Use ESLint's strict type-aware rules and Prettier. Run `npm run check`, `npm test`, and `npm run build` for TypeScript changes.
- Use Cargo formatting and Clippy for Rust. Avoid `unwrap` and `expect` in application code; handle errors explicitly. Unsafe code is forbidden in the initial scaffold; any future OS interop exception requires a narrow, documented boundary.
- Test behavior and failure boundaries rather than mirroring implementation. Never use real browsing data as committed fixtures.
