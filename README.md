# AgentiCCells__Site__Gabriel-DaCruz

Status: placeholder page only, built by sites@AgentiCCells.dinis for Dinis Cruz. Content waits on a brief.

- Site source in `src/`. Every push to `dev` runs `.github/workflows/pages.yml`: Agent trailer check, build, validate, leak scan, deploy to GitHub Pages, then a tag. The version is v0.1.N, set by CI only (first release v0.1.0), shown on the page and at `/version.json`. Locally: `scripts/release.sh`.
- The same files live in an sgit vault (`.sg_vault/bare/` is its encrypted store, committed here; `.sg_vault/local/` holds keys and is never committed).
- Licences: code Apache-2.0 (see LICENSE), text and images CC BY 4.0.
