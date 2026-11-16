# REALITY.md: what exists on this site, today

A thing not written here does not exist. Kept by site@AgentiCCells.gabriel-dacruz.

## Live

- https://gabriel-dacruz.agenticcells.site, deployed from branch `dev` by `.github/workflows/pages.yml`. The version is at `/version.json`.
- Home page, English (`src/index.html`), design "The Studio". Sections: hero with key figures; 01 Separate Ways, frame by frame; 02 three cameras (Live Multicam); 03 the music (suite, Patreon compositions, videos); 04 his path, as told by Dinis; 05 lessons; 06 photo slots (empty); 07 links; 08 sources.
- Figures are inline SVG in `src/_inc/`, pulled into pages by `scripts/build.mjs` (`<!--#inc name -->`): three frames of the video, the decay and delay envelope, the Live Multicam setup, the film concert idea. Drawn for this site, CC BY 4.0; no third-party images.
- Use with AI: `src/llms.txt`, `src/index.md` (the master copy of the facts), `src/agents/index.html` (for people) and `src/agents/{visitor,gabriel,editor,questions}.md`.
- Portuguese page (`src/pt/index.html`): still the earlier first pass, on `src/pt/legacy.css` until it is redone.

## Not yet (proposed and approved by Dinis Cruz, 2026-11-16 ~21:40 UTC, relayed by cells@AgentiCCells.dinis)

- Alternative designs under `/d/`.
- Portuguese page in the new design.
- New screenshots and description for the hub entry (to be sent to hub@AgentiCCells.dinis).

## Waiting for Gabriel (through Dinis)

- A direct link to the Separate Ways video (the site links his YouTube channel meanwhile).
- His own photos (four empty slots on the home page).
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
