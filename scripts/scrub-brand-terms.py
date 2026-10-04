# One-off scrub: replaces third-party sports-property / platform names with generic wording in
# user-visible strings and drops keyword-list entries that target them.
import json, re, glob

RULES = [
    (r'NHL, NFL, NBA, MLB, and PPV events', 'major live sports events'),
    (r'NHL, NFL, NBA, MLB', 'major sports'),
    (r'Premier League, Champions League, rugby, cricket, and PPV nights', 'football, rugby, cricket and live event nights'),
    (r'Premier League,? (&|and) Champions League', 'live football'),
    (r'Premier League, Champions League', 'football'),
    (r'Premier League', 'football'),
    (r'Champions League', 'football'),
    (r'Premium PPV events included', 'Live event streaming supported'),
    (r'sports and PPV', 'live sports and events'),
    (r'\bPPV\b', 'live event'),
    (r'Netflix or YouTube', 'other streaming apps'),
    (r'the 2026 FIFA World Cup', 'major live sports events'),
    (r'2026 FIFA World Cup', 'live sports events'),
    (r'FIFA World Cup 2026', 'live sports'),
    (r'World Cup', 'live sports'),
    (r'\bNFL\b|\bNBA\b|\bUFC\b', 'live sports'),
]


def scrub(s):
    for pat, rep in RULES:
        s = re.sub(pat, rep, s, flags=re.I if pat[0].isupper() and len(pat) > 6 else 0)
    return s


def walk(o):
    if isinstance(o, dict):
        return {k: walk(v) for k, v in o.items()}
    if isinstance(o, list):
        return [walk(v) for v in o]
    if isinstance(o, str):
        return scrub(o)
    return o


def rewrite_json(f):
    raw = open(f, encoding='utf-8', newline='').read()
    nl = '\r\n' if '\r\n' in raw else '\n'
    tail = raw[len(raw.rstrip('\r\n')):]
    d = json.loads(raw)
    n = json.dumps(walk(d), ensure_ascii=False, indent=2).replace('\n', nl) + tail
    if n != raw:
        open(f, 'w', encoding='utf-8', newline='').write(n)
        print('json', f)


for f in glob.glob('lib/i18n/translations/*.json') + glob.glob('data/metadata/*.json') + ['data/links/en.json']:
    rewrite_json(f)

TERMS = re.compile(r'world cup|\bnfl\b|\bnba\b|\bufc\b|premier league|champions league|\bppv\b|netflix|\bhbo\b|\bespn\b|\bdazn\b|sky sports|disney', re.I)
ITEM = re.compile(r'^\s*"[^"]*"\s*,?\s*$')

for f in ['lib/seo/site-keywords.ts', 'lib/seo/uk-hub.ts', 'lib/seo/uk-trending-keywords.ts']:
    raw = open(f, encoding='utf-8', newline='').read()
    lines = raw.split('\n')
    out = [l for l in lines if not (ITEM.match(l.rstrip('\r')) and TERMS.search(l))]
    if len(out) != len(lines):
        open(f, 'w', encoding='utf-8', newline='').write('\n'.join(out))
        print('ts', f, len(lines) - len(out), 'lines removed')

# FAQ schema + testimonials + uk hub json: plain text rewrite
for f in ['lib/seo/home-faq-schema.ts', 'components/TestimonialsSection.tsx', 'data/seo/uk-hub-visible.json']:
    raw = open(f, encoding='utf-8', newline='').read()
    n = scrub(raw)
    if n != raw:
        open(f, 'w', encoding='utf-8', newline='').write(n)
        print('text', f)
