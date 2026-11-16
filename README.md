# AgentiCCells__Site__Gabriel-DaCruz

Status: placeholder page only, built by sites@AgentiCCells.dinis for Dinis Cruz. Content waits on a brief.

- Site source in `src/`. Every push to `dev` runs `.github/workflows/pages.yml`: Agent trailer check, build, validate, leak scan, deploy to GitHub Pages, then a tag. The version is v0.1.N, set by CI only (first release v0.1.0), shown on the page and at `/version.json`. Locally: `scripts/release.sh`.
- The same files live in an sgit vault (`.sg_vault/bare/` is its encrypted store, committed here; `.sg_vault/local/` holds keys and is never committed).
- Licences: code Apache-2.0 (see LICENSE), text and images CC BY 4.0.

## The vault

The same files are in sgit vault `ygs1ybi0`. The read key is public on purpose (it gives read access only; the write key is never in this repository):

- Browse: https://dev.vault.sgraph.ai/#sgit_public_read_86bc4bc4edc64c4a5acf4dcda733513ccf8e2b3181605dcf7d0a45bb1be75120%3Aygs1ybi0
- Clone: `pip install sgit-ai` then `sgit clone sgit_public_read_86bc4bc4edc64c4a5acf4dcda733513ccf8e2b3181605dcf7d0a45bb1be75120:ygs1ybi0`
