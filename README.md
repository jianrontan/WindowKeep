# WindowKeep

Save and close your browser tabs, organized by window and workspace. Reopen them whenever you're ready.

**Status: initial scaffold.** The desktop shell, extension skeleton, and shared protocol checks are in place. Workspace detection, saving, and restoration are not implemented, and no downloadable release exists yet. V1 targets Windows 11 and Google Chrome, works entirely locally, and requires no account or cloud service.

## How it will work

- **Tab:** a single page in a Chrome window.
- **Chrome window:** a window containing multiple tabs.
- **Workspace:** a Windows virtual desktop (or, in future, a macOS workspace).

WindowKeep preserves **workspace → Chrome windows → tabs**. Preview the detected windows, save a named snapshot, and optionally close the selected Chrome windows after saving succeeds. Later, manually switch to your destination workspace and restore a whole collection, individual windows, or selected tabs as separate Chrome windows.

Snapshots store URLs and organization, not logged-in sessions or unsaved page content. WindowKeep will not create or switch OS workspaces. Restoration into the current workspace must be verified on supported configurations.

## Planned stack

| Layer                  | Technology                                     | Responsibility                                               |
| ---------------------- | ---------------------------------------------- | ------------------------------------------------------------ |
| Desktop framework      | Tauri 2                                        | Application window, tray integration, frontend/native bridge |
| Interface              | React, TypeScript, Vite, CSS                   | Live windows, saved library, previews, settings              |
| Native logic           | Rust                                           | Snapshot operations, local communication, OS integration     |
| Windows integration    | Windows APIs through the Rust `windows` crate  | Native window enumeration and workspace membership           |
| Browser integration    | Chrome Manifest V3 extension, TypeScript       | Read tabs; create and close Chrome windows                   |
| Browser/app connection | Chrome Native Messaging host and local IPC     | Connect each extension profile to the desktop app            |
| Local persistence      | SQLite                                         | Snapshots, history, settings                                 |
| Portable backups       | Versioned JSON                                 | Import/export and future sync compatibility                  |
| Verification           | Rust tests, Vitest, Windows integration checks | Data logic, extension behavior, real desktop integration     |
| Distribution           | Windows installer, GitHub Releases             | Downloadable desktop app and extension package               |

The interface and much of the Rust logic can be shared across platforms. Workspace detection and installation require platform-specific implementations; Tauri does not provide automatic OS workspace detection.

## V1: local Windows implementation plan

1. **Repository and application foundation:** scaffold the desktop app and extension, define the shared protocol, and establish build checks.
2. **Detection prototype:** collect Chrome windows/tabs, enumerate native windows, inspect workspace membership, and prove reliable matching between extension window IDs and native windows. Test multiple desktops, minimized windows, duplicate titles, multiple profiles, and monitors. Keep uncertain matches explicitly unassigned.
3. **Reliable extension connection:** implement native host registration, local IPC, message validation, reconnect behavior, and connected-profile identification.
4. **Durable snapshots:** define the versioned data model; implement SQLite transactions, named collections, history, and JSON import/export. Verify persistence across restarts and export/import round trips.
5. **Selective restore:** recreate windows and selected tabs, retaining tab order, pinned tabs, and Chrome tab-group names/colors. Report partial failures and validate current-workspace placement.
6. **Save and close:** preview the selection, commit a durable snapshot, recheck for changes, and close eligible windows. Failed saves must never trigger closing. Report changed windows and partial closing failures.
7. **Desktop workflow:** build the live view, saved library, previews, rename/delete actions, settings, and optional tray mode. Startup launch is opt-in.
8. **Packaging and release:** create the Windows installer, automate native host setup, document Chrome extension installation, and verify installation/uninstallation and save/restore on a clean Windows environment.

**The detection prototype is the first technical gate.** Matching titles or positions alone is insufficient. Prove the browser-to-native-window mapping before investing in a polished interface or automatic closing.

### V1 boundaries

- Windows 11 and Google Chrome only; no incognito capture initially.
- Multiple profiles require the extension in each profile. Restore into a selected connected profile.
- Workspace labels are names chosen in WindowKeep; retrieving Windows desktop names/order is not assumed.
- No account, backend, cloud credentials, or network connection is required for local use.
- The desktop installer and extension are separate installation steps until a supported distribution flow is implemented.

## After V1

- **Optional cross-device sync:** keep local use independent of cloud setup. Users bring their own cloud provider and deployment; downloading WindowKeep does not enroll anyone in a maintainer-funded backend.
- **AWS reference integration:** start with Cognito for Google sign-in, API Gateway/Lambda for an authenticated snapshot API, and S3 for versioned snapshot files. Include infrastructure code and setup instructions. Finalize the design when sync work begins.
- **Provider extensibility:** separate snapshot storage and synchronization from provider-specific authentication and APIs. Additional providers can be added without changing the local workflow.
- **Sync resilience:** offline retries, device management, recoverable concurrent updates, and explicit remote deletion behavior.
- **macOS support:** validate native window/workspace matching on real hardware before promising automatic grouping; package and test the app and extension bridge for macOS.
- **Linux investigation:** assess workspace detection for supported desktop environments and display systems before committing to support.
- **Quality-of-life improvements:** optional automatic snapshots, keyboard shortcuts, faster repeat save actions, and improved release/update handling.

These are roadmap items, not implemented capabilities or release commitments.

## Development environment

Develop the Windows version directly on Windows so the app can interact with the real Chrome windows and virtual desktops being tested. Docker, WSL, a virtual machine, and a Python virtual environment are not required for V1.

Planned prerequisites:

- Git and Google Chrome.
- Node.js LTS and npm for the TypeScript frontend and extension.
- Rust installed through `rustup`, using the Windows MSVC toolchain; Cargo manages Rust dependencies and builds.
- Microsoft C++ Build Tools with the **Desktop development with C++** workload and Windows SDK.
- Microsoft Edge WebView2 Runtime for Tauri's interface.

See the official [Tauri prerequisites](https://v2.tauri.app/start/prerequisites/) for installation details. Rust 1.98.1 is pinned in `rust-toolchain.toml`; rustup installs it when you run Cargo. Use Node.js 24 LTS for the same major version as CI.

The Rust toolchain and application dependency lockfiles are committed. npm installs project dependencies locally, and Cargo resolves dependencies per project, so no Python-style virtual environment is needed. A clean Windows VM may later help test installers, but is not the primary development environment.

### Repository layout

```text
apps/
  desktop/
    src/                  React interface
    src-tauri/            Rust/Tauri app and configuration
  extension/
    src/                  Chrome service worker
    manifest.json         Minimal extension manifest
    build.mjs             Extension bundling
packages/
  protocol/src/           Shared contracts, validators, and tests
.github/workflows/        Windows checks
Cargo.toml                Rust workspace and lint policy
rust-toolchain.toml        Pinned Rust compiler and tools
tsconfig.base.json        Shared strict TypeScript settings
eslint.config.mjs         Type-aware lint rules; explicit any prohibited
```

### Commands

Run from the repository root in a Windows terminal:

```sh
npm ci
npm run dev:desktop
```

`npm run dev` starts only the frontend development server at `http://127.0.0.1:1420`; `npm run dev:desktop` starts the real Tauri app and its frontend server.

```sh
npm run check
npm test
npm run build
cargo fmt --all -- --check
cargo check --workspace --locked
cargo clippy --workspace --all-targets --locked -- -D warnings
cargo test --workspace --locked
```

Run `npm run format` to format web code and documentation, and `cargo fmt --all` for Rust. After `npm run build`, load `apps/extension/dist` using **Load unpacked** in Chrome's extension developer mode. The extension currently only logs installation; it requests no browser data permissions and does not connect to the desktop app yet.

Installer bundling is disabled until the release milestone. Do not treat the development shell as a working snapshot tool.

`npm run build:desktop` creates the standalone Windows executable at `target/release/windowkeep.exe`, with the frontend embedded. Node.js and Rust are build tools and are not required to run that executable; WebView2 is a runtime prerequisite. `npm run build` builds only the frontend and extension assets.

## Contribution and commit conventions

Use Conventional Commit subjects, for example `feat: add local workspace snapshots` or `docs: document development setup`. Larger commits include bullet points in the commit body explaining meaningful changes and verification. Do not add attribution text or co-author trailers. See [AGENTS.md](AGENTS.md) for repository working instructions.

The intended distribution is source on GitHub and installers through [GitHub Releases](https://github.com/jianrontan/WindowKeep/releases). No release is available yet; a license should be selected before the first public release.
