import axios from 'axios';

export async function searchRestaurants(params: {
  cuisine?: string;
  location?: string;
}) {
  const query = `${params.cuisine || ''} restaurants ${params.location || 'Dubai'}`.trim();
  const url = 'https://maps.googleapis.com/maps/api/place/textsearch/json';
  const { data } = await axios.get(url, {
    params: {
      query,
      key: process.env.GOOGLE_PLACES_KEY
    }
  });
  return data.results || [];
}
