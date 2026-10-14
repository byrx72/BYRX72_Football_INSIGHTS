// Universal Player Photo Resolver for BYRX72 Football Insights

const KNOWN_PORTRAITS: Record<string, string> = {
  // Star players with high-res local portraits
  'haaland': '/players/haaland.jpg',
  'erling haaland': '/players/haaland.jpg',
  'e. haaland': '/players/haaland.jpg',
  
  'bellingham': '/players/bellingham.jpg',
  'jude bellingham': '/players/bellingham.jpg',
  'j. bellingham': '/players/bellingham.jpg',
  
  'mbappe': '/players/mbappe.jpg',
  'mbappé': '/players/mbappe.jpg',
  'kylian mbappe': '/players/mbappe.jpg',
  'kylian mbappé': '/players/mbappe.jpg',
  'k. mbappé': '/players/mbappe.jpg',
  'k. mbappe': '/players/mbappe.jpg',
  
  'palmer': '/players/palmer.jpg',
  'cole palmer': '/players/palmer.jpg',
  'c. palmer': '/players/palmer.jpg',
  
  'pedri': '/players/pedri.jpg',
  
  'saka': '/players/saka.jpg',
  'bukayo saka': '/players/saka.jpg',
  'b. saka': '/players/saka.jpg',
  
  'salah': '/players/salah.jpg',
  'mohamed salah': '/players/salah.jpg',
  'm. salah': '/players/salah.jpg',
  
  'saliba': '/players/saliba.jpg',
  'william saliba': '/players/saliba.jpg',
  'w. saliba': '/players/saliba.jpg',
  
  'vinicius': '/players/vinicius.jpg',
  'vinícius': '/players/vinicius.jpg',
  'vinicius junior': '/players/vinicius.jpg',
  'vinícius júnior': '/players/vinicius.jpg',
  'vinicius jr': '/players/vinicius.jpg',
  'v. júnior': '/players/vinicius.jpg',
  
  'yamal': '/players/yamal.jpg',
  'lamine yamal': '/players/yamal.jpg',
  'l. yamal': '/players/yamal.jpg',
  
  'raya': '/players/raya.jpg',
  'david raya': '/players/raya.jpg',
  'd. raya': '/players/raya.jpg',
  
  'courtois': '/players/courtois.jpg',
  'thibaut courtois': '/players/courtois.jpg',
  't. courtois': '/players/courtois.jpg',
};

// Curated high-resolution football athlete portraits
const CURATED_ATHLETE_PHOTOS = [
  'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1543351611-58f69d7c1781?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1516475429286-465d815a0df7?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1624880357913-a8539238245b?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1511886929837-354d827aae26?auto=format&fit=crop&w=400&q=80',
];

/**
 * Returns a high quality image path for a player.
 * Checks local star photos first, then curated deterministic athlete photo.
 */
export function getPlayerPhoto(player: { name: string; short?: string; id?: string }): string {
  if (!player) return CURATED_ATHLETE_PHOTOS[0];

  const cleanName = player.name.toLowerCase().trim();
  const cleanShort = (player.short || '').toLowerCase().trim();

  // 1. Direct match in local high-res stars
  for (const [key, path] of Object.entries(KNOWN_PORTRAITS)) {
    if (cleanName.includes(key) || cleanShort === key) {
      return path;
    }
  }

  // 2. Deterministic hash to assign a consistent high-res athlete photo
  let hash = 0;
  const str = player.id || player.name;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % CURATED_ATHLETE_PHOTOS.length;
  return CURATED_ATHLETE_PHOTOS[index];
}
