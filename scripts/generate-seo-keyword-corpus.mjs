/**
 * Builds locale-specific IPTV keyword expansions (2000 unique strings per locale = 6000 total).
 * Run: node scripts/generate-seo-keyword-corpus.mjs
 * Output: data/seo/keyword-corpus.json
 *
 * The corpus is for project-wide SEO vocabulary (meta, content planning, internal tooling).
 * Do not paste the entire array into a single page body — that is keyword stuffing.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "..", "data", "seo", "keyword-corpus.json");
const TARGET = 2000;

const countriesEn = [
  "United States", "United Kingdom", "Canada", "Australia", "Germany", "France", "Italy", "Spain",
  "Netherlands", "Belgium", "Switzerland", "Austria", "Portugal", "Ireland", "Sweden", "Norway",
  "Denmark", "Finland", "Poland", "Romania", "Greece", "Czech Republic", "Hungary", "Croatia",
  "Serbia", "Bulgaria", "Slovakia", "Slovenia", "Lithuania", "Latvia", "Estonia", "Ukraine",
  "Turkey", "Israel", "UAE", "Saudi Arabia", "Qatar", "Kuwait", "Bahrain", "Oman", "Jordan",
  "Lebanon", "Egypt", "Morocco", "Algeria", "Tunisia", "South Africa", "Nigeria", "Kenya",
  "Ghana", "India", "Pakistan", "Bangladesh", "Sri Lanka", "Philippines", "Thailand", "Vietnam",
  "Indonesia", "Malaysia", "Singapore", "Japan", "South Korea", "China", "Taiwan", "Hong Kong",
  "New Zealand", "Mexico", "Brazil", "Argentina", "Colombia", "Chile", "Peru", "Venezuela",
  "Ecuador", "Uruguay", "Paraguay", "Bolivia", "Costa Rica", "Panama", "Guatemala", "Honduras",
  "Dominican Republic", "Puerto Rico", "Jamaica", "Cuba", "Trinidad and Tobago", "Russia",
  "Kazakhstan", "Georgia", "Armenia", "Azerbaijan", "Iceland", "Luxembourg", "Malta", "Cyprus",
  "North Macedonia", "Albania", "Bosnia and Herzegovina", "Montenegro", "Moldova", "Belarus",
  "Iraq", "Iran", "Afghanistan", "Nepal", "Myanmar", "Cambodia", "Laos", "Mongolia", "Fiji",
  "Papua New Guinea", "Bahamas", "Barbados", "Guyana", "Suriname", "Belize", "El Salvador",
  "Nicaragua", "Haiti", "Senegal", "Ivory Coast", "Cameroon", "Uganda", "Tanzania", "Ethiopia",
  "Zimbabwe", "Botswana", "Namibia", "Mauritius", "Réunion", "Martinique", "Guadeloupe",
  "French Guiana", "Mayotte", "New Caledonia", "French Polynesia", "St Lucia", "Antigua and Barbuda",
];

const citiesEn = [
  "London", "New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio",
  "San Diego", "Dallas", "San Jose", "Austin", "Jacksonville", "Fort Worth", "Columbus", "Charlotte",
  "San Francisco", "Indianapolis", "Seattle", "Denver", "Boston", "Detroit", "Nashville", "Portland",
  "Las Vegas", "Miami", "Atlanta", "Toronto", "Montreal", "Vancouver", "Calgary", "Edmonton",
  "Ottawa", "Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "Dubai", "Abu Dhabi",
  "Paris", "Marseille", "Lyon", "Berlin", "Munich", "Hamburg", "Frankfurt", "Rome", "Milan",
  "Madrid", "Barcelona", "Valencia", "Amsterdam", "Rotterdam", "Brussels", "Zurich", "Geneva",
  "Vienna", "Prague", "Warsaw", "Krakow", "Budapest", "Bucharest", "Athens", "Dublin", "Cork",
  "Manchester", "Birmingham", "Leeds", "Glasgow", "Liverpool", "Johannesburg", "Cape Town",
  "Durban", "Lagos", "Nairobi", "Casablanca", "Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata",
  "Singapore", "Kuala Lumpur", "Bangkok", "Ho Chi Minh City", "Hanoi", "Manila", "Jakarta",
  "Tokyo", "Osaka", "Seoul", "Busan", "Taipei", "Kaohsiung", "Shanghai", "Beijing", "Hong Kong",
  "São Paulo", "Rio de Janeiro", "Buenos Aires", "Santiago", "Lima", "Bogotá", "Medellín",
  "Mexico City", "Guadalajara", "Monterrey", "Cancún", "Panama City", "San Juan", "Port of Spain",
  "Wellington", "Auckland", "Christchurch", "Quebec City", "Winnipeg", "Halifax", "Victoria BC",
  "St Johns", "Saskatoon", "Regina", "Hamilton ON", "Kitchener", "London ON", "Windsor",
  "Tucson", "Albuquerque", "Fresno", "Sacramento", "Kansas City", "Mesa", "Omaha", "Raleigh",
  "Long Beach", "Virginia Beach", "Oakland", "Tampa", "Minneapolis", "New Orleans", "Cleveland",
  "St Louis", "Pittsburgh", "Cincinnati", "Orlando", "Buffalo", "Richmond", "Hartford",
];

const countriesEs = [
  "España", "México", "Argentina", "Colombia", "Chile", "Perú", "Venezuela", "Ecuador", "Uruguay",
  "Paraguay", "Bolivia", "Costa Rica", "Panamá", "Guatemala", "Honduras", "El Salvador", "Nicaragua",
  "Cuba", "República Dominicana", "Puerto Rico", "Estados Unidos", "Canadá", "Reino Unido", "Francia",
  "Alemania", "Italia", "Portugal", "Brasil", "Estados Unidos", "Australia", "Nueva Zelanda",
  "Marruecos", "Argelia", "Túnez", "Egipto", "Sudáfrica", "Nigeria", "Kenia", "Arabia Saudí",
  "Emiratos Árabes", "Catar", "Turquía", "India", "Filipinas", "Indonesia", "Malasia", "Japón",
  "Corea del Sur", "China", "Taiwán", "Singapur", "Tailandia", "Vietnam", "Países Bajos",
  "Bélgica", "Suiza", "Austria", "Suecia", "Noruega", "Dinamarca", "Finlandia", "Polonia",
  "República Checa", "Hungría", "Rumanía", "Grecia", "Croacia", "Serbia", "Bulgaria", "Eslovaquia",
  "Eslovenia", "Irlanda", "Islandia", "Malta", "Chipre", "Luxemburgo", "Rusia", "Ucrania",
  "Israel", "Jordania", "Líbano", "Irak", "Irán", "Pakistán", "Bangladesh", "Sri Lanka", "Nepal",
  "Myanmar", "Camboya", "Mongolia", "Kazajistán", "Georgia", "Armenia", "Azerbaiyán", "Bielorrusia",
  "Moldavia", "Albania", "Macedonia del Norte", "Bosnia y Herzegovina", "Montenegro", "Letonia",
  "Lituania", "Estonia", "Bahamas", "Barbados", "Jamaica", "Trinidad y Tobago", "Guyana",
  "Surinam", "Belice", "Haití", "Senegal", "Costa de Marfil", "Camerún", "Uganda", "Tanzania",
  "Etiopía", "Zimbabue", "Botsuana", "Namibia", "Mauricio", "Reunión", "Martinica", "Guadalupe",
  "Guayana Francesa", "Mayotte", "Nueva Caledonia", "Polinesia Francesa", "Santa Lucía",
  "Antigua y Barbuda", "Fiyi", "Papúa Nueva Guinea", "Omán", "Baréin", "Kuwait", "Yemen",
  "Afganistán", "Laos", "Brunéi", "Macao", "Hong Kong", "Islandia", "Groenlandia", "Islas Canarias",
  "Islas Baleares", "Ceuta", "Melilla", "Andorra", "Mónaco", "San Marino", "Ciudad del Vaticano",
  "Liechtenstein", "Gibraltar", "Guernsey", "Jersey", "Isla de Man", "Faroe", "Azores", "Madeira",
  "Córcega", "Cerdeña", "Sicilia", "Galicia", "País Vasco", "Cataluña", "Valencia región",
  "Castilla", "Andalucía", "Aragón", "Asturias", "Murcia", "Navarra", "Cantabria", "La Rioja",
  "Extremadura", "Castilla-La Mancha", "Castilla y León", "Galicia IPTV región", "Caribe",
  "Centroamérica", "Sudamérica", "Latinoamérica", "Hispanoamérica", "Europa", "Asia", "África",
  "Oceanía", "Norteamérica", "Mundo", "UE", "Schengen", "Mercosur", "CELAC", "Iberoamérica",
];

const citiesEs = [
  "Madrid", "Barcelona", "Valencia", "Sevilla", "Zaragoza", "Málaga", "Murcia", "Palma", "Bilbao",
  "Alicante", "Córdoba", "Valladolid", "Vigo", "Gijón", "Granada", "Vitoria", "Elche", "Oviedo",
  "Ciudad de México", "Guadalajara", "Monterrey", "Puebla", "Tijuana", "León MX", "Juárez",
  "Torreón", "Querétaro", "Mérida", "Cancún", "Buenos Aires", "Córdoba AR", "Rosario", "Mendoza",
  "La Plata", "Bogotá", "Medellín", "Cali", "Barranquilla", "Cartagena CO", "Lima", "Arequipa",
  "Trujillo PE", "Santiago de Chile", "Valparaíso", "Concepción", "Caracas", "Maracaibo",
  "Valencia VE", "Quito", "Guayaquil", "Montevideo", "Asunción", "La Paz BO", "Santa Cruz BO",
  "San José CR", "Panamá ciudad", "Guatemala ciudad", "Tegucigalpa", "Managua", "San Salvador",
  "La Habana", "Santo Domingo", "San Juan PR", "Miami", "Nueva York", "Los Ángeles", "Chicago",
  "Houston", "Dallas", "Phoenix", "Toronto", "Montreal", "Vancouver", "Londres", "París", "Berlín",
  "Roma", "Milán", "Lisboa", "Oporto", "Ámsterdam", "Bruselas", "Zúrich", "Dublín", "Estocolmo",
  "Oslo", "Copenhague", "Helsinki", "Varsovia", "Praga", "Budapest", "Bucarest", "Atenas",
  "Johannesburgo", "Ciudad del Cabo", "Lagos", "Nairobi", "Casablanca", "Dubái", "Abu Dabi",
  "Riad", "Doha", "Tel Aviv", "Estambul", "Mumbai", "Delhi", "Bangkok", "Singapur", "Tokio",
  "Seúl", "Taipéi", "Shanghái", "Hong Kong", "São Paulo", "Río de Janeiro", "Sídney", "Melbourne",
  "Brisbane", "Auckland", "Wellington", "Frankfurt", "Múnich", "Hamburgo", "Stuttgart", "Colonia",
  "Núremberg", "Leipzig", "Dresde", "Hanóver", "Nantes", "Estrasburgo", "Burdeos", "Lille",
  "Toulouse", "Niza", "Montpellier", "Rennes", "Reims", "Le Havre", "Grenoble", "Dijon",
  "Angers", "Clermont-Ferrand", "Le Mans", "Tours", "Amiens", "Limoges", "Metz", "Besançon",
  "Perpiñán", "Orléans", "Mulhouse", "Caen", "Nancy", "Rouen", "Poitiers", "Aviñón", "Aix-en-Provence",
  "Brest", "Bayona", "Pau", "Annecy", "La Rochelle", "Biarritz", "San Sebastián", "Santander",
  "Salamanca", "Toledo", "Segovia", "Burgos", "León ES", "Santiago de Compostela", "Vigo ciudad",
  "A Coruña", "Ourense", "Lugo", "Pontevedra", "Badajoz", "Cáceres", "Mérida ES", "Huelva",
  "Cádiz", "Jerez", "Almería", "Jaén", "Granada ciudad", "Marbella", "Benidorm", "Ibiza",
  "Menorca", "Mallorca", "Tenerife", "Las Palmas", "Lanzarote", "Fuerteventura", "La Gomera",
];

const countriesFr = [
  "France", "Belgique", "Suisse", "Canada", "Québec", "Luxembourg", "Monaco", "Maroc", "Algérie",
  "Tunisie", "Sénégal", "Côte d'Ivoire", "Mali", "Burkina Faso", "Niger", "Tchad", "Cameroun",
  "Gabon", "Congo", "RDC", "Madagascar", "Maurice", "Réunion", "Guadeloupe", "Martinique",
  "Guyane", "Mayotte", "Nouvelle-Calédonie", "Polynésie française", "Haïti", "Louisiane",
  "États-Unis", "Royaume-Uni", "Irlande", "Espagne", "Portugal", "Italie", "Allemagne", "Pays-Bas",
  "Autriche", "Pologne", "Roumanie", "Grèce", "Hongrie", "République tchèque", "Croatie",
  "Serbie", "Bulgarie", "Ukraine", "Turquie", "Israël", "Émirats arabes unis", "Arabie saoudite",
  "Qatar", "Koweït", "Bahreïn", "Oman", "Jordanie", "Liban", "Égypte", "Afrique du Sud", "Nigeria",
  "Kenya", "Inde", "Pakistan", "Bangladesh", "Philippines", "Thaïlande", "Vietnam", "Indonésie",
  "Malaisie", "Singapour", "Japon", "Corée du Sud", "Chine", "Taïwan", "Hong Kong", "Australie",
  "Nouvelle-Zélande", "Brésil", "Mexique", "Argentine", "Colombie", "Chili", "Pérou", "Venezuela",
  "Équateur", "Uruguay", "Paraguay", "Bolivie", "Costa Rica", "Panama", "Guatemala", "Russie",
  "Kazakhstan", "Géorgie", "Arménie", "Azerbaïdjan", "Biélorussie", "Moldavie", "Islande", "Norvège",
  "Suède", "Finlande", "Danemark", "Estonie", "Lettonie", "Lituanie", "Slovaquie", "Slovénie",
  "Malte", "Chypre", "Albanie", "Macédoine du Nord", "Bosnie-Herzégovine", "Monténégro", "Andorre",
  "Saint-Marin", "Vatican", "Liechtenstein", "Gibraltar", "Brésil", "Cuba", "République dominicaine",
  "Porto Rico", "Jamaïque", "Trinité-et-Tobago", "Bahamas", "Barbade", "Guyana", "Suriname",
  "Belize", "Honduras", "Nicaragua", "Salvador", "Paraguay", "Uruguay", "Bolivie", "Équateur",
  "Pérou", "Chili", "Argentine", "Colombie", "Venezuela", "Brésil", "Mexique", "Panama", "Costa Rica",
  "Guatemala", "Portugal", "Espagne", "Italie", "Grèce", "Chypre", "Malte", "Croatie", "Slovénie",
  "Hongrie", "Roumanie", "Bulgarie", "Serbie", "Monténégro", "Macédoine du Nord", "Albanie",
  "Bosnie", "Kosovo", "Moldavie", "Ukraine", "Biélorussie", "Russie", "Norvège", "Suède", "Finlande",
  "Danemark", "Islande", "Irlande", "Royaume-Uni", "Pays de Galles", "Écosse", "Irlande du Nord",
  "Angleterre", "Australie", "Nouvelle-Zélande", "Fidji", "Papouasie-Nouvelle-Guinée", "Polynésie",
  "Calédonie", "Wallis-et-Futuna", "Saint-Pierre-et-Miquelon", "Saint-Barthélemy", "Saint-Martin",
  "Aruba", "Curaçao", "Sint Maarten", "Bonaire", "Saba", "Statia", "Groenland", "Îles Féroé",
  "Svalbard", "Antarctique français", "Terres australes", "Clipperton", "Afrique", "Europe", "Asie",
  "Amérique", "Amérique du Nord", "Amérique du Sud", "Océanie", "Monde entier", "Union européenne",
  "Espace Schengen", "Francophonie", "Maghreb", "Afrique subsaharienne", "Caraïbes", "Pacifique",
  "Moyen-Orient", "Golfe persique", "Levant", "Maghreb", "Sahel", "Afrique de l'Est", "Afrique de l'Ouest",
  "Afrique centrale", "Afrique australe", "Amérique latine", "Amérique centrale", "Hispanophone",
  "Lusophone", "Anglophone", "Germanophone", "Scandinavie", "Balkans", "Europe centrale",
  "Europe de l'Est", "Europe de l'Ouest", "Méditerranée", "Mer Baltique", "Mer Noire", "Mer Rouge",
  "Océan Indien", "Océan Atlantique", "Pacifique Sud", "Antilles", "DOM-TOM", "outre-mer français",
];

const citiesFr = [
  "Paris", "Lyon", "Marseille", "Toulouse", "Nice", "Nantes", "Strasbourg", "Montpellier", "Bordeaux",
  "Lille", "Rennes", "Reims", "Le Havre", "Saint-Étienne", "Toulon", "Grenoble", "Dijon", "Angers",
  "Nîmes", "Villeurbanne", "Saint-Denis", "Le Mans", "Aix-en-Provence", "Clermont-Ferrand", "Brest",
  "Tours", "Limoges", "Amiens", "Perpignan", "Metz", "Besançon", "Orléans", "Rouen", "Mulhouse",
  "Caen", "Nancy", "Argenteuil", "Montreuil", "Saint-Paul", "Roubaix", "Tourcoing", "Nanterre",
  "Avignon", "Créteil", "Dunkerque", "Poitiers", "Asnières", "Versailles", "Courbevoie", "Vitry",
  "Colombes", "Aulnay-sous-Bois", "La Rochelle", "Champigny", "Rueil-Malmaison", "Antibes",
  "Saint-Maur-des-Fossés", "Cannes", "Calais", "Béziers", "Colmar", "Drancy", "Mérignac", "Saint-Nazaire",
  "Issy-les-Moulineaux", "Noisy-le-Grand", "Évry", "Cergy", "Pessac", "Valence", "Antony", "La Seyne",
  "Ivry", "Vénissieux", "Clichy", "Troyes", "Pantin", "Neuilly", "Sarcelles", "Le Blanc-Mesnil",
  "Chambéry", "Lorient", "Villejuif", "Saint-André", "Hyères", "Épinay", "Bondy", "Bobigny",
  "Montréal", "Québec", "Laval", "Gatineau", "Longueuil", "Sherbrooke", "Saguenay", "Lévis",
  "Trois-Rivières", "Terre-Neuve", "Saint-Jean", "Halifax", "Charlottetown", "Fredericton", "Moncton",
  "Bruxelles", "Anvers", "Gand", "Charleroi", "Liège", "Bruges", "Namur", "Louvain", "Mons",
  "Genève", "Zurich", "Bâle", "Lausanne", "Berne", "Winterthour", "Lucerne", "Saint-Gall", "Lugano",
  "Casablanca", "Rabat", "Marrakech", "Fès", "Tanger", "Agadir", "Meknès", "Oujda", "Alger",
  "Oran", "Constantine", "Annaba", "Tunis", "Sfax", "Sousse", "Dakar", "Abidjan", "Bamako",
  "Ouagadougou", "Niamey", "N'Djamena", "Douala", "Yaoundé", "Libreville", "Brazzaville", "Kinshasa",
  "Antananarivo", "Port-Louis", "Saint-Denis La Réunion", "Cayenne", "Fort-de-France", "Pointe-à-Pitre",
  "Port-au-Prince", "La Nouvelle-Orléans", "New York", "Los Angeles", "Chicago", "Miami", "Boston",
  "San Francisco", "Seattle", "Denver", "Austin", "Dallas", "Houston", "Phoenix", "Philadelphie",
  "Détroit", "Atlanta", "Londres", "Manchester", "Birmingham", "Liverpool", "Leeds", "Glasgow",
  "Édimbourg", "Dublin", "Cork", "Galway", "Madrid", "Barcelone", "Valence", "Séville", "Bilbao",
  "Lisbonne", "Porto", "Rome", "Milan", "Naples", "Turin", "Florence", "Bologne", "Venise",
  "Berlin", "Munich", "Hambourg", "Francfort", "Cologne", "Stuttgart", "Düsseldorf", "Dresde",
  "Varsovie", "Cracovie", "Prague", "Budapest", "Bucarest", "Sofia", "Belgrade", "Zagreb", "Ljubljana",
  "Bratislava", "Tallinn", "Riga", "Vilnius", "Helsinki", "Oslo", "Stockholm", "Copenhague", "Reykjavik",
  "Dubaï", "Abou Dabi", "Riyad", "Doha", "Koweït", "Manama", "Mascate", "Tel Aviv", "Jérusalem",
  "Istanbul", "Ankara", "Le Caire", "Alexandrie", "Le Cap", "Johannesburg", "Durban", "Lagos",
  "Nairobi", "Mumbai", "Delhi", "Bangkok", "Singapour", "Kuala Lumpur", "Jakarta", "Manille",
  "Hanoï", "Hô Chi Minh-Ville", "Tokyo", "Osaka", "Séoul", "Busan", "Taipei", "Shanghai", "Pékin",
  "Hong Kong", "São Paulo", "Rio de Janeiro", "Buenos Aires", "Santiago", "Lima", "Bogota",
  "Mexico", "Guadalajara", "Monterrey", "Sydney", "Melbourne", "Brisbane", "Perth", "Adélaïde",
  "Auckland", "Wellington", "Christchurch", "Hanoï", "Phnom Penh", "Vientiane", "Yangon", "Katmandou",
  "Islamabad", "Karachi", "Lahore", "Dhaka", "Colombo", "Téhéran", "Bagdad", "Damas", "Beyrouth",
  "Amman", "Riyad", "Sanaa", "Khartoum", "Addis-Abeba", "Dar es Salaam", "Kampala", "Kigali",
];

function uniqueGeo(list) {
  const out = [];
  const seen = new Set();
  for (const g of list) {
    const k = g.trim();
    if (!k || seen.has(k)) continue;
    seen.add(k);
    out.push(k);
  }
  return out;
}

function buildLocale(geoList, templates) {
  const geo = uniqueGeo(geoList);
  const set = new Set();
  for (const g of geo) {
    for (const fn of templates) {
      const s = fn(g).replace(/\s+/g, " ").trim();
      if (s.length > 3 && s.length < 180) set.add(s);
      if (set.size >= TARGET) return [...set].slice(0, TARGET);
    }
  }
  return [...set].slice(0, TARGET);
}

const templatesEn = [
  (g) => `IPTV in ${g}`,
  (g) => `${g} IPTV subscription`,
  (g) => `watch IPTV ${g}`,
  (g) => `best IPTV ${g}`,
  (g) => `IPTV Smarters Pro ${g}`,
  (g) => `cheap IPTV ${g}`,
  (g) => `4K IPTV ${g}`,
  (g) => `live TV IPTV ${g}`,
];

const templatesEs = [
  (g) => `IPTV en ${g}`,
  (g) => `suscripción IPTV ${g}`,
  (g) => `ver IPTV ${g}`,
  (g) => `mejor IPTV ${g}`,
  (g) => `IPTV Smarters Pro ${g}`,
  (g) => `IPTV barato ${g}`,
  (g) => `IPTV 4K ${g}`,
  (g) => `TV en vivo IPTV ${g}`,
];

const templatesFr = [
  (g) => `IPTV ${g}`,
  (g) => `abonnement IPTV ${g}`,
  (g) => `regarder IPTV ${g}`,
  (g) => `meilleur IPTV ${g}`,
  (g) => `IPTV Smarters Pro ${g}`,
  (g) => `IPTV pas cher ${g}`,
  (g) => `IPTV 4K ${g}`,
  (g) => `streaming TV IPTV ${g}`,
];

const enGeo = uniqueGeo([...countriesEn, ...citiesEn]);
const esGeo = uniqueGeo([...countriesEs, ...citiesEs]);
const frGeo = uniqueGeo([...countriesFr, ...citiesFr]);

let en = buildLocale(enGeo, templatesEn);
let es = buildLocale(esGeo, templatesEs);
let fr = buildLocale(frGeo, templatesFr);

const devicesEn = [
  "Fire TV Stick", "Fire TV Cube", "Android TV", "Google TV", "Chromecast", "Apple TV", "Roku",
  "Samsung Smart TV", "LG Smart TV", "Sony Bravia", "Philips Smart TV", "TCL Roku TV", "Hisense TV",
  "Nvidia Shield", "Formuler", "MAG box", "Enigma2", "Dreambox", "Kodi box", "Windows PC", "Mac",
  "iPhone", "iPad", "Android phone", "Android tablet", "Chromebook", "Xbox", "PlayStation", "Mi Box",
];

const devicesEs = [
  "Fire TV Stick", "Fire TV Cube", "Android TV", "Google TV", "Chromecast", "Apple TV", "Roku",
  "Samsung Smart TV", "LG Smart TV", "Sony Bravia", "Philips Smart TV", "TCL Roku TV", "Hisense TV",
  "Nvidia Shield", "Formuler", "caja MAG", "Enigma2", "Dreambox", "Kodi", "Windows PC", "Mac",
  "iPhone", "iPad", "móvil Android", "tablet Android", "Chromebook", "Xbox", "PlayStation", "Mi Box",
];

const devicesFr = [
  "Fire TV Stick", "Fire TV Cube", "Android TV", "Google TV", "Chromecast", "Apple TV", "Roku",
  "Samsung Smart TV", "LG Smart TV", "Sony Bravia", "Philips Smart TV", "TCL Roku TV", "Hisense TV",
  "Nvidia Shield", "Formuler", "box MAG", "Enigma2", "Dreambox", "Kodi", "PC Windows", "Mac",
  "iPhone", "iPad", "téléphone Android", "tablette Android", "Chromebook", "Xbox", "PlayStation", "Mi Box",
];

function padWithDevices(arr, devices, localeTag) {
  const set = new Set(arr);
  let i = 0;
  while (set.size < TARGET && i < devices.length * 80) {
    const d = devices[i % devices.length];
    const wave = i % 3;
    const realExtra =
      localeTag === "en"
        ? [`IPTV on ${d}`, `IPTV Smarters Pro on ${d}`, `${d} IPTV installation guide`][wave]
        : localeTag === "es"
          ? [`IPTV en ${d}`, `IPTV Smarters Pro en ${d}`, `instalar IPTV ${d}`][wave]
          : [`IPTV sur ${d}`, `IPTV Smarters Pro sur ${d}`, `installer IPTV ${d}`][wave];
    set.add(realExtra);
    i++;
  }
  return [...set].slice(0, TARGET);
}

en = padWithDevices(en, devicesEn, "en");
es = padWithDevices(es, devicesEs, "es");
fr = padWithDevices(fr, devicesFr, "fr");

// Final trim/pad: ensure exactly TARGET with intent tails if still short
function topUp(arr, seeds, locale) {
  const set = new Set(arr);
  const tailsEn = [
    "trial",
    "free test",
    "M3U link",
    "Xtream login",
    "EPG guide",
    "catch up TV",
    "multi screen",
    "anti freeze",
    "no buffering",
    "24/7 channels",
    "sports package",
    "PPV events",
    "VOD library",
    "4K streams",
    "FHD quality",
    "instant activation",
    "reseller panel",
    "IPTV codes 2026",
  ];
  const tailsEs = [
    "prueba",
    "test gratis",
    "enlace M3U",
    "login Xtream",
    "guía EPG",
    "catch up",
    "multi pantalla",
    "anti congelación",
    "sin cortes",
    "canales 24/7",
    "paquete deportes",
    "eventos PPV",
    "biblioteca VOD",
    "streams 4K",
    "calidad FHD",
    "activación instantánea",
    "panel revendedor",
    "códigos IPTV 2026",
  ];
  const tailsFr = [
    "essai",
    "test gratuit",
    "lien M3U",
    "login Xtream",
    "guide EPG",
    "rattrapage TV",
    "multi écran",
    "anti gel",
    "sans coupure",
    "chaînes 24/7",
    "pack sport",
    "événements PPV",
    "bibliothèque VOD",
    "flux 4K",
    "qualité FHD",
    "activation instantanée",
    "panel revendeur",
    "codes IPTV 2026",
  ];
  const tails = locale === "en" ? tailsEn : locale === "es" ? tailsEs : tailsFr;
  let n = 0;
  while (set.size < TARGET) {
    const s = `${seeds[n % seeds.length]} ${tails[n % tails.length]}`;
    set.add(s);
    n++;
    if (n > TARGET * 4) break;
  }
  return [...set].slice(0, TARGET);
}

const seedsEn = [
  "IPTV Smarters Pro",
  "premium IPTV",
  "live TV streaming",
  "IPTV subscription",
  "best IPTV service",
  "IPTV provider",
  "IPTV channels list",
  "international IPTV",
  "IPTV for expats",
  "IPTV family plan",
];
const seedsEs = [
  "IPTV Smarters Pro",
  "IPTV premium",
  "streaming TV en vivo",
  "suscripción IPTV",
  "mejor servicio IPTV",
  "proveedor IPTV",
  "lista canales IPTV",
  "IPTV internacional",
  "IPTV para expatriados",
  "plan familiar IPTV",
];
const seedsFr = [
  "IPTV Smarters Pro",
  "IPTV premium",
  "streaming TV en direct",
  "abonnement IPTV",
  "meilleur service IPTV",
  "fournisseur IPTV",
  "liste chaînes IPTV",
  "IPTV international",
  "IPTV pour expatriés",
  "forfait familial IPTV",
];

en = topUp(en, seedsEn, "en");
es = topUp(es, seedsEs, "es");
fr = topUp(fr, seedsFr, "fr");

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify({ en, es, fr }, null, 0), "utf8");

console.log("Wrote", OUT);
console.log("counts:", { en: en.length, es: es.length, fr: fr.length, total: en.length + es.length + fr.length });
