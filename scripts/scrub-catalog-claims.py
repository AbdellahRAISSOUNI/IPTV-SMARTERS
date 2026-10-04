# Second content pass: replaces remaining exact catalog counts / "latest releases" promises
# in translations, metadata, layout JSON-LD and FAQ schema with generic wording.
import json, re, glob

NUM = r'\d{2,3}[,. ]?000\+?'

def en_sub(m):
    pre = m.group(0)
    return pre

def apply(s):
    # English
    s = re.sub(r'\b(?:(?:over|more than)\s+)?\+?%s(?=\s+(?:live\s+|TV\s+)?(?:channels|movies|films|on-demand|VOD|titles|TV shows))' % NUM,
               'thousands of', s)
    s = re.sub(r'\b(?:(?:Over|More than)\s+)?\+?%s(?=\s+(?:Live\s+|TV\s+)*(?:Channels|Movies|Films))' % NUM,
               'Thousands of', s)
    s = re.sub(r'\bthousands of(?= (?:live )?(?:channels|movies))', 'thousands of', s)
    # Spanish
    s = re.sub(r'\b(?:[Mm]ás de|casi)\s+\+?%s(?=\s+(?:canales|películas|series|Canales|Películas))' % NUM,
               lambda m: 'Miles de' if m.group(0)[0].isupper() else 'miles de', s)
    s = re.sub(r'\s*\((?:más de|más de) 70[,.]000\)', '', s)
    # French
    s = re.sub(r'\b(?:[Pp]lus de|près de|\+)\s*%s(?=\s+(?:chaînes|films|séries|Chaînes|Films))' % NUM,
               lambda m: 'Des milliers de' if m.group(0)[0].isupper() else 'des milliers de', s)
    s = re.sub(r'\s*\(plus de 70[,.]000\)', '', s)
    # Bare "+50,000 canales" style
    s = re.sub(r'\+%s(?=\s+(?:canales|chaînes|channels))' % NUM, 'des milliers de', s)
    return s

SPECIFIC = {
    ('es', 'features.vodMovies.description'): "Descubre una amplia biblioteca de películas bajo demanda, de todos los géneros, lista para reproducir cuando quieras.",
    ('es', 'features.vodSeries.description'): "Ponte al día con una amplia selección de series en nuestra sección bajo demanda, con nuevos episodios añadidos con regularidad, en el dispositivo que prefieras.",
    ('fr', 'features.vodMovies.description'): "Découvrez une vaste bibliothèque de films à la demande, de tous les genres, prête à être lue quand vous le souhaitez.",
    ('fr', 'features.vodSeries.description'): "Rattrapez une large sélection de séries dans notre section à la demande, avec de nouveaux épisodes ajoutés régulièrement, sur l'appareil de votre choix.",
    ('ca', 'features.vodMovies.title'): "Movies On Demand",
    ('ca', 'features.vodMovies.description'): "Browse a large on-demand library of movies, from classics to family favourites, in SD through 4K Ultra HD on your iptv for canada devices.",
    ('ca', 'features.premiumChannels.description'): "Stream a wide range of live channels with sports, news and entertainment, plus EPG and catch-up TV, for viewers across Canada.",
    ('uk', 'features.vodMovies.title'): "Movies on demand",
    ('uk', 'features.vodMovies.description'): "Browse a large library of films when you want, from classics to family picks, in HD through 4K on Fire Stick, Smart TV, or tablet via stable iptv providers.",
    ('ca', 'canadaLanding.stat1Value'): "Thousands",
    ('ca', 'canadaLanding.stat2Value'): "Huge library",
    ('uk', 'ukLanding.stat1Value'): "Thousands",
    ('uk', 'ukLanding.stat2Value'): "Huge library",
}


def walk(o, path, fn):
    if isinstance(o, dict):
        return {k: walk(v, path + [k], fn) for k, v in o.items()}
    if isinstance(o, list):
        return [walk(v, path + [str(i)], fn) for i, v in enumerate(o)]
    if isinstance(o, str):
        return fn(o)
    return o


def setp(d, path, val):
    ks = path.split('.')
    for k in ks[:-1]:
        d = d[k]
    d[ks[-1]] = val


def rewrite_json(f, lang):
    raw = open(f, encoding='utf-8', newline='').read()
    nl = '\r\n' if '\r\n' in raw else '\n'
    tail = raw[len(raw.rstrip('\r\n')):]
    d = walk(json.loads(raw), [], apply)
    for (l, p), v in SPECIFIC.items():
        if l == lang and 'translations' in f:
            try:
                setp(d, p, v)
            except KeyError:
                print('missing', l, p)
    out = json.dumps(d, ensure_ascii=False, indent=2).replace('\n', nl) + tail
    if out != raw:
        open(f, 'w', encoding='utf-8', newline='').write(out)
        print('json', f)


for l in ['en', 'fr', 'es', 'ca', 'uk']:
    rewrite_json(f'lib/i18n/translations/{l}.json', l)
    rewrite_json(f'data/metadata/{l}.json', l)

for f in ['app/layout.tsx', 'app/[locale]/layout.tsx', 'lib/seo/home-faq-schema.ts']:
    raw = open(f, encoding='utf-8', newline='').read()
    out = apply(raw)
    if out != raw:
        open(f, 'w', encoding='utf-8', newline='').write(out)
        print('text', f)
