# Makes the Portuguese copies of the shared fragments in src/_inc/ (name.pt.svg, name.pt.part)
# from the English ones, changing only the text, so the drawings stay identical.
# Run after editing an English fragment: python3 scripts/pt-fragments.py
# Fails if an English string it expects has changed, so a translation is never silently lost.
import sys, os
os.chdir(os.path.join(os.path.dirname(__file__), '..', 'src', '_inc'))
tr = {
'fig-three-frames.svg': [
 ('One take of Separate Ways, seen from three cameras','Um só take de Separate Ways, visto de três câmaras'),
 ("A drawing of the layout of Gabriel's synth video: three stacked frames of the same take. Top, the small keyboard from above. Middle, Gabriel at the desk, with the mixing console, the screen and the rack behind him. Bottom, close on the synthesizer's panel, where near the end his hand turns the decay down.",
  "Desenho da composição do vídeo de sintetizador do Gabriel: três imagens do mesmo take, empilhadas. Em cima, o pequeno teclado visto de cima. Ao meio, o Gabriel à secretária, com a mesa de mistura, o ecrã e o rack atrás. Em baixo, o painel do sintetizador, onde perto do fim a mão dele baixa o decay."),
 ('decay down: each chord goes staccato','decay em baixo: cada acorde fica staccato'),
 ('1 · the keyboard, from above','1 · o teclado, visto de cima'),
 ('2 · Gabriel at the desk','2 · o Gabriel à secretária'),
 ("3 · the synthesizer's panel",'3 · o painel do sintetizador'),
 ('width="186" height="26"','width="200" height="26"'),
 ('width="212" height="26"','width="222" height="26"'),
],
'fig-envelope.svg': [
 ('The trick at the end: decay turned down, and the delay repeats the short chord','O truque do fim: decay em baixo, e o delay repete o acorde curto'),
 ('Two rows, loudness over time. Top: with a long decay, a chord rings and fades slowly. Bottom: with the decay turned down, the chord stops almost at once, staccato, and the delay plays it back several times, each repeat softer than the last. An illustration of the technique, not a measurement.',
  'Duas linhas, volume ao longo do tempo. Em cima: com um decay longo, o acorde soa e desvanece devagar. Em baixo: com o decay em baixo, o acorde para quase logo, staccato, e o delay repete-o várias vezes, cada repetição mais suave. Uma ilustração da técnica, não uma medição.'),
 ('Decay long: each chord rings','Decay longo: cada acorde soa'),
 ('Decay turned down: staccato, then the delay repeats it','Decay em baixo: staccato, e o delay repete-o'),
 ('>chord<','>acorde<'),('>repeat<','>repete<'),('time →','tempo →'),
],
'fig-multicam.svg': [
 ('Three old iPhones, one iPad, one Mac: how the three angles were filmed','Três iPhones antigos, um iPad, um Mac: como foram filmados os três ângulos'),
 ("Three iPhones bought second-hand, two iPhone 12s and an iPhone 13, each running the free Final Cut Camera app, connect wirelessly to an iPad running Final Cut Pro. The iPad shows every angle live, controls each camera and records them in sync; its own camera can be a fourth angle. Each phone also records its own full-quality file, which transfers to the iPad afterwards. The project then moves to Final Cut Pro on the Mac for the edit.",
  "Três iPhones comprados em segunda mão, dois iPhone 12 e um iPhone 13, cada um com a app gratuita Final Cut Camera, ligam-se sem fios a um iPad com o Final Cut Pro. O iPad mostra todos os ângulos em direto, controla cada câmara e grava-os sincronizados; a câmara do próprio iPad pode ser um quarto ângulo. Cada telefone grava também o seu ficheiro em qualidade total, que passa depois para o iPad. O projeto segue para o Final Cut Pro no Mac para a montagem."),
 ('each runs Final Cut Camera, a free app','cada um corre o Final Cut Camera, uma app gratuita'),
 ('>wireless<','>sem fios<'),
 ('>angle 1<','>ângulo 1<'),('>angle 2<','>ângulo 2<'),('>angle 3<','>ângulo 3<'),
 ('>iPad camera<','>câmara do iPad<'),('>optional 4th<','>4.º opcional<'),
 ('Final Cut Pro for iPad: every angle live, in sync','Final Cut Pro para iPad: todos os ângulos em direto'),
 ('Final Cut Pro on the Mac: the edit','Final Cut Pro no Mac: a montagem'),
],
'fig-film-concert.svg': [
 ('Film music played live, in time with the film on a screen','Música de cinema tocada ao vivo, a tempo com o filme num ecrã'),
 ('A drawing of the idea of the Lisbon concert as Dinis describes it: a screen showing the film above the stage, an orchestra in arcs below it, and the conductor in front, keeping the music in time with the picture. Not a drawing of the real hall; its name, venue and dates wait for Gabriel.',
  'Desenho da ideia do concerto de Lisboa, tal como o Dinis o descreve: um ecrã com o filme por cima do palco, a orquestra em arcos por baixo e o maestro à frente, a manter a música a tempo com a imagem. Não é um desenho da sala real; o nome, o local e as datas esperam pelo Gabriel.'),
 ('>the film<','>o filme<'),('>the orchestra<','>a orquestra<'),('>the conductor<','>o maestro<'),
 ('>in time with<','>a tempo com<'),('>the picture<','>a imagem<'),
],
'chain.part': [
 ("<b>Keyboard</b><span>A small Bluetooth MIDI keyboard, no cable. The one in the video matches CME's Xkey Air.</span>",'<b>Teclado</b><span>Um pequeno teclado MIDI Bluetooth, sem cabo. O do vídeo corresponde ao Xkey Air da CME.</span>'),
 ('<span>An eight-voice reproduction of the Sequential Prophet-600 from 1982.</span>','<span>Uma reprodução de oito vozes do Sequential Prophet-600, de 1982.</span>'),
 ('<span>To widen the sound, as on the 1983 record.</span>','<span>Para alargar o som, como no disco de 1983.</span>'),
 ('<span>To repeat it. At the end it repeats the short chords.</span>','<span>Para o repetir. No fim, repete os acordes curtos.</span>'),
],
'works.part': [('September 2025','setembro de 2025'),('March 2026','março de 2026')],
'videos.part': [
 ("Journey's riff on a Behringer Pro-800, one take, three cameras. Explained on this page.","O riff dos Journey num Behringer Pro-800, um take, três câmaras. Explicado nesta página."),
 ('His channel <span class="tbc">video link to come</span>','O canal dele <span class="tbc">link do vídeo a seguir</span>'),
 ('<p>Played by an orchestra.</p>','<p>Tocado por uma orquestra.</p>'),
 ('<h3>The A-Team theme</h3>','<h3>O tema de A-Team</h3>'),
 ("<p>Mike Post's theme, played on bass.</p>",'<p>O tema de Mike Post, tocado no baixo.</p>'),
 ('<p>His entry to the DC Stargirl scoring competition.</p>','<p>A sua participação no concurso de banda sonora DC Stargirl.</p>'),
 ('Watch on YouTube','Ver no YouTube'),
],
'sources.part': [
 ("A website for my brother</a>, by Dinis Cruz, SGit Newsroom, 1 November 2026. Dinis's account of Gabriel's work (the band, the school, the studio, the Lisbon concert), and Gabriel's public pages as read on 1 and 2 November 2026. Read for this site on 16 November 2026.",
  'A website for my brother</a> (em inglês), de Dinis Cruz, SGit Newsroom, 1 de novembro de 2026. O relato do Dinis sobre o trabalho do Gabriel (a banda, a escola, o estúdio, o concerto de Lisboa) e as páginas públicas do Gabriel, lidas a 1 e 2 de novembro de 2026. Lido para este site a 16 de novembro de 2026.'),
 ("Separate Ways, explained</a>, by Dinis Cruz, SGit Newsroom, 2 November 2026. Gabriel's own explanation of his synth video, recorded on 2 November 2026, with the model names, the protocol and the record checked against public sources. Read 16 November 2026.",
  'Separate Ways, explained</a> (em inglês), de Dinis Cruz, SGit Newsroom, 2 de novembro de 2026. A explicação do próprio Gabriel sobre o seu vídeo de sintetizador, gravada a 2 de novembro de 2026, com os modelos, o protocolo e o disco verificados em fontes públicas. Lido a 16 de novembro de 2026.'),
 ("Four iPhones and an iPad</a>, by Dinis Cruz, SGit Newsroom, 2 November 2026. How the three angles were filmed, as Gabriel described it, checked against Apple's documentation. Read 16 November 2026.",
  'Four iPhones and an iPad</a> (em inglês), de Dinis Cruz, SGit Newsroom, 2 de novembro de 2026. Como foram filmados os três ângulos, tal como o Gabriel descreveu, verificado na documentação da Apple. Lido a 16 de novembro de 2026.'),
 ('His Patreon</a>: the seven compositions and their months, as recorded in source 1.','O Patreon dele</a>: as sete composições e os meses, como registado na fonte 1.'),
 ('His YouTube channel, @gabrieldacruz_composer</a>: the videos on this page, as recorded in sources 1 and 2.','O canal de YouTube, @gabrieldacruz_composer</a>: os vídeos desta página, como registado nas fontes 1 e 2.'),
 ('His Instagram, @gabrieldacruz_composer</a>: how he describes himself, and his invitation to message him about lessons, as recorded in source 1.','O Instagram, @gabrieldacruz_composer</a>: como se descreve e o convite para lhe escreverem sobre aulas, como registado na fonte 1.'),
],
}
for name, pairs in tr.items():
    s = open(name, encoding='utf-8').read()
    for en, pt in pairs:
        if en not in s:
            sys.exit(f'pt-fragments: "{en[:60]}" is no longer in {name}; update the translation')
        s = s.replace(en, pt)
    out = name.replace('.svg', '.pt.svg').replace('.part', '.pt.part')
    open(out, 'w', encoding='utf-8').write(s)
    print('wrote', out)
