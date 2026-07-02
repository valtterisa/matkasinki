// Built-in challenge sets — rich, sourced fallbacks for when no ANTHROPIC_API_KEY
// is present. Written for a traveller who knows NOTHING about the destination.

import type { Challenge } from "./index";

type Seed = Omit<Challenge, "id" | "placeId">;

function seeds(_city: string, cc: string, list: Omit<Seed, "reward">[]): Seed[] {
  // rotate reward kinds so every set unlocks a mix of players/staff/fixtures/leagues
  const kinds: Challenge["reward"]["kind"][] = ["player", "staff", "fixture", "league"];
  return list.map((s, i) => ({ ...s, reward: { kind: kinds[i % kinds.length], ref: cc } }));
}

export const BUILTIN_SETS: Record<string, Seed[]> = {
  porto: seeds("Porto", "pt", [
    {
      title: "Cross the Dom Luís I bridge on the top deck — on foot",
      description:
        "The double-deck iron bridge by a Eiffel disciple links Porto to Gaia. Walk the upper deck with the metro, 60m over the Douro, then descend to Gaia's riverside. Free, iconic, and the best orientation lesson in town.",
      difficulty: "easy",
      sustainable: true,
      sources: ["https://en.wikipedia.org/wiki/Dom_Lu%C3%ADs_I_Bridge", "https://visitporto.travel"],
    },
    {
      title: "Eat a francesinha and finish it",
      description:
        "Porto's monument of a sandwich: meats stacked under melted cheese, drowned in spiced beer sauce. Café Santiago and Lado B are the perennial local argument. Order a fino (small beer) with it, like everyone else.",
      difficulty: "medium",
      sustainable: false,
      sources: ["https://en.wikipedia.org/wiki/Francesinha", "https://www.timeout.com/porto"],
    },
    {
      title: "Port cellar tour in Vila Nova de Gaia — pick a small house",
      description:
        "Skip the mega-brands; book a tasting at a smaller lodge (Taylor's rivals aside, try Ramos Pinto or Kopke). Learn why tawny and ruby age differently, then log the receipt — it doubles as proof.",
      difficulty: "easy",
      sustainable: true,
      sources: ["https://www.gaiaporto.pt", "https://en.wikipedia.org/wiki/Port_wine"],
    },
    {
      title: "Livraria Lello before 09:30 or not at all",
      description:
        "The neo-gothic bookshop with the crimson staircase sells timed tickets that convert to book credit. Go at opening or the crowd swallows it. Buy a Portuguese author — Pessoa in translation counts.",
      difficulty: "medium",
      sustainable: true,
      sources: ["https://www.livrarialello.pt", "https://en.wikipedia.org/wiki/Livraria_Lello"],
    },
    {
      title: "Ride the Linha 1 historic tram to Foz and watch the Atlantic",
      description:
        "The wooden 1930s tram hugs the Douro to Foz do Douro where the river meets the ocean. Walk the Pérgola da Foz, eat grilled sardines, come back by bus like a local.",
      difficulty: "easy",
      sustainable: true,
      sources: ["https://www.stcp.pt", "https://visitporto.travel"],
    },
    {
      title: "Climb the Clérigos Tower at sunset",
      description:
        "225 spiral steps up the baroque bell tower for the full red-roof panorama. Time it for the last hour of light; the azulejo facades glow.",
      difficulty: "hard",
      sustainable: true,
      sources: ["https://www.torredosclerigos.pt", "https://en.wikipedia.org/wiki/Cl%C3%A9rigos_Church"],
    },
  ]),
  "hoi an": seeds("Hoi An", "vn", [
    {
      title: "Lantern-lit Old Town after dark — on foot, no scooter",
      description:
        "The UNESCO trading port glows after sunset when silk lanterns light the Thu Bồn riverfront. Buy the Old Town ticket (funds preservation), cross the Japanese Covered Bridge, and skip the plastic boat-lantern litter — watch instead.",
      difficulty: "easy",
      sustainable: true,
      sources: ["https://whc.unesco.org/en/list/948/", "https://en.wikipedia.org/wiki/H%E1%BB%99i_An"],
    },
    {
      title: "Eat cao lầu where the noodles are real",
      description:
        "Cao lầu exists only in Hoi An — legend says the noodles need water from the Bá Lễ well. Find a central-market stall or a family spot like Thanh Cao Lầu; pay street prices, keep the receipt.",
      difficulty: "easy",
      sustainable: true,
      sources: ["https://en.wikipedia.org/wiki/Cao_l%E1%BA%A7u", "https://www.vietnam.travel"],
    },
    {
      title: "Cycle to Tra Que vegetable village",
      description:
        "3km of rice-paddy cycling to an organic herb village where farmers still rake seaweed fertiliser from the lagoon. Join an hour of planting, then eat 'tam huu' spring rolls with herbs you just touched.",
      difficulty: "medium",
      sustainable: true,
      sources: ["https://traquevegetablevillage.com", "https://www.vietnam.travel"],
    },
    {
      title: "Get one garment tailored in 24 hours",
      description:
        "Hoi An has hundreds of tailors who fit, cut and finish in a day. Bring a photo of what you want, negotiate politely, and go back for the second fitting — that's where quality happens.",
      difficulty: "medium",
      sustainable: false,
      sources: ["https://en.wikipedia.org/wiki/H%E1%BB%99i_An", "https://www.rustycompass.com/vietnam/hoi-an"],
    },
    {
      title: "Basket-boat paddle in the Bay Mau coconut forest",
      description:
        "Round bamboo basket boats (thúng chai) through nipa-palm channels. Choose a quiet-hours operator — the eco value dies when the speakers come out. Ask your rower to teach you one paddle stroke.",
      difficulty: "easy",
      sustainable: true,
      sources: ["https://en.wikipedia.org/wiki/Basket_boat", "https://www.vietnam.travel"],
    },
    {
      title: "Sunrise at An Bang beach, breakfast from a beach shack",
      description:
        "Up at 05:15, cycle 20 minutes, watch fishing coracles come in with the sun. Order bánh mì and cà phê sữa đá from a family shack, not the resort strip.",
      difficulty: "hard",
      sustainable: true,
      sources: ["https://www.vietnam.travel", "https://en.wikipedia.org/wiki/H%E1%BB%99i_An"],
    },
  ]),
  kyoto: seeds("Kyoto", "jp", [
    {
      title: "Fushimi Inari before 07:00 — walk past the crowds line",
      description:
        "Ten thousand vermilion torii climb Mount Inari. Before 7am you share them with joggers and foxes. Push past the Yotsutsuji viewpoint where 95% turn back; the upper loop is silent.",
      difficulty: "hard",
      sustainable: true,
      sources: ["https://inari.jp", "https://en.wikipedia.org/wiki/Fushimi_Inari-taisha"],
    },
    {
      title: "Nishiki Market breakfast — eat three things you can't name",
      description:
        "Kyoto's 400-year-old 'kitchen': tsukemono pickles, tako tamago, yuba. Etiquette: never walk-and-eat, stand at the stall. Ask 'kore wa nan desu ka?' at least once.",
      difficulty: "easy",
      sustainable: true,
      sources: ["https://www.kyoto-nishiki.or.jp", "https://en.wikipedia.org/wiki/Nishiki_Market"],
    },
    {
      title: "Zen garden sit at Ryōan-ji — count the stones",
      description:
        "Fifteen rocks, but from any seated position you can only see fourteen. Sit on the veranda for fifteen unhurried minutes and try anyway. This is the whole point.",
      difficulty: "easy",
      sustainable: true,
      sources: ["https://www.ryoanji.jp", "https://en.wikipedia.org/wiki/Ry%C5%8Dan-ji"],
    },
    {
      title: "Tea ceremony in a machiya townhouse",
      description:
        "Book a small-group chado session in a wooden machiya. Learn why the bowl is turned twice, then buy matcha from a local shop (Ippodo, est. 1717) — receipt doubles as proof.",
      difficulty: "medium",
      sustainable: true,
      sources: ["https://www.ippodo-tea.co.jp", "https://en.wikipedia.org/wiki/Japanese_tea_ceremony"],
    },
    {
      title: "Philosopher's Path to Ginkaku-ji on foot",
      description:
        "2km canal-side walk linking temples, named for philosopher Nishida Kitarō's daily commute-think. End at the Silver Pavilion's raked sand sea. No taxi shortcuts — the walk is the challenge.",
      difficulty: "medium",
      sustainable: true,
      sources: ["https://en.wikipedia.org/wiki/Philosopher%27s_Walk", "https://www.shokoku-ji.jp"],
    },
    {
      title: "Evening in Pontocho alley — one counter seat, one conversation",
      description:
        "The lantern-lit alley along the Kamo river. Choose an izakaya with a counter, order the master's recommendation (omakase de), and thank them in Japanese on the way out.",
      difficulty: "medium",
      sustainable: false,
      sources: ["https://en.wikipedia.org/wiki/Ponto-ch%C5%8D", "https://kyoto.travel"],
    },
  ]),
  "mexico city": seeds("Mexico City", "mx", [
    {
      title: "Tacos al pastor at a trompo after 21:00",
      description:
        "The spinning marinated pork cone is CDMX's Lebanese-Mexican love child. El Huequito and El Vilsito (a mechanic shop by day) are the classic argument. Order 'con todo', stand at the counter, keep the receipt.",
      difficulty: "easy",
      sustainable: true,
      sources: ["https://en.wikipedia.org/wiki/Al_pastor", "https://www.mexicocity.cdmx.gob.mx"],
    },
    {
      title: "Sunday Lagunilla / weekday Ciudadela market haggle",
      description:
        "Buy one handmade thing directly from its maker — talavera, textiles, huaraches. Haggling is expected but gentle; 10-15%, with a smile, in Spanish numbers.",
      difficulty: "medium",
      sustainable: true,
      sources: ["https://www.laciudadela.com.mx", "https://en.wikipedia.org/wiki/Mexico_City"],
    },
    {
      title: "Teotihuacan by 08:00, Avenue of the Dead end to end",
      description:
        "The 'City of the Gods' predates the Aztecs, who found it already ancient. First bus from Autobuses del Norte, walk the full avenue between the Sun and Moon pyramids before the heat and crowds.",
      difficulty: "hard",
      sustainable: true,
      sources: ["https://whc.unesco.org/en/list/414/", "https://en.wikipedia.org/wiki/Teotihuacan"],
    },
    {
      title: "Chapultepec + Museo Nacional de Antropología (the umbrella hall)",
      description:
        "One of the world's great museums. Stand under the monolithic el paraguas fountain, find the Aztec Sun Stone, give the Mexica hall 90 minutes minimum. Sunday is free for residents — go weekday.",
      difficulty: "easy",
      sustainable: true,
      sources: ["https://www.mna.inah.gob.mx", "https://en.wikipedia.org/wiki/National_Museum_of_Anthropology_(Mexico)"],
    },
    {
      title: "Lucha libre night at Arena México",
      description:
        "Friday night CMLL: masks, villains (rudos), heroes (técnicos), and grandmothers screaming louder than you. Buy official taquilla tickets, cheer whoever the crowd hates.",
      difficulty: "medium",
      sustainable: false,
      sources: ["https://cmll.com", "https://en.wikipedia.org/wiki/Arena_M%C3%A9xico"],
    },
    {
      title: "Coyoacán on foot: Frida's Casa Azul + churros at the market",
      description:
        "Book Casa Azul tickets days ahead (it sells out), then wander cobbled Coyoacán to Mercado de Coyoacán for tostadas and churros. Metro + walking only — the traffic will eat your day otherwise.",
      difficulty: "easy",
      sustainable: true,
      sources: ["https://www.museofridakahlo.org.mx", "https://en.wikipedia.org/wiki/Coyoac%C3%A1n"],
    },
  ]),
  ljubljana: seeds("Ljubljana", "si", [
    {
      title: "Cross all three of the Triple Bridge's spans, then coffee on the embankment",
      description:
        "Architect Jože Plečnik turned one bridge into three and a whole capital into his sketchbook. The centre is entirely pedestrianised — Europe's greenest capital 2016. Coffee at the Cankarjevo nabrežje embankment is mandatory culture.",
      difficulty: "easy",
      sustainable: true,
      sources: ["https://www.visitljubljana.com", "https://en.wikipedia.org/wiki/Triple_Bridge"],
    },
    {
      title: "Friday Odprta kuhna (Open Kitchen) market graze",
      description:
        "March-October, Pogačar square fills with Slovenia's chefs cooking outdoors. One rule: three small plates from three stalls, at least one Slovenian classic (štruklji or kranjska klobasa).",
      difficulty: "easy",
      sustainable: true,
      sources: ["https://www.odprtakuhna.si", "https://www.visitljubljana.com"],
    },
    {
      title: "Walk up to Ljubljana Castle — skip the funicular",
      description:
        "15 minutes through the chestnut trees earns the Alps-to-Kamnik panorama. Descend the other side into Krakovo's vegetable gardens, the old market gardens that still feed the city.",
      difficulty: "medium",
      sustainable: true,
      sources: ["https://www.ljubljanskigrad.si", "https://en.wikipedia.org/wiki/Ljubljana_Castle"],
    },
    {
      title: "Find the dragons and learn why they're there",
      description:
        "Four bronze dragons guard Zmajski most (Dragon Bridge, 1901). The dragon is Ljubljana's symbol — Jason and the Argonauts allegedly slew it here. Photograph one with the castle behind.",
      difficulty: "easy",
      sustainable: true,
      sources: ["https://en.wikipedia.org/wiki/Dragon_Bridge_(Ljubljana)", "https://www.visitljubljana.com"],
    },
    {
      title: "Metelkova after dark — art squat, not a museum",
      description:
        "A former Yugoslav army barracks turned autonomous culture zone: galleries, gigs, mosaic monsters. Go with respect, buy a drink at a venue, no flash photography of residents.",
      difficulty: "medium",
      sustainable: true,
      sources: ["https://www.metelkovamesto.org", "https://en.wikipedia.org/wiki/Metelkova"],
    },
    {
      title: "Day-escape: bus to Lake Bled, row to the island, ring the bell",
      description:
        "70 minutes by bus. Rent a rowboat (or take the traditional pletna), climb 99 steps to the church, ring the wishing bell. Swim in summer — the water is Alpine-clean.",
      difficulty: "hard",
      sustainable: true,
      sources: ["https://www.bled.si", "https://en.wikipedia.org/wiki/Lake_Bled"],
    },
  ]),
  taipei: seeds("Taipei", "tw", [
    {
      title: "Raohe Night Market: black pepper bun from the Michelin stall",
      description:
        "Start at the temple gate end; the charcoal-oven pepper buns (hújiāo bǐng) at Fuzhou Shizu earned a Bib Gourmand. Then keep walking — stinky tofu is the boss level.",
      difficulty: "easy",
      sustainable: true,
      sources: ["https://en.wikipedia.org/wiki/Raohe_Street_Night_Market", "https://guide.michelin.com/tw/en"],
    },
    {
      title: "Hike Elephant Mountain for the Taipei 101 sunset",
      description:
        "Xiangshan trail: 20 sweaty minutes of stairs from the MRT to the boulder viewpoint. Arrive 45 minutes before sunset, watch the city lights flick on around the tower.",
      difficulty: "medium",
      sustainable: true,
      sources: ["https://www.travel.taipei", "https://en.wikipedia.org/wiki/Xiangshan_(Taipei)"],
    },
    {
      title: "Beitou hot springs — public bath, local rules",
      description:
        "The volcanic Beitou valley steams year-round. Try the outdoor public Millennium Hot Spring (cheap, tiled, strict rules: rinse first, no swimsuits scrubbing, follow the grandmas' lead).",
      difficulty: "medium",
      sustainable: true,
      sources: ["https://en.wikipedia.org/wiki/Beitou_District", "https://www.travel.taipei"],
    },
    {
      title: "National Palace Museum: find the Jadeite Cabbage",
      description:
        "700,000 imperial treasures evacuated from the Forbidden City. The jade cabbage with its hidden katydid, and the meat-shaped stone, are the crowd's darlings — see why in person.",
      difficulty: "easy",
      sustainable: true,
      sources: ["https://www.npm.gov.tw", "https://en.wikipedia.org/wiki/Jadeite_Cabbage"],
    },
    {
      title: "YouBike the riverside path to Tamsui for sunset",
      description:
        "Rent a YouBike share cycle and follow the Tamsui River bikeway out to the old port town. Grilled squid and iron eggs at the wharf; MRT back with the bike returned.",
      difficulty: "hard",
      sustainable: true,
      sources: ["https://www.youbike.com.tw", "https://en.wikipedia.org/wiki/Tamsui_District"],
    },
    {
      title: "Din Tasting: xiaolongbao — count the pleats",
      description:
        "Soup dumplings done properly have 18 pleats. Whether you queue at Din Tai Fung's original Xinyi shop or a local rival like Hangzhou Xiaolongbao, learn the ritual: ginger, vinegar, bite the corner first.",
      difficulty: "easy",
      sustainable: false,
      sources: ["https://www.dintaifung.com.tw", "https://en.wikipedia.org/wiki/Xiaolongbao"],
    },
  ]),
  valencia: seeds("Valencia", "es", [
    {
      title: "Paella valenciana in its birthplace — lunch only, never dinner",
      description:
        "Real paella has rabbit, chicken, garrofó beans — no chorizo, ever. Locals eat it at lunch, ideally near the Albufera where the rice grows. La Pepica or a village arrocería in El Palmar.",
      difficulty: "medium",
      sustainable: true,
      sources: ["https://en.wikipedia.org/wiki/Paella", "https://www.visitvalencia.com"],
    },
    {
      title: "Cycle the Turia — a river turned 9km garden",
      description:
        "After the 1957 flood, Valencia moved the river and planted a park in its bed. Rent a bike, ride bridge-to-bridge from the Bioparc end to the City of Arts and Sciences.",
      difficulty: "medium",
      sustainable: true,
      sources: ["https://www.visitvalencia.com/en/what-to-do-valencia/green-valencia/turia-garden", "https://en.wikipedia.org/wiki/Turia_Gardens"],
    },
    {
      title: "Mercado Central breakfast: horchata + fartons",
      description:
        "One of Europe's largest fresh markets under modernist iron and tile. Order horchata de chufa (tiger-nut milk, a Valencian obsession) with fartons for dunking. Buy fruit for later.",
      difficulty: "easy",
      sustainable: true,
      sources: ["https://www.mercadocentralvalencia.es", "https://en.wikipedia.org/wiki/Horchata"],
    },
    {
      title: "Climb the Micalet bell tower",
      description:
        "207 spiral steps up the cathedral's gothic tower for the blue-domed skyline. The cathedral also claims the Holy Grail — judge the chapel yourself on the way out.",
      difficulty: "hard",
      sustainable: true,
      sources: ["https://catedraldevalencia.es", "https://en.wikipedia.org/wiki/Valencia_Cathedral"],
    },
    {
      title: "City of Arts and Sciences at golden hour — photograph the reflections",
      description:
        "Calatrava's white spaceship complex doubles itself in shallow pools at sunset. Walk it free; go inside only the Oceanogràfic if you must pick one (Europe's largest aquarium).",
      difficulty: "easy",
      sustainable: true,
      sources: ["https://www.cac.es", "https://en.wikipedia.org/wiki/City_of_Arts_and_Sciences"],
    },
    {
      title: "El Cabanyal tiles + beach sardines",
      description:
        "The old fishermen's quarter is a grid of candy-tiled houses that survived demolition plans. Wander it, then eat espencat or grilled sardines near Playa de la Malvarrosa.",
      difficulty: "easy",
      sustainable: true,
      sources: ["https://en.wikipedia.org/wiki/El_Cabanyal", "https://www.visitvalencia.com"],
    },
  ]),
  "cape town": seeds("Cape Town", "za", [
    {
      title: "Platteklip Gorge up Table Mountain — cable car down only",
      description:
        "The direct route up the front face: 700m of vertical stone staircase, 2-3 hours. Start before 08:00, carry 2L of water, check the weather (the 'tablecloth' cloud closes the top). Earn the view; ride down.",
      difficulty: "hard",
      sustainable: true,
      sources: ["https://www.tablemountain.net", "https://en.wikipedia.org/wiki/Table_Mountain"],
    },
    {
      title: "Bo-Kaap walk + a koesister with the locals",
      description:
        "The candy-coloured Cape Malay quarter is a living community, not a backdrop — take a resident-led walking tour, learn the emancipation story behind the paint, and eat a spiced koesister doughnut on Wale Street.",
      difficulty: "easy",
      sustainable: true,
      sources: ["https://en.wikipedia.org/wiki/Bo-Kaap", "https://www.capetown.travel"],
    },
    {
      title: "Kirstenbosch Boomslang canopy walkway",
      description:
        "One of the world's great botanical gardens, set against the mountain's eastern buttresses. Walk the snake-spined treetop bridge, picnic on the lawns; summer Sundays have sunset concerts.",
      difficulty: "easy",
      sustainable: true,
      sources: ["https://www.sanbi.org/gardens/kirstenbosch/", "https://en.wikipedia.org/wiki/Kirstenbosch_National_Botanical_Garden"],
    },
    {
      title: "Penguins at Boulders Beach — the boardwalk, not the sand",
      description:
        "African penguins nest between granite boulders at Simon's Town. Stay on the Foxy Beach boardwalk (conservation fee funds their protection) — they're endangered and bite. Train there along the False Bay coast is the scenic move.",
      difficulty: "easy",
      sustainable: true,
      sources: ["https://www.sanparks.org/parks/table_mountain/", "https://en.wikipedia.org/wiki/Boulders_Beach"],
    },
    {
      title: "Saturday morning at the Oranjezicht City Farm Market",
      description:
        "Community farm market at Granger Bay: Cape wines, farm cheese, mountains of fynbos honey. Buy breakfast from three different stalls and talk to at least one grower.",
      difficulty: "easy",
      sustainable: true,
      sources: ["https://ozcf.co.za", "https://www.capetown.travel"],
    },
    {
      title: "Chapman's Peak Drive at golden hour",
      description:
        "114 curves carved into the cliff between Hout Bay and Noordhoek. Go by shared ride or the hop-on bus, stop at the lookouts, and watch the Atlantic ignite. Toll road — keep the receipt.",
      difficulty: "medium",
      sustainable: false,
      sources: ["https://www.chapmanspeakdrive.co.za", "https://en.wikipedia.org/wiki/Chapman%27s_Peak"],
    },
  ]),
};

// Country-code hints for the generic set when we can guess from the destination string.
const COUNTRY_HINTS: [RegExp, string][] = [
  [/portugal|lisbon|porto/i, "pt"],
  [/vietnam|hanoi|saigon|ho chi minh|hoi an|da nang/i, "vn"],
  [/japan|tokyo|kyoto|osaka/i, "jp"],
  [/mexico/i, "mx"],
  [/slovenia|ljubljana/i, "si"],
  [/taiwan|taipei/i, "tw"],
  [/spain|valencia|madrid|barcelona|seville/i, "es"],
  [/south africa|cape town|johannesburg/i, "za"],
  [/france|paris|lyon/i, "fr"],
  [/italy|rome|florence|venice|milan/i, "it"],
  [/thailand|bangkok|chiang mai/i, "th"],
  [/korea|seoul|busan/i, "kr"],
];

export function guessCountryCode(destination: string): string {
  for (const [re, cc] of COUNTRY_HINTS) if (re.test(destination)) return cc;
  return "xx";
}

export function genericSet(destination: string): Seed[] {
  const cc = guessCountryCode(destination);
  return seeds(destination, cc, [
    {
      title: `Eat the dish ${destination} is proudest of — where locals queue`,
      description:
        `Every place has one dish it argues about. Ask three different locals (host, vendor, bartender) what it is and where it's best in ${destination}; go where two answers agree. Log the receipt.`,
      difficulty: "easy",
      sustainable: true,
      sources: ["https://www.wikivoyage.org", "https://www.atlasobscura.com/foods"],
    },
    {
      title: "Central market immersion — buy lunch from three stalls",
      description:
        `Find the main covered or morning market in ${destination}. Assemble a meal from three different stalls, nothing from a laminated tourist menu, and learn the local word for 'thank you' before checkout.`,
      difficulty: "easy",
      sustainable: true,
      sources: ["https://www.wikivoyage.org", "https://www.lonelyplanet.com"],
    },
    {
      title: "The highest free viewpoint, on foot",
      description:
        `Locate the highest publicly accessible viewpoint in ${destination} — hill, tower, rooftop, cathedral — and reach it under your own power. Photograph the city with something recognisable in frame.`,
      difficulty: "hard",
      sustainable: true,
      sources: ["https://www.wikivoyage.org", "https://www.alltrails.com"],
    },
    {
      title: "One neighbourhood past the guidebook line",
      description:
        `Take public transport four stops beyond the tourist core of ${destination} and walk back. Buy a coffee or snack somewhere with no English menu. Note what the guidebooks missed.`,
      difficulty: "medium",
      sustainable: true,
      sources: ["https://www.wikivoyage.org", "https://www.reddit.com/r/travel"],
    },
    {
      title: "The museum or site locals actually rate",
      description:
        `Skip the longest queue in ${destination}. Ask a local which smaller museum, temple, or site they'd take a friend to, and give it a full 90 minutes.`,
      difficulty: "easy",
      sustainable: true,
      sources: ["https://www.wikivoyage.org", "https://www.atlasobscura.com"],
    },
    {
      title: "Sunrise or sunset ritual",
      description:
        `Find where ${destination} watches the sun — a bridge, beach, steps, rooftop — and be there for it once. Golden-hour photo required; company optional.`,
      difficulty: "medium",
      sustainable: true,
      sources: ["https://www.wikivoyage.org", "https://www.timeout.com"],
    },
  ]);
}
