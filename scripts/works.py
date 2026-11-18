# Writes src/works.json and the table in src/works/index.html (between <!-- works --> markers) from the list
# below: every work and video this site knows of, where each lives, and what is to confirm.
# Run after editing: python3 scripts/works.py. Sources are the numbered sources on the home page.
import json, html, os, re
os.chdir(os.path.join(os.path.dirname(__file__), '..'))
E = lambda s: html.escape(s, quote=True)
COLS = [('patreon', 'Patreon'), ('spotify', 'Spotify'), ('apple', 'Apple Music'), ('soundcloud', 'SoundCloud'), ('youtube', 'YouTube'), ('record', 'Album')]
# group, title, kind, date, places, sources, note
W = [
 ('His compositions', 'Suite #3: I. Intro, II. Sol, III. Mar, IV. Sognando Anita, I. Lua', 'suite in movements', 'tracks from 2011', ['spotify', 'apple', 'soundcloud'], '1, 7', 'Album title and year on Spotify: to confirm. SoundCloud names Intro and Sognando Anita as the 1st and 4th movements of Suite #3, and has Mar as a piano piece.'),
 ('His compositions', 'Variations on a theme', 'concert work', '2013', ['soundcloud'], '7', ''),
 ('His compositions', 'Tudo Azul', 'theme', '2023', ['soundcloud', 'youtube'], '7, 10', 'Patreon has "Suite Tudo Azul" (September 2025): whether it is the same work, to confirm.'),
 ('His compositions', 'Adeamus Sate', 'theme', '2023', ['soundcloud', 'youtube'], '7, 9, 10', 'Also sung, on the singer\'s channel. Patreon spells it "Ademus Sate" (September 2025).'),
 ('His compositions', 'Avé Maria', 'original theme, sung', 'to confirm', ['youtube'], '9', 'On the singer\'s own channel; his site plays it.'),
 ('His compositions', 'Amor Para Sempre', 'composition', 'September 2025', ['patreon'], '4', ''),
 ('His compositions', 'Journey', 'composition', 'March 2026', ['patreon'], '4', ''),
 ('His compositions', 'Magic Nocte', 'composition', 'March 2026', ['patreon'], '4', ''),
 ('His compositions', 'Fleur', 'composition', 'March 2026', ['patreon'], '4', ''),
 ('His compositions', 'Amazónia', 'composition', 'March 2026', ['patreon'], '4', ''),
 ('His compositions', 'COR, Live at café Império', 'album, composed and conducted', 'to confirm', ['record'], '8', 'Where and when, the musicians, where to hear it: to confirm.'),
 ('For the screen', 'War Flowers: WF 1M25 Next Morning, WF 2M14 Big Finale', 'film cues', '2011', ['soundcloud'], '7, 9', 'Initials match the film; his role: to confirm.'),
 ('For the screen', 'The Gauntlet: TG 2M1, TG 3M3, TG 3M10, TG 4M1', 'film cues', '2014', ['soundcloud'], '7, 9', 'Initials match the film; his role: to confirm.'),
 ('For the screen', 'The Bay: TB EP20 1M3', 'TV cue', '2011', ['soundcloud'], '7, 9', 'Initials match the series; his role: to confirm.'),
 ('For the screen', '#MyStargirlScore', 'scoring competition entry', 'to confirm', ['youtube'], '10', ''),
 ('On video', 'Separate Ways (Journey), on a Behringer Pro-800', 'synth, three cameras', '2026', ['youtube'], '2, 10', 'Explained frame by frame on this site.'),
 ('On video', 'A-Team Theme (Mike Post), on bass', 'bass', 'to confirm', ['youtube'], '10', ''),
 ('On video', 'Back To The Future; Legends Of The Fall; Gabriel\'s Oboe; Live And Let Die', 'film music, with players', 'to confirm', ['youtube'], '10', 'Who played, where and when: to confirm.'),
 ('On video', 'Star Wars; Cast Away; Palladio; Live And Let Die; James Bond Theme; Skyfall', 'film and concert music, Shorts', 'to confirm', ['youtube'], '10', 'Who played, where and when: to confirm.'),
 ('On video', 'Composing: Epic Theme; Late Night Composing; Studio Time', 'in the studio, Shorts', 'to confirm', ['youtube'], '10', ''),
]
data = {'about': 'Every work and video of Gabriel DaCruz this site knows of, where each lives, and what is still to confirm. Each work should get a page of its own (the plan in source 1); none has one yet. Read 2026-11-18.',
        'sources': 'The numbered sources at https://gabriel-dacruz.agenticcells.site/#sources',
        'works': [{'group': g, 'title': t, 'kind': k, 'date': d, 'where': [dict(COLS)[p] for p in pl], 'sources': s, 'to_confirm': n or None, 'page_on_this_site': None} for g, t, k, d, pl, s, n in W]}
json.dump(data, open('src/works.json', 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
open('src/works.json', 'a').write('\n')
rows, last = [], None
for g, t, k, d, pl, s, n in W:
    if g != last:
        rows.append(f'<tr class="grp"><th colspan="{len(COLS) + 2}" scope="rowgroup">{E(g)}</th></tr>'); last = g
    cells = ''.join(f'<td class="dot{" on" if c in pl else ""}"><span>{"●" if c in pl else ""}</span></td>' for c, _ in COLS)
    note = f'<span class="nt">{E(n)}</span>' if n else ''
    srcs = ' '.join(f'<a href="../index.html#s{x.strip()}">{x.strip()}</a>' for x in s.split(','))
    rows.append(f'<tr><th scope="row"><b>{E(t)}</b><span class="k">{E(k)} · {E(d)}</span>{note}</th>{cells}<td class="src-c"><sup class="s">{srcs}</sup></td></tr>')
head = ''.join(f'<th scope="col" class="pc"><span>{E(n)}</span></th>' for _, n in COLS)
table = (f'<!-- works --><div class="mx-wrap"><table class="mx"><caption>Where each one lives</caption><thead><tr><th scope="col">Work</th>{head}<th scope="col">Src</th></tr></thead><tbody>\n'
         + '\n'.join(rows) + '\n</tbody></table></div><!-- /works -->')
p = 'src/works/index.html'; s = open(p, encoding='utf-8').read()
s = re.sub(r'(<!-- works -->)?<div class="mx-wrap">.*?</table></div>(<!-- /works -->)?', lambda m: table, s, count=1, flags=re.S)
open(p, 'w', encoding='utf-8').write(s)
print(len(W), 'rows')
