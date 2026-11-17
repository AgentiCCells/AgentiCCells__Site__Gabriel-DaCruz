# REALITY.md: what exists on this site, today

A thing not written here does not exist. Kept by site@AgentiCCells.gabriel-dacruz.

## Live

- https://gabriel-dacruz.agenticcells.site, deployed from branch `dev` by `.github/workflows/pages.yml`. The version is at `/version.json`.
- Home page, English (`src/index.html`), design "The Studio". Sections: hero with key figures; 01 Separate Ways, frame by frame; 02 three cameras (Live Multicam); 03 the music (suite, Patreon compositions, videos); 04 his path, as told by Dinis; 05 lessons; 06 photo slots (empty); 07 links; 08 sources.
- Figures are inline SVG in `src/_inc/`, pulled into pages by `scripts/build.mjs` (`<!--#inc name -->`): three frames of the video, the decay and delay envelope, the Live Multicam setup, the film concert idea. Drawn for this site, CC BY 4.0; no third-party images.
- Use with AI: `src/llms.txt`, `src/index.md` (the master copy of the facts), `src/agents/index.html` (for people) and `src/agents/{visitor,gabriel,editor,questions}.md`.
- Five designs with the same facts (Dinis Cruz, 2026-11-16, "make these sites have cool 5 designs"): "The Studio" (`/`, default), "The Sleeve" (`/d/sleeve/`), "The Cue Sheet" (`/d/cues/`), "The Score" (`/d/score/`), "The Signal Chain" (`/d/signal/`). Picker with screenshots at `/d/` (`src/assets/designs/*.jpg`, regenerate when a design changes); listed in `src/designs.json`; a bar on each design switches between them.
- Gabriel's own photos in `src/assets/photos/` (supplied by Dinis Cruz, 2026-11-16; metadata stripped): studio with bass (hero, square crop), studio desk, portrait, the cover of COR. Rights stay Gabriel's; the site says ask before reuse.
- New facts, sourced: the album COR, Live at café Império ("music composed and conducted by Gabriel DaCruz", from its cover); his SoundCloud (two 2023 themes; the Media playlist of film and TV cues, 2011 to 2014), read 2026-11-16.
- From the ideas in Dinis's brief (2026-11-16, "the ideas on .../a-website-for-my-brother"): a home section "How this site grows" (EN and PT) with a drawing of own the masters, a page per work, a copy per platform, marked plan; `/works/` and `works.json`, the twenty works known so far and where each lives (none has its own page yet); `/status/`, the public page of how the site is run and what waits for Gabriel.
- Link previews (Dinis Cruz, 2026-11-17, WhatsApp showed no image): every page has canonical, Open Graph and Twitter card tags (between `<!-- share -->` markers) pointing at `src/assets/share/gabriel-dacruz-1200x630.jpg` (118 KB, made from his studio photo). `scripts/validate.mjs` now fails a page without them, or with an image that is not absolute https, not in the site, or over 300 KB.
- Portuguese page (`src/pt/index.html`) in "The Studio" design, with Portuguese copies of the figures and lists (`src/_inc/*.pt.*`, made by `scripts/pt-fragments.py`). The other designs and the agent files are English only.

## Not yet (proposed and approved by Dinis Cruz, 2026-11-16 ~21:40 UTC, relayed by cells@AgentiCCells.dinis)

- New screenshots and description for the hub entry (to be sent to hub@AgentiCCells.dinis).

## Waiting for Gabriel (through Dinis)

- A direct link to the Separate Ways video (the site links his YouTube channel meanwhile).
- Whether the guitar lesson photo (Gabriel with a second, young person) may be published: held back until Dinis confirms that person, or a parent, agreed.
- Everything marked "to confirm" or "as told by Dinis": the band's name and years, the school, the Lisbon concert's name, venue and dates, the award in his Instagram bio, the Spotify album's title and year, who played on each video.

## Decisions (Dinis Cruz, 2026-11-16 ~21:40 UTC, relayed by cells@)

- Audience numbers (followers, subscribers, plays) are left out.
- The reading meter and "sellable units" are out of scope.

## Sources read for this site (16 November 2026)

- https://newsroom.sgit.ai/articles/a-website-for-my-brother.md (published 2026-11-01)
- https://newsroom.sgit.ai/articles/four-iphones-and-an-ipad.md (published 2026-11-02)
- https://newsroom.sgit.ai/articles/separate-ways-explained.md (published 2026-11-02)
- https://newsroom.sgit.ai/articles/sellable-units.md (published 2026-11-02; context only, nothing from it is on the site)
- https://yiheng-wang.agenticcells.site/ and its index.md, llms.txt and /agents/ (the model for the treatment)

## Dinis's words for this work

- 2026-11-16 ~21:35 UTC: "can you also start a separate session here to do the same design threatment to https://hub.agenticcells.site/cells/gabriel-dacruz/ (see the articles I wrote on newsroom.sgit.ai about Gabriel , who is my brother)"
- 2026-11-16 ~21:30 UTC (relayed): "we want that site to have the same type of different designs and explanations and infographics as https://yiheng-wang.agenticcells.site/"
- 2026-11-16 ~21:40 UTC (relayed): "can you continue with the proposed plan"
