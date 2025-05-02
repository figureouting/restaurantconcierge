export function rankRestaurants(args: any, places: any[]) {
  return places
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .map(p => ({ name: p.name, rating: p.rating }));
}
