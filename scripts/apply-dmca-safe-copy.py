# One-off content pass: removes unverifiable numeric claims and catalog promises, adds a disclaimer.
import json


def load(f):
    raw = open(f, encoding='utf-8', newline='').read()
    nl = '\r\n' if '\r\n' in raw else '\n'
    tail = raw[len(raw.rstrip('\r\n')):]
    return json.loads(raw), nl, tail


def save(f, d, nl, tail):
    open(f, 'w', encoding='utf-8', newline='').write(
        json.dumps(d, ensure_ascii=False, indent=2).replace('\n', nl) + tail)


def setp(d, path, val):
    ks = path.split('.')
    for k in ks[:-1]:
        d = d[k]
    assert ks[-1] in d or path == 'footer.disclaimer', path
    d[ks[-1]] = val


EN_DISC = ("Best IPTV Subscription is an independent service provider. We do not host, upload or own any media "
           "content, and we are not affiliated with any broadcaster, studio, league or streaming platform. All "
           "trademarks, logos and names mentioned belong to their respective owners and are used for identification "
           "only. Copyright owners can contact us through the WhatsApp or contact details on this site and we will "
           "review any notice promptly.")
FEAT3_EN = "Large catalog of TV channels, movies and series"
TRIAL_NA = ("Yes — we offer a 24-hour free trial so you can test stream quality and device compatibility before you "
            "buy. Contact us on WhatsApp to start your trial risk-free.")

T = {
    'en': {
        'common.joinCustomers': "Join our community of satisfied customers.",
        'hero.channelsLink': "thousands of TV channels",
        'pricing.liveChannels': "Wide range of live TV channels",
        'pricing.moviesSeries': "Large on-demand library of movies and series",
        'reseller.credit10Feature3': FEAT3_EN,
        'reseller.credit20Feature3': FEAT3_EN,
        'reseller.credit30Feature3': FEAT3_EN,
        'faq.freeTrial.answer': "Yes, we offer a 24-hour free trial so you can check stream quality and device compatibility before you subscribe.",
        'testimonials.description': "From crystal clear picture quality to a smooth viewing experience, see what customers say about our IPTV service.",
        'footer.disclaimer': EN_DISC,
    },
    'fr': {
        'common.joinCustomers': "Rejoignez notre communauté de clients satisfaits.",
        'hero.channelsLink': "des milliers de chaînes TV",
        'pricing.liveChannels': "Large choix de chaînes TV en direct",
        'pricing.moviesSeries': "Grande bibliothèque de films et séries à la demande",
        'reseller.credit10Feature3': "Large catalogue de chaînes TV, films et séries",
        'reseller.credit20Feature3': "Large catalogue de chaînes TV, films et séries",
        'reseller.credit30Feature3': "Large catalogue de chaînes TV, films et séries",
        'faq.freeTrial.answer': "Oui, nous offrons un essai gratuit de 24 heures pour vérifier la qualité du flux et la compatibilité de votre appareil avant de vous abonner.",
        'testimonials.description': "D'une qualité d'image cristalline à une expérience de visionnage fluide, découvrez ce que nos clients disent de notre service IPTV.",
        'footer.disclaimer': "Meilleur Abonnement IPTV est un prestataire de services indépendant. Nous n'hébergeons, ne publions et ne possédons aucun contenu multimédia, et nous ne sommes affiliés à aucun diffuseur, studio, ligue ou plateforme de streaming. Les marques, logos et noms mentionnés appartiennent à leurs propriétaires respectifs et sont utilisés à des fins d'identification uniquement. Les titulaires de droits peuvent nous contacter via les coordonnées de ce site ; nous examinerons toute demande rapidement.",
    },
    'es': {
        'common.joinCustomers': "Únete a nuestra comunidad de clientes satisfechos.",
        'hero.channelsLink': "miles de canales de TV",
        'pricing.liveChannels': "Amplia selección de canales de TV en vivo",
        'pricing.moviesSeries': "Gran biblioteca de películas y series bajo demanda",
        'reseller.credit10Feature3': "Amplio catálogo de canales de TV, películas y series",
        'reseller.credit20Feature3': "Amplio catálogo de canales de TV, películas y series",
        'reseller.credit30Feature3': "Amplio catálogo de canales de TV, películas y series",
        'faq.freeTrial.answer': "Sí, ofrecemos una prueba gratuita de 24 horas para que compruebes la calidad de la transmisión y la compatibilidad de tu dispositivo antes de suscribirte.",
        'testimonials.description': "Desde una calidad de imagen nítida hasta una experiencia de visualización fluida, descubre lo que opinan nuestros clientes sobre nuestro servicio IPTV.",
        'footer.disclaimer': "Mejor Suscripción IPTV es un proveedor de servicios independiente. No alojamos, publicamos ni poseemos ningún contenido multimedia, y no estamos afiliados a ninguna cadena, estudio, liga ni plataforma de streaming. Las marcas, logotipos y nombres mencionados pertenecen a sus respectivos propietarios y se usan solo con fines de identificación. Los titulares de derechos pueden contactarnos a través de los datos de este sitio y revisaremos cualquier solicitud con prontitud.",
    },
    'ca': {
        'common.joinCustomers': "Trusted by viewers across Canada.",
        'hero.channelsLink': "thousands of channels",
        'pricing.liveChannels': "Wide range of live TV channels",
        'pricing.moviesSeries': "Large on-demand library of movies and TV shows",
        'reseller.credit10Feature3': FEAT3_EN,
        'reseller.credit20Feature3': FEAT3_EN,
        'reseller.credit30Feature3': FEAT3_EN,
        'faq.freeTrial.answer': TRIAL_NA,
        'testimonials.description': "See why families across Canada choose our IPTV service for reliable, high-quality streaming.",
        'footer.description': "StreamPro IPTV Canada — IPTV subscription plans in CAD, 4K streaming, Firestick and Smart TV setup help, and 24/7 Canadian support.",
        'footer.disclaimer': EN_DISC.replace('Best IPTV Subscription', 'StreamPro IPTV'),
    },
    'uk': {
        'common.joinCustomers': "Trusted by viewers across the UK.",
        'hero.channelsLink': "thousands of live channels",
        'pricing.liveChannels': "Wide range of live TV channels",
        'pricing.moviesSeries': "Large on-demand library of movies and TV shows",
        'reseller.credit10Feature3': FEAT3_EN,
        'reseller.credit20Feature3': FEAT3_EN,
        'reseller.credit30Feature3': FEAT3_EN,
        'faq.freeTrial.answer': TRIAL_NA,
        'testimonials.description': "See why households across the UK choose our IPTV service for reliable, high-quality streaming in HD and 4K.",
        'footer.description': "StreamPro IPTV UK — IPTV subscription plans in GBP, 4K streaming, IPTV Smarters Pro player setup help and UK-based support.",
        'footer.disclaimer': EN_DISC.replace('Best IPTV Subscription', 'StreamPro IPTV'),
    },
}

META = {
    'en': "Premium IPTV subscription for USA and English speakers: live TV, on-demand library, 4K streaming, USD plans and a free trial. IPTV Smarters Pro on Firestick, Smart TV, Android, iOS, Windows and Mac. M3U and Xtream Codes, instant activation.",
    'fr': "Abonnement IPTV premium avec IPTV Smarters Pro : TV en direct, VOD, 4K, serveurs stables, essai gratuit. Firestick, Smart TV, Android, iOS, Windows et Mac. Liste M3U et connexion Xtream Codes. Activation instantanée.",
    'es': "Suscripción IPTV premium con IPTV Smarters Pro: TV en vivo, VOD, 4K, servidores estables, prueba gratis. Firestick, Smart TV, Android, iOS, Windows y Mac. Lista M3U y login Xtream Codes. Activación instantánea.",
    'ca': "IPTV subscription for Canada: live TV, on-demand library, 4K streaming, plans in CAD and a free trial. Setup help for Firestick and Smart TV.",
    'uk': "IPTV subscription for the UK: live TV, on-demand library, 4K streaming, plans in GBP and a free trial. IPTV Smarters Pro setup on Firestick, Smart TV and more.",
}

for l, m in T.items():
    f = f'lib/i18n/translations/{l}.json'
    d, nl, tail = load(f)
    for k, v in m.items():
        setp(d, k, v)
    save(f, d, nl, tail)
    f = f'data/metadata/{l}.json'
    d, nl, tail = load(f)
    old = d['homepage']['description']
    suffix = 'Meilleur IPTV Abonnement' if l == 'fr' and old.endswith('Meilleur IPTV Abonnement') else ''
    d['homepage']['description'] = META[l] + suffix
    save(f, d, nl, tail)
print('ok')
