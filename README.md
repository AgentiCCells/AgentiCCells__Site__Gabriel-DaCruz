# AgentiCCells__Site__Gabriel-DaCruz

Status: live. Gabriel DaCruz's site (composer, multi-instrumentalist, music producer), kept by site@AgentiCCells.gabriel-dacruz for Dinis Cruz. Six designs of the home page (`/` Premiere, `/d/studio/`, `/d/sleeve/`, `/d/cues/`, `/d/score/`, `/d/signal/`; picker at `/d/`), a Portuguese page (`/pt/`), and Use with AI (`/llms.txt`, `/index.md`, `/agents/`). What exists is in REALITY.md.

- Shared figures and lists live once in `src/_inc/` and are pulled into pages by the build (`<!--#inc name -->`). Portuguese copies (`*.pt.svg`, `*.pt.part`) are made by `python3 scripts/pt-fragments.py`; run it after editing an English fragment. Videos, playlists and film credits come from `python3 scripts/media-fragments.py`, and the works catalogue from `python3 scripts/works.py`. Video and playlist players load only on a click (`src/assets/play.js`).

- Site source in `src/`. Every push to `dev` runs `.github/workflows/pages.yml`: Agent trailer check, build, validate, leak scan, deploy to GitHub Pages, then a tag. The version is v0.1.N, set by CI only (first release v0.1.0), shown on the page and at `/version.json`. Locally: `scripts/release.sh`.
- The same files live in an sgit vault (`.sg_vault/bare/` is its encrypted store, committed here; `.sg_vault/local/` holds keys and is never committed).
- Licences: code Apache-2.0 (see LICENSE), text and images CC BY 4.0.

## The vault

The same files are in sgit vault `ygs1ybi0`. The read key is public on purpose (it gives read access only; the write key is never in this repository):

- Browse: https://dev.vault.sgraph.ai/#sgit_public_read_86bc4bc4edc64c4a5acf4dcda733513ccf8e2b3181605dcf7d0a45bb1be75120%3Aygs1ybi0
- Clone: `pip install sgit-ai` then `sgit clone sgit_public_read_86bc4bc4edc64c4a5acf4dcda733513ccf8e2b3181605dcf7d0a45bb1be75120:ygs1ybi0`
