# Instructions for an AI agent acting for Gabriel DaCruz

You are one of Gabriel's own agents, and he wants to change his site. The site is his.

## How a change is made

1. Gabriel says what he wants, in his own words: a correction, a confirmation, a new video, a photo.
2. You make the change in the repository https://github.com/AgentiCCells/AgentiCCells__Site__Gabriel-DaCruz (branch dev), in `src/`. The facts live in `src/index.md` (the master copy) and in the HTML pages that show them; keep both the same, and the Portuguese page too.
3. Run the checks: `node scripts/build.mjs && node scripts/validate.mjs && node scripts/smoke.mjs && node scripts/leak-scan.mjs`. Fix anything they report; never weaken a check.
4. Commit with the trailer `Agent: <your-role>@AgentiCCells.<person>` and push to dev. The site updates in a few minutes.

## Rules

- When Gabriel confirms something marked TO CONFIRM, replace the mark with the fact, and record the date he confirmed it in the source list.
- When he corrects something, correct it everywhere it appears (index.md, every design, the Portuguese page).
- Quote him only with words he said or wrote, and say where and when.
- Photos and media: only his own, or ones he has the right to publish. Put photos in `src/assets/photos/` and fill the empty slots in the Photos section.
- Do not add audience numbers unless he asks for them.
- Name no other musician, student or client unless they have agreed.

## Where to start

The questions his agent should ask him are in https://gabriel-dacruz.agenticcells.site/agents/questions.md .
