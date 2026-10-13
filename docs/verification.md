# Verification and release notes

Release: 0.1.0, 2026-10-13. Fictional local retrieval demonstration. No live AI model connected.

## Checks

- Seven model tests: sample query source IDs, exact corpus provenance, blank/unsupported input, all-term matching, collection isolation, malformed session fallback and valid session retention.
- Production TypeScript/Vite build.
- Headless Microsoft Edge browser checks: source dialog/exact excerpt, Escape focus return, no-match outcome, support draft creation/edit/Reviewed status, reload persistence and library filtering.
- Viewport widths 320, 390, 1440 and 1920: no page-level horizontal overflow across all three workspace views.
- Long query (500 characters) and draft notes (4000 characters) do not overflow at mobile width.
- Mobile reset, reset cancellation, visible draft-limit enforcement and explicit deletion.
- Browser-storage failure warning.
- No page errors or unexpected external browser requests observed.
- Desktop and mobile screenshots visually inspected. Logo rendered locally.
- Read-only sidecar review found silent draft truncation and missing retrieval announcements; both corrected before release.

## Scope limits

No live AI accuracy, delivery, production authentication or backend behavior is claimed or tested. This is a lexical retrieval demo, not semantic question answering. No real data, public release or paid integrations. Automated accessibility checks cover dialog focus and status wiring, not a full assistive-technology audit. Testing used Edge on this Windows machine; other browsers are not verified.

The delivery includes the source, lockfile, built assets, standalone server, screenshots and browser report. Dependencies and Git/cache folders are excluded. Development preview remains local at port 5177; packaged build defaults to port 5178.
