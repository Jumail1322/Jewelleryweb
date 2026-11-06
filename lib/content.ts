// Homepage / editorial content, migrated from the Shopify theme sections.
// Edit copy and media here; components only handle layout and behaviour.

// Media is self-hosted under public/images and public/videos.
const FILES = "/images/";
const VIDEOS = "/videos/";

const video = (id: string) => `${VIDEOS}${id}.mp4`;

/** Optional product videos, keyed by product slug. Products without one fall back to their photo. */
export const PRODUCT_VIDEOS: Record<string, string> = {
  "thread-necklace": video("66e936d5fbbb4f70a7125eed7340722a"),
  "texture-band-ring": video("2fc4649683b242dc9b1ad2ee416bab19"),
  "gather-earrings": video("ec4c5a065e1e4cecab34f0b60d9d41b8"),
  "slim-cuff": video("a053bf8e25cc4f109e3d11a6ffb5b337"),
};

/** Optional transparent cut-outs for "Pieces that stay", keyed by product slug. */
export const PRODUCT_CUTOUTS: Record<string, string> = {
  "thread-necklace": `${FILES}freepik_a-delicate-thin-gold-chai_2851719407_1_1.png`,
  "texture-band-ring": `${FILES}freepik_a-wide-minimal-gold-band-_2851721232_1_1.png`,
  "gather-earrings": `${FILES}freepik_a-single-small-sculptural_2851722742_1_1.png`,
  "slim-cuff": `${FILES}freepik_a-flat-minimal-gold-cuff-_2851723434_1_1.png`,
};

export const LOGO = `${FILES}logo.png`;
export const FOOTER_LOGO = `${FILES}logo.png`;

export const NAV = [
  { label: "Home", href: "/" },
  { label: "Catalog", href: "/collections/all" },
  { label: "About Us", href: "/pages/about-us" },
  { label: "Contact", href: "/pages/contact" },
];

export const HERO = {
  image: `${FILES}947798535663747d5a4378834c9e414bf33da955_1.jpg`,
  imageMobile: `${FILES}947798535663747d5a4378834c9e414bf33da955_1.png`,
  eyebrow: "Jewelry.",
  heading: "Made for You.",
  label: "Welcome to Julmill",
  body: "India’s first 316L surgical-grade jewelry — made to wear every day, made to feel like it was made for you.",
  cta: { label: "Discover Yours", href: "/collections/signature" },
  look: {
    image: `${FILES}677685e54ebd6ab3d745d871087980499b5e8ff9.jpg`,
    label: "Shop the look",
    body: "Curated pairings designed to move together, effortlessly.",
    href: "/collections/signature",
  },
  arrivals: {
    label: "The latest arrivals",
    href: "/collections/signature",
    images: [1, 2, 3, 4, 5, 6].map((n) => `${FILES}Rectangle_${n}_1.jpg`),
  },
};

export const FEATURED = {
  label: "Featured collection",
  heading: "Pieces that stay.",
  // Product slugs from the store API; empty slots are filled with in-stock pieces
  products: ["9k-gold-noelle-pendant", "stone-ring", "9k-gold-kids-juno-earrings", "snake-chain"],
  bodyStrong: "The Still Collection",
  body: "is four pieces that were made to be worn through everything. Not for occasions. For the days you want to feel like yourself.",
  cta: { label: "Shop the collection", href: "/collections/signature" },
};

export const SIGNATURES = {
  label: "The Signatures",
  heading: "Featured products",
  body: "Four signatures. Each one designed to be worn on its own or with everything else. These are the ones people come back for.",
  tabs: [
    { filter: "necklace", label: "Necklaces", icon: `${FILES}fi_8561470_f57617af-949d-4cb3-8daa-d11c7f257096.svg` },
    { filter: "earring", label: "Earrings", icon: `${FILES}fi_8561461_0529cb12-ae42-44f6-bcc6-5edc53ee0bf0.svg` },
    { filter: "ring", label: "Rings", icon: `${FILES}fi_8561484_13499d06-ba0d-4dd6-b688-5275fd3dec1d.svg` },
    { filter: "bracelet", label: "Bracelets", icon: `${FILES}fi_8561420_70223b56-0a58-4abd-b0ec-b1128e3ab162.svg` },
  ],
};

export const CATEGORIES = [
  { title: "Necklaces", filter: "necklace", image: `${FILES}15823294bad3ec60ae69c000eeeb054592fd5427_1.jpg` },
  { title: "Earrings", filter: "earring", image: `${FILES}6a7e77a08aad126d0f0414c2cc8545cd2116b5b0_1.jpg` },
  { title: "Rings", filter: "ring", image: `${FILES}7b8237293a486213af99acc44f94015ced65ec0f_1.jpg` },
  { title: "Bracelets", filter: "bracelet", image: `${FILES}e0b7921f3ff63150de4d1f6ddd13a3ddf04bd700_1.jpg` },
];

export const WEAR_IT = {
  heading: "Julmill",
  body: "One Her. Every Version",
  rows: [
    {
      title: "The Everyday",
      image: `${FILES}4d232ed1a536a3827668b62f17c954db183f2470.jpg`,
      body: "She is not going anywhere special. Morning light, an ordinary moment, a kitchen counter or window. She is dressed but not for anyone. The jewellery is just on her.",
    },
    {
      title: "The First Date",
      image: `${FILES}c0881c6fe8956ebb983957b96ce3ad4411ec1431_1.jpg`,
      body: "She is ready but not showing it. Care went into choosing, not acting. Late afternoon light, between inside and outside. A doorway, staircase, street corner. One earring visible. A ring she just put on.",
    },
    {
      title: "The Reunion",
      image: `${FILES}d8984bcc6ba2aa2239bb0db6c74b96f6e4572da2_1.jpg`,
      body: "Someone from before sees who she became. She is fully herself. The setting is a platform outside a familiar building. The light is cooler, mood confident.",
    },
  ],
};

export const SHOP_BY = {
  label: "Shop By",
  heading: "Yours. And theirs.",
  body: "Five ways to find the right piece. For the person you know best, or the one you are still figuring out.",
  videos: [
    { title: "For Her", video: video("eacafcf570734927a36294bdd61cc3c9") },
    { title: "For Him", video: video("c338e40ebb0146cb86ed087cdc383c03") },
  ],
  images: [
    { title: "Anniversary Gifts", image: `${FILES}7b417419580932cfd4407a643a5c1cacf4619d46.jpg` },
    { title: "Wedding Gifts", image: `${FILES}45fced9f156ae237ca6171c14a4eaa21314add8b.jpg` },
    { title: "Birthday Gifts", image: `${FILES}c4b3546ed22cc4332061e1927cac4464d915e144.jpg` },
  ],
};

export const ABOUT = {
  label: "About Julmill",
  heading: "Designed to disappear into your life.",
  imageLeft: `${FILES}Rectangle_10_1.jpg`,
  imageRight: `${FILES}Rectangle_11_1.jpg`,
  paragraphs: [
    "Julmill was built on a single idea. That the pieces worth keeping are never the loudest ones in the room. We design for the woman who already knows what she wants. Who buys one thing and wears it every day for three years. Who does not need to be told what is trending.",
    "Every piece in our edit is demi-fine by design and minimal by intention. Gold that sits against skin like it belongs there. Forms that do not explain themselves. Details that only reveal themselves up close.",
    "We are not interested in occasions. We are interested in the everyday. The piece you reach for without thinking. The one that is still on your wrist at the end of the night. That is what Julmill is for.",
  ],
  closing: "Made to mean something. Made to stay.",
};

/** /pages/about-us — copy from the Shopify "About Us" page. */
export const ABOUT_PAGE = {
  label: "About Us",
  heading: "Jewellery, but with memory.",
  intro:
    "Julmill is demi-fine jewellery created for women who wear with intention. Not for trends that disappear in a season, but for pieces that quietly become part of your everyday life. Every design begins with a simple question:",
  question: "will this still mean something ten years from now?",
  paragraphs: [
    "That question shapes every detail — the weight of the chain, the curve of the band, the balance of a pendant resting against the skin. The result is jewellery that feels understated yet deeply considered. Minimal in form, but lasting in presence.",
    "At Julmill, simplicity is never accidental. Each piece is refined until nothing unnecessary remains, allowing the craftsmanship, proportion, and feeling behind it to speak for themselves. These are pieces designed to move with you effortlessly — worn on ordinary mornings, important evenings, and everything in between. Jewellery that does not demand attention, but naturally becomes part of your identity over time.",
  ],
  materials:
    "Made from 316L surgical-grade stainless steel, every Julmill piece is created for comfort, durability, and everyday wear. It resists tarnishing, feels gentle on the skin, and is designed to stay with you without constant care or caution. Because meaningful jewellery should not live hidden away for special occasions. It should live with you — daily, naturally, and for years to come.",
};

export const INTENTION = {
  image: `${FILES}e9f623a5656965a4de46a87bd78f3eafa8bf1309_1.jpg`,
  label: "Made with intention",
  heading: "The Julmill Experience",
  body: "From the weight of the chain to the box it arrives in. Nothing here happened by accident.",
  columns: [
    {
      title: "Wrapped in quiet.",
      image: `${FILES}Rectangle_16_1.jpg`,
      body: "Every Julmill piece comes in packaging as thoughtful as the jewellery. Neutral tones, soft textures, and a handwritten card. Unboxing feels like the first wear.",
    },
    {
      title: "Built to outlast the moment.",
      image: `${FILES}Rectangle_17_1.jpg`,
      body: "Demi-fine by category. Heirloom by intention. Every piece is made from materials that hold their finish, their weight, and their meaning. Not for a season. For years.",
    },
    {
      title: "The detail no one sees.",
      image: `${FILES}Rectangle_18_1.jpg`,
      body: "Each piece starts with deciding what to omit. The forms are simple because simplicity takes time. Every edge, join, and finish is carefully considered before leaving the studio.",
    },
  ],
};

export const TESTIMONIALS = {
  label: "From the people who keep it on",
  heading: "By women who wear it every single day.",
  body: "Real women. Real wear. What they said when we asked.",
  items: [
    {
      title: "I forgot I was wearing it.",
      body: "I put the Thread Necklace on the morning it arrived and genuinely forgot about it until my friend asked where I got it from. That is exactly what I wanted from it.",
      name: "Aditi Mehra",
      city: "Mumbai",
      image: `${FILES}5ec577bdd8419d6fb4afde4bbd1c7e3ddc0c79a6.jpg`,
    },
    {
      title: "Life-changing experience!",
      body: "I have worn the Form Ring every single day for four months. To work, to the gym, to sleep. It has not lost its finish and it has not lost its meaning. Worth every rupee.",
      name: "Zara T.",
      city: "Hyderabad",
      image: `${FILES}04b684cf8d8e7b8413d422dcfa9358ec83fc7b84.png`,
    },
    {
      title: "It made the gift feel considered.",
      body: "I bought the Pool Pendant for my best friend's birthday. The packaging alone made her emotional. She texted me that night saying she had not taken it off. That is the only review I need to give.",
      name: "Aanya Patil",
      city: "Mumbai",
      image: `${FILES}00dd711a9b93b4e357c22723415b8ebf6129d325.jpg`,
    },
    {
      title: "Quiet and completely mine.",
      body: "I am not someone who wears a lot of jewellery. The Gather Earrings are the first pair I have worn consistently in years. They feel like they were made for someone who thinks exactly the way I do.",
      name: "Priya Nair",
      city: "Bangalore",
      image: `${FILES}e4a4fc47e2306db23a11a41d6e831caf01b3d5c5.jpg`,
    },
  ],
};

export const REEL = {
  label: "On the feed",
  heading: "Julmill in the wild.",
  body: "Unscripted. Unedited. Unmistakably Julmill.",
  products: ["infinity-ring", "rose", "zig-zag", "9k-gold-kids-primavera-nose-pin"],
  cta: { label: "Follow us on Instagram", href: "#" },
};

export const FOOTER = {
  heading: "Be the first to know.",
  subheading: "New arrivals. Behind the pieces. Straight to you.",
  menus: [
    {
      title: "Shop",
      links: [
        { label: "Necklaces", href: "/collections/all?category=necklace" },
        { label: "Earrings", href: "/collections/all?category=earring" },
        { label: "Rings", href: "/collections/all?category=ring" },
        { label: "Bracelets", href: "/collections/all?category=bracelet" },
        { label: "For Her", href: "/collections/signature" },
        { label: "For Him", href: "/collections/signature" },
        { label: "Gifting", href: "/collections/signature" },
      ],
    },
    {
      title: "About",
      links: [
        { label: "Our Story", href: "/pages/about-us" },
        { label: "Care Guide", href: "/pages/about-us#care" },
        { label: "Sustainability", href: "/pages/about-us#materials" },
        { label: "FAQs", href: "/pages/contact#faq" },
        { label: "Get in touch", href: "/pages/contact" },
        { label: "Privacy Policy", href: "/policies/privacy-policy" },
        { label: "Terms & Conditions", href: "/policies/privacy-policy" },
      ],
    },
  ],
  connect: [
    { label: "Instagram", href: "#" },
    { label: "Facebook", href: "#" },
    { label: "support@ornmnt.com", href: "mailto:support@ornmnt.com" },
  ],
  badges: [
    { label: "Ethically sourced", icon: `${FILES}Frame.svg` },
    { label: "Surgical steel", icon: `${FILES}Frame_1.svg` },
    { label: "Free shipping", icon: `${FILES}Frame_2.svg` },
    { label: "Easy 15 day returns", icon: `${FILES}Frame_3.svg` },
  ],
};

/** "The World Of House of Aura" — two scrolling photo columns around the brand story. */
const AURA = `${FILES}aura/`;
export const WORLD_OF = {
  heading: "The World Of",
  headingAccent: "House of Aura",
  paragraphs: [
    "House of Aura was created around a simple belief — jewellery should feel natural to wear, not saved for moments that demand effort. Each piece is designed to move with you, sit comfortably on the skin, and become part of your everyday rhythm.",
    "Our collections focus on form, balance, and restraint. Nothing excessive. Nothing fleeting. Just modern jewellery that feels considered, wearable, and quietly confident — pieces you reach for without thinking, and keep coming back to.",
  ],
  features: [
    { label: "Free shipping", icon: `${AURA}Frame_29.svg` },
    { label: "Easy returns", icon: `${AURA}Frame_30.svg` },
    { label: "Secure checkout", icon: `${AURA}Frame_32.svg` },
    { label: "Carefully packed", icon: `${AURA}Frame_31.svg` },
  ],
  cta: { label: "Learn more", href: "/pages/about-us" },
  imagesLeft: [
    "c225cca48f110645806b3f7fd2d7c484e3ccad61_1.jpg",
    "0c5a46b7edbc1c95a503706fa5511b112503069a_1.jpg",
    "3957e60cb4c2aa7c98ad085cd035b54a778dde1a_1.jpg",
    "7275aa534e5328cdde73694a336006cbef95fbbe_1.jpg",
    "3a795c97a2248afac556261629e156141e1791ad_1.jpg",
    "7735ec77ad48f22f947fa2dfb555cb6f6bcc581d_1.jpg",
  ].map((f) => `${AURA}${f}`),
  imagesRight: [
    "6befd611475ab5d56e3f9d0809a9910c69a889c7_1.jpg",
    "2dcfd8cb3c501f8685122baa5f2ec3a55c358162_1.jpg",
    "4df79f2722208b43c4342ce22ee5991c11d9b547_1.jpg",
    "f4e379d841546f4092ffc542eedd753ac011eb7d_1.jpg",
    "be7b7923c645f212da7e486b6dfadc7dba075885_1.jpg",
    "3e357cf1d229db98d75f52e33b59c11dd3fff4ca_1.jpg",
  ].map((f) => `${AURA}${f}`),
};
