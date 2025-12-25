// ============================================
// DUBAINEGOCE - PRODUCTS DATABASE
// Base de données de parfums de Dubaï
// ============================================

const PRODUCTS_DATABASE = [
  // ========== LATTAFA ==========
  {
    id: 1,
    name: "Khamrah",
    brand: "Lattafa",
    price: 35,
    image: "https://www.frenchavenue.fr/wp-content/uploads/2024/01/Khamrah.jpeg",
    category: "Oriental",
    badge: "BEST-SELLER",
    description: "Une fragrance orientale gourmande avec des notes de cannelle, cardamome et praline. Un parfum chaleureux et enivrant qui évoque les nuits mystiques de Dubaï."
  },
  {
    id: 2,
    name: "Fakhar Black",
    brand: "Lattafa",
    price: 35,
    image: "https://www.frenchavenue.fr/wp-content/uploads/2023/12/fakhar-silver-lattafa-eau-de-parfum-mixte-jpg.webp",
    category: "Boisé",
    badge: "BEST-SELLER",
    description: "Notes de tête : bergamote, pomme. Cœur : jasmin, patchouli. Fond : vanille, musc, ambre. Un parfum sophistiqué et envoûtant."
  },
  {
    id: 3,
    name: "Raghba",
    brand: "Lattafa",
    price: 35,
    image: "https://www.frenchavenue.fr/wp-content/uploads/2023/12/1000029948-1-jpg.webp",
    category: "Oriental",
    badge: "BEST-SELLER",
    description: "Un mélange captivant d'oud, de vanille et d'encens. Une fragrance riche et opulente qui incarne le luxe oriental."
  },
  {
    id: 4,
    name: "Yara",
    brand: "Lattafa",
    price: 35,
    image: "https://www.frenchavenue.fr/wp-content/uploads/2023/12/Yara-eau-de-parfum-lattafa-600x600-1-jpg.webp",
    category: "Floral",
    badge: "BEST-SELLER",
    description: "Notes florales douces avec orchidée, héliotrope et gourmandise vanillée. Parfum féminin élégant et sensuel."
  },
  {
    id: 5,
    name: "Asad",
    brand: "Lattafa",
    price: 35,
    image: "https://www.frenchavenue.fr/wp-content/uploads/2024/01/lattafa-parfum-asad.jpg",
    category: "Boisé",
    badge: "BEST-SELLER",
    description: "Une fragrance masculine puissante avec des notes de cuir, d'oud et d'épices. Force et élégance réunies."
  },
  {
    id: 6,
    name: "Yara Tous",
    brand: "Lattafa",
    price: 35,
    image: "https://res.cloudinary.com/dhjwimevi/image/upload/v1765701177/yara_tous_lattafa_jm1prx.png",
    category: "Floral",
    badge: null,
    description: "Variation florale de Yara avec des notes plus fraîches et pétillantes. Parfait pour le jour."
  },
  {
    id: 7,
    name: "Opulent Oud",
    brand: "Lattafa",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=Opulent+Oud",
    category: "Oriental",
    badge: null,
    description: "Oud cambodgien noble enrichi de rose et de safran. Une expérience olfactive luxueuse."
  },
  {
    id: 8,
    name: "Pride Tharwah",
    brand: "Lattafa",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=Pride+Tharwah",
    category: "Oriental",
    badge: "NOUVEAU",
    description: "Notes de tête citronnées, cœur floral, fond ambré musqué. Élégance orientale moderne."
  },
  {
    id: 9,
    name: "Velvet Oud",
    brand: "Lattafa",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=Velvet+Oud",
    category: "Boisé",
    badge: null,
    description: "Oud velouté associé à des notes de cuir et de cèdre. Sophistication masculine."
  },
  {
    id: 10,
    name: "Ana Abiyedh",
    brand: "Lattafa",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=Ana+Abiyedh",
    category: "Floral",
    badge: null,
    description: "Fragrance florale blanche avec muguet, jasmin et muscs poudrés. Féminité pure."
  },
  {
    id: 11,
    name: "Oud Mood",
    brand: "Lattafa",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=Oud+Mood",
    category: "Oriental",
    badge: null,
    description: "Oud intense avec rose damascène et safran iranien. Luxe oriental authentique."
  },
  {
    id: 12,
    name: "Najdia",
    brand: "Lattafa",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=Najdia",
    category: "Oriental",
    badge: null,
    description: "Mélange épicé-floral avec notes de jasmin, safran et ambre chaud."
  },
  {
    id: 13,
    name: "Bade'e Al Oud",
    brand: "Lattafa",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=Bade'e+Al+Oud",
    category: "Boisé",
    badge: null,
    description: "Oud pur avec touches de musc noir et ambre gris. Puissance et caractère."
  },
  {
    id: 14,
    name: "Raed",
    brand: "Lattafa",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=Raed",
    category: "Frais",
    badge: "NOUVEAU",
    description: "Fraîcheur agrumes avec bergamote, menthe et notes marines. Vivifiant."
  },
  {
    id: 15,
    name: "Sheikh Al Shuyukh",
    brand: "Lattafa",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=Sheikh",
    category: "Oriental",
    badge: null,
    description: "Composition royale d'oud, rose et épices précieuses. Majestueux."
  },

  // ========== MAISON ALHAMBRA ==========
  {
    id: 16,
    name: "Lovely Cherie",
    brand: "Maison Alhambra",
    price: 35,
    image: "https://res.cloudinary.com/dhjwimevi/image/upload/v1765701177/lovely_cherie_b3nicj.png",
    category: "Floral",
    badge: "BEST-SELLER",
    description: "Fragrance florale gourmande avec rose, lychee et vanille. Romantisme et douceur."
  },
  {
    id: 17,
    name: "Jean Lowe",
    brand: "Maison Alhambra",
    price: 35,
    image: "https://res.cloudinary.com/dhjwimevi/image/upload/v1765701177/jean_lowe_alhambra_qkm11z.png",
    category: "Boisé",
    badge: "BEST-SELLER",
    description: "Notes boisées masculines avec cèdre, vétiver et musc. Charisme et élégance."
  },
  {
    id: 18,
    name: "Glamour Seduction",
    brand: "Maison Alhambra",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=Glamour+Seduction",
    category: "Floral",
    badge: null,
    description: "Tubéreuse, fleur d'oranger et notes sensuelles. Séduction incarnée."
  },
  {
    id: 19,
    name: "Porta Bellissimo",
    brand: "Maison Alhambra",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=Porta+Bellissimo",
    category: "Boisé",
    badge: null,
    description: "Bois précieux avec santal, patchouli et ambre. Sophistication italienne."
  },
  {
    id: 20,
    name: "Rocca Azzuro",
    brand: "Maison Alhambra",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=Rocca+Azzuro",
    category: "Frais",
    badge: "NOUVEAU",
    description: "Fraîcheur méditerranéenne avec citron, lavande et notes marines."
  },
  {
    id: 21,
    name: "Prestige Eternelle",
    brand: "Maison Alhambra",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=Prestige+Eternelle",
    category: "Floral",
    badge: null,
    description: "Iris, rose et muscs blancs. Élégance intemporelle et raffinée."
  },
  {
    id: 22,
    name: "Paris Galleria",
    brand: "Maison Alhambra",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=Paris+Galleria",
    category: "Fruité",
    badge: null,
    description: "Poire, gardénia et praline. Gourmandise parisienne chic."
  },
  {
    id: 23,
    name: "Ambre Exclusif",
    brand: "Maison Alhambra",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=Ambre+Exclusif",
    category: "Oriental",
    badge: "BEST-SELLER",
    description: "Ambre authentique avec benjoin et vanille bourbon. Chaleur orientale."
  },
  {
    id: 24,
    name: "Blanche Intense",
    brand: "Maison Alhambra",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=Blanche+Intense",
    category: "Floral",
    badge: null,
    description: "Fleurs blanches avec aldéhydes et musc. Pureté intense."
  },
  {
    id: 25,
    name: "Noir Intense",
    brand: "Maison Alhambra",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=Noir+Intense",
    category: "Boisé",
    badge: null,
    description: "Cuir noir avec vétiver fumé et patchouli. Mystère et intensité."
  },
  {
    id: 26,
    name: "L'Aventura",
    brand: "Maison Alhambra",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=L'Aventura",
    category: "Frais",
    badge: "BEST-SELLER",
    description: "Ananas, bergamote et musc. Fraîcheur aventureuse et dynamique."
  },
  {
    id: 27,
    name: "Mille Lumieres",
    brand: "Maison Alhambra",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=Mille+Lumieres",
    category: "Floral",
    badge: null,
    description: "Tubéreuse, ylang-ylang et notes poudrées. Mille facettes lumineuses."
  },
  {
    id: 28,
    name: "Sultan Royale",
    brand: "Maison Alhambra",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=Sultan+Royale",
    category: "Oriental",
    badge: null,
    description: "Oud royal avec safran et rose damascène. Majesté orientale."
  },
  {
    id: 29,
    name: "Imperatrice Divina",
    brand: "Maison Alhambra",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=Imperatrice",
    category: "Fruité",
    badge: "NOUVEAU",
    description: "Kiwi, notes vertes et musc. Fraîcheur impériale féminine."
  },
  {
    id: 30,
    name: "Velours Pourpre",
    brand: "Maison Alhambra",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=Velours+Pourpre",
    category: "Oriental",
    badge: null,
    description: "Prune, patchouli et notes sucrées. Douceur veloutée luxueuse."
  },

  // ========== FRAGRANCE WORLD ==========
  {
    id: 31,
    name: "Supremacy Silver",
    brand: "Fragrance World",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=Supremacy+Silver",
    category: "Frais",
    badge: "BEST-SELLER",
    description: "Notes argentées avec citron, thé vert et ambre gris. Fraîcheur suprême."
  },
  {
    id: 32,
    name: "Supremacy Gold",
    brand: "Fragrance World",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=Supremacy+Gold",
    category: "Oriental",
    badge: "BEST-SELLER",
    description: "Composition dorée d'oud, safran et ambre. Luxe absolu."
  },
  {
    id: 33,
    name: "Supremacy Noir",
    brand: "Fragrance World",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=Supremacy+Noir",
    category: "Boisé",
    badge: null,
    description: "Cuir noir, oud et cèdre. Élégance sombre et puissante."
  },
  {
    id: 34,
    name: "Deluxe Oud",
    brand: "Fragrance World",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=Deluxe+Oud",
    category: "Oriental",
    badge: null,
    description: "Oud de qualité supérieure avec rose et épices. Luxe authentique."
  },
  {
    id: 35,
    name: "Velvet Amber",
    brand: "Fragrance World",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=Velvet+Amber",
    category: "Oriental",
    badge: null,
    description: "Ambre velouté avec vanille et fève tonka. Douceur enveloppante."
  },
  {
    id: 36,
    name: "Intense White",
    brand: "Fragrance World",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=Intense+White",
    category: "Floral",
    badge: "NOUVEAU",
    description: "Accord blanc floral avec jasmin et muguet. Pureté intense."
  },
  {
    id: 37,
    name: "Imperial Blue",
    brand: "Fragrance World",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=Imperial+Blue",
    category: "Frais",
    badge: null,
    description: "Notes bleues marines avec gingembre et cèdre. Fraîcheur impériale."
  },
  {
    id: 38,
    name: "Executive Black",
    brand: "Fragrance World",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=Executive+Black",
    category: "Boisé",
    badge: "BEST-SELLER",
    description: "Pour l'homme d'affaires moderne. Vétiver, cuir et notes épicées."
  },
  {
    id: 39,
    name: "Magnetic Pink",
    brand: "Fragrance World",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=Magnetic+Pink",
    category: "Fruité",
    badge: null,
    description: "Fruits rouges, pivoine et patchouli. Magnétisme féminin."
  },
  {
    id: 40,
    name: "Royal Saffron",
    brand: "Fragrance World",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=Royal+Saffron",
    category: "Oriental",
    badge: null,
    description: "Safran royal avec oud et ambre. Richesse orientale."
  },
  {
    id: 41,
    name: "Diamond Secret",
    brand: "Fragrance World",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=Diamond+Secret",
    category: "Floral",
    badge: "NOUVEAU",
    description: "Gardénia, tubéreuse et notes poudrées. Secret précieux."
  },
  {
    id: 42,
    name: "Prestige Wood",
    brand: "Fragrance World",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=Prestige+Wood",
    category: "Boisé",
    badge: null,
    description: "Santal, cèdre et vétiver. Prestige boisé naturel."
  },

  // ========== FRENCH AVENUE ==========
  {
    id: 43,
    name: "Mon Paris",
    brand: "French Avenue",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=Mon+Paris",
    category: "Fruité",
    badge: "BEST-SELLER",
    description: "Fraise, framboise et patchouli. Romance parisienne gourmande."
  },
  {
    id: 44,
    name: "Libre Spirit",
    brand: "French Avenue",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=Libre+Spirit",
    category: "Floral",
    badge: null,
    description: "Lavande, fleur d'oranger et vanille. Liberté et féminité."
  },
  {
    id: 45,
    name: "La Vie Belle",
    brand: "French Avenue",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=La+Vie+Belle",
    category: "Fruité",
    badge: "BEST-SELLER",
    description: "Poire, iris et praline. La vie est belle et gourmande."
  },
  {
    id: 46,
    name: "Homme Intense",
    brand: "French Avenue",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=Homme+Intense",
    category: "Boisé",
    badge: null,
    description: "Iris, cèdre et fève tonka. Masculinité intense raffinée."
  },
  {
    id: 47,
    name: "Scandal Rose",
    brand: "French Avenue",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=Scandal+Rose",
    category: "Floral",
    badge: "NOUVEAU",
    description: "Miel, gardénia et patchouli. Scandale floral audacieux."
  },
  {
    id: 48,
    name: "Nuit Tresor",
    brand: "French Avenue",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=Nuit+Tresor",
    category: "Oriental",
    badge: null,
    description: "Vanille, rose et encens. Trésor des nuits orientales."
  },
  {
    id: 49,
    name: "Elixir Charnel",
    brand: "French Avenue",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=Elixir+Charnel",
    category: "Oriental",
    badge: null,
    description: "Amande amère, rose et musc. Sensualité charnelle."
  },
  {
    id: 50,
    name: "Idole Aura",
    brand: "French Avenue",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=Idole+Aura",
    category: "Floral",
    badge: "BEST-SELLER",
    description: "Rose, jasmin et chypré. Aura iconique féminine."
  },

  // ========== ARMAF ==========
  {
    id: 51,
    name: "Club de Nuit Intense",
    brand: "Armaf",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=Club+Intense",
    category: "Boisé",
    badge: "BEST-SELLER",
    description: "Notes fumées avec bergamote, rose et vanille. Nuit intense mémorable."
  },
  {
    id: 52,
    name: "Club de Nuit Milestone",
    brand: "Armaf",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=Milestone",
    category: "Frais",
    badge: null,
    description: "Citrus, menthe et ambre. Fraîcheur exceptionnelle masculine."
  },
  {
    id: 53,
    name: "Venetian Amour",
    brand: "Armaf",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=Venetian+Amour",
    category: "Floral",
    badge: null,
    description: "Jasmin, ylang-ylang et vanille. Amour vénitien romantique."
  },
  {
    id: 54,
    name: "Tag Him",
    brand: "Armaf",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=Tag+Him",
    category: "Frais",
    badge: null,
    description: "Lavande, orange et musc. Fraîcheur pour lui dynamique."
  },
  {
    id: 55,
    name: "Tag Her",
    brand: "Armaf",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=Tag+Her",
    category: "Fruité",
    badge: null,
    description: "Litchi, freesia et ambre. Fruité pour elle séduisant."
  },
  {
    id: 56,
    name: "Odyssey Homme",
    brand: "Armaf",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=Odyssey+Homme",
    category: "Boisé",
    badge: "NOUVEAU",
    description: "Bois de santal, cardamome et musc. Odyssée masculine noble."
  },
  {
    id: 57,
    name: "Odyssey Femme",
    brand: "Armaf",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=Odyssey+Femme",
    category: "Floral",
    badge: "NOUVEAU",
    description: "Pivoine, rose et ambre blanc. Odyssée féminine délicate."
  },
  {
    id: 58,
    name: "Hunter Intense",
    brand: "Armaf",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=Hunter+Intense",
    category: "Boisé",
    badge: "BEST-SELLER",
    description: "Cuir, tabac et oud. Intensité pour le chasseur moderne."
  },
  {
    id: 59,
    name: "Magnificent Pour Homme",
    brand: "Armaf",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=Magnificent",
    category: "Frais",
    badge: null,
    description: "Bergamote, poivre rose et cèdre. Magnificence masculine."
  },
  {
    id: 60,
    name: "Tres Nuit",
    brand: "Armaf",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=Tres+Nuit",
    category: "Frais",
    badge: null,
    description: "Citron, lavande et ambre. Fraîcheur pour trois nuits."
  },

  // ========== AL HARAMAIN ==========
  {
    id: 61,
    name: "Amber Oud Gold Edition",
    brand: "Al Haramain",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=Amber+Oud+Gold",
    category: "Oriental",
    badge: "BEST-SELLER",
    description: "Ambre doré et oud précieux avec notes épicées. Édition luxueuse."
  },
  {
    id: 62,
    name: "L'Aventure",
    brand: "Al Haramain",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=L'Aventure",
    category: "Frais",
    badge: "BEST-SELLER",
    description: "Bergamote, citron et musc blanc. Aventure fraîche et élégante."
  },
  {
    id: 63,
    name: "Neroli Canvas",
    brand: "Al Haramain",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=Neroli+Canvas",
    category: "Floral",
    badge: "NOUVEAU",
    description: "Néroli, bergamote et musc. Toile florale rafraîchissante."
  },
  {
    id: 64,
    name: "Amber Oud Rouge",
    brand: "Al Haramain",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=Rouge",
    category: "Oriental",
    badge: null,
    description: "Version rouge passionnée avec ambre, oud et notes épicées."
  },
  {
    id: 65,
    name: "Junoon Noir",
    brand: "Al Haramain",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=Junoon+Noir",
    category: "Boisé",
    badge: null,
    description: "Passion noire avec cuir, oud et patchouli intense."
  },
  {
    id: 66,
    name: "Portfolio Neroli Canvas",
    brand: "Al Haramain",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=Portfolio",
    category: "Frais",
    badge: null,
    description: "Collection portfolio avec néroli dominant et notes vertes."
  },
  {
    id: 67,
    name: "Midnight Oud",
    brand: "Al Haramain",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=Midnight+Oud",
    category: "Oriental",
    badge: null,
    description: "Oud de minuit mystérieux avec rose et ambre."
  },
  {
    id: 68,
    name: "Musk Al Ghazal",
    brand: "Al Haramain",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=Musk+Ghazal",
    category: "Oriental",
    badge: null,
    description: "Musc de gazelle avec notes florales et ambrées."
  },

  // ========== RASASI ==========
  {
    id: 69,
    name: "Hawas",
    brand: "Rasasi",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=Hawas",
    category: "Frais",
    badge: "BEST-SELLER",
    description: "Notes aquatiques avec pomme, bergamote et ambre. Fraîcheur irrésistible."
  },
  {
    id: 70,
    name: "Hawas Ice",
    brand: "Rasasi",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=Hawas+Ice",
    category: "Frais",
    badge: "NOUVEAU",
    description: "Version glacée encore plus fraîche avec menthe et notes marines."
  },
  {
    id: 71,
    name: "La Yuqawam",
    brand: "Rasasi",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=La+Yuqawam",
    category: "Oriental",
    badge: "BEST-SELLER",
    description: "Ambre, cuir et notes épicées. Puissance orientale masculine."
  },
  {
    id: 72,
    name: "Fattan",
    brand: "Rasasi",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=Fattan",
    category: "Floral",
    badge: null,
    description: "Floral féminin avec jasmin, rose et notes poudrées séduisantes."
  },
  {
    id: 73,
    name: "Shaghaf Oud",
    brand: "Rasasi",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=Shaghaf+Oud",
    category: "Oriental",
    badge: null,
    description: "Passion d'oud avec safran, rose et ambre chaleureux."
  },
  {
    id: 74,
    name: "Egra",
    brand: "Rasasi",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=Egra",
    category: "Boisé",
    badge: null,
    description: "Notes boisées avec vétiver, cèdre et muscs."
  },
  {
    id: 75,
    name: "Daarej",
    brand: "Rasasi",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=Daarej",
    category: "Oriental",
    badge: null,
    description: "Mélange oriental de cannelle, cardamome et oud."
  },

  // ========== AJMAL ==========
  {
    id: 76,
    name: "Aristocrat",
    brand: "Ajmal",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=Aristocrat",
    category: "Boisé",
    badge: "BEST-SELLER",
    description: "Pour l'aristocrate moderne. Bois nobles et épices raffinées."
  },
  {
    id: 77,
    name: "Evoke Gold",
    brand: "Ajmal",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=Evoke+Gold",
    category: "Oriental",
    badge: null,
    description: "Évocation dorée avec ambre, oud et notes épicées."
  },
  {
    id: 78,
    name: "Sacrifice",
    brand: "Ajmal",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=Sacrifice",
    category: "Floral",
    badge: null,
    description: "Sacrifice floral féminin avec rose, jasmin et vanille."
  },
  {
    id: 79,
    name: "Amber Wood",
    brand: "Ajmal",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=Amber+Wood",
    category: "Boisé",
    badge: null,
    description: "Fusion d'ambre et bois avec patchouli et cardamome."
  },
  {
    id: 80,
    name: "Wisal Dhahab",
    brand: "Ajmal",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=Wisal+Dhahab",
    category: "Oriental",
    badge: "BEST-SELLER",
    description: "Or liquide oriental avec safran, oud et ambre précieux."
  },
  {
    id: 81,
    name: "Qafiya",
    brand: "Ajmal",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=Qafiya",
    category: "Floral",
    badge: "NOUVEAU",
    description: "Poésie florale avec rose turque, jasmin sambac et musc."
  },

  // ========== SWISS ARABIAN ==========
  {
    id: 82,
    name: "Shaghaf Oud Abyad",
    brand: "Swiss Arabian",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=Shaghaf+Abyad",
    category: "Oriental",
    badge: "BEST-SELLER",
    description: "Oud blanc passionné avec notes florales et musquées."
  },
  {
    id: 83,
    name: "Layali Rouge",
    brand: "Swiss Arabian",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=Layali+Rouge",
    category: "Oriental",
    badge: null,
    description: "Nuits rouges avec ambre, vanille et notes épicées."
  },
  {
    id: 84,
    name: "Edge Intense",
    brand: "Swiss Arabian",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=Edge+Intense",
    category: "Boisé",
    badge: null,
    description: "Intensité extrême avec cuir, oud et épices noires."
  },
  {
    id: 85,
    name: "Kashkha",
    brand: "Swiss Arabian",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=Kashkha",
    category: "Oriental",
    badge: "BEST-SELLER",
    description: "Oud cambodgien avec rose damascène et safran."
  },
  {
    id: 86,
    name: "Casablanca",
    brand: "Swiss Arabian",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=Casablanca",
    category: "Floral",
    badge: null,
    description: "Romance de Casablanca avec notes florales blanches."
  },

  // ========== PARIS CORNER ==========
  {
    id: 87,
    name: "Emir Intense Oud",
    brand: "Paris Corner",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=Emir+Oud",
    category: "Oriental",
    badge: "BEST-SELLER",
    description: "L'émir de l'oud. Intense et noble avec safran et ambre."
  },
  {
    id: 88,
    name: "Killer Oud",
    brand: "Paris Corner",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=Killer+Oud",
    category: "Oriental",
    badge: "BEST-SELLER",
    description: "Puissance d'oud mortelle avec cuir et épices sombres."
  },
  {
    id: 89,
    name: "Delice Gourmand",
    brand: "Paris Corner",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=Delice",
    category: "Fruité",
    badge: null,
    description: "Délice gourmand avec caramel, vanille et notes sucrées."
  },
  {
    id: 90,
    name: "Royal Crown",
    brand: "Paris Corner",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=Royal+Crown",
    category: "Oriental",
    badge: null,
    description: "Couronne royale avec oud, ambre et notes précieuses."
  },

  // ========== NABEEL ==========
  {
    id: 91,
    name: "Touch Me",
    brand: "Nabeel",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=Touch+Me",
    category: "Floral",
    badge: "BEST-SELLER",
    description: "Toucher floral sensuel avec rose, muguet et muscs doux."
  },
  {
    id: 92,
    name: "Musk Code",
    brand: "Nabeel",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=Musk+Code",
    category: "Oriental",
    badge: null,
    description: "Code secret musqué avec ambre et notes boisées."
  },
  {
    id: 93,
    name: "Raunaq",
    brand: "Nabeel",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=Raunaq",
    category: "Oriental",
    badge: null,
    description: "Splendeur orientale avec oud, rose et épices."
  },

  // ========== AFN AN ==========
  {
    id: 94,
    name: "9 PM",
    brand: "Afnan",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=9+PM",
    category: "Boisé",
    badge: "BEST-SELLER",
    description: "21h, l'heure de la séduction. Notes boisées et épicées."
  },
  {
    id: 95,
    name: "Supremacy Silver",
    brand: "Afnan",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=Afnan+Silver",
    category: "Frais",
    badge: null,
    description: "Suprématie argentée avec notes fraîches et ambrées."
  },
  {
    id: 96,
    name: "Modest Une",
    brand: "Afnan",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=Modest+Une",
    category: "Floral",
    badge: "NOUVEAU",
    description: "Modestie florale numéro un avec iris et muscs."
  },

  // ========== EXTRA VARIÉS ==========
  {
    id: 97,
    name: "Black Orchid Intense",
    brand: "Lattafa",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=Black+Orchid",
    category: "Oriental",
    badge: null,
    description: "Orchidée noire intense avec truffe, ylang-ylang et patchouli."
  },
  {
    id: 98,
    name: "Ombre Leather",
    brand: "Fragrance World",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=Ombre+Leather",
    category: "Boisé",
    badge: null,
    description: "Ombre de cuir avec jasmin sambac et ambre noir."
  },
  {
    id: 99,
    name: "Lost Cherry",
    brand: "Maison Alhambra",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=Lost+Cherry",
    category: "Fruité",
    badge: "NOUVEAU",
    description: "Cerise perdue avec amande, rose turque et tonka."
  },
  {
    id: 100,
    name: "Tobacco Vanille",
    brand: "French Avenue",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=Tobacco+Vanille",
    category: "Oriental",
    badge: "BEST-SELLER",
    description: "Tabac et vanille avec cacao et fève tonka. Gourmandise fumée."
  },
  {
    id: 101,
    name: "Fucking Fabulous",
    brand: "Paris Corner",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=Fabulous",
    category: "Oriental",
    badge: null,
    description: "Fabuleusement audacieux avec amande amère, cuir et tonka."
  },
  {
    id: 102,
    name: "Bitter Peach",
    brand: "Maison Alhambra",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=Bitter+Peach",
    category: "Fruité",
    badge: null,
    description: "Pêche amère avec notes de rhum, cognac et vanille."
  },
  {
    id: 103,
    name: "Oud Wood Intense",
    brand: "Lattafa",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=Oud+Wood",
    category: "Boisé",
    badge: "BEST-SELLER",
    description: "Bois d'oud intense avec santal, vétiver et cardamome."
  },
  {
    id: 104,
    name: "Rose Prick",
    brand: "French Avenue",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=Rose+Prick",
    category: "Floral",
    badge: null,
    description: "Rose épineuse avec notes de sichuan et patchouli."
  },
  {
    id: 105,
    name: "Neroli Portofino",
    brand: "Fragrance World",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=Neroli+Portofino",
    category: "Frais",
    badge: null,
    description: "Néroli de Portofino avec bergamote, citron et ambre."
  },
  {
    id: 106,
    name: "Soleil Blanc",
    brand: "Maison Alhambra",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=Soleil+Blanc",
    category: "Floral",
    badge: "NOUVEAU",
    description: "Soleil blanc avec notes de coco, ylang-ylang et ambre."
  },
  {
    id: 107,
    name: "Velvet Orchid",
    brand: "Lattafa",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=Velvet+Orchid",
    category: "Oriental",
    badge: null,
    description: "Orchidée veloutée avec miel, rhum et notes sucrées."
  },
  {
    id: 108,
    name: "Tuscan Leather",
    brand: "Paris Corner",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=Tuscan+Leather",
    category: "Boisé",
    badge: null,
    description: "Cuir toscan avec safran, framboise et oud fumé."
  },
  {
    id: 109,
    name: "Costa Azzurra",
    brand: "Fragrance World",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=Costa+Azzurra",
    category: "Frais",
    badge: null,
    description: "Côte d'azur avec notes marines, genévrier et bois flottés."
  },
  {
    id: 110,
    name: "Mandarino Di Amalfi",
    brand: "Maison Alhambra",
    price: 35,
    image: "https://via.placeholder.com/300x400?text=Mandarino",
    category: "Frais",
    badge: null,
    description: "Mandarine d'Amalfi avec citron, menthe et notes marines."
  }
];

// Export pour utilisation dans app-v2.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PRODUCTS_DATABASE };
}

console.log(`✅ Base de données chargée: ${PRODUCTS_DATABASE.length} parfums disponibles`);
