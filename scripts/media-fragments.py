# Writes the shared media fragments in src/_inc/ (videos, SoundCloud, film credits), English and Portuguese,
# from the lists below. Every item names where it was read. Run after editing: python3 scripts/media-fragments.py
# Videos: his own uploads on YouTube (@gabrieldacruz_composer), titles as he gave them, read 2026-11-18,
# plus two original themes on the singer's own channel, embedded on his own site gabrieldacruz.com.
import os, html
os.chdir(os.path.join(os.path.dirname(__file__), '..', 'src', '_inc'))
E = lambda s: html.escape(s, quote=True)

# (id, title, kind: 'v' video | 's' short, note EN, note PT, still: True if we hold his still in /assets/video/)
GROUPS = [
 ('own', 'His own music', 'A sua própria música', None, None, [
   ('rivD-YULfXw', 'Tudo Azul', 's', 'his theme', 'o seu tema', True),
   ('1LyqwT7acl8', 'Adeamus Sate', 's', 'his theme', 'o seu tema', True),
   ('ySRlos-Gp40', 'Composing: Epic Theme', 's', 'in the studio', 'no estúdio', True),
   ('pBpB-GJ3hbg', 'Late Night Composing', 's', 'in the studio', 'no estúdio', True),
   ('gH_dIqt7M4c', 'Studio Time', 's', 'in the studio', 'no estúdio', True),
 ]),
 ('sung', 'His themes, sung', 'Os seus temas, cantados',
  'Two original themes by Gabriel, on the singer\'s own channel; his site plays both.',
  'Dois temas originais do Gabriel, no canal da cantora; o site dele mostra os dois.', [
   ('7G__viPsJKc', 'Avé Maria', 'v', 'original theme by Gabriel', 'tema original do Gabriel', False),
   ('dtPpb1t8ILA', 'Adeamus Sate', 'v', 'original theme by Gabriel', 'tema original do Gabriel', False),
 ]),
 ('film', 'Film and concert music, with players', 'Música de cinema e de concerto, com músicos', None, None, [
   ('PQUijA_qB-U', 'Back To The Future', 'v', 'Alan Silvestri', 'Alan Silvestri', True),
   ('_qzkIR4og1Q', 'Legends Of The Fall', 'v', 'James Horner', 'James Horner', True),
   ('_9RTtTHjrC8', "Gabriel's Oboe", 'v', 'from his channel', 'do canal dele', True),
   ('EbaH_Nekjzs', 'Live And Let Die', 'v', 'played by an orchestra', 'tocado por uma orquestra', True),
   ('1cDfGj1j4YQ', 'Star Wars', 's', 'string orchestra', 'orquestra de cordas', True),
   ('Yl6q7b2GHQk', 'Cast Away', 's', 'Alan Silvestri', 'Alan Silvestri', True),
   ('7e1Ai5RMVPw', 'Palladio', 's', 'Karl Jenkins', 'Karl Jenkins', True),
   ('4Qn26tSNEN0', 'Live And Let Die', 's', 'James Bond', 'James Bond', True),
   ('dOWbZQo_psg', 'James Bond Theme', 's', 'from his channel', 'do canal dele', True),
   ('i0P3lExj_A8', 'Skyfall', 's', 'James Bond', 'James Bond', True),
 ]),
 ('synth', 'Synth and bass', 'Sintetizador e baixo', None, None, [
   ('HM1fslJnusk', 'Separate Ways', 's', 'Journey, on a Behringer Pro-800, three cameras', 'Journey, num Behringer Pro-800, três câmaras', True),
   ('9mHskorwbZg', 'A-Team Theme', 's', 'Mike Post, on bass', 'Mike Post, no baixo', True),
   ('-b0V2kDIiFo', '#MyStargirlScore', 'v', 'his entry to the DC Stargirl scoring competition', 'a sua participação no concurso DC Stargirl', False),
 ]),
]

def card(vid, title, kind, note, pt, still):
    cls = 'vc short' if kind == 's' else 'vc'
    href = f'https://www.youtube.com/{"shorts/" + vid if kind == "s" else "watch?v=" + vid}'
    if still:
        w, h = (360, 640) if kind == 's' else (480, 270)
        thumb = f'<img src="/assets/video/{vid}.jpg" width="{w}" height="{h}" alt="" loading="lazy">'
    else:
        thumb = f'<span class="vposter">{E(title)}<small>{"tema original" if pt else "original theme"}</small></span>' if 'original' in note or 'original' in note.lower() else f'<span class="vposter">{E(title)}<small>{"vídeo" if pt else "video"}</small></span>'
    lab = ('short' if kind == 's' else 'vídeo' if pt else 'video')
    return (f'<a class="{cls}" href="{href}" data-yt="{vid}" data-title="{E(title)}, {E(note)}">'
            f'<span class="vthumb">{thumb}<span class="vplay"></span><span class="vlen">{lab}</span></span>'
            f'<span class="vbody"><span class="vt">{E(title)}</span><span class="vs">{E(note)}</span></span></a>')

def videos(pt):
    out = ['<div class="vids">']
    for gid, en, ptn, ven, vpt, items in GROUPS:
        tall = all(k == 's' for _, _, k, *_ in items)
        mixed_v = [i for i in items if i[2] == 'v']; mixed_s = [i for i in items if i[2] == 's']
        out.append(f'<div class="vgroup" id="v-{gid}"><h4>{E(ptn if pt else en)}</h4>')
        if (vpt if pt else ven): out.append(f'<p class="vnote">{E(vpt if pt else ven)}</p>')
        if mixed_v: out.append('<div class="rail wide">' + ''.join(card(v, t, k, (npt if pt else nen), pt, st) for v, t, k, nen, npt, st in mixed_v) + '</div>')
        if mixed_s: out.append('<div class="rail tall">' + ''.join(card(v, t, k, (npt if pt else nen), pt, st) for v, t, k, nen, npt, st in mixed_s) + '</div>')
        out.append('</div>')
    out.append('<p class="scnote">' + ('Toque para ver aqui; nada carrega do YouTube antes disso. Títulos como ele os deu, no canal <a href="https://www.youtube.com/@gabrieldacruz_composer">@gabrieldacruz_composer</a>, lidos a 18 de novembro de 2026.<sup class="s"><a href="#s10">10</a></sup>' if pt else
               'Press play to watch here; nothing loads from YouTube before that. Titles as he gave them on <a href="https://www.youtube.com/@gabrieldacruz_composer">@gabrieldacruz_composer</a>, read 18 November 2026.<sup class="s"><a href="#s10">10</a></sup>') + '</p>')
    out.append('</div>')
    return '\n'.join(out)

FILM = [('WF 2M14', 'Big Finale', '2011'), ('WF 1M25', 'Next Morning', '2011'), ('TG 2M1', 'V1.00', '2014'), ('TG 4M1', 'V1.03', '2014'), ('TG 3M10', 'V1.02', '2014')]
WORKS = [('Suite #3, 4th movement', 'Sognando Anita', '2011'), ('Mar', 'piano', '2011'), ('Suite #3, 1st movement', 'Intro', '2011'), ('Variations on a theme', '', '2013')]
WORKS_PT = [('Suite #3, 4.º andamento', 'Sognando Anita', '2011'), ('Mar', 'piano', '2011'), ('Suite #3, 1.º andamento', 'Intro', '2011'), ('Variations on a theme', '', '2013')]

def scl(pt):
    def box(title, when, rows, sc_id, more):
        lis = ''.join(f'<li><b>{E(a)}</b><span>{E(b + " · " if b else "")}{E(c)}</span></li>' for a, b, c in rows)
        btn = ('Ouvir aqui' if pt else 'Play here')
        return (f'<div class="scbox"><h4>{E(title)}</h4><p class="when">{E(when)}</p><ol>{lis}</ol>'
                f'<a class="scplay" href="https://soundcloud.com/gabriel-da-cruz/sets/{more}" data-sc="{sc_id}" data-title="{E(title)}, Gabriel DaCruz, SoundCloud">{btn}</a></div>')
    a = box('Film' if not pt else 'Cinema', ('Cues de cinema, 2011 e 2014' if pt else 'Film cues, 2011 and 2014'), FILM, '1074892', 'wf')
    b = box('Works' if not pt else 'Obras', ('Obras de concerto, 2011 a 2013' if pt else 'Concert works, 2011 to 2013'), WORKS_PT if pt else WORKS, '86608981', 'works')
    note = ('As duas playlists que o site dele toca, como aparecem no SoundCloud a 18 de novembro de 2026. A playlist de cinema tem mais quatro faixas que o SoundCloud não mostra publicamente. "1M25" é como a música de cinema dá nome a um cue: rolo 1, cue 25.' if pt else
            'The two playlists his own site plays, as SoundCloud lists them on 18 November 2026. The film playlist holds four more tracks SoundCloud does not show publicly. "1M25" is how film music names a cue: reel 1, cue 25.')
    return f'<div class="scl">{a}{b}</div>\n<p class="scnote">{note}<sup class="s"><a href="#s7">7</a></sup></p>'

def films(pt):
    # Posters as shown on his own site; Gabriel agreed to their use here (through Dinis, 2026-11-18).
    T = [('bay', 'The Bay', 'TB', ['TB EP20 1M3'], 'Série', 'Series', 'the-bay', 214, 322),
         ('war', 'War Flowers', 'WF', ['WF 1M25', 'WF 2M14'], 'Filme', 'Film', 'war-flowers', 464, 600),
         ('gauntlet', 'The Gauntlet', 'TG', ['TG 2M1', 'TG 3M3', 'TG 3M10', 'TG 4M1'], 'Filme', 'Film', 'the-gauntlet', 530, 776)]
    cards = []
    for cls, name, ini, cues, kpt, ken, img, w, h in T:
        alt = (f'Cartaz de {name}' if pt else f'Poster for {name}')
        c = ('cues no SoundCloud dele: ' if pt else 'his cues on SoundCloud: ') + ini
        cards.append(f'<figure class="tcard poster {cls}"><img src="/assets/posters/{img}.jpg" width="{w}" height="{h}" alt="{E(alt)}" loading="lazy">'
                     f'<figcaption><span class="tk">{E(kpt if pt else ken)}</span><span class="tn">{E(name)}</span>'
                     f'<span class="tc">{E(c)}</span><span class="tcues">' + ''.join(f'<span>{E(q)}</span>' for q in cues) + '</span></figcaption></figure>')
    note = ('Os cartazes das três produções com que o site dele abre, mostrados aqui com o acordo do Gabriel; pertencem às respetivas produções. Os seus cues no SoundCloud estão marcados com as iniciais TB, WF e TG; o papel exato em cada produção está <span class="tbc">a confirmar</span>.' if pt else
            'The posters of the three productions his own site opens with, shown here with Gabriel\'s agreement; each belongs to its production. His SoundCloud cues carry the initials TB, WF and TG; his exact role on each is <span class="tbc">to confirm</span>.')
    imdb = '<a class="imdb" href="https://www.imdb.com/name/nm4704147/">IMDb</a>'
    return f'<div class="credits">{"".join(cards)}</div>\n<p class="scnote">{note}<sup class="s"><a href="#s9">9</a></sup> {imdb}</p>'

for pt in (False, True):
    sfx = '.pt.part' if pt else '.part'
    open('videos' + sfx, 'w', encoding='utf-8').write(videos(pt) + '\n')
    open('scl' + sfx, 'w', encoding='utf-8').write(scl(pt) + '\n')
    open('films' + sfx, 'w', encoding='utf-8').write(films(pt) + '\n')
    print('wrote videos, scl, films' + sfx)
