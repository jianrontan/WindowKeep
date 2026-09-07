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

## Rust learning approach

- The user is learning Rust. When Rust work begins, explain the concepts and design choices involved in each small feature using the actual project code.
- Introduce ownership/borrowing, structs/enums, `Option`/`Result`, traits, and modules as needed rather than front-loading a long tutorial.
- Explain meaningful compiler errors and how fixes address them. Offer small exercises where useful without blocking authorized implementation work.
- Keep platform interop and necessary `unsafe` code isolated and document its safety requirements.
